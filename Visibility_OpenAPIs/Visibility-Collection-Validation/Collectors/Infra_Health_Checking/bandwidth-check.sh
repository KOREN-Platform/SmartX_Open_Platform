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
# Name			: bandwidth-check.sh
# Description	: Script for playground bandwidth checking.
#
# Created by    : Muhammad Usman
# Version       : 0.1
# Last Update	: November, 2017

# Configuration Parameter
LOGDIR="log"
LOGRES="/home/netcs/infra_health_checking/result"

WAN_BOXES="GIST_S_1 KN_S_1 JJ_S_1"
#CLOUD_BOXES="GIST_C_1 KN_C_1 JJ_C_1"
CLOUD_BOXES=""
#ACCESS_BOXES="GIST_O_1 KN_O_1 JJ_O_1"
ACCESS_BOXES=""

if [ ! -f "$LOGRES/IPERF_TCP_RESULT_WAN_BOX.log" ]
then
	touch $LOGRES/IPERF_TCP_RESULT_WAN_BOX.log
	touch $LOGRES/IPERF_UDP_RESULT_WAN_BOX.log
	echo "$file found."
fi

if [ ! -f "$LOGRES/IPERF_TCP_RESULT_CLOUD_BOX.log" ]
then
	touch $LOGRES/IPERF_TCP_RESULT_CLOUD_BOX.log
	touch $LOGRES/IPERF_UDP_RESULT_CLOUD_BOX.log
	echo "$file found."
fi

if [ ! -f "$LOGRES/IPERF_TCP_RESULT_ACCESS_BOX.log" ]
then
	touch $LOGRES/IPERF_TCP_RESULT_ACCESS_BOX.log
	touch $LOGRES/IPERF_UDP_RESULT_ACCESS_BOX.log
	echo "$file found."
fi


