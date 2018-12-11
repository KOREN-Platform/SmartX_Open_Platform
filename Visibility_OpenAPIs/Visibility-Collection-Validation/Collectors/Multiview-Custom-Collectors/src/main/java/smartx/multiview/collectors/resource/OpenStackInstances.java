/**
 * @author Muhammad Usman
 * @version 0.1
 */

package smartx.multiview.collectors.resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.simple.parser.JSONParser;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.bson.Document;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.StreamGobbler;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

public class OpenStackInstances implements Runnable{
	private Thread thread;
	private String ThreadName="vBox Status Thread";
	private String line = "", neworkList;
	private String vboxMongoCollection, vboxMongoCollectionRT;
	private String CTRL_Box_IP, CTRL_Box_USER, CTRL_Box_PASSWORD;
	
	private MongoClient mongoClient;
	private List<Document> documentsRT = new ArrayList<Document>();
	private MongoDatabase db;
	private Document documentHistory, documentRT;
	private DeleteResult deleteResult;
	
	private Date timestamp;
	private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private Logger LOG = Logger.getLogger("novaUpdateFile");
    
	public OpenStackInstances(String CTRL_IP, String CTRL_USER, String CTRL_PASSWORD, String dbHost, int dbPort, String dbName, String vboxhistory, String vboxrt) 
	{
		mongoClient           = new MongoClient(dbHost, dbPort);
		db                    = mongoClient.getDatabase(dbName);
		vboxMongoCollection   = vboxhistory;
		vboxMongoCollectionRT = vboxrt;
		CTRL_Box_IP           = CTRL_IP;
		CTRL_Box_USER         = CTRL_USER;
		CTRL_Box_PASSWORD     = CTRL_PASSWORD;
	}

	public void getOSInstanceList()
    {
		System.out.println("Running "+ThreadName);
    	String instanceName, instanceID, instanceStatus, instancePower, instanceNetwork, instancetenantID, BoxName;
    	
    	timestamp = new Date();
		try
        {
        	Connection conn = new Connection(CTRL_Box_IP);
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPassword(CTRL_Box_USER, CTRL_Box_PASSWORD);
            if (isAuthenticated == false)
                throw new IOException("Authentication failed.");        
            ch.ethz.ssh2.Session sess = conn.openSession();
            sess.execCommand("cat /home/netcs/InstanceList.list"); 
            
            InputStream stdout = new StreamGobbler(sess.getStdout());
            BufferedReader br = new BufferedReader(new InputStreamReader(stdout));
            
            while (true)
            {
            	String line = br.readLine();
            	if (line == null)
                    break;
                if (line!=null)
                {
                	
                	if (!(line.contains("+-") || line.contains("Task State")))
                	{
                		instanceID      = line.substring(StringUtils.ordinalIndexOf(line, "|", 1)+1, StringUtils.ordinalIndexOf(line, "|", 2)-1).trim();
                		instanceName    = line.substring(StringUtils.ordinalIndexOf(line, "|", 2)+1, StringUtils.ordinalIndexOf(line, "|", 3)-1).trim();
                		instanceStatus  = line.substring(StringUtils.ordinalIndexOf(line, "|", 3)+1, StringUtils.ordinalIndexOf(line, "|", 4)-1).trim();
                		instancePower   = line.substring(StringUtils.ordinalIndexOf(line, "|", 5)+1, StringUtils.ordinalIndexOf(line, "|", 6)-1).trim();
                		instanceNetwork = line.substring(StringUtils.ordinalIndexOf(line, "|", 6)+1, StringUtils.ordinalIndexOf(line, "|", 7)-1).trim();
                		BoxName         = line.substring(StringUtils.ordinalIndexOf(line, "|", 10)+1, StringUtils.ordinalIndexOf(line, "|", 11)-1).trim();
                		
                		/*if (BoxName.equals("KOREN-Cloud"))
                		{
                			BoxName = "GIST_C_1";
                		}*/
                		//System.out.println(instanceID);
                		documentHistory = new Document();
    		        	documentRT      = new Document();
    		        	
    		        	documentHistory.put("timestamp"  , new Date());
    		        	documentHistory.put("boxID"        , BoxName);
    		        	documentHistory.put("ostenantid" , "");
    		        	documentHistory.put("name"       , instanceName);
    		        	documentHistory.put("uuid"       , instanceID);
    		        	documentHistory.put("Powerstate" , instancePower);
    		        	documentHistory.put("Network"    , instanceNetwork);
    		    		
    		        	documentRT.put("name"            , instanceName);
    		        	documentRT.put("uuid"            , instanceID);
    		        	documentRT.put("vlanid"          , "");
    		        	documentRT.put("ostenantid"      , "");
    		        	//documentRT.put("osuserid"        , instancetenantID);
    		        	documentRT.put("boxID"             , BoxName);
    		    		
    		        	//	UpdateResult result;
    		    		if (instanceStatus.equals("ACTIVE"))
    	            	{
    		    			documentHistory.put("state", "Running");
    	            		documentRT.put("state", "Running");
    	            		
    	            	}
    	            	else
    	            	{
    	            		documentHistory.put("state", instanceStatus);
    	            		documentRT.put("state", instanceStatus);
    	            	}
    		    		
    		    		db.getCollection(vboxMongoCollection).insertOne(documentHistory);
    		    		
    	            	LOG.debug("["+dateFormat.format(timestamp)+"][INFO][NOVA][Box: "+BoxName+" Instance: "+instanceName+" State: "+instanceStatus+"]");
    	            	documentsRT.add(documentRT);
                	}
                }
            }
            
            //System.out.println("ExitCode: " + sess.getExitStatus());
            br.close();
            stdout.close();
            sess.close();
            conn.close();
        }
        catch (IOException e)
        {
        	LOG.debug("[INFO][OpenStack][Box : "+CTRL_Box_IP+" Failed]");
        	System.out.println("[INFO][OpenStack][Box : "+CTRL_Box_IP+" Failed]");
            e.printStackTrace(System.err);
        }
    }
	
	public void run() 
	{
		while (true)
		{
			getOSInstanceList();
						
			//Delete Previous Documents from Real Time collection
	    	deleteResult = db.getCollection(vboxMongoCollectionRT).deleteMany(new Document());
	    	
	    	//Insert New Documents for Near-Realtime Visualization
	    	if (documentsRT.isEmpty()==false)
	    	{
	    		db.getCollection(vboxMongoCollectionRT).insertMany(documentsRT);
	    		documentsRT.clear();
	    	}
			
			try {
				//Sleep For 30 Seconds
				Thread.sleep(30000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	public void start() {
		//System.out.println("Starting vBox Status Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
	}
}

