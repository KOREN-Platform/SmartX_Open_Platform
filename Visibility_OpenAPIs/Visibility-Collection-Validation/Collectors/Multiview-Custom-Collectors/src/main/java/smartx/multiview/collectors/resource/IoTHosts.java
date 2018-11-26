package smartx.multiview.collectors.resource;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
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

import com.mongodb.client.result.DeleteResult;

import smartx.multiview.DataLake.MongoDB_Connector;

public class IoTHosts implements Runnable{
	private Thread thread;
	private String ThreadName = "IoT Host Thread";
	
	private MongoDB_Connector mongoConnector;
	private Document documentHistory, documentRT;
	private List<Document> documentsRT = new ArrayList<Document>();
	private DeleteResult deleteResult;
	
	private String IoTMongoCollection="resourcelevel-IoTHost-list", IoTMongoCollectionRT = "configuration-IoTHost-list";
	private String IoT_Controller, IoT_Controller_User, IoT_Controller_Password;
	
	private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private Logger LOG = Logger.getLogger("IoTHostFile");
	
	public IoTHosts(MongoDB_Connector MongoConn, String iotcontroller, String User, String Password)
	{
		mongoConnector          = MongoConn;
		IoT_Controller          = iotcontroller;
		IoT_Controller_User 	= User;
		IoT_Controller_Password = Password;
	}
	
	public void getIoTHostsList(){
		System.out.println("Running "+ThreadName);
		String baseURL   = "http://"+IoT_Controller+":8181/onos/v1/hosts";
    	String BoxID, HostID, HostMAC, HostVLAN, HostConfigured, HostIpAddresses; 
    	Date timestamp = new Date();
    	
    	try {
    	    // Create URL = base URL + container
	        URL url = new URL(baseURL);
	        //System.out.println(url);
	
	        // Create authentication string and encode it to Base64
	        String authStr = IoT_Controller_User + ":" + IoT_Controller_Password;
	        String encodedAuthStr = Base64.encodeBase64String(authStr.getBytes());
	
	        // Create Http connection
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	
	        // Set connection properties
	        connection.setRequestMethod("GET");
	        connection.setRequestProperty("Authorization", "Basic " + encodedAuthStr);
	        connection.setRequestProperty("Accept", "application/json");
	
	        // Get the response from connection's inputStream
	        InputStream content = (InputStream) connection.getInputStream();
	        BufferedReader in = new BufferedReader(new InputStreamReader(content));
	        String line = "";
	        
	        //JSONParser jsonParser = null;
	        line = in.readLine();
	        JSONObject jsonObject = new JSONObject(line);
	        JSONArray jsonArray = jsonObject.getJSONArray("hosts");
	        
	        for (int i=0 ; i<jsonArray.length(); i++)
	        {
	        	/*System.out.print("["+dateFormat.format(timestamp)+"][INFO][IoT Host][ID "+jsonArray.getJSONObject(i).get("id"));
	        	System.out.print(" MAC "+jsonArray.getJSONObject(i).get("mac"));
	        	System.out.print(" VLAN "+jsonArray.getJSONObject(i).get("vlan"));
	        	System.out.print(" Configured "+jsonArray.getJSONObject(i).get("configured"));
	        	System.out.print(" ipAddresses "+jsonArray.getJSONObject(i).get("ipAddresses"));
	        	System.out.println(" Location "+jsonArray.getJSONObject(i).get("location")+"]\n");*/
	        	
	        	BoxID           = jsonArray.getJSONObject(i).get("location").toString();
	        	HostID          = jsonArray.getJSONObject(i).get("id").toString();
	        	HostMAC         = jsonArray.getJSONObject(i).get("mac").toString();
	        	HostVLAN        = jsonArray.getJSONObject(i).get("vlan").toString();
	        	HostConfigured  = jsonArray.getJSONObject(i).get("configured").toString();
	        	HostIpAddresses = jsonArray.getJSONObject(i).get("ipAddresses").toString();
	        	
	        	if (BoxID.contains("of:1111111111111111")){
	        		BoxID = "GIST_O_1";
	        	}
	        	else if (BoxID.contains("of:1111111111111122")){
	        		BoxID = "KN_O_1";
	        	}
	        	else if (BoxID.contains("of:1111111111111112")){
	        		BoxID = "JJ_O_1";
	        	}
	        	
	        	//documentHistory = new Document();
	        	documentRT = new Document();
	        	documentRT.put("timestamp", timestamp);
	        	documentRT.put("boxID", BoxID);
	        	documentRT.put("hostID", HostID);
	        	documentRT.put("macaddress", HostMAC);
	        	documentRT.put("vlanid", HostVLAN);
	        	documentRT.put("configured", HostConfigured);
	        	documentRT.put("ipaddress", HostIpAddresses);
	        	
	        	documentsRT.add(documentRT);
	        }
	    } catch (Exception e) {
	        //e.printStackTrace();
	        System.out.print("");
	    }
	}
	
	public void run() 
	{
		while (true)
		{
			getIoTHostsList();
						
			//Delete Previous Documents from Real Time collection
	    	deleteResult = mongoConnector.getDbConnection().getCollection(IoTMongoCollectionRT).deleteMany(new Document());
	    	
	    	//Insert New Documents for Near-Realtime Visualization
	    	if (!documentsRT.isEmpty())
	    	{
	    		//System.out.println(documentsRT.size());
	    		mongoConnector.getDbConnection().getCollection(IoTMongoCollectionRT).insertMany(documentsRT);
	    		documentsRT.clear();
	    	}
			
			try {
				//Sleep For 30 Seconds
				Thread.sleep(30000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				//e.printStackTrace();
				System.out.print("");
			}
		}
		
	}
	public void start() {
		//System.out.println("Starting IoT Host Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
	}
}