#
# [1] Bandwidth Checking
#
function check_box_bandwidth {
        TIME=`date +%Y/%m/%d`
		echo -e "\n"
        echo -e "------------------------------------------------------------"
        echo -e "|               Start Iperf Test For SD-WAN (Boxes)           |"
        echo -e "------------------------------------------------------------"
		
		for FROM_BOX in $WAN_BOXES
        do
			PING_RESULT1=`ping $FROM_BOX -c 2 -s 10 -W 5 | grep Unreachable`
			
			if [ "${PING_RESULT1:-null}" = null ]; then
				echo -e "-------------------------------------------------"
				echo -e "                $FROM_BOX is UP                  "  
				echo -e "     Start Iperf Server at Box $FROM_BOX         "
				echo -e "-------------------------------------------------"
				ssh visibility@$FROM_BOX 'iperf3 -s -D'&
				
				for TO_BOX in $WAN_BOXES
				do
					if [ $TO_BOX != $FROM_BOX ]; then
						PING_RESULT2=`ping $TO_BOX -c 2 -s 10 -W 5 | grep Unreachable`
				
						if [ "${PING_RESULT2:-null}" = null ]; then
							echo -e " $TO_BOX is UP"
							echo -e " Start Iperf TCP Client at Box $TO_BOX             "
							RESULT1=`ssh visibility@$TO_BOX "iperf3 -c Data_$FROM_BOX -i 3 -t 12 -l 1M -O 6 -4 -N" | grep -A 1 "sender" | awk '{print $7" "$8}'` 
							RESULT1=`echo $RESULT1 | sed 'N;s/\n/ /'`
							
							echo -e "$TIME $FROM_BOX $TO_BOX TCP $RESULT1" >>  $LOGRES/IPERF_TCP_RESULT_WAN_BOX.log
							echo "$TIME $FROM_BOX $TO_BOX TCP $RESULT1" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-s-bandwidth-tcp
				
							#echo -e  | sed "s/^/$TIME $FROM_BOX $TO_BOX TCP /" >>  $LOGRES/IPERF_TCP_RESULT_WAN_BOX.log
							
							echo -e " Start Iperf UDP Client at Box $TO_BOX             "
							RESULT2=`ssh visibility@$TO_BOX "iperf3 -c Data_$FROM_BOX -u -i 2 -t 10 -b 20M " | grep "0.00-10.00" | awk '{print $7" "$8" "$9" "$11" "$12}'`
							
							echo  -e "$TIME $FROM_BOX $TO_BOX UDP $RESULT2" >> $LOGRES/IPERF_UDP_RESULT_WAN_BOX.log
							echo "$TIME $FROM_BOX $TO_BOX UDP $RESULT2" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-s-bandwidth-udp
						else
							echo -e " $TO_BOX is DOWN"
							echo -e "$TIME $FROM_BOX $TO_BOX TCP -2 Mbits/sec -2 Mbits/sec" >>  $LOGRES/IPERF_TCP_RESULT_WAN_BOX.log
							echo -e "$TIME $FROM_BOX $TO_BOX UDP -2 Mbits/sec -2 -2" >>  $LOGRES/IPERF_UDP_RESULT_WAN_BOX.log
							
							echo "$TIME $FROM_BOX $TO_BOX TCP -2 Mbits/sec -2 Mbits/sec" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-s-bandwidth-tcp
							echo "$TIME $FROM_BOX $TO_BOX UDP -2 Mbits/sec -2 -2" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-s-bandwidth-udp
						fi
					fi						
				done
			
				echo " Terminate iperf Server on the $FROM_BOX"
				ssh visibility@$FROM_BOX 'killall -r -s KILL iperf3'
			else
				echo -e "$FROM_BOX is DOWN"
				TO_BOX='UNKNOWN'
				echo -e "$TIME $FROM_BOX $TO_BOX TCP -1 Mbits/sec -1 Mbits/sec" >>  $LOGRES/IPERF_TCP_RESULT_WAN_BOX.log
				echo -e "$TIME $FROM_BOX $TO_BOX UDP -1 Mbits/sec -1 -1" >>  $LOGRES/IPERF_UDP_RESULT_WAN_BOX.log
				echo "$TIME $FROM_BOX $TO_BOX TCP -1 Mbits/sec -1 Mbits/sec" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-s-bandwidth-tcp
				echo "$TIME $FROM_BOX $TO_BOX UDP -1 Mbits/sec -1 -1" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-s-bandwidth-udp
			fi
		done
		
		echo -e "\n"
        echo -e "------------------------------------------------------------"
        echo -e "|               Start Iperf Test For SD-Cloud (Boxes)           |"
        echo -e "------------------------------------------------------------"
		
		for FROM_BOX in $CLOUD_BOXES
        do
			PING_RESULT1=`ping $FROM_BOX -c 2 -s 10 -W 5 | grep Unreachable`
			
			if [ "${PING_RESULT1:-null}" = null ]; then
				echo -e "-------------------------------------------------"
				echo -e "                $FROM_BOX is UP                  "  
				echo -e "     Start Iperf Server at Box $FROM_BOX         "
				echo -e "-------------------------------------------------"
				ssh visibility@$FROM_BOX 'iperf3 -s -D'&
				
				for TO_BOX in $CLOUD_BOXES
				do
					if [ $TO_BOX != $FROM_BOX ]; then
						PING_RESULT2=`ping $TO_BOX -c 2 -s 10 -W 5 | grep Unreachable`
				
						if [ "${PING_RESULT2:-null}" = null ]; then
							echo -e " $TO_BOX is UP"
							echo -e " Start Iperf TCP Client at Box $TO_BOX             "
							RESULT1=`ssh visibility@$TO_BOX "iperf3 -c Data_$FROM_BOX -i 3 -t 12 -l 1M -O 6 -4 -N" | grep -A 1 "sender" | awk '{print $7" "$8}'` 
							RESULT1=`echo $RESULT1 | sed 'N;s/\n/ /'`
							
							echo -e "$TIME $FROM_BOX $TO_BOX TCP $RESULT1"
							echo -e "$TIME $FROM_BOX $TO_BOX TCP $RESULT1" >>  $LOGRES/IPERF_TCP_RESULT_CLOUD_BOX.log
							echo "$TIME $FROM_BOX $TO_BOX TCP $RESULT1" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-c-bandwidth-tcp
							
							echo -e " Start Iperf UDP Client at Box $TO_BOX             "
							RESULT2=`ssh visibility@$TO_BOX "iperf3 -c Data_$FROM_BOX -u -i 2 -t 10 -b 20M " | grep "0.00-10.00" | awk '{print $7" "$8" "$9" "$11" "$12}'`
							echo  -e "$TIME $FROM_BOX $TO_BOX UDP $RESULT2" >> $LOGRES/IPERF_UDP_RESULT_CLOUD_BOX.log
							echo "$TIME $FROM_BOX $TO_BOX UDP $RESULT2" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-c-bandwidth-udp
						else
							echo -e " $TO_BOX is DOWN"
							echo -e "$TIME $FROM_BOX $TO_BOX TCP -2 Mbits/sec -2 Mbits/sec" >>  $LOGRES/IPERF_TCP_RESULT_CLOUD_BOX.log
							echo -e "$TIME $FROM_BOX $TO_BOX UDP -2 Mbits/sec -2 -2" >>  $LOGRES/IPERF_UDP_RESULT_CLOUD_BOX.log
							
							echo "$TIME $FROM_BOX $TO_BOX TCP -2 Mbits/sec -2 Mbits/sec" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-c-bandwidth-tcp
							echo "$TIME $FROM_BOX $TO_BOX UDP -2 Mbits/sec -2 -2" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-c-bandwidth-udp

						fi
					fi						
				done
			
				echo " Terminate iperf Server on the $FROM_BOX"
				ssh visibility@$FROM_BOX 'killall -r -s KILL iperf3'
			else
			echo -n "DOWN" >> $LOG 
				echo -e "$FROM_BOX is DOWN"
				TO_BOX='UNKNOWN'
				echo -e "$TIME $FROM_BOX $TO_BOX TCP -1 Mbits/sec -1 Mbits/sec" >>  $LOGRES/IPERF_TCP_RESULT_CLOUD_BOX.log
				echo -e "$TIME $FROM_BOX $TO_BOX UDP -1 Mbits/sec -1 -1" >>  $LOGRES/IPERF_UDP_RESULT_CLOUD_BOX.log
				echo "$TIME $FROM_BOX $TO_BOX TCP -1 Mbits/sec -1 Mbits/sec" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-c-bandwidth-tcp
				echo "$TIME $FROM_BOX $TO_BOX UDP -1 Mbits/sec -1 -1" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-c-bandwidth-udp
			fi
		done
		
		echo -e "\n"
        echo -e "------------------------------------------------------------"
        echo -e "|               Start Iperf Test For SD-ACCESS (Boxes)           |"
        echo -e "------------------------------------------------------------"
		
		for FROM_BOX in $ACCESS_BOXES
        do
			PING_RESULT1=`ping $FROM_BOX -c 2 -s 10 -W 5 | grep Unreachable`
			
			if [ "${PING_RESULT1:-null}" = null ]; then
				echo -e "-------------------------------------------------"
				echo -e "                $FROM_BOX is UP                  "  
				echo -e "     Start Iperf Server at Box $FROM_BOX         "
				echo -e "-------------------------------------------------"
				ssh visibility@$FROM_BOX 'iperf3 -s -D'&
				
				for TO_BOX in $ACCESS_BOXES
				do
					if [ $TO_BOX != $FROM_BOX ]; then
						PING_RESULT2=`ping $TO_BOX -c 2 -s 10 -W 5 | grep Unreachable`
				
						if [ "${PING_RESULT2:-null}" = null ]; then
							echo -e " $TO_BOX is UP"
							echo -e " Start Iperf TCP Client at Box $TO_BOX             "
							
							RESULT1=`ssh visibility@$TO_BOX "iperf3 -c Data_$FROM_BOX -i 3 -t 12 -l 1M -O 6 -4 -N" | grep -A 1 "sender" | awk '{print $7" "$8}'` 
							RESULT1=`echo $RESULT1 | sed 'N;s/\n/ /'`
							
							echo -e "$TIME $FROM_BOX $TO_BOX TCP $RESULT1"
							echo -e "$TIME $FROM_BOX $TO_BOX TCP $RESULT1" >>  $LOGRES/IPERF_TCP_RESULT_ACCESS_BOX.log
							echo "$TIME $FROM_BOX $TO_BOX TCP $RESULT1" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-o-bandwidth-tcp
							
							echo -e " Start Iperf UDP Client at Box $TO_BOX             "
							RESULT2=`ssh visibility@$TO_BOX "iperf3 -c Data_$FROM_BOX -u -i 2 -t 10 -b 20M " | grep "0.00-10.00" | awk '{print $7" "$8" "$9" "$11" "$12}'`
							echo  -e "$TIME $FROM_BOX $TO_BOX UDP $RESULT2" >> $LOGRES/IPERF_UDP_RESULT_ACCESS_BOX.log
							echo "$TIME $FROM_BOX $TO_BOX UDP $RESULT2" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-o-bandwidth-udp
						else
							echo -e " $TO_BOX is DOWN"
							echo -e "$TIME $FROM_BOX $TO_BOX TCP -2 Mbits/sec -2 Mbits/sec" >>  $LOGRES/IPERF_TCP_RESULT_ACCESS_BOX.log
							echo -e "$TIME $FROM_BOX $TO_BOX UDP -2 Mbits/sec -2 -2" >>  $LOGRES/IPERF_UDP_RESULT_ACCESS_BOX.log
							
							echo "$TIME $FROM_BOX $TO_BOX TCP -2 Mbits/sec -2 Mbits/sec" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-o-bandwidth-tcp
							echo "$TIME $FROM_BOX $TO_BOX UDP -2 Mbits/sec -2 -2" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-o-bandwidth-udp
						fi
					fi						
				done
			
				echo " Terminate iperf Server on the $FROM_BOX"
				ssh visibility@$FROM_BOX 'killall -r -s KILL iperf3'
			else
			echo -n "DOWN" >> $LOG 
				echo -e "$FROM_BOX is DOWN"
				TO_BOX='UNKNOWN'
				echo -e "$TIME $FROM_BOX $TO_BOX TCP -1 Mbits/sec -1 Mbits/sec" >>  $LOGRES/IPERF_TCP_RESULT_ACCESS_BOX.log
				echo -e "$TIME $FROM_BOX $TO_BOX UDP -1 Mbits/sec -1 -1" >>  $LOGRES/IPERF_UDP_RESULT_ACCESS_BOX.log
				echo "$TIME $FROM_BOX $TO_BOX TCP -1 Mbits/sec -1 Mbits/sec" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-o-bandwidth-tcp
				echo "$TIME $FROM_BOX $TO_BOX UDP -1 Mbits/sec -1 -1" | /opt/KONE-MultiView/MultiView-Dependencies/kafka_2.10-0.10.2.0/bin/kafka-console-producer.sh --broker-list vc.manage.overcloud:9092 --topic koren-o-bandwidth-udp
			fi
		done
        
        echo -e "Iperf is done...\n"
}

#
# Main Script
#

echo -e "\n"
echo -e "#######################################################"
echo -e "#       Checking Playground Resources Bandwidth       #"
echo -e "#######################################################"

check_box_bandwidth

echo -e "Checking Playground Resources Bandwidth is Completed.\n"
echo -e "\n"
