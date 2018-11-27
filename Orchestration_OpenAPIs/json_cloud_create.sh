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



Instance_IP=$1
Slicing_ID=$2
REGION=$3
# REGION = {KR-GISTC, KR-KNC}

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


if [ "$REGION" == "KR-GISTC" ]; then
	
	# find Edge between new node (GJ_S-GJ_C)
	lineNum="$(grep -n "\"id\":\"$Slicing_ID-GJ_S-GJ_C\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

	if [ "$lineNum" == "" ]; then
		# find edge line
		lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
		# create edge
		sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-GJ_S-GJ_C\", \"from\":\"1\", \"to\":\"2\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json

	fi


	# find Edge (KOREN-GJ_S)
	lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-GJ_S\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

	if [ "$lineNum" == "" ]; then
                # find edge line
                lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
                # create edge
		sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KOREN-GJ_S\", \"from\":\"10\", \"to\":\"2\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi


	# add new Node (GIST)
	lineNum="$(grep -n "\"id\":\"10\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-$Instance_IP\", \"label\":\"$Instance_IP\", \"color\":\"rgb(166,166,166)\"}" api/slices/static/test.json

        # add new edge (VM to GJ_C)
        # find line number
        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-GJ_C-$Instance_IP\", \"from\":\"$Slicing_ID-$Instance_IP\", \"to\":\"1\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json

elif [ "$REGION" == "KR-KNC" ]; then

	# find Edge between new node (KN_S-KN_C)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KN_S-KN_C\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        if [ "$lineNum" == "" ]; then
                # find edge line
                lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
                # create edge
                sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KN_S-KN_C\", \"from\":\"4\", \"to\":\"5\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json

        fi

	 # find Edge (KOREN-KN_S)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-KN_S\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        if [ "$lineNum" == "" ]; then
                # find edge line
                lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
                # create edge
                sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KOREN-KN_S\", \"from\":\"10\", \"to\":\"5\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json
        fi


	# add ne Node (KN)
	lineNum="$(grep -n "\"id\":\"10\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-$Instance_IP\", \"label\":\"$Instance_IP\", \"color\":\"rgb(166,166,166)\"}" api/slices/static/test.json

        # add new edge (VM to KN_C)
        # find line number
        lineNum="$(grep -n "\"from\":\"5\", \"to\":\"6\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
        sed -i "$lineNum a\\,{\"id\":\"$Slicing_ID-KN_C-$Instance_IP\", \"from\":\"$Slicing_ID-$Instance_IP\", \"to\":\"4\", \"label\":\"$Slicing_ID\", \"color\":{\"color\":\"red\"}}" api/slices/static/test.json



fi



