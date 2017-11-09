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
DB_IP=1.1.1.1
DB_PW=pass


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


################################# Slicing Pool

# Find available Slicing pool list

Slicing=`cat slicing_pool | grep none | awk '{print $1}' | sed -n 1p`


# IF slicing pool is not available, halt the script
if [ "$Slicing" == "" ]; then
   echo "Slicing ID is not available"
   exit 1
fi
#echo Slciing ID is $Slicing


# Calculateing Row

Row=`expr $Slicing - 950`
#echo Row is $Row


# Edit the Slicing pool
sed -i "$Row"s/none/used/ slicing_pool


###################### Create DB

#Default SDN Controller Authority
Authority="high"

# Add DB
cat << EOF | mysql -h $DB_IP -uroot -p$DB_PW
use Slicing_Management;
INSERT INTO Slicing  VALUES ('$Slicing', '$ID', '$Authority', '$Slicing');
quit
EOF


echo "Slicing has been created"
echo
echo "Slicing id: $Slicing"
echo


