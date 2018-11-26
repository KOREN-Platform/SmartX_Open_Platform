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

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;
import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mongodb.Block;
import com.mongodb.client.FindIterable;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.StreamGobbler;
import smartx.multiview.DataLake.MongoDB_Connector;

public class PlatformControllers implements Runnable{
	private Thread thread;
	private String ThreadName = "Platform Controller Thread";
	
	private MongoDB_Connector mongoConnector;
	private List<Document> documentsRT = new ArrayList<Document>();
	private FindIterable<Document> controllerList;
	
	private String controllerMongoCollection="configuration-controller-list";
	private String Cloud_Controller, Cloud_Controller_User, Cloud_Controller_Password;
	private String Access_Controller, Access_Controller_User, Access_Controller_Password;
	private String WAN_Controller, WAN_Controller_User, WAN_Controller_Password;
	private String controllerStatus="", pingResult = "";
	
	private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private Logger LOG = Logger.getLogger("PlatformControllerFile");
	protected Date timestamp;
	
	public PlatformControllers(MongoDB_Connector MongoConn, String wController, String wUser, String wPassword, String cController, String cUser, String cPassword, String aController, String aUser, String aPassword)
	{
		mongoConnector             = MongoConn;
		Access_Controller          = aController;
		Access_Controller_User     = aUser;
		Access_Controller_Password = aPassword;
		Cloud_Controller           = cController;
		Cloud_Controller_User      = cUser;
		Cloud_Controller_Password  = cPassword;
		WAN_Controller             = wController;
		WAN_Controller_User        = wUser;
		WAN_Controller_Password    = wPassword;
	}
	
