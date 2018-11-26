var MongoClient = require('mongodb').MongoClient;
var dateFormat  = require('dateformat');
var mongodbHost = '127.0.0.1';
var mongodbPort = '27017';
var mongodbDatabase = 'multiviewdb';
var mongourl = "mongodb://127.0.0.1:27017/multiviewdb";

ResourceProvider = function() {};
//UserProvider = function() {};

//Get MultiView Users
ResourceProvider.prototype.getUsers = function(callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        var collection = db.collection("configuration-multiview-users");
        collection.find().toArray(function(err, users){
			callback(null,users);
			db.close();
		});
    });
};

//Get pBoxes List From MongoDB for TCP throughput-based Topology
ResourceProvider.prototype.getTCPTopologyList = function(callback) 
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('Physical Boxes List: ');
	    var collection = db.collection("topolgoy-throughput-data-rt");
        collection.find({},{srcBoxname: true, destBoxname: true, srcBoxID: true, destBoxID: true, value: true, score: true, _id: false}).sort({srcBoxID: -1}).toArray(function(err, boxes){
		callback(null,boxes);
		db.close();
	});
	});
};

//Get pBoxes List From MongoDB
ResourceProvider.prototype.getpBoxList = function(callback) 
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('Physical Boxes List: ');
	// Locate all the entries using find
        var collection = db.collection("configuration-pbox-list");
        //collection.find({type: 'B**'},{box: true, host: true, management_ip: true, management_ip_status: true, data_ip: true, data_ip_status: true, control_ip: true, control_ip_status: true, _id: false}).sort({host: -1}).toArray(function(err, boxes){
		collection.find({$or:[{type: 'B**'},{type: 'C**'}]},{box: true, boxID: true, management_ip: true, management_ip_status: true, data_ip: true, data_ip_status: true, control_ip: true, control_ip_status: true, _id: false}).sort({host: -1}).toArray(function(err, boxes){
	//	db.close();
		//console.log(boxes);
		callback(null,boxes);
		db.close();
	});
	//console.log (db.boxes);
    });
};

//Get pBoxes List From MongoDB New
ResourceProvider.prototype.getpBoxList = function(box_type, callback) 
{
	 //var boxes = {};//sboxes, cboxes, oboxes;
    MongoClient.connect(mongourl, function(err, db)
    {
        //console.log('Physical Boxes List: ');
		var collection = db.collection("pbox-list");
        //collection.find({type: 'B**'},{box: true, host: true, management_ip: true, management_ip_status: true, data_ip: true, data_ip_status: true, control_ip: true, control_ip_status: true, _id: false}).sort({host: -1}).toArray(function(err, boxes){
		  //collection.find({$or:[{boxType: 'S'},{boxType: 'C'},{boxType: 'O'}]},{boxID: true, boxName: true, management_ip: true, boxType: true, management_ip: true, management_ip_status: true, data1_ip: true, data1_ip_status: true, control_ip: true, control_ip_status: true, _id: false}).sort({boxName: -1}).toArray(function(err, boxes){
		  collection.find({boxType: box_type, type: 'B**'},{boxID: true, boxName: true, boxType: true, site: true, management_ip: true, management_ip_status: true, data_ip: true, data_ip_status: true, control_ip: true, control_ip_status: true, _id: false}).sort({boxName: 1}).toArray(function(err, boxes){
				callback(null, boxes);
				db.close();
		});
	 });
};

//Get vSwitches List From MongoDB
ResourceProvider.prototype.getvSwitchList = function(callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('OVS bridges List: ');
        var collection = db.collection("configuration-vswitch-list");
        collection.find({},{type: true, bridge: true, topologyorder: true, _id: false}).sort({topologyorder: 1}).toArray(function(err, switchList){
                //db.close();
                callback(null,switchList);
				db.close();
        });
    });
};

//Get Virtual Switches List From MongoDB New
ResourceProvider.prototype.getvSwitchList = function(switch_type, callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('OVS bridges List: ');
        var collection = db.collection("vswitch-list");
        collection.find({boxType: switch_type},{boxType: true, bridge: true, topologyorder: true, boxDevType: true, _id: false}).sort({topologyorder: 1}).toArray(function(err, switchList){
            callback(null, switchList);
			db.close();
        });
    });
};

//Get OVS Bridge Status From MongoDB
ResourceProvider.prototype.getovsBridgeStatus = function(callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('OVS Bridge Status: ');
        var collection = db.collection("configuration-vswitch-status");
        collection.find({},{box: true, bridge: true, status: true, _id: false}).sort({box: -1}).toArray(function(err, ovsBridgeStatus){
                //db.close();
                callback(null,ovsBridgeStatus);
				db.close();
        });
    });
};

//Get Virtual Switches Status From MongoDB New
ResourceProvider.prototype.getovsBridgeStatus = function(box_type, callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('OVS Bridge Status: ');
        var collection = db.collection("vswitch-status");
        collection.find({boxType: box_type},{boxType: true, boxID: true, bridge: true, status: true, _id: false}).sort({boxID: -1}).toArray(function(err, ovsBridgeStatus){
                //db.close();
                callback(null,ovsBridgeStatus);
				db.close();
        });
    });
};

//Get Controllers List From MongoDB New
ResourceProvider.prototype.getControllerList = function(callback) 
{
	MongoClient.connect(mongourl, function(err, db)
    {
        var collection = db.collection("playground-controllers-list");
        collection.find({},{controllerIP: true, controllerName: true, controllerStatus: true, controllerSoftware: true, _id: false}).sort({controllerName: -1}).toArray(function(err, controllers){
	     	callback(null, controllers);
		    db.close();
		});
	 });
};

//Get OpenStack Instances List From MongoDB
ResourceProvider.prototype.getvBoxList = function(callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('OpenStack instances List: ');
        var collection = db.collection("vm-instance-list");
        collection.find({},{box: true, name: true, osuserid: true, ostenantid: true, vlanid: true, state: true, _id: false}).sort({box: -1}).toArray(function(err, vBoxList){
            callback(null,vBoxList);
			db.close();
        });
    });
};

//Get OpenStack Instances List for Specific Tenant From MongoDB
ResourceProvider.prototype.getTenantvBoxList = function(tenantID, callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('OpenStack instances List in Tenant : '+tenantID);
        var collection = db.collection("vm-instance-list");
        collection.find({ostenantid: tenantID},{_id: false, state: false, osuserid: false, vlandid: false}).sort({box: -1}).toArray(function(err, vBoxList){
            //db.close();
            console.log(vBoxList);
            callback(null,vBoxList);
                        db.close();
        });
    });
};

