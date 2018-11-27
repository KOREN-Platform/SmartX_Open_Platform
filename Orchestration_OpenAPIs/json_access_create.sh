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



MAC_IP=$1
Slicing_ID=$2
LOCATION=$3
# location = {GJ, KN, JJ, JNU, KU}


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

DB_HOST=$(get_config_value configuration/init.ini database MySQL_HOST)
DB_PASS=$(get_config_value configuration/init.ini database MySQL_PASS)


if [ "$LOCATION" == "GJ" ]; then


	# find Edge between new node (KOREN-GJ_S)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-GJ_S\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"


        if [ "$lineNum" == "" ]; then
        	# finde edge line number
	        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
	
		# create Edge (KOREN - Type S GJ)
		sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KOREN-GJ_S\", \"from\":\"10\", \"to\":\"2\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi


        # find Edge between new node (GJ_S-GJ_O)
	lineNum="$(grep -n "\"id\":\"$Slicing_ID-GJ_S-GJ_O\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"


	if [ "$lineNum" == "" ]; then
		# finde edge line number
                lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

		# create Edge (Type S GJ - Type O GJ)
                sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-GJ_S-GJ_O\", \"from\":\"3\", \"to\":\"2\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi

	
	# create node
	lineNum="$(grep -n "\"id\":\"10\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        # add new node (Type O GJ)
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-$MAC_IP\", \"label\":\"$MAC_IP\", \"color\":\"rgb(255,217,250)\"}" api/slices/static/test.json

        # add new edge (Type O GJ - New node)
        # find line number
        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-GJ_O-$MAC_IP\", \"from\":\"$Slicing_ID-$MAC_IP\", \"to\":\"3\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json

elif [ "$LOCATION" == "KN" ]; then

        # find Edge between new node (KOREN - Type S KN)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-KN_S\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        if [ "$lineNum" == "" ]; then
		lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
		# create Edge (KOREN - Type S GJ)
                sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KOREN-KN_S\", \"from\":\"10\", \"to\":\"5\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi


        # find Edge between new node (KN_S-KN_O)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KN_S-KN_O\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        if [ "$lineNum" == "" ]; then
		# finde edge line number
                lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

		# create Edge (Type S GJ - Type O GJ)
                sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KN_S-KN_O\", \"from\":\"6\", \"to\":\"5\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi


        # create node
        lineNum="$(grep -n "\"id\":\"10\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        # add new node (Type O GJ)
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-$MAC_IP\", \"label\":\"$MAC_IP\", \"color\":\"rgb(255,217,250)\"}" api/slices/static/test.json

        # add new edge (Type O KN - New node)
        # find line number
        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KN_O-$MAC_IP\", \"from\":\"$Slicing_ID-$MAC_IP\", \"to\":\"6\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json


elif [ "$LOCATION" == "JJ" ]; then

        # find Edge between new node (GJ_S-JJ_O)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-JJ_O\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"


        if [ "$lineNum" == "" ]; then
		# finde edge line number
	        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

		# create Edge (KOREN - Type O JJ)
                sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KOREN-JJ_O\", \"from\":\"10\", \"to\":\"7\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi


        # create node
        lineNum="$(grep -n "\"id\":\"10\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        # add new node (Type O JJ)
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-$MAC_IP\", \"label\":\"$MAC_IP\", \"color\":\"rgb(255,217,250)\"}" api/slices/static/test.json

        # add new edge (Type O JJ - New node)
        # find line number
        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-JJ_O-$MAC_IP\", \"from\":\"$Slicing_ID-$MAC_IP\", \"to\":\"7\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json


elif [ "$LOCATION" == "JNU" ]; then

	# find Edge between new node (KOREN-JNU_O)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-JNU_O\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        if [ "$lineNum" == "" ]; then
		 # finde edge line number
	        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

		# create Edge (KOREN - Type O JNU)
                sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KOREN-JNU_O\", \"from\":\"10\", \"to\":\"8\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi


        # create node
        lineNum="$(grep -n "\"id\":\"10\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        # add new node (Type O JNU)
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-$MAC_IP\", \"label\":\"$MAC_IP\", \"color\":\"rgb(255,217,250)\"}" api/slices/static/test.json

        # add new edge (Type O JNU - New node)
        # find line number
        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-JNU_O-$MAC_IP\", \"from\":\"$Slicing_ID-$MAC_IP\", \"to\":\"8\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json



elif [ "$LOCATION" == "KU" ]; then

	# find Edge between new node (KOREN-KU_O)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-KU_O\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

	# check KOREN - Type O KU edge
        sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select * from IoT where Slicing_ID='$Slicing_ID' and location='KU';")

        if [ "$lineNum" == "" ]; then
		# finde edge line number
	        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

		# create Edge (KOREN - Type O KU)
                sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KOREN-KU_O\", \"from\":\"10\", \"to\":\"9\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi


        # create node
        lineNum="$(grep -n "\"id\":\"10\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        # add new node (Type O KU)
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-$MAC_IP\", \"label\":\"$MAC_IP\", \"color\":\"rgb(255,217,250)\"}" api/slices/static/test.json

        # add new edge (Type O KU - New node)
        # find line number
        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
	sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KU_O-$MAC_IP\", \"from\":\"$Slicing_ID-$MAC_IP\", \"to\":\"9\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json

fi