	public void getControllerStatus()
	{
		System.out.println("Running "+ThreadName);
		
		//Get List of SmartX Boxes
		controllerList = mongoConnector.getDataDB(controllerMongoCollection);
		
		controllerList.forEach(new Block<Document>() {
		    private String controllerIP;
			private String controllerType;
			
			public void apply(final Document document) {
		    	pingResult = "";
		    	controllerIP = (String) document.get("controllerIP");
		    	controllerType = (String) document.get("controllerType");
		    	//String pingCmd = "nmap -sP -R " + controllerIP;
		    	String pingCmd = "ping -w 2 -c 2 "+controllerIP;
		    	
		    	try 
	            {
					Runtime r = Runtime.getRuntime();
					Process p = r.exec(pingCmd);
	
					BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
					String inputLine;
					timestamp = new Date();
					while ((inputLine = in.readLine()) != null) {
						pingResult += inputLine;
					}
					
					if (pingResult.contains("icmp_seq")==true)
					{
						controllerStatus = "ORANGE";
						//System.out.println("["+dateFormat.format(timestamp)+"][INFO][Platform][Pinging Host: "+controllerIP+"]");
						//LOG.debug("["+dateFormat.format(timestamp)+"][INFO][Platform][Pinging Host: "+controllerIP+"]");
					}
					else
					{
						controllerStatus = "RED";
						//System.out.println("["+dateFormat.format(timestamp)+"][INFO][Platform][Pinging Host: "+controllerIP+"]");
						//LOG.debug("["+dateFormat.format(timestamp)+"][INFO][Platform][Pinging Host: "+controllerIP+"]");
					}
					in.close();
	            } catch (IOException e) {
	            	//LOG.debug("["+dateFormat.format(timestamp)+"][INFO][Platform][Collect][Box: "+controllerIP+" Failed]"+e.getMessage());
	            	System.out.println("[INFO][Controller][Box : "+controllerIP+" Failed ");
	            }
		    	
		    	//Check Additional Services
		    	if (controllerStatus.equals("ORANGE"))
		    	{
			    	if (controllerType.equals("SD-WAN"))
			    	{
			    		String baseURL   = "http://"+controllerIP+":8181/onos/v1/docs/index.html";
			    		try {
			        	    // Create URL = base URL + container
			    	        URL url = new URL(baseURL);
			    	        
			    	        // Create authentication string and encode it to Base64
			    	        String authStr = WAN_Controller_User + ":" + WAN_Controller_Password;
			    	        String encodedAuthStr = Base64.encodeBase64String(authStr.getBytes());
			    	
			    	        // Create Http connection
			    	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			    	
			    	        // Set connection properties
			    	        connection.setRequestMethod("GET");
			    	        connection.setRequestProperty("Authorization", "Basic " + encodedAuthStr);
			    	        connection.setRequestProperty("Accept", "application/json");
			    	        
			    	        if (connection.getResponseCode()==200)
			    	        {
			    	        	controllerStatus = "GREEN";
			    	        	//System.out.println("WAN Controller: "+controllerStatus);
			    	        }
		    	        	else
		    	        	{
		    	        		controllerStatus = "ORANGE";
		    	        		//System.out.println("WAN Controller: "+controllerStatus);
		    	        	}
			    	    } catch (Exception e) {
			    	    	//System.out.println("SD-WAN Controller: "+controllerStatus);
			    	    	System.out.print("");;
			    	        //e.printStackTrace();
			    	    }
			    	}
		    	
			    	else if (controllerType.equals("cloud"))
			    	{
			    		checkService(controllerIP, "ps aux | grep nova", Cloud_Controller_User, Cloud_Controller_Password);
			    	}
			    	
			    	else
			    	{
			    		String baseURL   = "http://"+controllerIP+":8181/onos/v1/docs/index.html";
			    		try {
			        	    // Create URL = base URL + container
			    	        URL url = new URL(baseURL);
			    	        
			    	        // Create authentication string and encode it to Base64
			    	        String authStr = Access_Controller_User + ":" + Access_Controller_Password;
			    	        String encodedAuthStr = Base64.encodeBase64String(authStr.getBytes());
			    	
			    	        // Create Http connection
			    	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			    	
			    	        // Set connection properties
			    	        connection.setRequestMethod("GET");
			    	        connection.setRequestProperty("Authorization", "Basic " + encodedAuthStr);
			    	        connection.setRequestProperty("Accept", "application/json");
			    	        
			    	        if (connection.getResponseCode()==200)
			    	        {
			    	        	controllerStatus = "GREEN";
			    	        	//System.out.println("Access Controller: "+controllerStatus);
			    	        }
		    	        	else
		    	        	{
		    	        		controllerStatus = "ORANGE";
		    	        		//System.out.println("Access Controller: "+controllerStatus);
		    	        	}
			    	    } catch (Exception e) {
			    	        //e.printStackTrace();
			    	    	System.out.println("SD-WAN Controller: "+controllerStatus+ " Failed...");
			    	    }
			    	}
		    	}
		    	
		    	UpdateResult result= mongoConnector.getDbConnection().getCollection(controllerMongoCollection).updateOne(new Document("controllerIP", controllerIP),
            	        new Document("$set", new Document("controllerStatus", controllerStatus)));
		    }
		});
	}
	
	public void checkService(String serverIp, String command, String usernameString, String password)
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
                	if (line.contains("nova-api"))
                	{
                    	controllerStatus = "GREEN";
                    	//System.out.println("Cloud Controller: "+controllerStatus);
                    	break;
                	}
                }
            }
            //System.out.println("ExitCode: " + sess.getExitStatus());
            sess.close();
            conn.close();
        }
        catch (IOException e)
        {
        	System.out.println("[INFO][Platform][Controller : "+serverIp+" Failed");
        	//LOG.debug("["+dateFormat.format(timestamp)+"][INFO][Platform]"+serverIp+" Failed"+e.getStackTrace());
            //e.printStackTrace(System.err);
        }
        //return activeVM;
    }
	
	public void run() 
	{
		while (true)
		{
			getControllerStatus();
			
			//Delete Previous Documents from Real Time collection
	    	/*deleteResult = mongoConnector.getDbConnection().getCollection(IoTMongoCollectionRT).deleteMany(new Document());
	    	
	    	//Insert New Documents for Near-Realtime Visualization
	    	if (!documentsRT.isEmpty())
	    	{
	    		System.out.println(documentsRT.size());
	    		mongoConnector.getDbConnection().getCollection(IoTMongoCollectionRT).insertMany(documentsRT);
	    		documentsRT.clear();
	    	}*/
			
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
		//System.out.println("Starting Platform Controller Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
	}
}