//Get IoT Host List From MongoDB New
ResourceProvider.prototype.getIoTHostList = function(callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('IoT Host List: ');
        var collection = db.collection("IoT-Host-list");
        collection.find({},{boxID: true, hostID: true, macaddress: true, ipaddress: true, vlanid: true, _id: false}).sort({boxID: -1}).toArray(function(err, iotHostList){
            callback(null, iotHostList);
			db.close();
        });
    });
};

//Get Workloads List From MongoDB
/*ResourceProvider.prototype.getServicesList = function(callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('Services List: ');
        var collection = db.collection("configuration-service-list");
        collection.find({type: 'B**'},{box: true, name: true, osusername: true, ostenantname: true, vlanid: true, state: true, _id: false}).sort({box: -1}).toArray(function(err, vmList){
                //db.close();
                callback(null,vmList);
				db.close();
        });
    });
};*/

//Get Tenant-vlan Mapping List
ResourceProvider.prototype.gettenantvlanmapList = function(callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
		//console.log('Tenant-vlan Mapping List: '+tenantID);
		var collection = db.collection("configuration-tenant-vlan-mapping");
		collection.find({},{_id: false}).sort({name: -1}).toArray(function(err, tenantList){
			callback(null,tenantList);
			db.close();
		});
    });
};

//Get Bridge-vlan Mapping List
ResourceProvider.prototype.getbridgevlanmapList = function(vlanID, callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
		console.log('Bridge-vlan Mapping for '+vlanID);
		var collection = db.collection("configuration-bridge-vlan-map-rt");
		collection.find({vlan: vlanID},{_id: false, timestamp:false}).sort({vlan: -1}).toArray(function(err, vlanList){
			callback(null, vlanList);
			db.close();
		});
    });
};

//Get Operator Controller Flow Rules
ResourceProvider.prototype.getOpsSDNConfigList = function(boxID, callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
	console.log('Flow Rules List: '+boxID);
	var currentTime = new Date();
	console.log('System Time: '+currentTime);
	dateFormat(currentTime.setMinutes(currentTime.getMinutes() - 59));
	console.log('Updated Time: '+currentTime);
       	var collection = db.collection("flow-configuration-sdn-controller-rt");
        collection.find({controllerIP: '103.22.221.152', boxID: boxID},{_id: false}).sort({name: -1}).toArray(function(err, rulesList){
                callback(null,rulesList);
				db.close();
        });
    });
};

//Get Operator Controller Flow Statistics
ResourceProvider.prototype.getOpsSDNStatList = function(boxID, callback)
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('Flow Statistics List: ');
        var currentTime = new Date();
        console.log('System Time: '+currentTime);
        dateFormat(currentTime.setMinutes(currentTime.getMinutes() - 5));
        console.log('Updated Time: '+currentTime);
        var collection = db.collection("flow-stats-sdn-controller-rt");
        collection.find({controllerIP: '103.22.221.152', boxID: boxID},{_id: false}).sort({name: -1}).toArray(function(err, statList){
            callback(null,statList);
			db.close();
        });
    });
};

//Get Active Monitoring data From MongoDB for TCP throughput
ResourceProvider.prototype.getAMDataTCPperDay = function(boxID, startDate, endDate, callback) 
{
    MongoClient.connect(mongourl, function(err, db)
    {
        console.log('Active Monitoring TCP data / day: ');
	    var collection = db.collection("topolgoy-tcp-data-raw");
        collection.find({$and: [{srcBoxname: boxID}, {timestamp :  {$gte : {"$date" : startDate}, $lte : {"$date" : endDate}}}]}).count().toArray(function(err, data){
		callback(null, data);
		db.close();
	});
	});
};

