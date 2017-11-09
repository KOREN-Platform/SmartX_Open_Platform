#!/bin/bash


#
# ---------------------------------------------|
#   Infrastructure Slicing v01                 |
#   Written by Jungsu Han                      |
# ---------------------------------------------|
#

IP=1.1.1.1
Port=35357
ONOS_IP=1.1.1.1
ONOS_PORT=8181

# We need to modify this part
Out_Port=2



if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

jq=`which jq`

# Check jq library
if [ $jq != "" ]
then
        echo "jq has been installed."
else
        #echo "jq will be installed"
	apt-get install jq -y
fi



#Authentication
echo -n "Input your ID: "
read User_ID
echo -n "Input your Password: "
stty -echo
read Password
echo ""
stty echo

export OS_PROJECT_DOMAIN_NAME=default
export OS_USER_DOMAIN_NAME=default
export OS_PROJECT_NAME=$User_ID
export OS_USERNAME=$User_ID
export OS_PASSWORD=$Password
export OS_AUTH_URL=http://$IP:$Port/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2

Output=`openstack token issue`

#echo "check is $Output"

if [ "$Output" == "" ]; then
   echo "Authentication Failed"
   exit 1
fi


# SLicing ID Checking
echo -n "Input Sllicing ID: "
read Slicing




# MAC Checking
echo -n "Inpuy Your IoT MAC: "
read MAC

#point to point intent for ARP
json=`curl -X GET --header "Accept: application/json" "http://$ONOS_IP:$ONOS_PORT/onos/v1/hosts/$MAC/-1" --user karaf:karaf`


#echo "Json"
echo

DPID=`echo $json | jq -r '.location.elementId'`

port=`echo $json | jq -r '.location.port'`
#echo "Dpid is= $DPID"
#echo "port is= $port"


# Check MAC
if [ $DPID = null ]; then

 echo "Cannot find MAC"
 exit 1
fi


echo "MAC Location found!"
echo
echo "Making Intents.."


# VLAN Tagging Part (from IoT to VM)

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ 
   "type": "PointToPointIntent", 
   "appId": "org.onosproject.cli",  
   "priority": 100, 
   "selector": 
    {  
      "criteria":  
      [  
        {"mac": "'$MAC'", 
         "type": "ETH_SRC" 
        } 
      ] 
    },  
   "treatment": 
     { 
      "instructions": 
      [ 
        {"type": "L2MODIFICATION", 
         "subtype": "VLAN_PUSH" 
        }, 
        {"type": "L2MODIFICATION",
         "subtype": "VLAN_ID",
         "vlanId": "'$Slicing'"
        } 
      ] 
     }, 
   "ingressPoint":
     { 
      "device": "'$DPID'", 
      "port": "'$port'" 
     }, 
   "egressPoint": 
     {"device": "'$DPID'", 
      "port": "2" 
     } 
 }' 'http://'$ONOS_IP':'$ONOS_PORT'/onos/v1/intents' --user karaf:karaf



## VLAN Taggging Part #2 (ARP Version)


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "type": "PointToPointIntent",
   "appId": "org.onosproject.cli",
   "priority": 100,
   "selector":
    {
      "criteria":
      [
        {"type": "ETH_TYPE",
         "ethType": "0x806"
        },
        {"mac": "'$MAC'",
         "type": "ETH_SRC"
        }
      ]
    },
   "treatment":
     {
      "instructions":
      [
        {"type": "L2MODIFICATION",
         "subtype": "VLAN_PUSH"
        },
        {"type": "L2MODIFICATION",
         "subtype": "VLAN_ID",
         "vlanId": "'$Slicing'"
        }
      ]
     },
   "ingressPoint":
     {
      "device": "'$DPID'",
      "port": "'$port'"
     },
   "egressPoint":
     {"device": "'$DPID'",
      "port": "'$Out_Port'"
     }
 }' 'http://'$ONOS_IP':'$ONOS_PORT'/onos/v1/intents' --user karaf:karaf






### Removing VLAN Tag (From VM to IoT)

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "type": "PointToPointIntent",
   "appId": "org.onosproject.cli",
   "priority": 100,
   "selector":
    {
      "criteria":
      [
        {"type": "VLAN_VID",
         "vlanId": "'$Slicing'"
        }
      ]
    },
   "treatment":
     {
      "instructions":
      [
        {"type": "L2MODIFICATION",
         "subtype": "VLAN_POP"
        }
      ]
     },
   "ingressPoint":
     {
      "device": "'$DPID'",
      "port": "'$Out_Port'"
     },
   "egressPoint":
     {"device": "'$DPID'",
      "port": "'$port'"
     }
 }' 'http://'$ONOS_IP':'$ONOS_PORT'/onos/v1/intents' --user karaf:karaf




### Removing VLAN Tag #2 (Arp Version)

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "type": "PointToPointIntent",
   "appId": "org.onosproject.cli",
   "priority": 100,
   "selector":
    {
      "criteria":
      [
        {"ethType": "0x806",
         "type": "ETH_TYPE"
        },
        {"type": "VLAN_VID",
         "vlanId": "'$Slicing'"
        }
      ]
    },
   "treatment":
     {
      "instructions":
      [
        {"type": "L2MODIFICATION",
         "subtype": "VLAN_POP"
        }
      ]
     },
   "ingressPoint":
     {
      "device": "'$DPID'",
      "port": "'$Out_Port'"
     },
   "egressPoint":
     {"device": "'$DPID'",
      "port": "'$port'"
     }
 }' 'http://'$ONOS_IP':'$ONOS_PORT'/onos/v1/intents' --user karaf:karaf


echo
echo "Intents have been created"
echo 

#curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d "{'type':'PointToPointIntent','appId': 'org.onosproject.cli','priority': 100,'selector':{'criteria':[{'ethType': '0x806', 'type': 'ETH_TYPE'},{'mac': '$MAC', 'type': 'ETH_SRC'}]},'treatment': {'instructions':[{'type': 'L2MODIFICATION', 'subtype': 'VLAN_PUSH'},{'type': 'L2MODIFICATION', 'subtype': 'VLAN_ID', 'vlanId': $Slicing}]},'ingressPoint':{'device': '$DPID','port': '$port'},'egressPoint':{'device': '$DPID','port': '7'}}" "http://$ONOS_IP:$ONOS_PORT/onos/v1/intents" --user karaf:karaf

#point to point intent
#curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d "{'type':'PointToPointIntent','appId': 'org.onosproject.cli','priority': 100,'selector':{'criteria':[{'mac': '$MAC', 'type': 'ETH_SRC'}]},'treatment': {'instructions':[{'type': 'L2MODIFICATION', 'subtype': 'VLAN_PUSH'},{'type': 'L2MODIFICATION', 'subtype': 'VLAN_ID', 'vlanId': $Slicing_ID}]},'ingressPoint':{'device': '$DPID','port': '$In_Port'},'egressPoint':{'device': '$DPID','port': '$Out_port'}}" "http://$ONOS_IP:$ONOS_PORT/onos/v1/intents" --user karaf:karaf

	
