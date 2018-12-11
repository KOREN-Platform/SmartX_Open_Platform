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

# find Edge between new node 
lineNum="$(grep -n "\"from\":\"$Slicing_ID-$Instance_IP\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

if [ "$lineNum" != "" ]; then
	# delete edge
	sed -i "$lineNum"d api/slices/static/test.json
fi

# find Node 
lineNum="$(grep -n "\"id\":\"$Slicing_ID-$Instance_IP\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

if [ "$lineNum" != "" ]; then
	# delete node
	sed -i "$lineNum"d api/slices/static/test.json
fi



if [ "$REGION" == "KR-GISTC" ]; then

	# Type S - Type C edge

	# find Edge between new node (GJ_S-GJ_C)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-GJ_C-" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

	if [ "$lineNum" == "" ]; then
		#delete edge (GJ_S-GJ_C)
		lineNum="$(grep -n "\"id\":\"$Slicing_ID-GJ_S-GJ_C\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
		# delete edge
		sed -i "$lineNum"d api/slices/static/test.json
	fi

	# KOREN - Type S edge

	# find Edge between new node (GJ_S-GJ_C)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-GJ_C-" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

	if [ "$lineNum" == "" ]; then

		# find Edge between new node (GJ_O-New node)
	        lineNum="$(grep -n "\"id\":\"$Slicing_ID-GJ_O-" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

		if [ "$lineNum" == "" ]; then
			# delete edge (KOREN-GJ_S)
			lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-GJ_S\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
                	# delete edge
                	sed -i "$lineNum"d api/slices/static/test.json
		fi
	fi
elif [ "$REGION" == "KR-KNC" ]; then

	# Type S - Type C edge

        # find Edge between new node (KN-C- new node)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KN_C-" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        if [ "$lineNum" == "" ]; then
                #delete edge (KN_S-KN_C)
                lineNum="$(grep -n "\"id\":\"$Slicing_ID-KN_S-KN_C\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
                # delete edge
                sed -i "$lineNum"d api/slices/static/test.json
        fi

        # KOREN - Type S edge

        # find Edge between new node (GJ_S-GJ_C)
        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KN_C-" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

        if [ "$lineNum" == "" ]; then

                # find Edge between new node (GJ_O-New node)
                lineNum="$(grep -n "\"id\":\"$Slicing_ID-KN_O-" api/slices/static/test.json | head -n 1 | cut -d: -f1)"

                if [ "$lineNum" == "" ]; then
                        # delete edge (KOREN-GJ_S)
                        lineNum="$(grep -n "\"id\":\"$Slicing_ID-KOREN-KN_S\"" api/slices/static/test.json | head -n 1 | cut -d: -f1)"
                        # delete edge
                        sed -i "$lineNum"d api/slices/static/test.json
                fi
        fi

fi