//ManhNT
ResourceProvider.prototype.getDataMultiSliceVisibility = function(userID, callback)
{
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colConfigMultiUser = db.collection('configuration-multiview-users');
		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		var colunder_ren = db.collection('underlay_REN');
		var playground_sites = db.collection('playground_sites');
		var colpBox = db.collection('pbox-list');
		var colIoTHostList = db.collection('IoT-Host-list');
		var colVMInstance = db.collection('vm-instance-list');
		var flowvisor_slice = db.collection('flowvisor_slice');

		var data = [];
		var main = 0;
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				colunder_ren.find({}).toArray(function(err, rUnder_ren){
					playground_sites.find({}).toArray(function(err, rplayground_sites){
						colpBox.find({type: 'B**'}).toArray(function(err, rpBox){
							flowvisor_slice.find({}).toArray(function(err, rVLANs){
								colVMInstance.find({}).toArray(function(err, rVM){
									colIoTHostList.find({}).toArray(function(err, rIoT){
										//TEIN Main
										for (var i = 0 ; i < rUnderlay_main.length; i++){
											rUnderlay_main[i].drilldown = [];
											rUnderlay_main[i].resource = 4;
											rUnderlay_main[i].label = rUnderlay_main[i].name;
											rUnderlay_main[i].info = rUnderlay_main[i].name;
											rUnderlay_main[i].color = 'white';
											rUnderlay_main[i].textBoder= 'LightGrey';
											
											//TEIN International
											for (var j = 0 ; j < rUnder_int.length; j++){
												if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
												{
													rUnder_int[j].drilldown = [];
													rUnder_int[j].resource = 5;
													rUnder_int[j].label = rUnder_int[j].name;
													rUnder_int[j].info = "TEIN International \n "+ rUnder_int[i].name;
													rUnder_int[j].color = 'white';
													rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
													rUnderlay_main[i].drilldown.push(rUnder_int[j]);
													
													//National Research Networks
													for (var k = 0 ; k < rUnder_ren.length; k++){
														if (rUnder_ren[k].intID == rUnder_int[j].intID)
														{
															rUnder_ren[k].drilldown = [];
															rUnder_ren[k].resource = 10;
															rUnder_ren[k].label = rUnder_ren[k].name;
															rUnder_ren[k].info = "Underlay Ren Info \n" + rUnder_ren[k].name;
															rUnder_ren[k].color = 'white';
															rUnder_ren[k].colorBoder = 'LightGrey'; // Grey
															rUnder_int[j].drilldown.push(rUnder_ren[k]);
															
															//Playground sites
															for (var l = 0 ; l < rplayground_sites.length; l++){
																if (rplayground_sites[l].RENID == rUnder_ren[k].RENID)
																{
																	rplayground_sites[l].drilldown = [];
																	rplayground_sites[l].resource = 6;
																	rplayground_sites[l].label =   rplayground_sites[l].name;
																	rplayground_sites[l].info = "Site Info \n Name: " + rplayground_sites[l].name;
																	rplayground_sites[l].color = 'white';
																	rplayground_sites[l].colorBoder =  	'#90EE90';
																	
																	rUnder_ren[k].drilldown.push(rplayground_sites[l]);
																	
																	//Physical Boxes
																	for (var m = 0 ; m < rpBox.length; m++){
																		if (rpBox[m].site == rplayground_sites[l].siteID)
																		{
																			rpBox[m].drilldown = [];
																			rpBox[m].resource = 1;
																			rpBox[m].label = ''+ rpBox[m].boxType;
																			rpBox[m].info = "Box Info \n Box Name: "+rpBox[m].boxName+ "\n"+" Site: " + rpBox[m].site;
																			if (rpBox[m].data_ip_status == "GREEN"){
																				rpBox[m].color = 'white';
																				console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																				console.log(rpBox[m].boxName+' '+rpBox[m].color)
																			}
																			else if (rpBox[m].data_ip_status == "ORANGE"){
																				rpBox[m].color = '#ffcc99';//light Orange
																				console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																				console.log(rpBox[m].boxName+' '+rpBox[m].color)
																			}
																			else{
																				rpBox[m].color = '#ffcce0';//light red
																				console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																				console.log(rpBox[m].boxName+' '+rpBox[m].color)
																			}
																			rpBox[m].colorBoder = 	'MediumSeaGreen' //MediumSeaGreen
																			
																			rplayground_sites[l].drilldown.push(rpBox[m]);
																			
																			//Tenant VLAN IDs
																			for (var n = 0 ; n < rVLANs.length; n++){
																				if (rVLANs[n].boxName == rpBox[m].boxName)
																				{
																					rVLANs[n].drilldown = [];
																					rVLANs[n].resource = 7;
																					rVLANs[n].label = ''+rVLANs[n].VLANID;
																					rVLANs[n].info= "VLAN: " +rVLANs[n].VLANID+ "\n" + " Box: " + rVLANs[n].boxName;
																					rVLANs[n].color = 'white';
																					rVLANs[n].colorBoder = '#FFD700'; //Navajo white
																					rpBox[m].drilldown.push(rVLANs[n]);
																					
																					//OpenStack VMs
																					for (var o = 0 ; o < rVM.length; o++){
																						console.log(rVM[o].boxName+ " "+rVM[o].state);
																						if (rVM[o].box == rVLANs[n].boxName)
																						{
																							rVM[o].drilldown = [];
																							rVM[o].resource = 3;
																							rVM[o].label = ''+rVM[o].name;
																							rVM[o].info = "VM info \n Name: " +rVM[i].name + " - Box: " + rVM[i].boxName;
																							rVM[o].colorBoder = '#FFD700'; //Gold
																							
																							if (rVM[o].state == "Running"){
																								rVM[o].color = 'white';
																								console.log(rVM[o].boxName+ " "+rVM[o].state);
																							}
																							else{
																								rVM[o].color = "#ffcce0"; //light red
																							}
																							rVLANs[n].drilldown.push(rVM[o]);
																							
																							var sFlows = {"resource": "11", "label": "SF", "info": "Click to get details about sampled flows", "color": "white", "colorBoder": "#0040ff"}; //Blue
																							rVM[o].drilldown.push(sFlows);
																							
																							sFlows.drilldown = [];
																							var tPackets = {"resource": "12", "label": "TP", "info": "Click to get details about packets", "color": "white", "colorBoder": "#0040ff"}; //Blue
																							sFlows.drilldown.push(tPackets);
																						}
																					}
																					
																					//IoT Hosts
																					for (var p = 0 ; p < rIoT.length; p++){
																						if (rIoT[p].box == rVLANs[n].boxName)
																						{
																							rIoT[p].drilldown = [];
																							rIoT[p].resource = 3;
																							rIoT[p].label = ''+rIoT[p].hostID;
																							rIoT[p].info = "IoT info \n Name: " +rIoT[p].hostID + " - Box: " + rIoT[p].ipaddress;
																							rIoT[p].color = 'white';
																							rIoT[p].colorBoder = '#FFD700'; //Gold
																							
																							rVLANs[n].drilldown.push(rIoT[p]);
																							
																							var sFlows = {"resource": "11", "label": "SF", "info": "Click to get details about sampled flows", "color": "white", "colorBoder": "#0040ff"}; //Blue
																							rIoT[p].drilldown.push(sFlows);
																							
																							sFlows.drilldown = [];
																							var tPackets = {"resource": "12", "label": "TP", "info": "Click to get details about packets", "color": "white", "colorBoder": "#0040ff"}; //Blue
																							sFlows.drilldown.push(tPackets);
																						}
																					}
																					
																				}
																			}
																		}
																		
																	}
																}
																
															}
														}
													}
												}
											}
											data = rUnderlay_main;
											//console.log(data);
										}
										callback(null, data);
									});
								});
							});
						});
					});
				});
			});
		});
    });
};


