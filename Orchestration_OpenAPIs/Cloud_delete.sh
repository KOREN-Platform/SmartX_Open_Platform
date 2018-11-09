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

IP=$(get_config_value configuration/init.ini controller OpenStack_keystone)
Port=$(get_config_value configuration/init.ini controller OpenStack_Port)

DB_HOST=$(get_config_value configuration/init.ini database MySQL_HOST)
DB_PASS=$(get_config_value configuration/init.ini database MySQL_PASS)



KEYSTONE_ADMIN_PASS=$(get_config_value configuration/init.ini controller keystone_admin_pass)


User_ID=$1
Password=$2
Instance_ID=$3
region=$4


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



# Check Instance & tenant
sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select distinct Instance_ID from Slicing join Instance where Tenant_ID='$User_ID' and Instance_ID='$Instance_ID';")

if [ "$sql" == "" ]; then
  echo "Error: Instance ID is not valid"
  exit 0
fi



# delete Instance
temp=$(openstack server delete --os-region-name $region $Instance_ID)


# get the slicing id 
sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select Slicing_ID from Instance where Instance_ID='$Instance_ID';")

Slicing_ID=`echo $sql | awk '{print $2}'`


# delete database
sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; delete from Instance where Instance_ID='$Instance_ID';")


# Check existed instances with the slicing id 
sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select * from Instance where Slicing_ID='$Slicing_ID';")

if [ "$sql" == "" ]; then
  #delete router and network

  # delete router subnet
  openstack router remove --os-region-name $region subnet router_$Slicing_ID sub_$Slicing_ID

  # delete router
  openstack router delete --os-region-name $region router_$Slicing_ID

  # delete network
  openstack network delete --os-region-name $region vlan_$Slicing_ID 

fi


echo "Success"








