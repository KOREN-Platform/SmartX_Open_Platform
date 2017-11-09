#!/bin/bash


#
# ---------------------------------------------|
#   Infrastructure Slicing v01                 |
#   Written by Jungsu Han                      |
# ---------------------------------------------|
#



if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi


IP=1.1.1.1
Port=35357
PASS=pass


Flavor=$3
Image=$4



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




##Need to check SLicing ID Part!!!
echo -n "Input Sllicing ID: "
read Slicing




export OS_PROJECT_DOMAIN_NAME=default
export OS_USER_DOMAIN_NAME=default
export OS_PROJECT_NAME=admin
export OS_USERNAME=admin
export OS_PASSWORD=$PASS
export OS_AUTH_URL=http://$IP:$Port/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2


# Flavor & Image

echo -n "Input Flavor: "
read Flavor
echo -n "Input Image: "
read Image



##Checking Network

net_list=`openstack network list | grep vlan_$Slicing`


if [ "$net_list" == "" ]; then

  echo "Creating Network.."
  echo
  
  # Create Network
  openstack network create --project $User_ID --provider-network-type vlan --provider-physical-network provider --provider-segment $Slicing vlan_$Slicing


  # Obtain Network ID
  Net_ID=`openstack network list | grep vlan_$Slicing | awk '{print $2}'`

  # Create Subnet
  subnet=`cat network_pool | grep $Slicing | awk '{print $3}'`
  allocation=`cat network_pool | grep $Slicing | awk '{print $4}'`

  openstack subnet create --project demo --subnet-range $subnet --ip-version 4 --network $Net_ID --dns-nameserver 8.8.8.8 --allocation-pool start=$allocation.100,end=$allocation.200 sub_$Slicing


  export OS_PROJECT_DOMAIN_NAME=default
  export OS_USER_DOMAIN_NAME=default
  export OS_PROJECT_NAME=$User_ID
  export OS_USERNAME=$User_ID
  export OS_PASSWORD=$Password
  export OS_AUTH_URL=http://$IP:$Port/v3
  export OS_IDENTITY_API_VERSION=3
  export OS_IMAGE_API_VERSION=2

  
  # Create Router
  openstack router create router_$Slicing

  # Setting External Gateway
  openstack router set --external-gateway public router_$Slicing

  # Add Port
  openstack router add subnet router_$Slicing sub_$Slicing
else
 
 echo "Network has been created"
 echo ""

fi


export OS_PROJECT_DOMAIN_NAME=default
export OS_USER_DOMAIN_NAME=default
export OS_PROJECT_NAME=$User_ID
export OS_USERNAME=$User_ID
export OS_PASSWORD=$Password
export OS_AUTH_URL=http://$IP:$Port/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2




# obtain Network ID
Net_ID=`openstack network list | grep vlan_$Slicing | awk '{print $2}'`



# Create Instance
openstack server create --flavor $Flavor --image $Image --nic net-id=$Net_ID Cloud_Instance_$Slicing

#Instance_ID=`openstack server list | grep Cloud_Instance_$2 | awk '{print $2}'`

# Add DB
#cat << EOF | mysql -h 172.20.90.167 -uroot -p$PASSWORD
#use Slicing_Management;
#INSERT INTO Slicing_Instance('Slicing_ID', 'Instance_ID') VALUES ($2, $Instance_ID);
#quit
#EOF


