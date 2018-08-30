#!/bin/bash

#
# ---------------------------------------------|
#   Infrastructure Slicing v06                 |
#   Written by Jungsu Han                      |
# ---------------------------------------------|
#


IP=103.22.221.74
Port=35357



MYSQL_HOST="172.20.90.167"
MYSQL_PASS="fn!xo!ska!"



# Indentification
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







sql=$(mysql -u root -h $MYSQL_HOST --password=$MYSQL_PASS -e "use Slicing_Management; select count(*) from Slicing where tenant_ID='$User_ID';")

#echo $sql

count=`echo $sql | awk '{print $2}'`


# find value
sql=$(mysql -u root -h $MYSQL_HOST --password=$MYSQL_PASS -e "use Slicing_Management; select * from Slicing where tenant_ID='$User_ID';" | column -t | sed 1d )




# Make Json format
json=""

json=`echo "$json ["`


for ((i=0;i<$count;i++)); do

    for ((j=1;j<5;j++)); do

      if [ "$j" == "1" ]; then
        let num=$i*4+$j
        cmd=`echo $sql | awk '{print $'$num'}'`
        json=`echo $json '{"Slicing_ID": "'$cmd'", '`
      elif [ "$j" == "2" ]; then
        let num=$i*4+$j
        cmd=`echo $sql | awk '{print $'$num'}'`
        json=`echo $json '"Tenant_ID": "'$cmd'", '`
      elif [ "$j" == "3" ]; then
        let num=$i*4+$j
        cmd=`echo $sql | awk '{print $'$num'}'`
        json=`echo $json '"Authority": "'$cmd'", '`
      else
        let num=$i*4+$j
        cmd=`echo $sql | awk '{print $'$num'}'`
        json=`echo $json '"VLAN_ID": "'$cmd'"}'`
        let finish=$i+1
        if [ "$finish" != "$count" ]; then
          json=`echo $json','`
        fi        

      fi
    done

done

json=`echo "$json ]"`


echo $json

