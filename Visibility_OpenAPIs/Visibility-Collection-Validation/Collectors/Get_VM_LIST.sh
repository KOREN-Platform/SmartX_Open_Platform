#!/bin/bash
#
# Copyright 2016 SmartX Collaboration (GIST NetCS). All rights reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#
# Name          : Get_VM_Box.sh
# Description   : Script for Getting VM's/Box
#
# Created by    : usman@smartx.kr
# Version       : 0.1
# Last Update   : September, 2017

#Source the Admin File
#. /home/netcs/overcloud-provisioning/deployment/admin-openrc.sh
. /home/netcs/box-openstack-installation/ocata/admin-openrc.sh

openstack  server list --all-projects --long > /opt/InstanceList
#nova list --host KU-C1 --all-tenants > /opt/InstanceList/Box1VMs.list
#nova list --host KN-C1 --all-tenants > /opt/InstanceList/Box2VMs.list
#nova list --host JJ-C1 --all-tenatns > /opt/InstanceList/Box3VMs.list
#nova list --host GJ-C1 --all-tenants > /opt/InstanceList/Box4VMs.list


