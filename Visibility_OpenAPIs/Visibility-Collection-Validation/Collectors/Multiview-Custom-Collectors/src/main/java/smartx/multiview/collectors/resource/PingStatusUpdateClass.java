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

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.StreamGobbler;

import com.mongodb.Block;
import com.mongodb.client.FindIterable;
import com.mongodb.client.result.UpdateResult;

import static java.util.Arrays.asList;
import smartx.multiview.DataLake.MongoDB_Connector;

public class PingStatusUpdateClass implements Runnable {
	private Thread thread;
	private String ThreadName="vSwitch Status Thread";
	private String SmartXBox_USER, SmartXBox_PASSWORD, ovsVM_USER, ovsVM_PASSWORD;
	private String m_status, m_status_new, d_status;
	private String box = "", activeVM, m_ip = "", d_ip = "", ovsVM1ip, ovsVM2ip, boxtype;
	private String pboxMongoCollection, pboxstatusMongoCollectionRT;
	private String [] BoxType;
	private FindIterable<Document> pBoxList;
    private FindIterable<Document> pBoxStatus;
    private List<String> bridges = new ArrayList<String>();
    private MongoDB_Connector mongoConnector;
    private Date timestamp;
    private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private Logger LOG = Logger.getLogger("pingUpdateFile");
	
    public PingStatusUpdateClass(String boxUser, String boxPassword, MongoDB_Connector MongoConn, String pbox, String pboxstatus, String [] boxType, String ovsVMUser, String ovsVMPass)
    {
    	SmartXBox_USER              = boxUser;
    	SmartXBox_PASSWORD          = boxPassword;
    	ovsVM_USER                  = ovsVMUser;
    	ovsVM_PASSWORD              = ovsVMPass;
    	mongoConnector              = MongoConn;
		BoxType                     = boxType;  
		pboxMongoCollection         = pbox;
		pboxstatusMongoCollectionRT = pboxstatus;
	}
	
