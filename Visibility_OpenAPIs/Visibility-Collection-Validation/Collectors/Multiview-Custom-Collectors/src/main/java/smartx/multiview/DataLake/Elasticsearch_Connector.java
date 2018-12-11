/**
 * @author Muhammad Usman
 * @version 0.1
 */
 
package smartx.multiview.DataLake;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;

import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.search.SearchHits;

public class Elasticsearch_Connector {
	//private Client client;
	TransportClient client;
    private long index;
    
	@SuppressWarnings("unchecked")
	public void setClient(String dbHost, int dbPort)
	{
		//Elasticsearch Properties
		
	    //Settings settings = Settings.settingsBuilder().put("cluster.name", "elasticsearch").build();
	   //# Settings settings = Settings.builder().put("cluster.name", "elasticsearch").build();
	    try {
	    	
	    	client = new PreBuiltTransportClient(Settings.EMPTY).addTransportAddress(new  InetSocketTransportAddress(InetAddress.getByName(dbHost), dbPort));
	   // 	System.out.println(client.connectedNodes());
	  //#  	client = new PreBuiltTransportClient(settings);
			//client = TransportClient.builder().build().addTransportAddress(new  InetSocketTransportAddress(InetAddress.getByName(dbHost), dbPort));
	    } catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
	    }
	}
	
	public boolean checkIndexExist(String indexName)
	{
		//Check Elasticsearch Index Already Exists or not
	    boolean indexStatus = client.admin().indices().prepareExists(indexName).execute().actionGet().isExists();
	    return indexStatus;
	}
	
    
    public void createIndex(String indexName)
    {
    	//Create Elasticsearch Index
    	if (!checkIndexExist(indexName))
    	{
    		//System.out.println("Index Does not Exist");
    		CreateIndexResponse response = client.admin().indices().prepareCreate(indexName).execute().actionGet();
        }
    	
    	SearchHits resp = client.prepareSearch(indexName).get().getHits();
    	index = resp.getTotalHits();
    	//System.out.println("Total Records in Index: "+index);
    }
    
    public void insertData(String indexName, Date timestamp, String flowKey, String TLProtocol, String agentBox, float dataBytes, float frameSize)
    {
    	try {
    		XContentBuilder builder = jsonBuilder()
    			.startObject()
    				.field("@version", "1")
    				.field("@timestamp", timestamp)
    				.field("AgentID", agentBox)
    				.field("TransportProtocol", TLProtocol)
    				.field("flowKey", flowKey)
    				.field("Bytes", dataBytes)
    				.field("FrameSize", frameSize)
    			.endObject();
    		index=index+1;
    		client.prepareIndex(indexName, "mirror", index+"").setSource(builder).execute();
    	}
    	catch (IOException e) {
    		e.printStackTrace();
    	}
    }
    
    public void insertIOVisorData(String indexName, Date timestamp, String boxIP, String boxID, String packetHeader)
    {
    	try {
    		XContentBuilder builder = jsonBuilder()
    			.startObject()
    				.field("@version", "1")
    				.field("@timestamp", timestamp)
    				.field("boxIP", boxIP)
    				.field("boxID", boxID)
    				.field("packetHeader", packetHeader)
    			.endObject();
    		index=index+1;
    		client.prepareIndex(indexName, "mirror", index+"").setSource(builder).execute();
    	}
    	catch (IOException e) {
    		e.printStackTrace();
    	}
    }
}
