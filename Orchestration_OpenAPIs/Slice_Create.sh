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


IP=100.100.100.100
Port=35357
DB_HOST=100.100.100.100
DB_PASS="pass"


echo -n "Input your ID: "
read ID
echo -n "Input your Password: "
stty -echo
read Password
echo ""
stty echo




#ID="demo"
#Password="pass"



#source 
export OS_PROJECT_DOMAIN_NAME=default
export OS_USER_DOMAIN_NAME=default
export OS_PROJECT_NAME=$ID
export OS_USERNAME=$ID
export OS_PASSWORD=$Password
export OS_AUTH_URL=http://$IP:$Port/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2

#openstack token issue > temp

Output=`openstack token issue`

#echo "check is $Output"

if [ "$Output" == "" ]; then
   echo "Authentication Failed"
   exit 1
fi



##### Assigning Slicing  ID
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


echo "Slicing has been created"
echo
echo "Slicing id: $vlan"
echo


