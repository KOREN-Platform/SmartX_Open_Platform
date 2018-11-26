/**
 * @author Muhammad Usman
 * @version 0.1
 */

package smartx.multiview.collectors.flow;

import java.util.Arrays;
import java.util.Date;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.log4j.Logger;
import org.bson.Document;

import smartx.multiview.DataLake.Elasticsearch_Connector;
import smartx.multiview.DataLake.MongoDB_Connector;

public class IOVisorKafkaConsumer implements Runnable{
	private Thread thread;
	private String ThreadName = "IO Visor Thread";
	
	private String iovisorMongoCollection = "flow-iovisor-data";
	private String bootstrapServer;
	private String topic = "iovisor";
	private String ESindex = "flow-iovisor-data-koren";
    
    private MongoDB_Connector mongoConnector;
    private Elasticsearch_Connector ESConnector;
    
    private Document document;
    private Date timestamp;
	
	private Logger LOG = Logger.getLogger("IOVisorKafka");
    
    public IOVisorKafkaConsumer(String bootstrapserver, MongoDB_Connector MongoConn, Elasticsearch_Connector ESConn) 
    {
    	bootstrapServer        = bootstrapserver;
    	mongoConnector         = MongoConn;
    	ESConnector            = ESConn;
    	ESConnector.createIndex(ESindex);
    	//System.out.println("Starting IO Visor Thread");
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
    	
        while (true) 
        {
            ConsumerRecords<String, String> records = consumer.poll(0);
            for (ConsumerRecord<String, String> record : records)
            {
            	//System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
                this.StoreToDB(record.value());
		    }
        }
     }
    
    public void StoreToDB(String record)
    {
    	String [] values =record.split(",");
    	timestamp = new Date();
    	document = new Document();
		document.put("timestamp",   timestamp);
		document.put("boxIP",   values[0]);
		document.put("boxID",   values[1]);
		document.put("packetdata",  values[2]+","+values[3]+","+values[4]+","+values[5]+","+values[6]);
		
		ESConnector.insertIOVisorData(ESindex, timestamp, values[0], values[1], values[2]+","+values[3]+","+values[4]+","+values[5]+","+values[6]);
		mongoConnector.getDbConnection().getCollection(iovisorMongoCollection).insertOne(document);
		document.clear();
    }
    
    public void run() 
	{
		//while (true)
		//{
    		System.out.println("Running "+ThreadName);
			this.Consume();
		//}
	}
	public void start() {
		//System.out.println("Starting IO Visor Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
	}
}