ResourceProvider.prototype.getDataMultiSliceVisibilityTenant = function(userID, callback)
{
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colConfigMultiUser = db.collection('configuration-multiview-users');
		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		var colunder_ren = db.collection('underlay_REN');
		var playground_sites = db.collection('playground_sites');
		var colpBox = db.collection('pbox-list');
		
		var colIoTHostList = db.collection('IoT-Host-list');
		var colVMInstance = db.collection('vm-instance-list');
		
		var flowvisor_slice = db.collection('flowvisor_slice');

		var data = [];
		var main = 0;
		
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				colunder_ren.find({}).toArray(function(err, rUnder_ren){
					playground_sites.find({}).toArray(function(err, rplayground_sites){
						colpBox.find({type: 'B**'}).toArray(function(err, rpBox){
							flowvisor_slice.find({}).toArray(function(err, rVLANs){
								colVMInstance.find({}).toArray(function(err, rVM){
									colIoTHostList.find({}).toArray(function(err, rIoT){
										//TEIN Main
										for (var i = 0 ; i < rUnderlay_main.length; i++){
											rUnderlay_main[i].drilldown = [];
											rUnderlay_main[i].resource = 4;
											rUnderlay_main[i].label = rUnderlay_main[i].name;
											rUnderlay_main[i].info = rUnderlay_main[i].name;
											rUnderlay_main[i].color = 'white';
											rUnderlay_main[i].textBoder= 'LightGrey';
											
											//TEIN International
											for (var j = 0 ; j < rUnder_int.length; j++){
												if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
												{
													rUnder_int[j].drilldown = [];
													rUnder_int[j].resource = 5;
													rUnder_int[j].label = rUnder_int[j].name;
													rUnder_int[j].info = "TEIN International \n "+ rUnder_int[i].name;
													rUnder_int[j].color = 'white';
													rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
													rUnderlay_main[i].drilldown.push(rUnder_int[j]);
													
													//National Research Networks
													for (var k = 0 ; k < rUnder_ren.length; k++){
														if (rUnder_ren[k].intID == rUnder_int[j].intID)
														{
															rUnder_ren[k].drilldown = [];
															rUnder_ren[k].resource = 10;
															rUnder_ren[k].label = rUnder_ren[k].name;
															rUnder_ren[k].info = "Underlay Ren Info \n" + rUnder_ren[k].name;
															rUnder_ren[k].color = 'white';
															rUnder_ren[k].colorBoder = 'LightGrey'; // Grey
															rUnder_int[j].drilldown.push(rUnder_ren[k]);
															
															//Playground sites
															for (var l = 0 ; l < rplayground_sites.length; l++){
																if (rplayground_sites[l].RENID == rUnder_ren[k].RENID)
																{
																	rplayground_sites[l].drilldown = [];
																	rplayground_sites[l].resource = 6;
																	rplayground_sites[l].label =   rplayground_sites[l].name;
																	rplayground_sites[l].info = "Site Info \n Name: " + rplayground_sites[l].name;
																	rplayground_sites[l].color = 'white';
																	rplayground_sites[l].colorBoder =  	'#90EE90';
																	
																	rUnder_ren[k].drilldown.push(rplayground_sites[l]);
																	
																	//Physical Boxes
																	for (var m = 0 ; m < rpBox.length; m++){
																		if (rpBox[m].site == rplayground_sites[l].siteID)
																		{
																			rpBox[m].drilldown = [];
																			rpBox[m].resource = 1;
																			rpBox[m].label = ''+ rpBox[m].boxType;
																			rpBox[m].info = "Box Info \n Box Name: "+rpBox[m].boxName+ "\n"+" Site: " + rpBox[m].site;
																			if (rpBox[m].data_ip_status == "GREEN"){
																				rpBox[m].color = 'white';
																				console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																				console.log(rpBox[m].boxName+' '+rpBox[m].color)
																			}
																			else if (rpBox[m].data_ip_status == "ORANGE"){
																				rpBox[m].color = '#ffcc99';//light Orange
																				console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																				console.log(rpBox[m].boxName+' '+rpBox[m].color)
																			}
																			else{
																				rpBox[m].color = '#ffcce0';//light red
																				console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																				console.log(rpBox[m].boxName+' '+rpBox[m].color)
																			}
																			rpBox[m].colorBoder = 	'MediumSeaGreen' //MediumSeaGreen
																			
																			rplayground_sites[l].drilldown.push(rpBox[m]);
																			
																			//Tenant VLAN IDs
																			for (var n = 0 ; n < rVLANs.length; n++){
																				if (rVLANs[n].boxName == rpBox[m].boxName)
																				{
																					rVLANs[n].drilldown = [];
																					rVLANs[n].resource = 7;
																					rVLANs[n].label = ''+rVLANs[n].VLANID;
																					rVLANs[n].info= "VLAN: " +rVLANs[n].VLANID+ "\n" + " Box: " + rVLANs[n].boxName;
																					rVLANs[n].color = 'white';
																					rVLANs[n].colorBoder = '#FFD700'; //Navajo white
																					rpBox[m].drilldown.push(rVLANs[n]);
																					
																					//OpenStack VMs
																					for (var o = 0 ; o < rVM.length; o++){
																						console.log(rVM[o].boxName+ " "+rVM[o].state);
																						if (rVM[o].box == rVLANs[n].boxName)
																						{
																							rVM[o].drilldown = [];
																							rVM[o].resource = 3;
																							rVM[o].label = ''+rVM[o].name;
																							rVM[o].info = "VM info \n Name: " +rVM[i].name + " - Box: " + rVM[i].boxName;
																							rVM[o].colorBoder = '#FFD700'; //Gold
																							
																							if (rVM[o].state == "Running"){
																								rVM[o].color = 'white';
																								console.log(rVM[o].boxName+ " "+rVM[o].state);
																							}
																							else{
																								rVM[o].color = "#ffcce0"; //light red
																							}
																							rVLANs[n].drilldown.push(rVM[o]);
																							
																							var sFlows = {"resource": "11", "label": "SF", "info": "Click to get details about sampled flows", "color": "white", "colorBoder": "#0040ff"}; //Blue
																							rVM[o].drilldown.push(sFlows);
																							
																							sFlows.drilldown = [];
																							var tPackets = {"resource": "12", "label": "TP", "info": "Click to get details about packets", "color": "white", "colorBoder": "#0040ff"}; //Blue
																							sFlows.drilldown.push(tPackets);
																						}
																					}
																					
																					//IoT Hosts
																					for (var p = 0 ; p < rIoT.length; p++){
																						if (rIoT[p].box == rVLANs[n].boxName)
																						{
																							rIoT[p].drilldown = [];
																							rIoT[p].resource = 3;
																							rIoT[p].label = ''+rIoT[p].hostID;
																							rIoT[p].info = "IoT info \n Name: " +rIoT[p].hostID + " - Box: " + rIoT[p].ipaddress;
																							rIoT[p].color = 'white';
																							rIoT[p].colorBoder = '#FFD700'; //Gold
																							
																							rVLANs[n].drilldown.push(rIoT[p]);
																							
																							var sFlows = {"resource": "11", "label": "SF", "info": "Click to get details about sampled flows", "color": "white", "colorBoder": "#0040ff"}; //Blue
																							rIoT[p].drilldown.push(sFlows);
																							
																							sFlows.drilldown = [];
																							var tPackets = {"resource": "12", "label": "TP", "info": "Click to get details about packets", "color": "white", "colorBoder": "#0040ff"}; //Blue
																							sFlows.drilldown.push(tPackets);
																						}
																					}
																					
																				}
																			}
																		}
																		
																	}
																}
																
															}
														}
													}
												}
											}
											data = rUnderlay_main;
											//console.log(data);
										}
										callback(null, data);
									});
								});
							});
						});
					});
				});
			});
		});
    });
};

