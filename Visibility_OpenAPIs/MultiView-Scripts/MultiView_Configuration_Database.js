//Update This Script Before Installing MultiView Software
use korenplatformdb
show collections

//Create Unique Indexes
db['configuration-multiview-users'].createIndex( { username:1, password: 1 }, { unique: true } )
db['configuration-pbox-list'].createIndex({box:1, boxID: 1},{unique:true})
db['configuration-vswitch-list'].ensureIndex({boxType:1, bridge: 1},{unique:true})
db['configuration-vswitch-status'].ensureIndex({bridge:1, boxID: 1},{unique:true})

//Insert MultiView Users Data into Collection
db['configuration-multiview-users'].insert( { username: "admin", password: "admin", role: "operator" } )
db['configuration-multiview-users'].insert( { username: "demo", password: "demo", role: "developer" } )

//Insert pBoxes Data into Collection
db['configuration-pbox-list'].insert( { boxID: "GIST_S_1", boxName: "GIST-WAN-Box", boxType: "S", site: "GIST", management_ip: "210.114.90.171", management_ip_status: "up", data1_ip: "", data1_ip_status: "up", control_ip: "", control_ip_status: "up", ovs_vm1: "", ovs_vm2: "", active_ovs_vm: "ovs_vm1" } )
db['configuration-pbox-list'].insert( { boxID: "GIST_C_1", boxName: "GIST-Cloud-Box", boxType: "C", site: "GIST", management_ip: "210.114.90.170", management_ip_status: "up", data1_ip: "", data1_ip_status: "up", control_ip: "", control_ip_status: "up", ovs_vm1: "", ovs_vm2: "", active_ovs_vm: "ovs_vm1" } )
db['configuration-pbox-list'].insert( { boxID: "GIST_O_1", boxName: "GIST-Access-Box", boxType: "O", site: "GIST", management_ip: "210.114.90.169", management_ip_status: "up", data1_ip: "", data1_ip_status: "up", control_ip: "", control_ip_status: "up", ovs_vm1: "", ovs_vm2: "", active_ovs_vm: "ovs_vm1" } )

//Insert OVS Bridges Topology Data into Collection
db['configuration-vswitch-list'].insert( { boxType: "S", boxDevType: "", bridge: "br-cap", topologyorder: "1" } )
db['configuration-vswitch-list'].insert( { boxType: "O", boxDevType: "", bridge: "br-IoT", topologyorder: "1" } )
db['configuration-vswitch-list'].insert( { boxType: "C", boxDevType: "", bridge: "brvlan", topologyorder: "1" } )
db['configuration-vswitch-list'].insert( { boxType: "C", boxDevType: "", bridge: "br-int", topologyorder: "2" } )
//db['configuration-vswitch-list'].insert( { type: "B**", bridge: "brcap", topologyorder: "1" } )
//db['configuration-vswitch-list'].insert( { type: "B**", bridge: "brdev", topologyorder: "2" } )
//db['configuration-vswitch-list'].insert( { type: "B**", bridge: "brvlan", topologyorder: "3" } )
//db['configuration-vswitch-list'].insert( { type: "B**", bridge: "br-ex", topologyorder: "3" } )
//db['configuration-vswitch-list'].insert( { type: "B**", bridge: "br-int", topologyorder: "4" } )

//Insert OVS Bridges Status Data into Collection <Insert For all boxes>
db['configuration-vswitch-status'].insert( { boxType: "S", bridge: "br-cap", boxID: "GIST_S_1", status: "GREEN" } )
db['configuration-vswitch-status'].insert( { boxType: "O", bridge: "br-IoT", boxID: "GIST_O_1", status: "GREEN" } )
db['configuration-vswitch-status'].insert( { boxType: "C", bridge: "br-int", boxID: "GIST_C_1", status: "RED" } )
db['configuration-vswitch-status'].insert( { boxType: "C", bridge: "brvlan", boxID: "GIST_C_1", status: "RED" } )
//db['configuration-vswitch-status'].insert( { bridge: "brcap", box: "boxName", status: "RED" } )
//db['configuration-vswitch-status'].insert( { bridge: "brdev", box: "boxName", status: "RED" } )
//db['configuration-vswitch-status'].insert( { bridge: "brvlan", box: "boxName", status: "RED" } )
//db['configuration-vswitch-status'].insert( { bridge: "br-ex", box: "boxName", status: "RED" } )
//db['configuration-vswitch-status'].insert( { bridge: "br-int", box: "boxName", status: "RED" } )

//Insert Controllers Data into Collection [Add One Entry for each controller]
db['configuration-controller-list'].insert( { controllerIP: "", ControllerName: "Cloud Controller", controllerType: "cloud", controllerSoftware: "OpenStack", controllerStatus: "GREEN", controllerUser: "netcs", controllerPass: "fn!xo!ska!" } )

//Insert Centres Data into Collection [Modify First]
db['configuration-controller-list'].insert( { controllerIP: ""})