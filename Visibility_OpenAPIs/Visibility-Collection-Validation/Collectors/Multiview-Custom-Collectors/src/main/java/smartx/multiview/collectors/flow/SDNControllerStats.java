/**
 * @author Muhammad Usman
 * @version 0.1
 */

package smartx.multiview.collectors.flow;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;



import org.apache.commons.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;

public class SDNControllerStats implements Runnable{
		private String user, password, devopscontroller, ThreadName="SDN Controller Stats Thread";
		private Thread thread;
		private MongoClient mongoClient;
		private Document document;
		private MongoCollection<Document> collection1, collection2;
		private static MongoDatabase db;
		private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		public SDNControllerStats(String dbHost, int dbPort, String dbName, String flowStatsMongoCollection, String flowStatsMongoCollectionRT, String devopscon, String User, String Password)
		{
			mongoClient 	 = new MongoClient(dbHost, dbPort);
			db               = mongoClient.getDatabase(dbName);
			collection1      = db.getCollection(flowStatsMongoCollection);
			collection2      = db.getCollection(flowStatsMongoCollectionRT);
			devopscontroller = devopscon;
			user 			 = User;
			password         = Password;
		}
		
	    public void getSwitchStats() 
	    {
	    	String matchField, outputAction, NodeID, BoxID; ;
	    	String [] id;
	    	JSONObject jsonObjectMain, jsonObjectFlowStat;
	        JSONArray  jsonArrayMain, jsonArrayFlowStat;
	        	        
	        String baseURL = "http://"+devopscontroller+":8080/controller/nb/v2/statistics/default/flow";
	        Date timestamp = new Date();
	        collection2.deleteMany(new Document());
	    	
		    try {
		
		        URL url = new URL(baseURL);
		        //System.out.println(url);
		
		        // Create authentication string and encode it to Base64
		        String authStr = user + ":" + password;
		        String encodedAuthStr = Base64.encodeBase64String(authStr.getBytes());
		
		        // Create Http connection
		        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		
		        // Set connection properties
		        connection.setRequestMethod("GET");
		        connection.setRequestProperty("Authorization", "Basic " + encodedAuthStr);
		        connection.setRequestProperty("Accept", "application/json");
		
		        // Get the response from connection's inputStream
		        InputStream content = (InputStream) connection.getInputStream();
		        BufferedReader in   = new BufferedReader(new InputStreamReader(content));
		        String line = "";
		        
		        //JSONParser jsonParser = null;
		        line = in.readLine();
		        System.out.println(line);
		        
		        jsonObjectMain = new JSONObject(line);
		        jsonArrayMain  = jsonObjectMain.getJSONArray("flowStatistics");
		        
		        for (int i=0 ; i<jsonArrayMain.length(); i++)
		        {
		        	id = jsonArrayMain.getJSONObject(i).get("node").toString().split(",");
		        	jsonObjectFlowStat = jsonArrayMain.getJSONObject(i);
		        	jsonArrayFlowStat  = jsonObjectFlowStat.getJSONArray("flowStatistic");
		        	
		        	for (int j=0; j<jsonArrayFlowStat.length(); j++)
		        	{
		        		document     = new Document();
		        		NodeID       = id[0].substring(7, id[0].length()-1);
		        		matchField   = jsonArrayFlowStat.getJSONObject(j).get("flow").toString();
		        		outputAction = matchField.substring(matchField.indexOf("actions")-1,matchField.lastIndexOf("}]}")+2);
		        		matchField   = matchField.substring(matchField.indexOf("matchField")-1,matchField.indexOf("}]}")+2);
		        		
		        		
		        		if (NodeID.equals("33:33:33:33:33:33:33:11"))
			        		BoxID="SmartXBoxGIST";
			        	else if(NodeID.equals("33:33:33:33:33:33:33:31"))
			        		BoxID="SmartXBoxMYREN";
			        	else if(NodeID.equals("33:33:33:33:33:33:33:41"))
			        		BoxID="SmartXBoxID";
			        	else if(NodeID.equals("33:33:33:33:33:33:33:51"))
			        		BoxID="SmartXBoxPH";
			        	else if(NodeID.equals("33:33:33:33:33:33:33:61"))
			        		BoxID="SmartXBoxVN";
			        	else if(NodeID.equals("33:33:33:33:33:33:33:81"))
			        		BoxID="SmartXBoxPKS";
			        	else
			        		BoxID="";
		        		
		        		System.out.print("["+dateFormat.format(timestamp)+"][INFO][ODL][Node "+id[0].substring(7, id[0].length()-1));
		        		System.out.print(" packetCount "+jsonArrayFlowStat.getJSONObject(j).get("packetCount"));
		        		System.out.print(" byteCount "+jsonArrayFlowStat.getJSONObject(j).get("byteCount"));
		        		System.out.print(" durationSeconds "+jsonArrayFlowStat.getJSONObject(j).get("durationSeconds"));
		        		System.out.print(" matchField "+matchField);
		        		System.out.println(" actions "+outputAction+"]");
		        		
		        		document.put("timestamp"       , timestamp);
			        	document.put("controllerIP"    , devopscontroller);
			        	document.put("boxID"           , BoxID);
			        	document.put("node"            , NodeID);
			        	document.put("matchField"      , matchField);
			        	document.put("actions"         , outputAction);
			        	document.put("packetCount"     , jsonArrayFlowStat.getJSONObject(j).get("packetCount"));
			        	document.put("byteCount"       , jsonArrayFlowStat.getJSONObject(j).get("byteCount"));
			        	document.put("durationSeconds" , jsonArrayFlowStat.getJSONObject(j).get("durationSeconds"));
			        	
			        	collection1.insertOne(document);
			        	collection2.insertOne(document);
			        }
		        }
		    } catch (Exception e) {
		        e.printStackTrace();
		    }
	    }
	    
	    public void run() {
	    	while (true)
			{
	    		getSwitchStats();
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
			System.out.println("Starting SDN Controller Stats Thread");
			if (thread==null){
				thread = new Thread(this, ThreadName);
				thread.start();
			}
		}
	   
	}


