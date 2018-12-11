package smartx.multiview.collectors.flow;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringWriter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.ParseException;

/**
*
* The Class File of MessageProcessing part of sFlowtoKafka Program.
*
* The class for processing two JSON formatted REST API output
* into single JSON-formatted string message.
*
* @author Aris C. Risdianto
* @author GIST NetCS
* 
*/

public class MessageProcessing {
	
	public static String MessageParsingAndBuilder (String line, String flowDetail) {

		String message = "";
        org.json.simple.parser.JSONParser jsonParser = new org.json.simple.parser.JSONParser();
        JSONObject jsonObject;
        JSONArray infoArray;
        JSONObject jsonObject2;
        JSONArray infoArray2;
        String[] agentID = new String[100];
        String[] flowKey = new String[100];
        String[] bytesMetric = new String[100];
        String[] framesMetric = new String[100];
        String[] framesSizeMetric = new String[100];
        int objectID = 0;

        // Split the combined RESTAPI output (Bytes and Frame Value)
		String[] lines = line.split(";");
		try {
			
			// Read the first API output
			jsonObject = (JSONObject) jsonParser.parse(lines[0]);
	        infoArray = (JSONArray) jsonObject.get(flowDetail);
				         	        
	        for(int i = 0; i<infoArray.size();i++){
	            JSONObject Object = (JSONObject) infoArray.get(i);
	            agentID[i] = Object.get("agent").toString();
	            flowKey[i] = Object.get("key").toString();
	            bytesMetric[i] = Object.get("value").toString();
	        
	            // Read the second API output
				jsonObject2 = (JSONObject) jsonParser.parse(lines[1]);
		        infoArray2 = (JSONArray) jsonObject2.get(flowDetail);
		        
		        for(int j = 0; j<infoArray2.size();j++){
		            JSONObject Object2 = (JSONObject) infoArray2.get(j);
		            agentID[j] = Object2.get("agent").toString();
		            flowKey[j] = Object2.get("key").toString();
		            framesMetric[j] = Object2.get("value").toString();
		            
		            // If the flow key and agent are same, add second metric in the first JSON output 
		            if ( agentID[j].equals(agentID[i]) && (flowKey[j].equals(flowKey[i]))) {
			            // Calculate the FrameSize from Bytes and Frame Per Second
		            	framesSizeMetric[i] = frameSizeCalculation(bytesMetric[i], framesMetric[i]);
		            }
		            
		        }
	            objectID++;
			}
	        
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		/** Re-build the JSON message with two values (bytes and frame size) **/
		
        for(int i = 0; i<objectID;i++){
        	
        	// Different entry for the last JSON object
            if ( i == objectID - 1) 
            	message = message + JsonBuilder(agentID[i],flowKey[i],bytesMetric[i],framesSizeMetric[i]);
            else
            	message = message + JsonBuilder(agentID[i],flowKey[i],bytesMetric[i],framesSizeMetric[i]) + ",";
        }
        
        // Add the string to complete JSON messages
        if (!message.equals("")) 
        	message = "{\"" + flowDetail + "\":[" + message + "]}";
        else 
        	message = "{\"" + flowDetail + "\":[]}";
                
		return message;
	}
	
	private static String frameSizeCalculation (String bytes, String frames) {
		double frameSizeMetric = 0.0;
		// Convert string into double and the calculate the frame size
		frameSizeMetric = Double.valueOf(bytes) / Double.valueOf(frames);
		return String.valueOf(frameSizeMetric);
	}
	
	@SuppressWarnings("unchecked")
	private static String JsonBuilder (String agent, String key, String bytes, String frameSize) {
		String message = "";
		// JSON message builder for two types of REST API output
		@SuppressWarnings("rawtypes")
		Map Object = new LinkedHashMap();
		Object.put("AgentID", checkAgentName(agent));
        Object.put("FlowKey",key);
        Object.put("Bytes",bytes);
        Object.put("FrameSize", frameSize);
        
        StringWriter Out = new StringWriter();
        try {
			JSONValue.writeJSONString(Object, Out);
		} catch (IOException e) {
			e.printStackTrace();
		}

        message = Out.toString();
		return message;
	}
	
    private static String checkAgentName(String IpAddress) {
    	Scanner hostFile;
    	String hostname ="";
		try {
			hostFile = new Scanner(new File("/etc/hosts"));
	    	while (hostFile.hasNextLine()){
	    	    String[] hostIP = (hostFile.nextLine().toString()).split("\\s+");
	    	    if (IpAddress.equals(hostIP[0])) {
	    	    		hostname = hostIP[1];
	    	    		break;
	    	    }
	    	    else
	    	    		hostname = IpAddress;
	    	}
	    	hostFile.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
    	return hostname;
    }
}
