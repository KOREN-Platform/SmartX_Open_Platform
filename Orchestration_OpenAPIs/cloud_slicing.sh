#!/bin/bash

if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

#User_ID=demo
#VLAN_ID=603
#Flavor=m1.small
#Image=cirros

User_ID=$1
VLAN_ID=$2
Flavor=$3
Image=$4
PASS=$5

source admin-openrc.sh

# Create Network
openstack network create --project $User_ID --provider-network-type vlan --provider-physical-network provider --provider-segment $VLAN_ID Slicing_Network

# Obtain Network ID
Net_ID=`openstack network list | grep Slicing_Network | awk '{print $2}'`

# Create Subnet
openstack subnet create --project demo --subnet-range 10.10.50.0/16 --ip-version 4 --network $Net_ID --dns-nameserver 8.8.8.8 Slicing_sub


source demo-openrc.sh

# Create Router
openstack router create router

# Setting External Gateway
openstack router set --external-gateway public router

# Add Port
openstack router add subnet router Slicing_sub

# Create Instance
openstack server create --flavor $Flavor --image $Image --nic net-id=$Net_ID Cloud_Instance_$2

Instance_ID=`openstack server list | grep Cloud_Instance_$2 | awk '{print $2}'`

# Add DB
cat << EOF | mysql -h 172.20.90.167 -uroot -p$PASSWORD
use Slicing_Management;
INSERT INTO Slicing_Instance('Slicing_ID', 'Instance_ID') VALUES ($2, $Instance_ID);
quit
EOF


