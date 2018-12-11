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
# Name			: management-plane-check.sh
# Description	: Script for Box health checking.
#
# Created by    : Muhammad Usman
# Version       : 0.1
# Last Update	: November, 2017

BOXES="GIST_S_1 GIST_C_1 GIST_O_1 JJ_S_1 JJ_C_1 JJ_O_1 KN_S_1 KN_C_1 KN_O_1"
LOG="/home/netcs/infra_health_checking/result/ping.log"
TIME=`date`
RESULT="$TIME"

echo -n $TIME >> $LOG

for box in $BOXES
do
echo -n "," >> $LOG
PING_RESULT=`ping $box -c 2 -s 10 -W 5 | grep Unreachable`
		#RESULT="$RESULT,"
		#echo "$box$RESULT"
        if [ "${PING_RESULT:-null}" = null ]; then
            echo -n "UP" >> $LOG 
			#RESULT="UP"
			RESULT="$RESULT,$box:UP"
        else
		echo -n "DOWN" >> $LOG 
			#RESULT="DOWN"
			RESULT="$RESULT,$box:DOWN"
        fi
done
echo "" >> $LOG 
echo $RESULT
echo $RESULT | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-mgmt-checking


