/**
 * @author Muhammad Usman
 * @version 0.2
 */

package smartx.multiview.collectors.CollectorsMain;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PlaygroundConfigurationLoader {
	private String VISIBILITY_CENTER;
	
	private String MONGO_DB_HOST;
	private int    MONGO_DB_PORT;
	private String MONGO_DB_DATABASE;
	
	private String ES_HOST;
	private int    ES_PORT;
	
	private String OPENSTACK_PASSWORD;
	private String OPENSTACK_USER_ID;
	private String OPENSTACK_PROJECT_ID;
	private String OPENSTACK_ENDPOINT;
	
	private String devopscontrollers;
	private String ControllerPassword;
	private String ControllerUser;
	
	private String SmartXBox_USER;
	private String SmartXBox_PASSWORD;
	
	private String CTRL_Box_IP;
	private String CTRL_Box_USER;
	private String CTRL_Box_PASSWORD;
	
	private String OVS_VM_USER;
	private String OVS_VM_PASSWORD;
	
	private int VLAN_START;
	private int VLAN_END;
	
	private String pboxMongoCollection                  = "configuration-pbox-list";
	private String vboxMongoCollection                  = "resourcelevel-os-instance-detail";
	private String vboxMongoCollectionRT                = "configuration-vbox-list";
	private String pboxstatusMongoCollection            = "resourcelevel-ppath";
	private String pboxstatusMongoCollectionRT          = "resourcelevel-ppath-rt";
	private String ovsListMongoCollection               = "configuration-vswitch-list";
	private String ovsstatusMongoCollection             = "configuration-vswitch-status";
	private String bridgevlanmapMongoCollection         = "configuration-bridge-vlan-map";
	private String bridgevlanmapMongoCollectionRT       = "configuration-bridge-vlan-map-rt";
	private String flowConfigMongoCollection            = "flow-configuration-sdn-controller";
	private String flowConfigMongoCollectionRT          = "flow-configuration-sdn-controller-rt";
	private String flowStatsMongoCollection             = "flow-stats-sdn-controller";
	private String flowStatsMongoCollectionRT           = "flow-stats-sdn-controller-rt";
	private String flowConfigOpenStackMongoCollection   = "flow-stats-openstack-bridges";
	private String flowConfigOpenStackMongoCollectionRT = "flow-stats-openstack-bridges-rt";
	private String sflowMongoCollection                 = "flow-sFlow-data";
	private String [] BoxType = {"B**", "C**"};
	
	public String getVISIBILITY_CENTER() {
		return VISIBILITY_CENTER;
	}
	
	public String getMONGO_DB_HOST() {
		return MONGO_DB_HOST;
	}

	public int getMONGO_DB_PORT() {
		return MONGO_DB_PORT;
	}

	public String getMONGO_DB_DATABASE() {
		return MONGO_DB_DATABASE;
	}

	public String getOPENSTACK_PASSWORD() {
		return OPENSTACK_PASSWORD;
	}

	public String getOPENSTACK_USER_ID() {
		return OPENSTACK_USER_ID;
	}

	public String getOPENSTACK_PROJECT_ID() {
		return OPENSTACK_PROJECT_ID;
	}

	public String getOPENSTACK_ENDPOINT() {
		return OPENSTACK_ENDPOINT;
	}

	public String getdevopscontrollers() {
		return devopscontrollers;
	}

	public String getControllerPassword() {
		return ControllerPassword;
	}

	public String getControllerUser() {
		return ControllerUser;
	}

	public String getSmartXBox_USER() {
		return SmartXBox_USER;
	}

	public String getSmartXBox_PASSWORD() {
		return SmartXBox_PASSWORD;
	}

	public String getOVS_VM_USER() {
		return OVS_VM_USER;
	}

	public String getOVS_VM_PASSWORD() {
		return OVS_VM_PASSWORD;
	}

	public String getpboxMongoCollection() {
		return pboxMongoCollection;
	}

	public String getvboxMongoCollection() {
		return vboxMongoCollection;
	}

	public String getvboxMongoCollectionRT() {
		return vboxMongoCollectionRT;
	}

	public String getpboxstatusMongoCollection() {
		return pboxstatusMongoCollection;
	}

	public String getpboxstatusMongoCollectionRT() {
		return pboxstatusMongoCollectionRT;
	}

	public String getovsListMongoCollection() {
		return ovsListMongoCollection;
	}

	public String getovsstatusMongoCollection() {
		return ovsstatusMongoCollection;
	}

	public String getflowConfigMongoCollection() {
		return flowConfigMongoCollection;
	}

	public String getflowConfigMongoCollectionRT() {
		return flowConfigMongoCollectionRT;
	}

	public String getflowStatsMongoCollection() {
		return flowStatsMongoCollection;
	}

	public String getflowStatsMongoCollectionRT() {
		return flowStatsMongoCollectionRT;
	}

	public String getflowConfigOpenStackMongoCollection() {
		return flowConfigOpenStackMongoCollection;
	}

	public String getflowConfigOpenStackMongoCollectionRT() {
		return flowConfigOpenStackMongoCollectionRT;
	}
	
	public String getbridgevlanmapMongoCollection() {
		return bridgevlanmapMongoCollection;
	}

	public String getbridgevlanmapMongoCollectionRT() {
		return bridgevlanmapMongoCollectionRT;
	}
	
	public String getCTRL_Box_IP() {
		return CTRL_Box_IP;
	}

	
	public String getCTRL_Box_USER() {
		return CTRL_Box_USER;
	}

	public String getCTRL_Box_PASSWORD() {
		return CTRL_Box_PASSWORD;
	}
	
	public String getsflowMongoCollection() {
		return sflowMongoCollection;
	}
	
	public int getVLAN_START() {
		return VLAN_START;
	}

		public int getVLAN_END() {
		return VLAN_END;
	}
	
	public String getES_HOST() {
		return ES_HOST;
	}

	public int getES_PORT() {
		return ES_PORT;
	}	

	public String[] getBoxType() {
		return BoxType;
	}
	
	public void getProperties(){
    	Properties prop = new Properties();
    	InputStream input = null;
    	try {

    		input = new FileInputStream("../MultiView-Configurations/Custom_Collectors.properties");

    		// load a properties file
    		prop.load(input);
    		
    		//Visibility Center IP
    		VISIBILITY_CENTER    = prop.getProperty("VISIBILITY_CENTER");
    		
    		//Type C control Box properties
    		CTRL_Box_IP          = prop.getProperty("CTRL_Box_IP");
    		CTRL_Box_USER        = prop.getProperty("CTRL_Box_USER");
    		CTRL_Box_PASSWORD    = prop.getProperty("CTRL_Box_PASSWORD");
    		
    		//MongoDB Properties
    		MONGO_DB_HOST        = prop.getProperty("MONGODB_HOST");
    		MONGO_DB_PORT        = Integer.parseInt(prop.getProperty("MONGODB_PORT"));
    		MONGO_DB_DATABASE    = prop.getProperty("MONGODB_DATABASE");
    		
    		//Elasticsearch Properties
    		ES_HOST              = prop.getProperty("ES_HOST");
    		ES_PORT              = Integer.parseInt(prop.getProperty("ES_PORT"));
    		
    		//OpenStack Properties
    		OPENSTACK_USER_ID    = prop.getProperty("OPENSTACK_USER_ID");
    		OPENSTACK_PASSWORD   = prop.getProperty("OPENSTACK_PASSWORD");
    		OPENSTACK_PROJECT_ID = prop.getProperty("OPENSTACK_PROJECT_ID");
    		OPENSTACK_ENDPOINT   = prop.getProperty("OPENSTACK_ENDPOINT");
    		
    		//OpenDayLight Properties
    		devopscontrollers    = prop.getProperty("devopscontrollers");
    		ControllerUser       = prop.getProperty("CONTROLLER_USER");
    		ControllerPassword   = prop.getProperty("CONTROLLER_PASSWORD");
    		
    		//SmartX Box Properties
    		SmartXBox_USER       = prop.getProperty("SmartXBox_USER");
    		SmartXBox_PASSWORD   = prop.getProperty("SmartXBox_PASSWORD");
    		
    		//OVS-VM Properties
    		OVS_VM_USER          = prop.getProperty("OVS_VM_USER");
    		OVS_VM_PASSWORD      = prop.getProperty("OVS_VM_PASSWORD");
    		
    		//VLAN Range Properties
    		VLAN_START           = Integer.parseInt(prop.getProperty("VLAN_START"));
    		VLAN_END             = Integer.parseInt(prop.getProperty("VLAN_END"));
    		
    		} catch (IOException ex) {
    		 ex.printStackTrace();
    	 }	finally {
    		 if (input != null) {
    			 try {
    				 input.close();
    			 } catch (IOException e) {
				e.printStackTrace();
    			 }
    		 }
    	 }
    }
	
}
