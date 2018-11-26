/**
 * @author Muhammad Usman
 * @version 0.1
 */

package smartx.multiview.collectors.resource;

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

import smartx.multiview.DataLake.MongoDB_Connector;
import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.StreamGobbler;

import static java.util.Arrays.asList;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

public class BridgesVLANMapping implements Runnable{
	private Thread thread;
	private String ThreadName="Bridge Vlan Mapping Thread";
	
	private String SmartXBox_USER, SmartXBox_PASSWORD, OVS_VM_USER, OVS_VM_PASSWORD, box = "", m_ip = "", boxStatus="", ovsVM1ip, ovsVM2ip, activeVM;
	private String pboxMongoCollection, bridgevlanmapMongoCollection, bridgevlanmapMongoCollectionRT;
	private String [] BoxType;
	
	private int VLAN_START;
	private int VLAN_END;
	
	private List<Document> documentsRT = new ArrayList<Document>();
	
	private MongoDB_Connector mongoConnector;
    private Document document;
	private DeleteResult deleteResult;
	private FindIterable<Document> pBoxList;
	
	private Date timestamp;
    private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
    private Logger LOG = Logger.getLogger("bridgeVlanFile");
    
    public BridgesVLANMapping(String boxUser, String boxPassword, String ovsvmuser, String ovsvmpwd, MongoDB_Connector MongoConn, String pboxCollection, String vlanmapCollection, String vlanmapCollectionRT, int vlanstart, int vlanend, String [] boxType) {
    	SmartXBox_USER                 = boxUser;
    	SmartXBox_PASSWORD             = boxPassword;
    	OVS_VM_USER                    = ovsvmuser;
    	OVS_VM_PASSWORD                = ovsvmpwd;
    	mongoConnector                 = MongoConn;
    	pboxMongoCollection            = pboxCollection;
		bridgevlanmapMongoCollection   = vlanmapCollection;
		bridgevlanmapMongoCollectionRT = vlanmapCollectionRT;
		VLAN_START                      = vlanstart;
		VLAN_END                        = vlanend; 
		BoxType                        = boxType;
	}
    
    public void getBridgesStatus(String box, String serverIp, String bridgeName, String command, String usernameString, String password)
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
                	//System.out.println("Box: "+box+" Bridge: "+bridgeName+" --- > "+line);
                	if ((!line.contains("actions=drop")) && line.contains("dl_vlan") && !line.contains("actions=strip") && !line.contains("actions=mod_dl_src"))
                	{
                		setBridgesStatus(box, serverIp, bridgeName, line);
                    }
                }
            }
            sess.close();
            conn.close();
        }
        catch (IOException e)
        {
        	LOG.debug("[ERROR][Bridge VLAN][Box : "+box+" Failed]");
        	System.out.println("[ERROR][Bridge-VLAN-Mapping][Box : "+box+" Failed]");
            e.printStackTrace(System.err);
        }
    }
    
    public void setBridgesStatus(String box, String serverIp, String bridgeName, String result)
    {
    	String dl_vlan;
    	document = new Document();
    	int result2, result3;
    	
    	if (bridgeName.equals("brvlan"))
    	{
    		result2 = result.indexOf("mod_vlan_vid:");
    		result3 = result.indexOf(",NORMAL");
    		dl_vlan=result.substring(result2+13, result3);
    		//System.out.println(dl_vlan);
    	}
    	else
    	{
    		//System.out.println(bridgeName);
	    	result2=result.indexOf("dl_vlan")+8;
	    	
	    	result=result.substring(result2);
	    	//System.out.println("result    ---->   "+result);
	    	result3=result.indexOf("actions")-1;
	    	//System.out.println("action index    ---->   "+result3);
	    	dl_vlan=result.substring(0, result3);
	    	//System.out.println("dl_vlan    ---->   "+dl_vlan);
    	}
    	
    	if (Integer.parseInt(dl_vlan) >= VLAN_START && Integer.parseInt(dl_vlan) <= VLAN_END)
    	{
    		System.out.println("[ Bridge: "+bridgeName+" ] -----------> [Vlan "+dl_vlan+" ]");
	    	document.put("timestamp", new Date());
	    	document.put("box",       box);
	    	document.put("bridge",    bridgeName);
	    	document.put("vlan",      dl_vlan);
	    	
	    	//Insert New Documents to MongoDB History Collection
	    	documentsRT.add(document);
			mongoConnector.insertDataDB(bridgevlanmapMongoCollection, document);
			
			LOG.debug("["+dateFormat.format(timestamp)+"][INFO][Bridge VLAN][Box: "+box+" Bridge: "+bridgeName+" VLAN: "+dl_vlan+" inserted]");
	    }
    }
    
	public void update_status() 
	{
		timestamp = new Date();
		
		//pBoxList = db.getCollection(pboxMongoCollection).find(new Document("type", BoxType[0]));
    	pBoxList = mongoConnector.getDbConnection().getCollection(pboxMongoCollection).find(new Document("$or", asList(new Document("type", BoxType[0]),new Document("type", BoxType[1]))));
		pBoxList.forEach(new Block<Document>() 
		{
		    public void apply(final Document document) 
		    {
		    	boxStatus = (String) document.get("management_ip_status");
		    	box      = (String) document.get("box");
		    	System.out.println("Box  ----------------------------> "+box);
		    	if (boxStatus.equals("GREEN"))
		    	{
			    	
			        m_ip     = (String) document.get("management_ip");
			        ovsVM1ip = (String) document.get("ovs_vm1");
			        ovsVM2ip = (String) document.get("ovs_vm2");
			        activeVM = (String) document.get("active_ovs_vm");
			        //System.out.println("test "+activeVM);
			        activeVM = activeVM.equals("ovs-vm1") ? ovsVM1ip : ovsVM2ip;
			        //System.out.println("test2 "+activeVM);
			        //System.out.println("ip2 "+ovsVM2ip);
			        //Get/Set Statistics of OpenStack Bridges
			        try
			        {
			        	getBridgesStatus(box, m_ip, "br-int","ovs-ofctl dump-flows br-int | grep dl_vlan", SmartXBox_USER, SmartXBox_PASSWORD);
			        	getBridgesStatus(box, m_ip, "brvlan","ovs-ofctl dump-flows brvlan | grep dl_vlan", SmartXBox_USER, SmartXBox_PASSWORD);
			        	getBridgesStatus(box, activeVM, "brdev","sudo ovs-ofctl dump-flows brdev | grep dl_vlan", OVS_VM_USER, OVS_VM_PASSWORD);
			        }
			        catch(StringIndexOutOfBoundsException exc)
			        {
			        	System.out.println(exc);
			        	throw exc;
			        }
		    	}
		    }
		});
	}
	
	public void run() 
	{
		while (true)
		{
			update_status();
			
			//Remove Previous records from Collection (For good performance)
			deleteResult = mongoConnector.deleteDataDB(bridgevlanmapMongoCollectionRT);
			LOG.debug(deleteResult);
			
			//Insert new Documents in MongoDB RT Collection
			if (documentsRT.isEmpty()==false)
			{
				System.out.println("List not Empty");
				mongoConnector.getDbConnection().getCollection(bridgevlanmapMongoCollectionRT).insertMany(documentsRT);
				documentsRT.clear();
			}
			
			try {
				//Sleep For 60 seconds
				Thread.sleep(60000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	public void start() {
		System.out.println("Starting Bridge-Vlan Mapping Thread");
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
	}
}