//VM's Visualization API
ResourceProvider.prototype.getSevenRingAPI = function(callback){
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		var colunder_ren = db.collection('underlay_REN');
		var playground_sites = db.collection('playground_sites');
		var colpBox = db.collection('pbox-list');
		var colVMInstance = db.collection('vm-instance-list');
		
		var data = [];
		var main = 0;
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				colunder_ren.find({}).toArray(function(err, rUnder_ren){
					playground_sites.find({}).toArray(function(err, rplayground_sites){
						colpBox.find({type: 'B**'}).toArray(function(err, rpBox){
							colVMInstance.find({}).toArray(function(err, rVM){
								for (var i = 0 ; i < rUnderlay_main.length; i++){
									rUnderlay_main[i].drilldown = [];
									rUnderlay_main[i].resource = 1;
									rUnderlay_main[i].label = rUnderlay_main[i].name;
									rUnderlay_main[i].info = "TEIN Main";
									rUnderlay_main[i].color = 'white';
									rUnderlay_main[i].textBoder= 'LightGrey';
									
									//TEIN International
									for (var j = 0 ; j < rUnder_int.length; j++){
										if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
										{
											rUnder_int[j].drilldown = [];
											rUnder_int[j].resource = 2;
											rUnder_int[j].label = rUnder_int[j].name;
											rUnder_int[j].info = "TEIN International: "+ rUnder_int[i].name;
											rUnder_int[j].color = 'white';
											rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
											rUnderlay_main[i].drilldown.push(rUnder_int[j]);
											
											//National Research Networks
											for (var k = 0 ; k < rUnder_ren.length; k++){
												if (rUnder_ren[k].intID == rUnder_int[j].intID)
												{
													rUnder_ren[k].drilldown = [];
													rUnder_ren[k].resource = 3;
													rUnder_ren[k].label = rUnder_ren[k].name;
													rUnder_ren[k].info = "Underlay REN: " + rUnder_ren[k].name;
													rUnder_ren[k].color = 'white';
													rUnder_ren[k].colorBoder = 'LightGrey'; // Grey
													rUnder_int[j].drilldown.push(rUnder_ren[k]);
													
													//Playground Sites
													for (var l = 0 ; l < rplayground_sites.length; l++){
														if (rplayground_sites[l].RENID == rUnder_ren[k].RENID)
														{
															rplayground_sites[l].drilldown = [];
															rplayground_sites[l].resource = 4;
															rplayground_sites[l].label =   rplayground_sites[l].name;
															rplayground_sites[l].info = "Site Name: " + rplayground_sites[l].name;
															rplayground_sites[l].color = 'white';
															rplayground_sites[l].colorBoder =  	'#90EE90';
															
															rUnder_ren[k].drilldown.push(rplayground_sites[l]);
															
															//Physical Boxes
															for (var m = 0 ; m < rpBox.length; m++){
																if (rpBox[m].site == rplayground_sites[l].siteID)
																{
																	rpBox[m].drilldown = [];
																	rpBox[m].resource = 5;
																	rpBox[m].label = ''+ rpBox[m].boxType;
																	rpBox[m].info = "Box Name: "+rpBox[m].boxName+ "\n"+" Site: " + rpBox[m].site;
																	if (rpBox[m].data_ip_status == "GREEN"){
																		rpBox[m].color = 'white';
																		console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																		console.log(rpBox[m].boxName+' '+rpBox[m].color)
																	}
																	else if (rpBox[m].data_ip_status == "ORANGE"){
																		rpBox[m].color = '#ffcc99';//light Orange
																		console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																		console.log(rpBox[m].boxName+' '+rpBox[m].color)
																	}
																	else{
																		rpBox[m].color = '#ffcce0';//light red
																		console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																		console.log(rpBox[m].boxName+' '+rpBox[m].color)
																	}
																	rpBox[m].colorBoder = 	'MediumSeaGreen' //MediumSeaGreen
																	
																	rplayground_sites[l].drilldown.push(rpBox[m]);
																	
																	//OpenStack VMs
																	for (var o = 0 ; o < rVM.length; o++){
																		if (rVM[o].box == rpBox[m].boxName)
																		{
																			rVM[o].drilldown = [];
																			rVM[o].resource = 6;
																			rVM[o].label = ''+rVM[o].name;
																			rVM[o].info = "VM: " +rVM[o].name + " Box: " + rpBox[m].boxName;
																			rVM[o].colorBoder = '#FFD700'; //Gold
																			
																			if (rVM[o].state == "Running"){
																				rVM[o].color = 'white';
																			}
																			else{
																				rVM[o].color = "#ffcce0"; //light red
																			}
																			rpBox[m].drilldown.push(rVM[o]);
																			
																			var sFlows = {"resource": "11", "label": "SF", "info": "Click to get details about sampled flows", "color": "white", "colorBoder": "#0040ff"}; //Blue
																			rVM[o].drilldown.push(sFlows);
																			
																			//sFlows.drilldown = [];
																			//var tPackets = {"resource": "12", "label": "TP", "info": "Click to get details about packets", "color": "white", "colorBoder": "#0040ff"}; //Blue
																			//sFlows.drilldown.push(tPackets);
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
									data = rUnderlay_main;
									console.log(data);
								}
								callback(null, data);
							});
						});
					});
				});
			});
		});
    });
};

//VM's Visualization API
ResourceProvider.prototype.getEightRingAPI = function(callback){
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		var colunder_ren = db.collection('underlay_REN');
		var playground_sites = db.collection('playground_sites');
		var colpBox = db.collection('pbox-list');
		var colVMInstance = db.collection('vm-instance-list');
		var colWorkload = db.collection('workload-list');
		
		var data = [];
		var main = 0;
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				colunder_ren.find({}).toArray(function(err, rUnder_ren){
					playground_sites.find({}).toArray(function(err, rplayground_sites){
						colpBox.find({type: 'B**'}).toArray(function(err, rpBox){
							colVMInstance.find({}).toArray(function(err, rVM){
								colWorkload.find({}).toArray(function(err, rWorkload){
									for (var i = 0 ; i < rUnderlay_main.length; i++){
										rUnderlay_main[i].drilldown = [];
										rUnderlay_main[i].resource = 1;
										rUnderlay_main[i].label = rUnderlay_main[i].name;
										rUnderlay_main[i].info = "TEIN Main";
										rUnderlay_main[i].color = 'white';
										rUnderlay_main[i].textBoder= 'LightGrey';
										
										//TEIN International
										for (var j = 0 ; j < rUnder_int.length; j++){
											if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
											{
												rUnder_int[j].drilldown = [];
												rUnder_int[j].resource = 2;
												rUnder_int[j].label = rUnder_int[j].name;
												rUnder_int[j].info = "TEIN International: "+ rUnder_int[i].name;
												rUnder_int[j].color = 'white';
												rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
												rUnderlay_main[i].drilldown.push(rUnder_int[j]);
												
												//National Research Networks
												for (var k = 0 ; k < rUnder_ren.length; k++){
													if (rUnder_ren[k].intID == rUnder_int[j].intID)
													{
														rUnder_ren[k].drilldown = [];
														rUnder_ren[k].resource = 3;
														rUnder_ren[k].label = rUnder_ren[k].name;
														rUnder_ren[k].info = "Underlay REN: " + rUnder_ren[k].name;
														rUnder_ren[k].color = 'white';
														rUnder_ren[k].colorBoder = 'LightGrey'; // Grey
														rUnder_int[j].drilldown.push(rUnder_ren[k]);
														
														//Playground Sites
														for (var l = 0 ; l < rplayground_sites.length; l++){
															if (rplayground_sites[l].RENID == rUnder_ren[k].RENID)
															{
																rplayground_sites[l].drilldown = [];
																rplayground_sites[l].resource = 4;
																rplayground_sites[l].label =   rplayground_sites[l].name;
																rplayground_sites[l].info = "Site Name: " + rplayground_sites[l].name;
																rplayground_sites[l].color = 'white';
																rplayground_sites[l].colorBoder =  	'#90EE90';
																
																rUnder_ren[k].drilldown.push(rplayground_sites[l]);
																
																//Physical Boxes
																for (var m = 0 ; m < rpBox.length; m++){
																	if (rpBox[m].site == rplayground_sites[l].siteID)
																	{
																		rpBox[m].drilldown = [];
																		rpBox[m].resource = 5;
																		rpBox[m].label = ''+ rpBox[m].boxType;
																		rpBox[m].info = "Box Name: "+rpBox[m].boxName+ "\n"+" Site: " + rpBox[m].site;
																		if (rpBox[m].data_ip_status == "GREEN"){
																			rpBox[m].color = 'white';
																			console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																			console.log(rpBox[m].boxName+' '+rpBox[m].color)
																		}
																		else if (rpBox[m].data_ip_status == "ORANGE"){
																			rpBox[m].color = '#ffe680';//light Orange
																			console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																			console.log(rpBox[m].boxName+' '+rpBox[m].color)
																		}
																		else{
																			rpBox[m].color = '#ff66a3';//light red
																			console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																			console.log(rpBox[m].boxName+' '+rpBox[m].color)
																		}
																		rpBox[m].colorBoder = 	'MediumSeaGreen' //MediumSeaGreen
																		
																		rplayground_sites[l].drilldown.push(rpBox[m]);
																		
																		//OpenStack VMs
																		for (var o = 0 ; o < rVM.length; o++){
																			if (rVM[o].box == rpBox[m].boxName)
																			{
																				rVM[o].drilldown = [];
																				rVM[o].resource = 6;
																				rVM[o].label = ''+rVM[o].name;
																				rVM[o].info = "VM: " +rVM[o].name + " Box: " + rpBox[m].boxName;
																				rVM[o].colorBoder = '#FFD700'; //Gold
																				
																				if (rVM[o].state == "Running"){
																					rVM[o].color = 'white';
																				}
																				else{
																					rVM[o].color = "#ff66a3"; //light red
																				}
																				rpBox[m].drilldown.push(rVM[o]);
																				
																				var sFlows = {"resource": "7", "label": "SF", "drilldown": [], "info": "Click to get details about sampled flows", "color": "white", "colorBoder": "#0040ff"}; //Blue
																				rVM[o].drilldown.push(sFlows);
																				
																				//Workloads
																				for (var p = 0 ; p < rWorkload.length; p++){
																					if (rWorkload[p].vmInstance == rVM[o].name)
																					{
																						rWorkload[p].drilldown = [];
																						rWorkload[p].resource = 8;
																						rWorkload[p].label = ''+rWorkload[p].workloadName;
																						rWorkload[p].info = "Workload: " +rWorkload[p].name + " VM: " + rVM[o].name;
																						rWorkload[p].colorBoder = '#ff66ff'; //Light Purple
																						
																						if (rWorkload[p].state == "Running"){
																							rWorkload[p].color = 'white';
																						}
																						else{
																							rWorkload[p].color = "#ff66a3"; //light red
																						}
																						sFlows.drilldown.push(rWorkload[p]);
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
										data = rUnderlay_main;
										console.log(data);
									}
									callback(null, data);
								});
							});
						});
					});
				});
			});
		});
    });
};
//ManhNT end

//TEIN Internatioal Visualization API
ResourceProvider.prototype.getTwoRingAPI = function(callback){
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		
		var data = [];
		var main = 0;
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				
					
					//TEIN Main
					for (var i = 0 ; i < rUnderlay_main.length; i++){
						rUnderlay_main[i].drilldown = [];
						rUnderlay_main[i].resource = 1;
						rUnderlay_main[i].label = rUnderlay_main[i].name;
						rUnderlay_main[i].info = "TEIN Main";
						rUnderlay_main[i].color = 'black';
						rUnderlay_main[i].textBoder= 'LightGrey';
						
						//TEIN International
						for (var j = 0 ; j < rUnder_int.length; j++){
							if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
							{
								rUnder_int[j].drilldown = [];
								rUnder_int[j].resource = 2;
								rUnder_int[j].label = rUnder_int[j].name;
								rUnder_int[j].info = "TEIN International: "+ rUnder_int[i].name;
								rUnder_int[j].color = 'white';
								rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
								rUnderlay_main[i].drilldown.push(rUnder_int[j]);
							}
						}
						data = rUnderlay_main;
						console.log(data);
					}
					callback(null, data);
			
			});
		});
    });
};

//REN Visualization API
ResourceProvider.prototype.getThreeRingAPI = function(callback){
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		var colunder_ren = db.collection('underlay_REN');
		
		var data = [];
		var main = 0;
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				colunder_ren.find({}).toArray(function(err, rUnder_ren){
					
					for (var i = 0 ; i < rUnderlay_main.length; i++){
						rUnderlay_main[i].drilldown = [];
						rUnderlay_main[i].resource = 1;
						rUnderlay_main[i].label = rUnderlay_main[i].name;
						rUnderlay_main[i].info = "TEIN Main";
						rUnderlay_main[i].color = 'white';
						rUnderlay_main[i].textBoder= 'LightGrey';
						
						//TEIN International
						for (var j = 0 ; j < rUnder_int.length; j++){
							if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
							{
								rUnder_int[j].drilldown = [];
								rUnder_int[j].resource = 2;
								rUnder_int[j].label = rUnder_int[j].name;
								rUnder_int[j].info = "TEIN International: "+ rUnder_int[i].name;
								rUnder_int[j].color = 'white';
								rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
								rUnderlay_main[i].drilldown.push(rUnder_int[j]);
								
								//National Research Networks
								for (var k = 0 ; k < rUnder_ren.length; k++){
									if (rUnder_ren[k].intID == rUnder_int[j].intID)
									{
										rUnder_ren[k].drilldown = [];
										rUnder_ren[k].resource = 3;
										rUnder_ren[k].label = rUnder_ren[k].name;
										rUnder_ren[k].info = "Underlay REN: " + rUnder_ren[k].name;
										rUnder_ren[k].color = 'white';
										rUnder_ren[k].colorBoder = 'LightGrey'; // Grey
										rUnder_int[j].drilldown.push(rUnder_ren[k]);
									}
								}
							}
						}
						data = rUnderlay_main;
						console.log(data);
					}
					callback(null, data);
				});
			});
		});
    });
};

