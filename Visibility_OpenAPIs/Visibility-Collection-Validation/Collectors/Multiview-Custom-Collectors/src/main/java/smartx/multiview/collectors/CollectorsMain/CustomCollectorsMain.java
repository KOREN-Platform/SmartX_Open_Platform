/**
 * @author Muhammad Usman
 * @version 0.1
 */

package smartx.multiview.collectors.CollectorsMain;

import java.util.Timer;
import java.util.concurrent.TimeUnit;

import smartx.multiview.collectors.flow.*;
import smartx.multiview.collectors.resource.*;
import smartx.multiview.DataLake.*;

public class CustomCollectorsMain 
{
	public static void main( String[] args )
    {
		PlaygroundConfigurationLoader configLoader = new PlaygroundConfigurationLoader();
		configLoader.getProperties();
		
		MongoDB_Connector MongoConnector = new MongoDB_Connector();
		MongoConnector.setDbConnection(configLoader.getMONGO_DB_HOST(), configLoader.getMONGO_DB_PORT(), configLoader.getMONGO_DB_DATABASE());
		
		Elasticsearch_Connector ESConnector = new Elasticsearch_Connector();
		ESConnector.setClient(configLoader.getES_HOST(), configLoader.getES_PORT());

    	//Start Visibility Data Collection for Ping Data from SmartX Boxes
    	PingStatusCollectClass pingStatusCollect = new PingStatusCollectClass(configLoader.getVISIBILITY_CENTER(), MongoConnector, configLoader.getpboxMongoCollection(), configLoader.getpboxstatusMongoCollection(), configLoader. getpboxstatusMongoCollectionRT(), configLoader.getBoxType());
    	pingStatusCollect.start();
    	try {
			TimeUnit.SECONDS.sleep(10);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	//Update Instant Visibility Collection for Box status using Ping Data
    	PingStatusUpdateClass pingStatusUpdate = new PingStatusUpdateClass(configLoader.getSmartXBox_USER(), configLoader.getSmartXBox_PASSWORD(), MongoConnector, configLoader.getpboxMongoCollection(), configLoader.getpboxstatusMongoCollectionRT(), configLoader.getBoxType(), configLoader.getOVS_VM_USER(), configLoader.getOVS_VM_PASSWORD());
    	pingStatusUpdate.start(); 
        try {
			TimeUnit.SECONDS.sleep(10);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
        
		//Start Visibility Collection for Platform Controllers
		PlatformControllers platformcontroller = new PlatformControllers(MongoConnector, "210.114.90.173", "karaf", "karaf", "210.114.90.172", "netcs", "fn!xo!ska!", "210.114.90.174", "karaf", "karaf");
		platformcontroller.start();
		
		//Start Visibility Collection for VM's Data
        OpenStackInstances instancelist = new OpenStackInstances(configLoader.getCTRL_Box_IP(), configLoader.getCTRL_Box_USER(), configLoader.getCTRL_Box_PASSWORD(), configLoader.getMONGO_DB_HOST(), configLoader.getMONGO_DB_PORT(), configLoader.getMONGO_DB_DATABASE(), configLoader.getvboxMongoCollection(), configLoader.getvboxMongoCollectionRT());
        instancelist.start();
        
        //Start Visibility Collection for IoT Hosts
        IoTHosts IoThosts = new IoTHosts(MongoConnector, "210.114.90.174", "karaf", "karaf");
        IoThosts.start();
        
        
        //Start Instant Visibility Collection for OVS Data
        ovsBridgeStatusClass bridgeStatus  = new ovsBridgeStatusClass(configLoader.getSmartXBox_USER(), configLoader.getSmartXBox_PASSWORD(), configLoader.getMONGO_DB_HOST(), configLoader.getMONGO_DB_PORT(), configLoader.getMONGO_DB_DATABASE(), configLoader.getpboxMongoCollection(), configLoader.getovsListMongoCollection(), configLoader.getovsstatusMongoCollection(), configLoader.getOVS_VM_USER(), configLoader.getOVS_VM_PASSWORD());
        bridgeStatus.start();
        
        //Start Visibility Collection for OpenStack Bridges Data
   /*     OpenStackBridgesStatus osBridgeStatus  = new OpenStackBridgesStatus(configLoader.getSmartXBox_USER(), configLoader.getSmartXBox_PASSWORD(), configLoader.getMONGO_DB_HOST(), configLoader.getMONGO_DB_PORT(), configLoader.getMONGO_DB_DATABASE(), configLoader.getpboxMongoCollection(), configLoader.getflowConfigOpenStackMongoCollection(), configLoader.getflowConfigOpenStackMongoCollectionRT(), configLoader.getBoxType());
        osBridgeStatus.start();
        
        //Start Instant Visibility Collection for Vlan Mappings
        BridgesVLANMapping vlanMapping  = new BridgesVLANMapping(configLoader.getSmartXBox_USER(), configLoader.getSmartXBox_PASSWORD(), configLoader.getOVS_VM_USER(), configLoader.getOVS_VM_PASSWORD(), MongoConnector, configLoader.getpboxMongoCollection(), configLoader.getbridgevlanmapMongoCollection(), configLoader.getbridgevlanmapMongoCollectionRT(), configLoader.getVLAN_START(), configLoader.getVLAN_END(), configLoader.getBoxType());
        vlanMapping.start();
        */
        
      //Start IO Visor Kafka Consumer
        IOVisorKafkaConsumer iovisorconsumer = new IOVisorKafkaConsumer(configLoader.getVISIBILITY_CENTER()+":9092", MongoConnector, ESConnector);
        iovisorconsumer.start();
        
        //Start Visibility Collection for sFlow Flow Collection
    	String topic = "sFlow-KOREN";
    	sFlowKafkaProducer sFlowproducer  = new sFlowKafkaProducer(configLoader.getVISIBILITY_CENTER(), topic);
    	sFlowproducer.start();
    	/*Timer timer = new Timer();
    	timer.schedule(new sFlowKafkaProducer(configLoader.getVISIBILITY_CENTER(), topic),0,10000);
    	try {
			TimeUnit.SECONDS.sleep(5);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
        
        //Start sFlow Kafka Consumer
        sFlowKafkaConsumer sFlowconsumer  = new sFlowKafkaConsumer(configLoader.getVISIBILITY_CENTER()+":9092", MongoConnector, ESConnector, configLoader.getsflowMongoCollection(), configLoader.getBoxType());
        sFlowconsumer.start();
        
        /*//Start Visibility Collection for ODL Flow Rules Data
        SDNControllerStatus sdnStatus = new SDNControllerStatus(configLoader.getMONGO_DB_HOST(), configLoader.getMONGO_DB_PORT(), configLoader.getMONGO_DB_DATABASE(), configLoader.getflowConfigMongoCollection(), configLoader.getflowConfigMongoCollectionRT(), configLoader.getdevopscontrollers(), configLoader.getControllerUser(), configLoader.getControllerPassword());
        sdnStatus.start();
        
        //Start Visibility Collection for ODL Statistics Data
        SDNControllerStats sdnStats = new SDNControllerStats(configLoader.getMONGO_DB_HOST(), configLoader.getMONGO_DB_PORT(), configLoader.getMONGO_DB_DATABASE(), configLoader.getflowStatsMongoCollection(), configLoader.getflowStatsMongoCollectionRT(), configLoader.getdevopscontrollers(), configLoader.getControllerUser(), configLoader.getControllerPassword());
        sdnStats.start();*/
    }
}
