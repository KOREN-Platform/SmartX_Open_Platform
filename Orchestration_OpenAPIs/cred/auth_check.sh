#!/bin/bash


#
# ---------------------------------------------|
#   Infrastructure Slicing v01                 |
#   Written by Jungsu Han                      |
# ---------------------------------------------|
#


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

IP=$(get_config_value ../configuration/init.ini controller OpenStack_keystone)
Port=$(get_config_value ../configuration/init.ini controller OpenStack_Port)




if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

User_ID=$1
Password=$2


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
   echo "False"
else
   echo "True"
fi



