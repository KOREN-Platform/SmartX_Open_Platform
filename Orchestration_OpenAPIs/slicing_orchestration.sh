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

#######


User_ID=$1
Password=$2
Flavor=$3
Image=$4
IoT_IP=$5
IoT_MAC=$6


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


# Add DB Table
cat << EOF | mysql -h 172.20.90.167 -uroot -p$PASSWORD
use Slicing_Management;
INSERT INTO Slicing  VALUES ('$Slicing', '$User_ID', 'high', '$Slicing');
quit
EOF

# Execute Cloud Slicing
./cloud_slicing.sh $User_ID $Slicing $Flavor $Image



#source admin-openrc.sh

