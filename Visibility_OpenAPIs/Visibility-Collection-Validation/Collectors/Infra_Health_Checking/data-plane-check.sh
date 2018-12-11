#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#
# Name			: data-plane-check.sh
# Description	: Script for Box health checking.
#
# Created by    : Muhammad Usman
# Version       : 0.1
# Last Update	: November, 2017

# Configuration Parameter
LOGDIR="log"
LOGRES="/home/netcs/infra_health_checking/result"
#LOGFILE=experiment.check.`date +%Y%m%d.%H%M%S`.log
#B_SITES="MYREN MY TH PKS ID PH VN TEST GIST TW IN"

WAN_BOXES="GIST_S_1 KN_S_1 JJ_S_1"
#CLOUD_BOXES="GIST_C_1 KN_C_1 JJ_C_1"
CLOUD_BOXES=""
#ACCESS_BOXES="GIST_O_1 KN_O_1 JJ_O_1"
ACCESS_BOXES=""

if [ ! -f "$LOGRES/PING_RESULT_WAN.log" ]
then
        touch $LOGRES/PING_RESULT_WAN.log
        #echo "$file found."
fi
#if [ ! -f "$LOGRES/PING_RESULT_CLOUD.log" ]
#then
#        touch $LOGRES/PING_RESULT_CLOUD.log
        #echo "$file found."
#fi
#if [ ! -f "$LOGRES/PING_RESULT_ACCESS.log" ]
#then
#        touch $LOGRES/PING_RESULT_ACCESS.log
        #echo "$file found."
#fi


#
# [1] Boxes Checking
#

function check_box {
	TIME=`date`
	echo -e "\n"
	echo -e "--------------------------------------------------"
	echo -e "|          Start SD-WAN (Box) Checking           |"
	echo -e "--------------------------------------------------"
	echo -e "\n"

	for FROM_BOX in $WAN_BOXES
	do
		echo -e "------------------------"
		echo -e "Checking for $FROM_BOX"
		echo -e "------------------------"
		
		for TO_BOX in $WAN_BOXES
		do
			#echo "FROM Box: $FROM_BOX, To Box: $TO_BOX"
			
			PING_RESULT=""
			if [ $TO_BOX != $FROM_BOX ]; then
				RESULT=`ssh visibility@$FROM_BOX 'ping 'Data_$TO_BOX' -c 1 | grep ttl'`
				if [ "${RESULT:-null}" = null ]; then
					#echo "Host $TO_BOX is not reachable from $FROM_BOX."
					PING_RESULT="$TIME,$FROM_BOX,$TO_BOX,DOWN"
				else
					#echo "Host $TO_BOX is reachable from $FROM_BOX."
					PING_RESULT="$TIME,$FROM_BOX,$TO_BOX,UP"
				fi
				echo $PING_RESULT
				echo $PING_RESULT >> $LOGRES/PING_RESULT_WAN.log
				echo $PING_RESULT | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-s-dataplane-checking
			fi
			
			#if [ -n "$PING_RESULT" ]; then
				
			#fi
		done
	done
	
	echo -e "\n"
	echo -e "--------------------------------------------------"
	echo -e "|          Start SD-Cloud (Box) Checking         |"
	echo -e "--------------------------------------------------"
	echo -e "\n"

	for FROM_BOX in $CLOUD_BOXES
	do
		echo -e "------------------------"
		echo -e "Checking for $FROM_BOX"
		echo -e "------------------------"
		
		for TO_BOX in $CLOUD_BOXES
		do
			PING_RESULT=""
			if [ $TO_BOX != $FROM_BOX ]; then
				RESULT=`ssh visibility@$FROM_BOX 'ping 'Data_$TO_BOX' -c 1 | grep ttl'`
				if [ "${RESULT:-null}" = null ]; then
					#echo "Host $TO_BOX is not reachable from $FROM_BOX."
					PING_RESULT="$TIME,$FROM_BOX,$TO_BOX,DOWN"
				else
					#echo "Host $TO_BOX is reachable from $FROM_BOX."
					PING_RESULT="$TIME,$FROM_BOX,$TO_BOX,UP"
				fi
				echo $PING_RESULT
				echo $PING_RESULT >> $LOGRES/PING_RESULT_CLOUD.log
				echo $PING_RESULT | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-c-dataplane-checking
			fi
		done
	done
	
	echo -e "\n"
	echo -e "--------------------------------------------------"
	echo -e "|          Start SD-Access (Box) Checking         |"
	echo -e "--------------------------------------------------"
	echo -e "\n"
	for FROM_BOX in $ACCESS_BOXES
	do
		echo -e "------------------------"
		echo -e "Checking for $FROM_BOX"
		echo -e "------------------------"
		
		for TO_BOX in $ACCESS_BOXES
		do
			PING_RESULT=""
			if [ $TO_BOX != $FROM_BOX ]; then
				RESULT=`ssh visibility@$FROM_BOX 'ping 'Data_$TO_BOX' -c 1 | grep ttl'`
				if [ "${RESULT:-null}" = null ]; then
					#echo "Host $TO_BOX is not reachable from $FROM_BOX."
					PING_RESULT="$TIME,$FROM_BOX,$TO_BOX,DOWN"
				else
					#echo "Host $TO_BOX is reachable from $FROM_BOX."
					PING_RESULT="$TIME,$FROM_BOX,$TO_BOX,UP"
				fi
				echo $PING_RESULT
				echo $PING_RESULT >> $LOGRES/PING_RESULT_ACCESS.log
				echo $PING_RESULT | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-o-dataplane-checking
			fi
		done
	done
	
	#echo -e $GIST_PING_RESULT
#	echo $GIST_PING_RESULT >> $LOGRES/PING_RESULT_GIST.log
#	echo $MYREN_PING_RESULT >> $LOGRES/PING_RESULT_MYREN.log
#	echo $TEST_PING_RESULT >> $LOGRES/PING_RESULT_TEST.log
    echo -e "Box Checking is completed...\n"
}



#
# Main Script
#

echo -e "\n"
echo -e "#######################################################"
echo -e "# Checking Playground Resources for Health Monitoring #"
echo -e "#######################################################"

check_box

echo -e "Checking Playground Resources is Completed.\n"
echo -e "\n"