//Sites Visualization API
ResourceProvider.prototype.getFourRingAPI = function(callback){
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		var colunder_ren = db.collection('underlay_REN');
		var playground_sites = db.collection('playground_sites');
		
		
		var data = [];
		var main = 0;
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				colunder_ren.find({}).toArray(function(err, rUnder_ren){
					playground_sites.find({}).toArray(function(err, rplayground_sites){
						for (var i = 0 ; i < rUnderlay_main.length; i++){
							rUnderlay_main[i].drilldown = [];
							rUnderlay_main[i].resource = 1;
							rUnderlay_main[i].label = rUnderlay_main[i].name;
							rUnderlay_main[i].info = "TEIN Main";
							rUnderlay_main[i].color = 'white';
							rUnderlay_main[i].textBoder= 'LightGrey';
							
							//TEIN International
							for (var j = 0 ; j < rUnder_int.length; j++){
								if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
								{
									rUnder_int[j].drilldown = [];
									rUnder_int[j].resource = 2;
									rUnder_int[j].label = rUnder_int[j].name;
									rUnder_int[j].info = "TEIN International: "+ rUnder_int[i].name;
									rUnder_int[j].color = 'white';
									rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
									rUnderlay_main[i].drilldown.push(rUnder_int[j]);
									
									//National Research Networks
									for (var k = 0 ; k < rUnder_ren.length; k++){
										if (rUnder_ren[k].intID == rUnder_int[j].intID)
										{
											rUnder_ren[k].drilldown = [];
											rUnder_ren[k].resource = 3;
											rUnder_ren[k].label = rUnder_ren[k].name;
											rUnder_ren[k].info = "Underlay REN: " + rUnder_ren[k].name;
											rUnder_ren[k].color = 'white';
											rUnder_ren[k].colorBoder = 'LightGrey'; // Grey
											rUnder_int[j].drilldown.push(rUnder_ren[k]);
											
											//Playground Sites
											for (var l = 0 ; l < rplayground_sites.length; l++){
												if (rplayground_sites[l].RENID == rUnder_ren[k].RENID)
												{
													rplayground_sites[l].drilldown = [];
													rplayground_sites[l].resource = 4;
													rplayground_sites[l].label =   rplayground_sites[l].name;
													rplayground_sites[l].info = "Site Name: " + rplayground_sites[l].name;
													rplayground_sites[l].color = 'white';
													rplayground_sites[l].colorBoder =  	'#90EE90';
													
													rUnder_ren[k].drilldown.push(rplayground_sites[l]);
												}
											}
										}
									}
								}
							}
							data = rUnderlay_main;
							console.log(data);
						}
						callback(null, data);
					});
				});
			});
		});
    });
};

