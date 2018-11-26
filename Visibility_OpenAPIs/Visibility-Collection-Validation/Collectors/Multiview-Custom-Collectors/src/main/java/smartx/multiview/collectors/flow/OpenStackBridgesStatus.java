/**
 * @author Muhammad Usman
 * @version 0.1
 */

package smartx.multiview.collectors.flow;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.bson.Document;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.StreamGobbler;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

public class OpenStackBridgesStatus implements Runnable{
	private Thread thread;
	private String ThreadName="pBox Status Thread";
	
	private String SmartXBox_USER, SmartXBox_PASSWORD, box = "", m_ip = "";
	private String pboxMongoCollection, flowMongoCollection, flowMongoCollectionRT;
	private String [] BoxType;
	private List<String> bridges = new ArrayList<String>();
	
    private MongoClient mongoClient;
	private MongoDatabase db;
	private Document document;
	private DeleteResult deleteResult;
	private FindIterable<Document> pBoxList;
	
	private Date timestamp;
    private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
    private static Logger logger = Logger.getLogger(OpenStackBridgesStatus.class.getName());
    
    public OpenStackBridgesStatus(String boxUser, String boxPassword, String dbHost, int dbPort, String dbName, String pboxCollection, String osMongoCollection, String osMongoCollectionRT, String [] boxType) {
    	SmartXBox_USER        = boxUser;
    	SmartXBox_PASSWORD    = boxPassword;
    	mongoClient 		  = new MongoClient(dbHost, dbPort);
		db                    = mongoClient.getDatabase(dbName);
		pboxMongoCollection   = pboxCollection;
		flowMongoCollection   = osMongoCollection;
		flowMongoCollectionRT = osMongoCollectionRT;
		BoxType               = boxType;
	}
    
    public void getBridgesStatus(String box, String serverIp, String bridgeName, String command, String usernameString,String password)
    {
        try
        {
            Connection conn = new Connection(serverIp);
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPassword(usernameString, password);
            if (isAuthenticated == false)
                throw new IOException("Authentication failed.");        
            ch.ethz.ssh2.Session sess = conn.openSession();
            sess.execCommand(command);  
            InputStream stdout = new StreamGobbler(sess.getStdout());
            BufferedReader br = new BufferedReader(new InputStreamReader(stdout));
            while (true)
            {
            	String line = br.readLine();
                if (line == null)
                    break;
                if (line!=null)
                {
                	bridges.add(line);
                	System.out.println(line);
                	setBridgesStatus(box, serverIp, bridgeName, line);
                }
            }
            sess.close();
            conn.close();
        }
        catch (IOException e)
        {
        	System.out.println("[ERROR][OSB][Box : "+box+" Failed]");
            e.printStackTrace(System.err);
        }
    }
    
    public void setBridgesStatus(String box, String serverIp, String bridgeName, String result)
    {
    	String n_packets, n_bytes, dl_vlan, actions;
    	String[] ResultArray, mappingArray;
    	document = new Document();
    	
    	ResultArray = result.split(",");
    	n_packets = ResultArray[3].substring(ResultArray[3].indexOf("=")+1, ResultArray[3].length());
    	n_bytes = ResultArray[4].substring(ResultArray[4].indexOf("=")+1, ResultArray[4].length());
    	
    	mappingArray = ResultArray[9].split(" ");
    	dl_vlan = mappingArray[0].substring(mappingArray[0].indexOf("=")+1, mappingArray[0].length());
    	actions = mappingArray[1].substring(mappingArray[1].indexOf("=")+14, mappingArray[1].length());
    	
    	System.out.println(ResultArray[0]);
    	System.out.println(ResultArray[3]);
    	System.out.println(actions);
    	
    	document.put("timestamp", new Date());
    	document.put("box",       box);
    	document.put("bridge",    bridgeName);
    	document.put("n_packets", n_packets);
    	document.put("n_bytes",   n_bytes);
    	document.put("dl_vlan",   dl_vlan);
    	document.put("actions",   actions);
    	
    	//Insert New Documents to MongoDB
		db.getCollection(flowMongoCollectionRT).insertOne(document);
    	db.getCollection(flowMongoCollection).insertOne(document);
    	System.out.println("["+dateFormat.format(timestamp)+"][INFO][OSB][Box: "+box+" Bridge: "+bridgeName+" inserted]");
    }
    
	public void update_status() 
	{
		timestamp = new Date();
		
		//Delete Previous Documents from Real Time collection
    	deleteResult=db.getCollection(flowMongoCollectionRT).deleteMany(new Document());
		
    	pBoxList = db.getCollection(pboxMongoCollection).find(new Document("type", BoxType[0]));
    	//pBoxList = db.getCollection(pboxMongoCollection).find(new Document("$or", asList(new Document("type", BoxType[0]),new Document("type", BoxType[1]))));
		pBoxList.forEach(new Block<Document>() {
		    public void apply(final Document document) {
		    	
		        box      = (String) document.get("box");
		        m_ip     = (String) document.get("management_ip");
		        
		        //Get/Set Statistics of OpenStack Bridges
		        try{
		        	getBridgesStatus(box, m_ip, "brvlan","ovs-ofctl dump-flows brvlan | grep dl_vlan", SmartXBox_USER, SmartXBox_PASSWORD);
		        	getBridgesStatus(box, m_ip, "br-int","ovs-ofctl dump-flows br-int | grep dl_vlan", SmartXBox_USER, SmartXBox_PASSWORD);
		        }catch(StringIndexOutOfBoundsException exc){
		        	System.out.println(exc);
		        	throw exc;
		        }
		     }
		});
	}
	
	public void run() 
	{
		while (true)
		{
			update_status();
			try {
				//Sleep For 5 Minutes
				Thread.sleep(300000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	public void start() {
		System.out.println("Starting OpenStack Bridges Statistics Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
		
	}
}
