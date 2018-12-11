/**
 * Module dependencies.
 */

var http = require("http");
var express = require('express');
var async = require('async');
var path = require('path')

var favicon = require('serve-favicon')
var logger = require('morgan')
var methodOverride = require('method-override')
var session = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var errorHandler = require('errorhandler')
var logger = require('morgan')

var BoxProvider = require('./MultiView-DataAPI').BoxProvider;
var client = require('socket.io').listen(8080).sockets;
var host = "";

var app = express();

app.set('view engine', 'pug');
app.use(express.json());
app.use(logger('dev'))
app.use(methodOverride());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.set('views', path.join(__dirname, '/views'))
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }))
//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//app.use(multer())
app.use(express.static(path.join(__dirname, '/public')))
//Before starting application run below command in public directory
//ln -s /opt/KONE-MultiView/pvcT-Visualization/node_modules/ /opt/KONE-MultiView/pvcT-Visualization/public/

//Define Application Routes
var resourceProvider = new ResourceProvider();

// Route for TCP Throughput-based Topology View
app.get('/tcptopologyviewops', function(req, res){
    var boxList = null;
	//console.log('Topology Visualization Rendering.');
    resourceProvider.getTCPTopologyList( function(error, boxobj){
        boxList = boxobj;
        showView();
    })
    function showView(){
        if(boxList !== null){
            console.log('Topology Visualization Rendering.');
			//console.log(boxList);
            res.render('tcptopologyviewops.jade', { title: 'Playground Topology View', boxList: JSON.stringify(boxList) });
        }
    }
});

//the dictionary key is user name and value is
var userwithip = null;
var username = "admin";

//ManhNT start
app.get('/onionringviewops', function(req, res){
	var data = null;
	console.log(username);
	resourceProvider.getDataMultiSliceVisibility(username, function(error, databj)
	{
		data = databj;
		showView();
	});
	
	resourceProvider.getControllerList(function(error, controllerobj)
    {
        controllerList = controllerobj;
        console.log(controllerList);
        showView();
    });
	
	function showView()
	{
		if(data !== null && controllerList !== null){
			res.render('onionringviewops.jade', {title: 'Onion-ring-based Visualization', data : JSON.stringify(data), controllerList : JSON.stringify(controllerList)});
		}
	}
});

app.get('/onionringviewtenant/*', function(req, res){
	var data = null;
	console.log(username);
	resourceProvider.getDataMultiSliceVisibilityTenant('demo', function(error, databj)
	{
		data = databj;
		showView();
	});
	resourceProvider.getControllerList(function(error, controllerobj)
    {
        controllerList = controllerobj;
        console.log(controllerList);
        showView();
    });
	function showView()
	{
		if(data !== null && controllerList !== null){
			//console.log('Onion-ring Visualization Rendering'+data);
			res.render('onionringviewtenant.jade', {title: 'Onion-ring-based Visualization', data : JSON.stringify(data), controllerList : JSON.stringify(controllerList)});
    }
  }
});
//manhNT end

// Route for Resource-Centric View
/*app.get('/resourcecentricviewops', function(req, res){
    var boxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList     = 0;
    var ovsBridgeStatus = null;
    var pPathStatus     = null;

    resourceProvider.getpBoxList( function(error,boxobj){
		boxList = boxobj;
		//console.log( boxList);
		showView();
    })
    
	resourceProvider.getvSwitchList(function(error, switchobj){
    	switchList = switchobj;
        //console.log(switchList);
		showView();
    })

    resourceProvider.getvBoxList(function(error, instanceobj){
        instanceList = instanceobj;
        //console.log(instanceList);
        showView();
    })

    resourceProvider.getovsBridgeStatus(function(error, bridgestatusobj){
        ovsBridgeStatus = bridgestatusobj;
        //console.log(ovsBridgeStatus);
        showView();
    })

    function showView(){
        if(boxList !== null && switchList !== null && instanceList !== null && workloadList !==null &&  ovsBridgeStatus !== null){
		    console.log('Resource-Centric View Rendering');
			//console.log(ovsBridgeStatus);
			
			res.render('resourcecentricviewops.jade', {title: 'Resource-Centric Topological View',
				boxList         : JSON.stringify(boxList),
				switchList      : JSON.stringify(switchList),
				instanceList    : JSON.stringify(instanceList),
				workloadList     : JSON.stringify(workloadList),
				ovsBridgeStatus : JSON.stringify(ovsBridgeStatus)
				}, 
				function(err, html){
					if (err) { console.err("ERR", err) };
					//console.log(html);
					res.status(200).send(html);
				}
			);
		}
	}
});*/