//SmartX Boxes Visualization API
ResourceProvider.prototype.getFiveRingAPI = function(callback){
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		var colunder_ren = db.collection('underlay_REN');
		var playground_sites = db.collection('playground_sites');
		var colpBox = db.collection('pbox-list');
		
		var data = [];
		var main = 0;
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				colunder_ren.find({}).toArray(function(err, rUnder_ren){
					playground_sites.find({}).toArray(function(err, rplayground_sites){
						colpBox.find({type: 'B**'}).toArray(function(err, rpBox){
							for (var i = 0 ; i < rUnderlay_main.length; i++){
								rUnderlay_main[i].drilldown = [];
								rUnderlay_main[i].resource = 1;
								rUnderlay_main[i].label = rUnderlay_main[i].name;
								rUnderlay_main[i].info = "TEIN Main";
								rUnderlay_main[i].color = 'white';
								rUnderlay_main[i].textBoder= 'LightGrey';
								
								//TEIN International
								for (var j = 0 ; j < rUnder_int.length; j++){
									if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
									{
										rUnder_int[j].drilldown = [];
										rUnder_int[j].resource = 2;
										rUnder_int[j].label = rUnder_int[j].name;
										rUnder_int[j].info = "TEIN International: "+ rUnder_int[i].name;
										rUnder_int[j].color = 'white';
										rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
										rUnderlay_main[i].drilldown.push(rUnder_int[j]);
										
										//National Research Networks
										for (var k = 0 ; k < rUnder_ren.length; k++){
											if (rUnder_ren[k].intID == rUnder_int[j].intID)
											{
												rUnder_ren[k].drilldown = [];
												rUnder_ren[k].resource = 3;
												rUnder_ren[k].label = rUnder_ren[k].name;
												rUnder_ren[k].info = "Underlay REN: " + rUnder_ren[k].name;
												rUnder_ren[k].color = 'white';
												rUnder_ren[k].colorBoder = 'LightGrey'; // Grey
												rUnder_int[j].drilldown.push(rUnder_ren[k]);
												
												//Playground Sites
												for (var l = 0 ; l < rplayground_sites.length; l++){
													if (rplayground_sites[l].RENID == rUnder_ren[k].RENID)
													{
														rplayground_sites[l].drilldown = [];
														rplayground_sites[l].resource = 4;
														rplayground_sites[l].label =   rplayground_sites[l].name;
														rplayground_sites[l].info = "Site Name: " + rplayground_sites[l].name;
														rplayground_sites[l].color = 'white';
														rplayground_sites[l].colorBoder =  	'#90EE90';
														
														rUnder_ren[k].drilldown.push(rplayground_sites[l]);
														
														//Physical Boxes
														for (var m = 0 ; m < rpBox.length; m++){
															if (rpBox[m].site == rplayground_sites[l].siteID)
															{
																rpBox[m].drilldown = [];
																rpBox[m].resource = 5;
																rpBox[m].label = ''+ rpBox[m].boxType;
																rpBox[m].info = "Box Info \n Box Name: "+rpBox[m].boxName+ "\n"+" Site: " + rpBox[m].site;
																if (rpBox[m].data_ip_status == "GREEN"){
																	rpBox[m].color = 'white';
																	console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																	console.log(rpBox[m].boxName+' '+rpBox[m].color)
																}
																else if (rpBox[m].data_ip_status == "ORANGE"){
																	rpBox[m].color = '#ffcc99';//light Orange
																	console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																	console.log(rpBox[m].boxName+' '+rpBox[m].color)
																}
																else{
																	rpBox[m].color = '#ffcce0';//light red
																	console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																	console.log(rpBox[m].boxName+' '+rpBox[m].color)
																}
																rpBox[m].colorBoder = 	'MediumSeaGreen' //MediumSeaGreen
																
																rplayground_sites[l].drilldown.push(rpBox[m]);
															}
														}
													}
												}
											}
										}
									}
								}
								data = rUnderlay_main;
								console.log(data);
							}
							callback(null, data);
						});
					});
				});
			});
		});
    });
};

