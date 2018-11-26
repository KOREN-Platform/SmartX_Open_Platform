/**
 * @author Muhammad Usman
 * @version 0.2
 */

package smartx.multiview.collectors.flow;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.log4j.Logger;
import org.bson.Document;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import smartx.multiview.DataLake.Elasticsearch_Connector;
import smartx.multiview.DataLake.MongoDB_Connector;

public class sFlowKafkaConsumer implements Runnable{
	private Thread thread;
	private String ThreadName = "sFlow Consumer Thread";
	
	private String sFlowMongoCollection;
	private String bootstrapServer;
	
	private String topic   = "sFlow-KOREN";
    private String ESindex = "flow-sflow-data";
    
    private MongoDB_Connector mongoConnector;
    private Elasticsearch_Connector ESConnector;
    
    private Document document;
    private List<Document> documentsRT = new ArrayList<Document>();
    
    private Date timestamp;
	
	private Logger LOG = Logger.getLogger("sFlowKafka");
    
    public sFlowKafkaConsumer(String bootstrapserver, MongoDB_Connector MongoConn, Elasticsearch_Connector ESConn, String sflowCollection, String [] boxType) 
    {
    	bootstrapServer      = bootstrapserver;
    	mongoConnector       = MongoConn;
    	sFlowMongoCollection = sflowCollection;
    	ESConnector          = ESConn;
    	ESConnector.createIndex(ESindex);
    }
    