    public void getActiveVM(String serverIp, String command, String usernameString, String password)
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
                	activeVM=line;
                }
            }
            //System.out.println("ExitCode: " + sess.getExitStatus());
            sess.close();
            conn.close();
        }
        catch (IOException e)
        {
        	System.out.println("[INFO][OVS-VM][Box : "+serverIp+" Failed");
        	LOG.debug("["+dateFormat.format(timestamp)+"][INFO][PING][UPDATE]"+serverIp+" Failed"+e.getStackTrace());
            //e.printStackTrace(System.err);
        }
        //return activeVM;
    }
    
	public String getDataPlaneStatusTypeS(String serverMgmtIp, String serverDataIp, String command, String usernameString, String password)
    {
		String InterfaceStatus = null;
        try
        {
            Connection conn = new Connection(serverMgmtIp);
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPassword(usernameString, password);
            if (isAuthenticated == false)
                throw new IOException("Authentication failed.");        
            ch.ethz.ssh2.Session sess = conn.openSession();
            sess.execCommand(command);  
            InputStream stdout = new StreamGobbler(sess.getStdout());
            InputStream stdout2;
            BufferedReader br = new BufferedReader(new InputStreamReader(stdout));
            BufferedReader br2;
            
            if (br.readLine()!=null)
            {
            	int index = 0;
            	InterfaceStatus="GREEN";
            	//System.out.println("Box : "+serverMgmtIp+" Data Interface Status: "+InterfaceStatus);
            	ch.ethz.ssh2.Session sess2 = conn.openSession();
            	sess2.execCommand("sudo ovs-ofctl show br-cap | grep vxlan | cut -f 1 -d : | cut -f 2 -d '(' | cut -f 1 -d ')'");
            	stdout = new StreamGobbler(sess2.getStdout());
            	br     = new BufferedReader(new InputStreamReader(stdout));
            	
            	while(true)
            	{
            		String host = br.readLine();
            		if (host == null)
            		{
            			if (index==0)
            				InterfaceStatus="ORANGE";
            			index=1;
            			//System.out.println("InterfaceStatus : "+InterfaceStatus);
            			break;
            		}
                    
            		index++;
            		//System.out.print(host);
                    if (host != null)
                    {
                    	//System.out.println("Host : "+host);
                    	ch.ethz.ssh2.Session sess3 = conn.openSession();
                    	
                    	sess3.execCommand("ping -c 1 `ovs-vsctl show | grep -A2 "+host+" | grep remote_ip | cut -d '\"' -f 2` | grep ttl");
                    	
                    	stdout2 = new StreamGobbler(sess3.getStdout());
                    	br2     = new BufferedReader(new InputStreamReader(stdout2));
                    	if (br2.readLine() == null)
                    	{
                    		
                    		InterfaceStatus="ORANGE";
                    		System.out.println("[INFO][Data Plane][UPDATE][Box S: "+serverMgmtIp+"] "+InterfaceStatus);
                    		break;
                    	}
                    	else
                    	{
                    		//System.out.println(" Else");
                    		InterfaceStatus="GREEN";
                    		System.out.println("[INFO][Data Plane][UPDATE][Box S: "+serverMgmtIp+"] "+InterfaceStatus);
                    	}
                    }
            	}
            	sess.close();
            	conn.close();
            }
            else
            {
            	InterfaceStatus="RED";
            	System.out.println("[INFO][Data Plane][UPDATE][Box S: "+serverMgmtIp+"] "+InterfaceStatus);
            	sess.close();
            	conn.close();
            }
        }
        catch (IOException e)
        {
        	System.out.println("[INFO][Data Plane][UPDATE][Box S: "+serverMgmtIp+" Failed");
        	LOG.debug("["+dateFormat.format(timestamp)+"][ERROR][Data Plane][UPDATE][Box : "+serverMgmtIp+" Failed");
            e.printStackTrace(System.err);
        }
        
		return InterfaceStatus;
    }
	
	public  String getDataPlaneStatusTypeC(String serverMgmtIp, String command, String usernameString, String password)
	{
		String InterfaceStatus = null;
        try
        {
            Connection conn = new Connection(serverMgmtIp);
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPassword(usernameString, password);
            if (isAuthenticated == false)
                throw new IOException("Authentication failed.");        
            ch.ethz.ssh2.Session sess = conn.openSession();
            sess.execCommand(command);  
            InputStream stdout = new StreamGobbler(sess.getStdout());
            InputStream stdout2;
            BufferedReader br = new BufferedReader(new InputStreamReader(stdout));
            BufferedReader br2;
            
            String line = br.readLine();
            
        	if (Integer.parseInt(line)==0)
        	{
        		ch.ethz.ssh2.Session sess2 = conn.openSession();
            	sess2.execCommand("sudo ovs-ofctl show brvlan | grep addr: | cut -f 1 -d : | cut -f 2 -d '(' | cut -f 1 -d ')' | awk '!/phy-brvlan/ && !/brvlan/'");
            	stdout = new StreamGobbler(sess2.getStdout());
            	br     = new BufferedReader(new InputStreamReader(stdout));
            	
            	String interfaceName=br.readLine();
            	if (interfaceName!=null)
                {
            		ch.ethz.ssh2.Session sess3 = conn.openSession();
                	sess3.execCommand("ethtool "+interfaceName+" | awk '/Link detected: yes/'");
                	stdout = new StreamGobbler(sess3.getStdout());
                	br     = new BufferedReader(new InputStreamReader(stdout));
                	if (br.readLine()!=null)
                    {
                		InterfaceStatus="GREEN";
                		System.out.println("[INFO][Data Plane][UPDATE][Box C: "+serverMgmtIp+"] "+InterfaceStatus);
                    }
                	else
                	{
                		InterfaceStatus="RED";
                		System.out.println("[INFO][Data Plane][UPDATE][Box C: "+serverMgmtIp+"] "+InterfaceStatus);
                	}
                	sess3.close();
                }
            	else
            	{
            		InterfaceStatus="DARKGRAY";
            		System.out.println("[INFO][Data Plane][UPDATE][Box C: "+serverMgmtIp+"] "+InterfaceStatus);
            	}
            	sess2.close();
            }
            else
            {
            	InterfaceStatus="ORANGE";
            	System.out.println("[INFO][Data Plane][UPDATE][Box C: "+serverMgmtIp+"] "+InterfaceStatus);
            }
        	
        	sess.close();
        	conn.close();
        }
        catch (IOException e)
        {
        	System.out.println("[INFO][Data Plane][UPDATE][Box C: "+serverMgmtIp+"] Failed");
        	LOG.debug("["+dateFormat.format(timestamp)+"][ERROR][Data Plane][UPDATE][Box C: "+serverMgmtIp+" Failed");
            e.printStackTrace(System.err);
        }
        
		return InterfaceStatus;
	}
	
	public  String getDataPlaneStatusTypeO(String serverMgmtIp, String command, String usernameString, String password)
	{
		String InterfaceStatus = null;
        try
        {
            Connection conn = new Connection(serverMgmtIp);
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPassword(usernameString, password);
            if (isAuthenticated == false)
                throw new IOException("Authentication failed.");        
            ch.ethz.ssh2.Session sess = conn.openSession();
            sess.execCommand(command);  
            InputStream stdout = new StreamGobbler(sess.getStdout());
            BufferedReader br = new BufferedReader(new InputStreamReader(stdout));
            
            String line = br.readLine();
            //System.out.println("[INFO][Data Plane][UPDATE][Box O: "+serverMgmtIp+"] "+line);
            
        	if (Integer.parseInt(line)==0)
        	{
        		ch.ethz.ssh2.Session sess2 = conn.openSession();
            	sess2.execCommand("ethtool eno7 | awk '/Link detected: yes/'");
            	stdout = new StreamGobbler(sess2.getStdout());
            	br     = new BufferedReader(new InputStreamReader(stdout));
            	if (br.readLine()!=null)
                {
            		InterfaceStatus="GREEN";
            		System.out.println("[INFO][Data Plane][UPDATE][Box O: "+serverMgmtIp+"] "+InterfaceStatus);
                }
            	else
            	{
            		InterfaceStatus="RED";
            		System.out.println("[INFO][Data Plane][UPDATE][Box O: "+serverMgmtIp+"] "+InterfaceStatus);
            	}
            	sess2.close();
            }
            else
            {
            	InterfaceStatus="ORANGE";
            	System.out.println("[INFO][Data Plane][UPDATE][Box O: "+serverMgmtIp+"] "+InterfaceStatus);
            }
        	
        	sess.close();
        	conn.close();
        }
        catch (IOException e)
        {
        	System.out.println("[INFO][Data Plane][UPDATE][Box O: "+serverMgmtIp+"] Failed");
        	LOG.debug("["+dateFormat.format(timestamp)+"][ERROR][Data Plane][UPDATE][Box O: "+serverMgmtIp+" Failed");
            e.printStackTrace(System.err);
        }
        
		return InterfaceStatus;
	}
	
	public void update_status() 
	{
		timestamp = new Date();
		pBoxList = mongoConnector.getDbConnection().getCollection(pboxMongoCollection).find();
		//pBoxList = mongoConnector.getDbConnection().getCollection(pboxMongoCollection).find(new Document("$or", asList(new Document("type", BoxType[0]),new Document("type", BoxType[1]))));
		
		pBoxList.forEach(new Block<Document>() {
		    public void apply(final Document document) 
		    {
		        box       = (String) document.get("boxID");
		        m_ip      = (String) document.get("management_ip");
		        d_ip      = (String) document.get("data1_ip");
		        m_status  = (String) document.get("management_ip_status");
		        boxtype   = (String) document.get("boxType");
		        
		        //Get Management Plane Status & Update pBox Status Collection
		        pBoxStatus = mongoConnector.getDataDB(pboxstatusMongoCollectionRT, "destination", m_ip);		        		
		        pBoxStatus.forEach(new Block<Document>() 
		        {
		            public void apply(final Document document2) 
		            {
		            	m_status_new = document2.get("status").toString().toUpperCase();
		            	
		            	if (m_status_new.equalsIgnoreCase("UP"))
		            	{
		            		m_status_new="GREEN";
		            		
	            			if (boxtype.equals("S"))
	            			{
	            				d_status = getDataPlaneStatusTypeS(m_ip, d_ip, "netstat -ie | grep 'inet addr:"+d_ip+"' | cut -f 2 -d :", SmartXBox_USER, SmartXBox_PASSWORD);
	            			}
	            			
	            			else if (boxtype.equals("C"))
	            			{
	            				d_status = getDataPlaneStatusTypeC(m_ip, "service openvswitch-switch status | egrep -c 'stop|not running'", SmartXBox_USER, SmartXBox_PASSWORD);
	            			}
	            				
	            			else if (boxtype.equals("O"))
	            			{
	            				d_status = getDataPlaneStatusTypeO(m_ip, "service openvswitch-switch status | egrep -c 'stop|not running'", SmartXBox_USER, SmartXBox_PASSWORD);
	            			}
	            		}
		            	else
		            	{
		            		m_status_new="RED";
		            		d_status="RED";
		            	}
		            	
		            	UpdateResult result= mongoConnector.getDbConnection().getCollection(pboxMongoCollection).updateOne(new Document("management_ip", m_ip),
		            	        new Document("$set", new Document("management_ip_status", m_status_new)
		            	        		.append("data1_ip_status", d_status)
		            	        		.append("active_ovs_vm", activeVM)));
		            	LOG.debug("["+dateFormat.format(timestamp)+"][INFO][PING][UPDATE][Box: "+m_ip+" Management Status: "+m_status_new+" Data Status: "+d_status+" Active VM: "+activeVM+" Records Updated :"+result.getModifiedCount()+"]");
		            	//System.out.println("["+dateFormat.format(timestamp)+"][INFO][PING][MVC][Box: "+m_ip+" Management Status: "+m_status_new+" Data Status: "+d_status+" Active VM: "+activeVM+" Records Updated :"+result.getModifiedCount()+"]");
		            }
		        });
		    }
		});
	}
	
	public void run() 
	{
		while (true)
		{
			System.out.println("Running "+ThreadName);
			update_status();
			try {
				//Sleep For 30 Seconds
				Thread.sleep(60000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public void start() 
	{
		if (thread==null){
			thread = new Thread(this, ThreadName);
			thread.start();
		}
		
	}
}
