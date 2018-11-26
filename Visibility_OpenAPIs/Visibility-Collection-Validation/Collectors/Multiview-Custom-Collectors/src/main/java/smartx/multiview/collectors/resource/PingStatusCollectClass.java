/**
 * @author Muhammad Usman
 * @version 0.1
 */

package smartx.multiview.collectors.resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.bson.Document;

import com.mongodb.Block;
import com.mongodb.client.FindIterable;
import com.mongodb.client.result.DeleteResult;

import smartx.multiview.DataLake.MongoDB_Connector;

public class PingStatusCollectClass implements Runnable
{
	private Thread thread;
	private String ThreadName="Physical Path Thread";
	private String VisibilityCenter, BoxIP, pingResult = "";
	private String pboxMongoCollection, pboxstatusMongoCollection, pboxstatusMongoCollectionRT;
	private Document NewDocument;
	private DeleteResult deleteResult;
	private MongoDB_Connector mongoConnector;
	private FindIterable<Document> pBoxList;
	private List<Document> documentsRT = new ArrayList<Document>();
	private float latency;
	private Date timestamp;
    private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
    private Logger LOG = Logger.getLogger("pingCollectFile");
	
	public PingStatusCollectClass(String visibilityCenter, MongoDB_Connector MongoConn, String pbox, String pboxstatus, String pboxstatusRT, String [] boxType) 
	{
		VisibilityCenter            = visibilityCenter;
		mongoConnector              = MongoConn;
		pboxMongoCollection         = pbox;
		pboxstatusMongoCollection   = pboxstatus;
		pboxstatusMongoCollectionRT = pboxstatusRT;
	}
	
	public void writeDB(Date timestamp, String src, String dest, String stat, float latency)
	{
		NewDocument = new Document();
		NewDocument.put("timestamp",   new Date());
		NewDocument.put("source",      src);
		NewDocument.put("destination", dest);
		NewDocument.put("status",      stat);
		NewDocument.put("latency",     latency);
		
		documentsRT.add(NewDocument);
		mongoConnector.insertDataDB(pboxstatusMongoCollection, NewDocument);
	}
	
	public void getPingStatus()
	{
		//Get List of SmartX Boxes
		pBoxList = mongoConnector.getDataDB(pboxMongoCollection);
		
		pBoxList.forEach(new Block<Document>() {
		    public void apply(final Document document) {
		    	pingResult = "";
		    	BoxIP = (String) document.get("management_ip");
		    	
		    	String pingCmd = "nmap -sP -R " + BoxIP;
		    	//String pingCmd          = "ping -w 5 -c 5 ";
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
					
					if (pingResult.contains("Host seems down")==true)
					//if (pingResult.contains("100% packet loss")==true)	
					{
						writeDB(new Date(), VisibilityCenter, BoxIP, "Down", 5000);
						LOG.debug("["+dateFormat.format(timestamp)+"][INFO][PING][Collect][Box: "+BoxIP+" Management Status: Down]");
						//System.out.println("["+dateFormat.format(timestamp)+"][INFO][PING][Box: "+BoxIP+" Management Status: Down]");
					}
					else
					{
						//pingResult = pingResult.substring(pingResult.indexOf("min/avg/max/mdev = ")+19, pingResult.length());
						//latency    = Float.parseFloat(pingResult.split("/")[1]);
						//latency = Float.parseFloat(pingResult.substring(pingResult.indexOf("Host is up (")+12, pingResult.indexOf(" latency")-1));
						writeDB(new Date(), VisibilityCenter, BoxIP, "Up", latency);
						LOG.debug("["+dateFormat.format(timestamp)+"][INFO][PING][Collect][Box: "+BoxIP+" Management Status: Up]");
						//System.out.println("["+dateFormat.format(timestamp)+"][INFO][PING][Box: "+BoxIP+" Management Status: Up]");
					}
					in.close();
	            } catch (IOException e) {
	            	LOG.debug("["+dateFormat.format(timestamp)+"][INFO][PING][Collect][Box: "+BoxIP+" Failed]"+e.getMessage());
	            	System.out.println("[INFO][PING][Box : "+BoxIP+" Failed ");
	            }
	        }
		});
	}
	
	public void run() 
	{
		while (true)
		{
			System.out.println("Running "+ThreadName);
			getPingStatus();
			
			//Remove Previous records from Collection (For good performance)
			deleteResult = mongoConnector.deleteDataDB(pboxstatusMongoCollectionRT);
			LOG.debug(deleteResult);
			
			//Insert new Documents in MongoDB RT Collection
			mongoConnector.getDbConnection().getCollection(pboxstatusMongoCollectionRT).insertMany(documentsRT);
			documentsRT.clear();
			
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
		//System.out.println("Starting Ping Collect Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
	}
}