//VM's Visualization API
ResourceProvider.prototype.getSixRingAPI = function(callback){
    MongoClient.connect(mongourl, function(err, client){
		const db = client.db('multiviewdb');

		var colUnderlay_main = db.collection('underlay_main');
		var colunder_int =db.collection('underlay_int');
		var colunder_ren = db.collection('underlay_REN');
		var playground_sites = db.collection('playground_sites');
		var colpBox = db.collection('pbox-list');
		var colVMInstance = db.collection('vm-instance-list');
		
		var data = [];
		var main = 0;
		
		colUnderlay_main.find({}).toArray(function(err, rUnderlay_main){
			colunder_int.find({}).toArray(function(err, rUnder_int){
				colunder_ren.find({}).toArray(function(err, rUnder_ren){
					playground_sites.find({}).toArray(function(err, rplayground_sites){
						colpBox.find({type: 'B**'}).toArray(function(err, rpBox){
							colVMInstance.find({}).toArray(function(err, rVM){
								for (var i = 0 ; i < rUnderlay_main.length; i++){
									rUnderlay_main[i].drilldown = [];
									rUnderlay_main[i].resource = 1;
									rUnderlay_main[i].label = rUnderlay_main[i].name;
									rUnderlay_main[i].info = "TEIN Main";
									rUnderlay_main[i].color = 'white';
									rUnderlay_main[i].textBoder= 'LightGrey';
									
									//TEIN International
									for (var j = 0 ; j < rUnder_int.length; j++){
										if (rUnder_int[j].mainID == rUnderlay_main[i].mainID)
										{
											rUnder_int[j].drilldown = [];
											rUnder_int[j].resource = 2;
											rUnder_int[j].label = rUnder_int[j].name;
											rUnder_int[j].info = "TEIN International: "+ rUnder_int[i].name;
											rUnder_int[j].color = 'white';
											rUnder_int[j].colorBoder = 'LightGrey ';// Light Grey
											rUnderlay_main[i].drilldown.push(rUnder_int[j]);
											
											//National Research Networks
											for (var k = 0 ; k < rUnder_ren.length; k++){
												if (rUnder_ren[k].intID == rUnder_int[j].intID)
												{
													rUnder_ren[k].drilldown = [];
													rUnder_ren[k].resource = 3;
													rUnder_ren[k].label = rUnder_ren[k].name;
													rUnder_ren[k].info = "Underlay REN: " + rUnder_ren[k].name;
													rUnder_ren[k].color = 'white';
													rUnder_ren[k].colorBoder = 'LightGrey'; // Grey
													rUnder_int[j].drilldown.push(rUnder_ren[k]);
													
													//Playground Sites
													for (var l = 0 ; l < rplayground_sites.length; l++){
														if (rplayground_sites[l].RENID == rUnder_ren[k].RENID)
														{
															rplayground_sites[l].drilldown = [];
															rplayground_sites[l].resource = 4;
															rplayground_sites[l].label =   rplayground_sites[l].name;
															rplayground_sites[l].info = "Site Name: " + rplayground_sites[l].name;
															rplayground_sites[l].color = 'white';
															rplayground_sites[l].colorBoder =  	'#90EE90';
															
															rUnder_ren[k].drilldown.push(rplayground_sites[l]);
															
															//Physical Boxes
															for (var m = 0 ; m < rpBox.length; m++){
																if (rpBox[m].site == rplayground_sites[l].siteID)
																{
																	rpBox[m].drilldown = [];
																	rpBox[m].resource = 5;
																	rpBox[m].label = ''+ rpBox[m].boxType;
																	rpBox[m].info = "Box Name: "+rpBox[m].boxName+ "\n"+" Site: " + rpBox[m].site;
																	if (rpBox[m].data_ip_status == "GREEN"){
																		rpBox[m].color = 'white';
																		console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																		console.log(rpBox[m].boxName+' '+rpBox[m].color)
																	}
																	else if (rpBox[m].data_ip_status == "ORANGE"){
																		rpBox[m].color = '#ffcc99';//light Orange
																		console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																		console.log(rpBox[m].boxName+' '+rpBox[m].color)
																	}
																	else{
																		rpBox[m].color = '#ffcce0';//light red
																		console.log(rpBox[m].boxName+ " "+rpBox[m].data_ip_status);
																		console.log(rpBox[m].boxName+' '+rpBox[m].color)
																	}
																	rpBox[m].colorBoder = 	'MediumSeaGreen' //MediumSeaGreen
																	
																	rplayground_sites[l].drilldown.push(rpBox[m]);
																	
																	//OpenStack VMs
																	for (var o = 0 ; o < rVM.length; o++){
																		if (rVM[o].box == rpBox[m].boxName)
																		{
																			rVM[o].drilldown = [];
																			rVM[o].resource = 6;
																			rVM[o].label = ''+rVM[o].name;
																			rVM[o].info = "VM: " +rVM[o].name + " Box: " + rpBox[m].boxName;
																			rVM[o].colorBoder = '#FFD700'; //Gold
																			
																			if (rVM[o].state == "Running"){
																				rVM[o].color = 'white';
																			}
																			else{
																				rVM[o].color = "#ffcce0"; //light red
																			}
																			rpBox[m].drilldown.push(rVM[o]);
																			
																			//var sFlows = {"resource": "11", "label": "SF", "info": "Click to get details about sampled flows", "color": "white", "colorBoder": "#0040ff"}; //Blue
																			//rVM[o].drilldown.push(sFlows);
																			
																			//sFlows.drilldown = [];
																			//var tPackets = {"resource": "12", "label": "TP", "info": "Click to get details about packets", "color": "white", "colorBoder": "#0040ff"}; //Blue
																			//sFlows.drilldown.push(tPackets);
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
									data = rUnderlay_main;
									console.log(data);
								}
								callback(null, data);
							});
						});
					});
				});
			});
		});
    });
};

exports.ResourceProvider = ResourceProvider;
//exports.UserProvider = UserProvider;
