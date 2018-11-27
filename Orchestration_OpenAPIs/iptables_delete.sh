#!/bin/bash

#
# ---------------------------------------------|
#   Infrastructure Slicing v08                 |
#   Written by Jungsu Han                      |
# ---------------------------------------------|
#



if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi


# $1= ID
# $2= Password

Slice_ID=$1
Box_Location=$2



# Parsing Function
get_config_value()
{
    cat <<EOF | python3
import configparser
config = configparser.RawConfigParser()
config.read('$1')
print (config.get('$2','$3'))
EOF
}

#find BOX_IP

if [ "$Box_Location" == "GJ" ]; then
  BOX_HOST=$(get_config_value configuration/init.ini box O_GJ_IP)
  BOX_PASS=$(get_config_value configuration/init.ini box O_GJ_Password)
elif [ "$Box_Location" == "JJ" ]; then
  BOX_HOST=$(get_config_value configuration/init.ini box O_JJ_IP)
  BOX_PASS=$(get_config_value configuration/init.ini box O_JJ_Password)
elif [ "$Box_Location" == "JNU" ]; then
  BOX_HOST=$(get_config_value configuration/init.ini box O_JNU_IP)
  BOX_PASS=$(get_config_value configuration/init.ini box O_JNU_Password)
elif [ "$Box_Location" == "KU" ]; then
  BOX_HOST=$(get_config_value configuration/init.ini box O_KU_IP)
  BOX_PASS=$(get_config_value configuration/init.ini box O_KU_Password)
else
  "Error: Box location is not valid"
  exit 1
fi

network_pool=`cat network_pool | grep $Slice_ID | awk '{print $4}'`

echo $network_pool


# iptables

sshpass -p $BOX_PASS ssh -o StrictHostKeyChecking=no root@$BOX_HOST "iptables -t nat -D POSTROUTING -o br-ex -s $network_pool.0/24 -j MASQUERADE && iptables -D FORWARD -i br-ex -d $network_pool.0/24 -m state --state RELATED,ESTABLISHED -j ACCEPT && iptables -D FORWARD -i br-ex -d $network_pool.0/24 -j ACCEPT"

sshpass -p $BOX_PASS ssh -o StrictHostKeyChecking=no root@$BOX_HOST "netfilter-persistent save && netfilter-persistent reload"

sshpass -p $BOX_PASS ssh -o StrictHostKeyChecking=no root@$BOX_HOST "ip addr delete $network_pool.10/24 dev br-ex"

