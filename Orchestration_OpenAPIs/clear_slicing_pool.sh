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

# Clear Slicing_list

sed -i "s/used/none/g" slicing_pool



