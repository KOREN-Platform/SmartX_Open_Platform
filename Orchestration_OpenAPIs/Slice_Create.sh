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

ID=$1
Password=$2


# Parsing Function
get_config_value()
{
    cat <<EOF | python3
import configparser
config = configparser.ConfigParser()
config.read('$1')
print (config.get('$2','$3'))
EOF
}

Cloud_keystone_IP=$(get_config_value configuration/init.ini controller OpenStack_keystone)
Port=$(get_config_value configuration/init.ini controller OpenStack_Port)

DB_HOST=$(get_config_value configuration/init.ini database MySQL_HOST)
DB_PASS=$(get_config_value configuration/init.ini database MySQL_PASS)


#echo -n "Input your ID: "
#read ID
#echo -n "Input your Password: "
#stty -echo
#read Password
#echo ""
#stty echo


#source 
export OS_PROJECT_DOMAIN_NAME=default
export OS_USER_DOMAIN_NAME=default
export OS_PROJECT_NAME=$ID
export OS_USERNAME=$ID
export OS_PASSWORD=$Password
export OS_AUTH_URL=http://$Cloud_keystone_IP:$Port/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2

#openstack token issue > temp

Output=`openstack token issue`

#echo "check is $Output"

if [ "$Output" == "" ]; then
   echo "Authentication Failed"
   exit 1
fi



##### Assigning Slicing  ID 951~ 958
SPOTS=30
vlan=0

let "vlan = $RANDOM % $SPOTS + 950"



sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select * from Slicing where VLAN_ID='$vlan';")


check=0
while [ $check == 0 ]
do

  if [ "$sql" != "" ]; then
    let "vlan = $RANDOM % $SPOTS + 950"
    sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select * from Slicing where VLAN_ID='$vlan';")
  else
    check=1
  fi

done

echo $vlan



###################### Create DB

#Default SDN Controller Authority
Authority="high"

# Add DB
cat << EOF | mysql -h $DB_HOST -uroot -p$DB_PASS
use Slicing_Management;
INSERT INTO Slicing  VALUES ('$vlan', '$ID', '$Authority', '$vlan');
quit
EOF



#echo "Slicing has been created"
#echo
#echo "Slicing id: $vlan"
#echo