    public void Consume(){
    	//Kafka & Zookeeper Properties
    	Properties props = new Properties();
        props.put("bootstrap.servers", bootstrapServer);
        props.put("group.id", "test");
        props.put("enable.auto.commit", "true");
        props.put("auto.commit.interval.ms", "1000");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);
    	consumer.subscribe(Arrays.asList(topic));
    	System.out.println("Running "+ThreadName);
        while (true) 
        {
            ConsumerRecords<String, String> records = consumer.poll(100);
            for (ConsumerRecord<String, String> record : records)
            {
            	//System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
                this.StoreToDB(record.value());
		    }
        }
     }
    
    public void StoreToDB(String record)
    {
    	timestamp = new Date();
    	String agentBox, flowKey, TLProtocol;
    	float dataBytes, frameSize; 
    
    	JSONParser parser = new JSONParser();
		JSONObject json;
		try 
		{
			json = (JSONObject) parser.parse(record);
		
    		if (json.containsKey("UDPFlowDetail"))
			{
				JSONArray array = (JSONArray) json.get("UDPFlowDetail");
		        //System.out.println(array.get(0));
		        //System.out.println(array.size());
		        
		        for (int i=0; i< array.size(); i++)
		        {
		        	json =(JSONObject)  array.get(i);
		        	
					flowKey    = json.get("FlowKey").toString();
					TLProtocol = "UDP";
					agentBox   = json.get("AgentID").toString();
					dataBytes  = Float.parseFloat(json.get("Bytes").toString());
					
					//System.out.println("[AgentID - "+agentBox+"][FlowKey - "+flowKey+"][ Bytes - "+dataBytes+"][FrameSize - "+json+"]");
					if (json.get("FrameSize")==null)
					{
						frameSize = 0;
					//	System.out.println("[AgentID - "+agentBox+"][FlowKey - "+flowKey+"][ Bytes - "+dataBytes+"][FrameSize - "+frameSize+"]");
					}
					else
					{
						frameSize  = Float.parseFloat(json.get("FrameSize").toString());
					//	System.out.println("[AgentID - "+agentBox+"][FlowKey - "+flowKey+"][ Bytes - "+dataBytes+"][FrameSize - "+frameSize+"]");
					}
					
					//System.out.println("[AgentID - "+agentBox+"][FlowKey - "+flowKey+"][ Bytes - "+dataBytes+"][FrameSize - "+frameSize+"]");
		        	
					document = new Document();
					document.put("timestamp",         timestamp);
					document.put("AgentID",           agentBox);
					document.put("TransportProtocol", TLProtocol);
		    		document.put("Flowkey",           flowKey);
		    		document.put("Bytes",             dataBytes);
		            document.put("FrameSize",         frameSize);
		            
		            documentsRT.add(document);
		            
		            ESConnector.insertData(ESindex, timestamp, flowKey, TLProtocol, agentBox, dataBytes, frameSize);
		            LOG.debug("[AgentID - "+agentBox+"][FlowKey - "+flowKey+"][ Bytes - "+dataBytes+"][FrameSize - "+frameSize+"]");
		        }
		    }
			else if (json.containsKey("TCPFlowDetail"))
			{
			    JSONArray array = (JSONArray) json.get("TCPFlowDetail");
		        for (int i=0; i< array.size(); i++)
		        {
		        	json =(JSONObject)  array.get(i);
		        	
			        flowKey    = json.get("FlowKey").toString();
					TLProtocol = "TCP";
					agentBox   = json.get("AgentID").toString();
					dataBytes  = Float.parseFloat(json.get("Bytes").toString());
					frameSize  = Float.parseFloat(json.get("FrameSize").toString());
					
					document = new Document();
					document.put("timestamp",         timestamp);
					document.put("AgentID",           agentBox);
					document.put("TransportProtocol", TLProtocol);
		    		document.put("Flowkey",           flowKey);
		    		document.put("Bytes",             dataBytes);
		            document.put("FrameSize",         frameSize);
		            
		            documentsRT.add(document);
		            
		            ESConnector.insertData(ESindex, timestamp, flowKey, TLProtocol, agentBox, dataBytes, frameSize);
		            LOG.debug("[AgentID - "+agentBox+"][FlowKey - "+flowKey+"][ Bytes - "+dataBytes+"][FrameSize - "+frameSize+"]");
		        }
			}
			else if (json.containsKey("ICMPFlowDetail"))
			{
				JSONArray array = (JSONArray) json.get("ICMPFlowDetail");
		        for (int i=0; i< array.size(); i++)
		        {
		        	json =(JSONObject)  array.get(i);
		        	
			        flowKey    = json.get("FlowKey").toString();
					TLProtocol = "ICMP";
					agentBox   = json.get("AgentID").toString();
					dataBytes  = Float.parseFloat(json.get("Bytes").toString());
					frameSize  = Float.parseFloat(json.get("FrameSize").toString());
					
					//System.out.println("[AgentID - "+agentBox+"][FlowKey - "+flowKey+"][ Bytes - "+dataBytes+"][FrameSize - "+frameSize+"]");
		        	
		        	document = new Document();
					document.put("timestamp",         timestamp);
					document.put("AgentID",           agentBox);
					document.put("TransportProtocol", TLProtocol);
		    		document.put("Flowkey",           flowKey);
		    		document.put("Bytes",             dataBytes);
		            document.put("FrameSize",         frameSize);
		            
		            documentsRT.add(document);
		            
		            ESConnector.insertData(ESindex, timestamp, flowKey, TLProtocol, agentBox, dataBytes, frameSize);
		            LOG.debug("[AgentID - "+agentBox+"][FlowKey - "+flowKey+"][ Bytes - "+dataBytes+"][FrameSize - "+frameSize+"]");
		        }
			}
			else
			{
				System.out.println("Unknown Key in JSON.");
			}
    		
    		//Insert New Documents to MongoDB Collection
    		if (documentsRT.size()>0)
    		{
    			mongoConnector.getDbConnection().getCollection(sFlowMongoCollection).insertMany(documentsRT);
    			documentsRT.clear();
    		}
			
		} catch (org.json.simple.parser.ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
    }
    
    public void run() 
	{
		while (true)
		{
			this.Consume();
		}
	}
    
    public void start() {
		//System.out.println("Starting sFlow Consumer Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
	}
    
    
}

