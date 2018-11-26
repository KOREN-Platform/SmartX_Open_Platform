/**
*
* The Class File of sFlowKafka.
*
* The class for querying sFlow messages and send it to Kafka. 
* Developing by sFlow-RT REST API and Kafka Java Consumer.
*
* @author Aris C. Risdianto
* @author GIST NetCS
* @author Muhammad Usman (Updated thread management)
* 
*/

package smartx.multiview.collectors.flow;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.TimerTask;
import java.util.concurrent.ExecutionException;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class sFlowKafkaProducer implements Runnable {
	private Thread thread;
	private String ThreadName = "sFlow Producer Thread";

	private String server;
	private String topic;
	
	public sFlowKafkaProducer(String server, String topic) {
		this.server = server;
		this.topic = topic;
	}
	
	/** Run the program as Java Thread **/
	public void run()
	{
		while (true)
		{
			//Build the all REST API's URL for different value
		    String baseURL = "http://127.0.0.1:8008";
		    List<String> APIList = new ArrayList<String>();
		    APIList.add("UDPFlowDetail");
		    APIList.add("TCPFlowDetail");
		    APIList.add("ICMPFlowDetail");
		        
		    for (String FlowDetail : APIList)	{
		    
		    String value = "";
		        
		    /** Check the connection for sFlow RT */ 
		    try {
		    	
		        // Create URL = base URL + container
		       	List<String> RESTAPIList = new ArrayList<String>();
		    	RESTAPIList.add("activeflows/ALL/" + FlowDetail + "/json");
		    	RESTAPIList.add("activeflows/ALL/" + FlowDetail + "Frames" + "/json");
				String key = "sFlow";
		    	
		    	for (String RESTAPI : RESTAPIList) {
		    	
		    		URL url = new URL(baseURL + "/" + RESTAPI);
		    	
		    		// Create HTTP connection and properties
		    		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		    		connection.setRequestMethod("GET");
		    		connection.setRequestProperty("Accept", "application/json");
		    		InputStream content = (InputStream) connection.getInputStream();
		    		BufferedReader in = new BufferedReader(new InputStreamReader(content));
		    		String line = "";
		    		
		    		// Build the JSON object for Kafka Message
		    		value = value + "{\"" + FlowDetail + "\":" ;
		    		while ((line = in.readLine()) != null) {
		    			value = value+line;
		    		}
		    		value = value + "};";
		    	}
		        
		    	String message = MessageProcessing.MessageParsingAndBuilder(value, FlowDetail);
		    	//System.out.println("sFlow Producer: "+message);
		        /** Open Kafka Consumer and Sent */ 
				try {
					KafkaSent(server, topic, key, message);
					} catch (Exception e) {
						e.printStackTrace();
					}	
		        
		    	} catch (Exception e) {
		    		e.printStackTrace();
		    	}
		    }
	   }
    }
	
	public static void KafkaSent(String server, String topic, String key, String value) throws InterruptedException, ExecutionException {
		Properties props = new Properties();
		props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,server + ":9092");
		props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,StringSerializer.class.getName());
		props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,StringSerializer.class.getName());

		KafkaProducer<String,String> producer = new KafkaProducer<String,String>(props);
		boolean sync = false;

		ProducerRecord<String,String> producerRecord = new ProducerRecord<String,String>(topic, key, value);
		if (sync) {
			producer.send(producerRecord).get();
		} else {
			producer.send(producerRecord);
		}
		producer.close();
	}
	
	public void start() {
		//System.out.println("Starting sFlow Producer Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
	}

}