app.get('/resourcecentricviewops', function(req, res){
	var bboxList         = null;
    var sboxList         = null;
    var cboxList         = null;
    var oboxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList    = 0;
    var ovsBridgeStatus = null;
    var boxes           = {};
    var pPathStatus     = null;
    
    var tasks = [
	function(callback){
    	resourceProvider.getpBoxList('B', (function(error, bboxobj)
    	{
		 	boxes.bbox = bboxobj;
	    	callback();
		}))
    },
    function(callback){
    	resourceProvider.getpBoxList('S', (function(error, sboxobj)
    	{
		 	boxes.sbox = sboxobj;
	    	//console.log(boxes.sbox);
	    	callback();
		 	//showView();
    	}))
    },
    
    function (callback){
    	resourceProvider.getpBoxList('C', (function(error, cboxobj)
    {
		 boxes.cbox = cboxobj;
	    //console.log(boxes.cbox);
	    callback();
		 //showView();
    }))
    },
    function (callback){
    	resourceProvider.getpBoxList('O', (function(error, oboxobj)
    	{
		 	boxes.obox = oboxobj;
	    	//console.log(boxes.obox);
	    	callback();
		 	//showView();
    	}))
    },
	function (callback){
    	resourceProvider.getvSwitchList('B', (function(error, bswitchobj)
    	{
    		boxes.bswitchList = bswitchobj;
       	   	callback();
		}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('S', (function(error, sswitchobj)
    	{
    		boxes.sswitchList = sswitchobj;
       	//console.log(switchList);
			callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('C', (function(error, cswitchobj)
    	{
    		boxes.cswitchList = cswitchobj;
       	//console.log(switchList);
			callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('O', (function(error, oswitchobj)
    	{
    		boxes.oswitchList = oswitchobj;
       	//console.log(boxes.oswitchList);
			callback();
		 	//showView();
    	}))
    },
	function (callback){
    	resourceProvider.getovsBridgeStatus('B', function(error, bbridgestatusobj)
    	{
			console.log(bbridgestatusobj);
			boxes.bovsBridgeStatus = bbridgestatusobj;
			callback();
        })
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('S', function(error, sbridgestatusobj)
    	{
			boxes.sovsBridgeStatus = sbridgestatusobj;
			//console.log(ovsBridgeStatus);
			callback();
			//showView();
    	})
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('C', function(error, cbridgestatusobj)
    	{
			boxes.covsBridgeStatus = cbridgestatusobj;
			//console.log(boxes.covsBridgeStatus);
			callback();
			//showView();
    	})
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('O', function(error, obridgestatusobj)
    	{
			boxes.oovsBridgeStatus = obridgestatusobj;
			//console.log(boxes.oovsBridgeStatus);
			callback();
			//showView();
    	})
    },
    function(callback){
    	resourceProvider.getvBoxList(function(error, instanceobj)
    	{
			boxes.instanceList = instanceobj;
			//console.log(boxes.instanceList);
			callback();
			//showView();
    	})
    },
    function(callback){
    	resourceProvider.getIoTHostList(function(error, hostobj)
    	{
			boxes.iotHostList = hostobj;
			//console.log(boxes.iotHostList);
			callback();
      })
    },
    function(callback){
    	resourceProvider.getControllerList(function(error, controllerobj)
    	{
			boxes.controllerList = controllerobj;
			//console.log(boxes.controllerList);
			callback();
      })
    }
    ];

	 async.parallel(tasks, function(err) { 
			console.log('Resource-Centric View Rendering');
			res.render('resourcecentricviewops.jade', {
				bboxList         : JSON.stringify(boxes.bbox),
				sboxList         : JSON.stringify(boxes.sbox),
				cboxList         : JSON.stringify(boxes.cbox),
				oboxList         : JSON.stringify(boxes.obox),
				bswitchList      : JSON.stringify(boxes.bswitchList),
				sswitchList      : JSON.stringify(boxes.sswitchList),
				cswitchList      : JSON.stringify(boxes.cswitchList),
				oswitchList      : JSON.stringify(boxes.oswitchList),
				instanceList     : JSON.stringify(boxes.instanceList),
				iotHostList      : JSON.stringify(boxes.iotHostList),
				bovsBridgeStatus : JSON.stringify(boxes.bovsBridgeStatus),
				sovsBridgeStatus : JSON.stringify(boxes.sovsBridgeStatus),
				covsBridgeStatus : JSON.stringify(boxes.covsBridgeStatus),
				oovsBridgeStatus : JSON.stringify(boxes.oovsBridgeStatus),
				controllerList   : JSON.stringify(boxes.controllerList)
        	});
        });
    });

//Route for Flow Rules View
app.get('/flowrulesviewops', function(req, res){
    console.log('Flow Rules and Statistics View Rendering');
    //res.render('flowrulesviewops.jade', {title: 'Flow-Centric View'})
    var boxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList     = 0;
    var ovsBridgeStatus = null;
    var pPathStatus     = null;
    resourceProvider.getpBoxList( function(error,boxobj)
    {
        boxList = boxobj;
        console.log( boxList);
        showView();
    })
    resourceProvider.getvSwitchList(function(error, switchobj)
    {
        switchList = switchobj;
        console.log(switchList);
        showView();
    })

    resourceProvider.getvBoxList(function(error, instanceobj)
    {
        instanceList = instanceobj;
        console.log(instanceList);
        showView();
    })

	resourceProvider.getovsBridgeStatus(function(error, bridgestatusobj)
    {
        ovsBridgeStatus = bridgestatusobj;
        console.log(ovsBridgeStatus);
        showView();
    })

    function showView()
    {
        if(boxList !== null && switchList !== null && instanceList !== null && workloadList !==null &&  ovsBridgeStatus !== null)
        {
                console.log('Flow Rules and Statistics View Rendering');
                
				res.render('flowrulesviewops.jade', {title: 'Flow Rules and Statistics View Rendering',
				boxList         : JSON.stringify(boxList),
				switchList      : JSON.stringify(switchList),
				instanceList    : JSON.stringify(instanceList),
				workloadList     : JSON.stringify(workloadList),
				ovsBridgeStatus : JSON.stringify(ovsBridgeStatus)
				}, 
				function(err, html){
					if (err) { console.err("ERR", err) };
					//console.log(html);
					res.status(200).send(html);
				}
			);
        }
    }
});

// Route for Flow Path Tracing View
app.get('/flowtracingviewops/*', function(req, res){
	//Wait for 1 minute before requesting again
	req.connection.setTimeout(60*1000);
	
	console.log('Flow Path Tracing View Rendering');
    
	var tenantID=req.originalUrl;
	var vlanID=tenantID;
	
	tenantID=tenantID.substring(20, tenantID.indexOf("&"));
	vlanID=vlanID.substring(vlanID.indexOf("&")+1, vlanID.length);
	console.log(tenantID);
	console.log(vlanID);
	
    var boxList           = null;
    var switchList        = null;
    var instanceList      = null;
    var workloadList      = 0;
    var ovsBridgeStatus   = 0;
	var bridgevlanmapList = null;
    
	resourceProvider.getpBoxList( function(error,boxobj)
    {
        boxList = boxobj;
        showView();
    })
    resourceProvider.getvSwitchList(function(error, switchobj)
    {
        switchList = switchobj;
        showView();
    })

    resourceProvider.getTenantvBoxList(tenantID, function(error, instanceobj)
    {
        instanceList = instanceobj;
        showView();
    })

	resourceProvider.getbridgevlanmapList(vlanID, function(error, bridgevlanmapobj)
    {
       	bridgevlanmapList = bridgevlanmapobj;
       	showView();
    })

    function showView()
    {
        if(boxList !== null && switchList !== null && instanceList !== null && workloadList !==null &&  ovsBridgeStatus !== null && bridgevlanmapList !==null)
        {
                res.render('flowtracingviewops.jade', {title: 'Flow Tracing View Rendering',
                        boxList           : JSON.stringify(boxList),
                        switchList        : JSON.stringify(switchList),
                        instanceList      : JSON.stringify(instanceList),
                        workloadList      : JSON.stringify(workloadList),
                        ovsBridgeStatus   : JSON.stringify(ovsBridgeStatus),
                        bridgevlanmapList : JSON.stringify(bridgevlanmapList)
                    }
                )
        }
	}
});

// Route for Flows/Playground Measurements View
app.get('/flowmeasureviewops', function(req, res){
    console.log('Flow Measure View Rendering');
    //res.render('flowcentricviewops.jade', {title: 'Flow-Centric View'})
    var boxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList     = 0;
    var ovsBridgeStatus = null;
    var pPathStatus     = null;
    resourceProvider.getpBoxList( function(error,boxobj)
    {
        boxList = boxobj;
        console.log( boxList);
        showView();
    })
    resourceProvider.getvSwitchList(function(error, switchobj)
    {
        switchList = switchobj;
        console.log(switchList);
        showView();
    })

    resourceProvider.getvBoxList(function(error, instanceobj)
    {
        instanceList = instanceobj;
        console.log(instanceList);
        showView();
    })

	resourceProvider.getovsBridgeStatus(function(error, bridgestatusobj)
    {
        ovsBridgeStatus = bridgestatusobj;
        console.log(ovsBridgeStatus);
        showView();
    })

    function showView()
    {
        if(boxList !== null && switchList !== null && instanceList !== null && workloadList !==null &&  ovsBridgeStatus !== null)
        {
			console.log('Flow Measure View Rendering');
			res.render('flowmeasureviewops.jade', {title: 'Flow Measure View', 
					boxList         : JSON.stringify(boxList),
					switchList      : JSON.stringify(switchList),
					instanceList    : JSON.stringify(instanceList),
					workloadList     : JSON.stringify(workloadList),
					ovsBridgeStatus : JSON.stringify(ovsBridgeStatus)
			}
			);
        }
    }
});

// Route for Packets/Box IO-Visor View
app.get('/flowiovisorviewops', function(req, res){
    //res.render('flowiovisorviewops.jade', {title: 'Flow-Centric View'})
    var boxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList     = 0;
    var ovsBridgeStatus = null;
    var pPathStatus     = null;
    resourceProvider.getpBoxList( function(error,boxobj)
    {
        boxList = boxobj;
        console.log( boxList);
        showView();
    })
    resourceProvider.getvSwitchList(function(error, switchobj)
    {
        switchList = switchobj;
        console.log(switchList);
        showView();
    })

    resourceProvider.getvBoxList(function(error, instanceobj)
    {
        instanceList = instanceobj;
        console.log(instanceList);
        showView();
    })

	resourceProvider.getovsBridgeStatus(function(error, bridgestatusobj)
    {
        ovsBridgeStatus = bridgestatusobj;
        console.log(ovsBridgeStatus);
        showView();
    })

    function showView()
    {
        if(boxList !== null && switchList !== null && instanceList !== null && workloadList !==null &&  ovsBridgeStatus !== null)
        {
			console.log('Packets/Box View Rendering');
			res.render('flowiovisorviewops.jade', {title: 'Flow Measure View', 
					boxList         : JSON.stringify(boxList),
					switchList      : JSON.stringify(switchList),
					instanceList    : JSON.stringify(instanceList),
					workloadList     : JSON.stringify(workloadList),
					ovsBridgeStatus : JSON.stringify(ovsBridgeStatus)
			}
			);
        }
    }
});

// Route for Workload View
app.get('/servicecentricviewops', function(req, res){
    console.log('Workload-Centric View Rendering');
    res.render('servicecentricviewops.jade', {title: 'Workload Centric View'})
});

// Route for Flow Rules View
app.get('/opsflowrules/*', function(req, res){
    var configList = null;
    var statList = null;
    var boxID=req.originalUrl;
    boxID=boxID.substring(14,boxID.length);
    resourceProvider.getOpsSDNConfigList(boxID, function(error,configobj)
    {
       	configList = configobj;
       	showView();
    })
    resourceProvider.getOpsSDNStatList(boxID, function(error,statobj)
    {
        statList = statobj;
        console.log(statList);
        showView();
    })
    function showView()
    {
       	if(configList !== null && statList !== null)
       	{
        	console.log('Operator Controller Flow Rules');
		console.log(statList);
		res.render('opssdncontconfig.jade', { title: 'Operator Controller Flow Rules', configList: configList, statList: statList });
               // res.render('opssdncontconfig.jade',{locals: {
               //        	configList : JSON.stringify(configList),
               // },
               // title: 'Operator Controller Flow Rules'}
               // )
        }
    }    
});

// Route for Flow Statistics View
app.get('/opsflowstat', function(req, res){
    var statList = null;
    resourceProvider.getOpsSDNStatList( function(error,statobj)
    {
        statList = statobj;
        console.log(statList);
        showView();
    })
    function showView()
    {
        if(statList !== null)
        {
                console.log('Operator Controller Flow Stats');
                res.render('opssdncontstat.jade', { title: 'Operator Controller Flow Statistics', statList: statList });
        }
    }
});

// Route for Tenant-Vlan Mappings View
app.get('/tenantvlanmapops', function(req, res){
	var tenantList = null;
    //var tenantID=req.originalUrl;
    //tenantID=tenantID.substring(14, tenantID.length);
    //resourceProvider.gettenantvlanmapList(tenantID, function(error, tenantObj)
	resourceProvider.gettenantvlanmapList(function(error, tenantObj)
    {
       	tenantList = tenantObj;
       	showView();
    })
    
    function showView()
    {
       	if(tenantList !== null)
       	{
        	console.log('Tenant-Vlan Flow Path Tracing');
			console.log(tenantList);
			res.render('tenantvlanmapops.jade', { title: 'Tenant Vlan Mappings View', tenantList: tenantList });
		}
    }    
});

// Route for Tenant-Vlan Mappings View
app.get('/tenantvlanmaponionring', function(req, res){
	var tenantList = null;
    resourceProvider.gettenantvlanmapList(function(error, tenantObj)
    {
       	tenantList = tenantObj;
       	showView();
    })
    
    function showView()
    {
       	if(tenantList !== null)
       	{
        	console.log('Tenant-Vlan Onion-ring');
			//console.log(tenantList);
			res.render('tenantvlanmaponionring.jade', { title: 'Tenant Vlan Mappings View', tenantList: tenantList });
		}
    }    
});

// Route for TCP Throughput-based Data API
app.get('/getamdatatcpperDay/', function(req, res){
    //Wait for 1 minute before requesting again
	req.connection.setTimeout(60*1000);
	
	var boxID=req.originalUrl;
	var filterdate=boxID;
	
	boxID=filterdate.substring(20, filterdate.indexOf("&"));
	filterdate=boxID.substring(boxID.indexOf("&")+1, boxID.length);
	console.log(boxID);
	console.log(filterdate);
	
	resourceProvider.getAMDataTCPperDay(boxID, filterdate, function(error, data){
        if (err)
			res.send(err);
		res.json(data);
    })
});

// Route for TEIN International API Call
app.get('/teinint', function(req, res){
    var data = null;
	
	resourceProvider.getTwoRingAPI(function(error, dataobj)
	{
		data = dataobj;
		showView();
	});
	
	function showView()
	{
		if(data !== null){
			res.render('onionringviewapi.jade', {title: 'Onion-ring Visualization', data : JSON.stringify(data)});
		}
	}
});

// Route for REN API Call
app.get('/ren', function(req, res){
    var data = null;
	
	resourceProvider.getThreeRingAPI(function(error, dataobj)
	{
		data = dataobj;
		showView();
	});
	
	function showView()
	{
		if(data !== null){
			res.render('onionringviewapi.jade', {title: 'Onion-ring Visualization', data : JSON.stringify(data)});
		}
	}
});

// Route for Sites API Call
app.get('/sites', function(req, res){
    var data = null;
	
	resourceProvider.getFourRingAPI(function(error, dataobj)
	{
		data = dataobj;
		showView();
	});
	
	function showView()
	{
		if(data !== null){
			res.render('onionringviewapi.jade', {title: 'Onion-ring Visualization', data : JSON.stringify(data)});
		}
	}
});

// Route for SmartX Boxes/Micro-Boxes API Call
app.get('/boxes', function(req, res){
    var data = null;
	
	resourceProvider.getFiveRingAPI(function(error, dataobj)
	{
		data = dataobj;
		showView();
	});
	
	function showView()
	{
		if(data !== null){
			res.render('onionringviewapi.jade', {title: 'Onion-ring Visualization', data : JSON.stringify(data)});
		}
	}
});

// Route for SmartX Boxes/Micro-Boxes API Call
app.get('/vms', function(req, res){
    var data = null;
	
	resourceProvider.getSixRingAPI(function(error, dataobj)
	{
		data = dataobj;
		showView();
	});
	
	function showView()
	{
		if(data !== null){
			res.render('onionringviewapi.jade', {title: 'Onion-ring Visualization', data : JSON.stringify(data)});
		}
	}
});

// Route for SmartX Boxes/Micro-Boxes API Call
app.get('/flows', function(req, res){
    var data = null;
	
	resourceProvider.getSevenRingAPI(function(error, dataobj)
	{
		data = dataobj;
		showView();
	});
	
	function showView()
	{
		if(data !== null){
			res.render('onionringviewapi.jade', {title: 'Onion-ring Visualization', data : JSON.stringify(data)});
		}
	}
});

// Route for SmartX Boxes/Micro-Boxes API Call
app.get('/workload', function(req, res){
    var data = null;
	
	resourceProvider.getEightRingAPI(function(error, dataobj)
	{
		data = dataobj;
		showView();
	});
	
	function showView()
	{
		if(data !== null){
			res.render('onionringviewapi.jade', {title: 'Onion-ring Visualization', data : JSON.stringify(data)});
		}
	}
});

// Route for Login View
app.get('/', function(req, res){
    res.render('login.jade', {title: 'MultiView Web Application Login'})
});

// Route for Menu View
app.get('/menu', function(req, res){
    console.log('Menu Rendering');
	userwithip = {name:username , ip : req.connection.remoteAddress};
	console.log(userwithip);
	res.render('menu.jade',{locals: {}, title: 'Multi-View Menu'})
});

app.get('/login', function(req, res){
    res.render('login.jade',{ title: 'MultiView Login'})
});

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'production') {
  app.use(errorHandler())
}

// Web Autentication & Validation
client.on('connection', function (socket) {
    socket.on('login', function(login_info){
        var this_user_name = login_info.user_name,
            this_user_password = login_info.user_password;
        if (this_user_name === '' || this_user_password === '') {
                socket.emit('alert', 'You must fill in both fields');
        } else {
            resourceProvider.getUsers(function (err, listusers){
                if(err) throw err;
                var found = false,
                    location =-1;
                  if (listusers.length) {
                        for (var i in listusers) {
                            if (listusers[i].username === this_user_name) {
                                found = true;
                                if (listusers[i].password === this_user_password) {
                                    //todo: get priority and send to menu page.
									username = this_user_name;
                                    if(listusers[i].role === 'operator'){
                                        socket.emit('redirect', 'operator');
                                    }
                                    else{
                                        socket.emit('redirect', 'developer');
                                    }
                                } else {
                                    socket.emit('alert', 'Please retry password');
                                }
                                break;
                            }
                        }

                        if (!found) {
                            socket.emit('alert', 'Sorry, We could not find you.');
                        }
                    }
            })
        }
    });
});

app.set('domain', '0.0.0.0')
app.listen(3011, () => console.log("Express Server Running..."))
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
