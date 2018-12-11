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
# Name			: dailymail_report.sh
# Description	: Script for Box health check Report Generation.
#
# Created by    : Muhammad Usman
# Version       : 0.1
# Last Update	: November, 2017

LOGDIR="/home/netcs/infra_health_checking/result"

if [ -f "$LOGDIR/result.html" ]
then
        rm $LOGDIR/result.html
        echo "$file found."
fi

cd /home/netcs/infra_health_checking/result/
cat /home/netcs/infra_health_checking/result/ping.log | tail -n 288 > /home/netcs/infra_health_checking/result/log.txt

total=$(cat log.txt | wc -l) 
echo "total entries are : $total"

############################### GIST S Box ###############################
GIST_S_Box=$(cat log.txt | cut -d , -f 2 | grep DOWN | wc -l)
echo "GIST S Box down entries : $GIST_S_Box"
ans1=$((total - GIST_S_Box ))
#frac_perc1=$(echo "scale=2; $GIST_S_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
GIST_S_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
GIST_S_Box_down_time=$(echo "scale=0; $GIST_S_Box * 5" | bc)
echo "GIST_S_Box was up for $GIST_S_Box_up_perc % of the time/day"
echo "GIST_S_Box was down for $GIST_S_Box_down_time minutes/day"

############################### GIST C Box ###############################
GIST_C_Box=$(cat log.txt | cut -d , -f 3 | grep DOWN | wc -l)
echo "GIST C Box down entries : $GIST_C_Box"
ans1=$((total - GIST_C_Box ))
#frac_perc1=$(echo "scale=2; $GIST_S_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
GIST_C_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
GIST_C_Box_down_time=$(echo "scale=0; $GIST_C_Box * 5" | bc)
echo "GIST_C_Box was up for $GIST_C_Box_up_perc % of the time/day"
echo "GIST_C_Box was down for $GIST_C_Box_down_time minutes/day"

############################### GIST O Box ###############################
GIST_O_Box=$(cat log.txt | cut -d , -f 4 | grep DOWN | wc -l)
echo "GIST O Box down entries : $GIST_O_Box"
ans1=$((total - GIST_O_Box ))
#frac_perc1=$(echo "scale=2; $GIST_O_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
GIST_O_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
GIST_O_Box_down_time=$(echo "scale=0; $GIST_O_Box * 5" | bc)
echo "GIST_O_Box was up for $GIST_O_Box_up_perc % of the time/day"
echo "GIST_O_Box was down for $GIST_O_Box_down_time minutes/day"

############################### JJ S Box ###############################
JJ_S_Box=$(cat log.txt | cut -d , -f 5 | grep DOWN | wc -l)
echo "JJ S Box down entries : $JJ_S_Box"
ans1=$((total - JJ_S_Box ))
#frac_perc1=$(echo "scale=2; $JJ_S_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
JJ_S_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
JJ_S_Box_down_time=$(echo "scale=0; $JJ_S_Box * 5" | bc)
echo "JJ_S_Box was up for $JJ_S_Box_up_perc % of the time/day"
echo "JJ_S_Box was down for $JJ_S_Box_down_time minutes/day"

############################### JJ C Box ###############################
JJ_C_Box=$(cat log.txt | cut -d , -f 6 | grep DOWN | wc -l)
echo "JJ C Box down entries : $JJ_C_Box"
ans1=$((total - JJ_C_Box ))
#frac_perc1=$(echo "scale=2; $JJ_S_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
JJ_C_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
JJ_C_Box_down_time=$(echo "scale=0; $JJ_C_Box * 5" | bc)
echo "JJ_C_Box was up for $JJ_C_Box_up_perc % of the time/day"
echo "JJ_C_Box was down for $JJ_C_Box_down_time minutes/day"

############################### JJ O Box ###############################
JJ_O_Box=$(cat log.txt | cut -d , -f 7 | grep DOWN | wc -l)
echo "JJ O Box down entries : $JJ_O_Box"
ans1=$((total - JJ_O_Box ))
#frac_perc1=$(echo "scale=2; $JJ_O_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
JJ_O_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
JJ_O_Box_down_time=$(echo "scale=0; $JJ_O_Box * 5" | bc)
echo "JJ_O_Box was up for $JJ_O_Box_up_perc % of the time/day"
echo "JJ_O_Box was down for $JJ_O_Box_down_time minutes/day"

############################### KN S Box ###############################
KN_S_Box=$(cat log.txt | cut -d , -f 8 | grep DOWN | wc -l)
echo "KN S Box down entries : $KN_S_Box"
ans1=$((total - KN_S_Box ))
#frac_perc1=$(echo "scale=2; $KN_S_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
KN_S_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
KN_S_Box_down_time=$(echo "scale=0; $KN_S_Box * 5" | bc)
echo "KN_S_Box was up for $KN_S_Box_up_perc % of the time/day"
echo "KN_S_Box was down for $KN_S_Box_down_time minutes/day"

############################### KN C Box ###############################
KN_C_Box=$(cat log.txt | cut -d , -f 9 | grep DOWN | wc -l)
echo "KN C Box down entries : $KN_C_Box"
ans1=$((total - KN_C_Box ))
#frac_perc1=$(echo "scale=2; $KN_C_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
KN_C_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
KN_C_Box_down_time=$(echo "scale=0; $KN_C_Box * 5" | bc)
echo "KN_C_Box was up for $KN_C_Box_up_perc % of the time/day"
echo "KN_C_Box was down for $KN_C_Box_down_time minutes/day"

############################### KN O Box ###############################
KN_O_Box=$(cat log.txt | cut -d , -f 10 | grep DOWN | wc -l)
echo "KN O Box down entries : $KN_O_Box"
ans1=$((total - KN_O_Box ))
#frac_perc1=$(echo "scale=2; $KN_O_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
KN_O_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
KN_O_Box_down_time=$(echo "scale=0; $KN_O_Box * 5" | bc)
echo "KN_O_Box was up for $KN_O_Box_up_perc % of the time/day"
echo "KN_O_Box was down for $KN_O_Box_down_time minutes/day"

#############################Data Plane Checking###########################
############################### SD-WAN Boxes ###############################
cat /home/netcs/infra_health_checking/result/PING_RESULT_WAN.log | tail -n 4320 > /home/netcs/infra_health_checking/result/wan_log.txt

total=$(cat wan_log.txt | wc -l) 
Entries_per_box=6
total=$((total/Entries_per_box)) 
echo "total entries are : $total"

############################### GIST S Box ###############################
GIST_S_to_KN_Box=$(cat /home/netcs/infra_health_checking/result/wan_log.txt | grep $(date +"%Y"),GIST_S_1 | grep KN_S_1 | grep DOWN | wc -l)
ans1=$((total - GIST_S_to_KN_Box ))
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
GIST_S_to_KN_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
GIST_S_to_KN_Box_down_time=$(echo "scale=0; $GIST_S_to_KN_Box * 2" | bc)

GIST_S_to_JJ_Box=$(cat /home/netcs/infra_health_checking/result/wan_log.txt | grep $(date +"%Y"),GIST_S_1 | grep JJ_S_1 | grep DOWN | wc -l)
ans1=$((total - GIST_S_to_JJ_Box ))
#frac_perc1=$(echo "scale=2; $GIST_S_Box/$total" | bc)
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
GIST_S_to_JJ_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
GIST_S_to_JJ_Box_down_time=$(echo "scale=0; $GIST_S_to_JJ_Box * 2" | bc)

############################### JJ S Box ###############################
JJ_S_to_GIST_Box=$(cat /home/netcs/infra_health_checking/result/wan_log.txt | grep $(date +"%Y"),JJ_S_1 | grep GIST_S_1 | grep DOWN | wc -l)
ans1=$((total - JJ_S_to_GIST_Box ))
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
JJ_S_to_GIST_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
JJ_S_to_GIST_Box_down_time=$(echo "scale=0; $JJ_S_to_GIST_Box * 2" | bc)

JJ_S_to_KN_Box=$(cat /home/netcs/infra_health_checking/result/wan_log.txt | grep $(date +"%Y"),JJ_S_1 | grep KN_S_1 | grep DOWN | wc -l)
ans1=$((total - JJ_S_to_KN_Box ))
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
JJ_S_to_KN_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
JJ_S_to_KN_Box_down_time=$(echo "scale=0; $JJ_S_to_KN_Box * 2" | bc)

############################### KN S Box ###############################
KN_S_to_GIST_Box=$(cat /home/netcs/infra_health_checking/result/wan_log.txt | grep $(date +"%Y"),KN_S_1 | grep GIST_S_1 | grep DOWN | wc -l)
ans1=$((total - KN_S_to_GIST_Box ))
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
KN_S_to_GIST_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
KN_S_to_GIST_Box_down_time=$(echo "scale=0; $KN_S_to_GIST_Box * 2" | bc)

KN_S_to_JJ_Box=$(cat /home/netcs/infra_health_checking/result/wan_log.txt | grep $(date +"%Y"),KN_S_1 | grep JJ_S_1 | grep DOWN | wc -l)
ans1=$((total - KN_S_to_JJ_Box ))
frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
KN_S_to_JJ_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
KN_S_to_JJ_Box_down_time=$(echo "scale=0; $KN_S_to_JJ_Box * 2" | bc)

############################### SD-Cloud Boxes ###############################
#cat /home/netcs/infra_health_checking/result/PING_RESULT_CLOUD.log | tail -n 4320 > /home/netcs/infra_health_checking/result/cloud_log.txt

#total=$(cat cloud_log.txt | wc -l) 
#Entries_per_box=6
#total=$((total/Entries_per_box)) 
#echo "total entries are : $total"

############################### GIST C Box ###############################
#GIST_C_to_KN_Box=$(cat /home/netcs/infra_health_checking/result/cloud_log.txt | grep $(date +"%Y"),GIST_C_1 | grep KN_C_1 | grep DOWN | wc -l)
#ans1=$((total - GIST_C_to_KN_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#GIST_C_to_KN_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#GIST_C_to_KN_Box_down_time=$(echo "scale=0; $GIST_C_to_KN_Box * 2" | bc)

#GIST_C_to_JJ_Box=$(cat /home/netcs/infra_health_checking/result/cloud_log.txt | grep $(date +"%Y"),GIST_C_1 | grep JJ_C_1 | grep DOWN | wc -l)
#ans1=$((total - GIST_C_to_JJ_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#GIST_C_to_JJ_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#GIST_C_to_JJ_Box_down_time=$(echo "scale=0; $GIST_C_to_JJ_Box * 2" | bc)

############################### JJ C Box ###############################
#JJ_C_to_GIST_Box=$(cat /home/netcs/infra_health_checking/result/cloud_log.txt | grep $(date +"%Y"),JJ_C_1 | grep GIST_C_1 | grep DOWN | wc -l)
#ans1=$((total - JJ_C_to_GIST_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#JJ_C_to_GIST_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#JJ_C_to_GIST_Box_down_time=$(echo "scale=0; $JJ_C_to_GIST_Box * 2" | bc)

#JJ_C_to_KN_Box=$(cat /home/netcs/infra_health_checking/result/cloud_log.txt | grep $(date +"%Y"),JJ_C_1 | grep KN_C_1 | grep DOWN | wc -l)
#ans1=$((total - JJ_C_to_KN_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#JJ_C_to_KN_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#JJ_C_to_KN_Box_down_time=$(echo "scale=0; $JJ_C_to_KN_Box * 2" | bc)

############################### KN C Box ###############################
#KN_C_to_GIST_Box=$(cat /home/netcs/infra_health_checking/result/cloud_log.txt | grep $(date +"%Y"),KN_C_1 | grep GIST_C_1 | grep DOWN | wc -l)
#ans1=$((total - KN_C_to_GIST_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#KN_C_to_GIST_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#KN_C_to_GIST_Box_down_time=$(echo "scale=0; $KN_C_to_GIST_Box * 2" | bc)

#KN_C_to_JJ_Box=$(cat /home/netcs/infra_health_checking/result/cloud_log.txt | grep $(date +"%Y"),KN_C_1 | grep JJ_C_1 | grep DOWN | wc -l)
#ans1=$((total - KN_C_to_JJ_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#KN_C_to_JJ_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#KN_C_to_JJ_Box_down_time=$(echo "scale=0; $KN_C_to_JJ_Box * 2" | bc)

############################### SD-Access Boxes ###############################
#cat /home/netcs/infra_health_checking/result/PING_RESULT_ACCESS.log | tail -n 4320 > /home/netcs/infra_health_checking/result/access_log.txt

#total=$(cat access_log.txt | wc -l)
#Entries_per_box=6
#total=$((total/Entries_per_box)) 
#echo "total entries are : $total"

############################### GIST O Box ###############################
#GIST_O_to_KN_Box=$(cat /home/netcs/infra_health_checking/result/access_log.txt | grep $(date +"%Y"),GIST_O_1 | grep KN_O_1 | grep DOWN | wc -l)
#ans1=$((total - GIST_O_to_KN_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#GIST_O_to_KN_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#GIST_O_to_KN_Box_down_time=$(echo "scale=0; $GIST_O_to_KN_Box * 2" | bc)

#GIST_O_to_JJ_Box=$(cat /home/netcs/infra_health_checking/result/access_log.txt | grep $(date +"%Y"),GIST_O_1 | grep JJ_O_1 | grep DOWN | wc -l)
#ans1=$((total - GIST_O_to_JJ_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#GIST_O_to_JJ_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#GIST_O_to_JJ_Box_down_time=$(echo "scale=0; $GIST_O_to_JJ_Box * 2" | bc)

############################### JJ O Box ###############################
#JJ_O_to_GIST_Box=$(cat /home/netcs/infra_health_checking/result/access_log.txt | grep $(date +"%Y"),JJ_O_1 | grep GIST_O_1 | grep DOWN | wc -l)
#ans1=$((total - JJ_O_to_GIST_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#JJ_O_to_GIST_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#JJ_O_to_GIST_Box_down_time=$(echo "scale=0; $JJ_O_to_GIST_Box * 2" | bc)

#JJ_O_to_KN_Box=$(cat /home/netcs/infra_health_checking/result/access_log.txt | grep $(date +"%Y"),JJ_O_1 | grep KN_O_1 | grep DOWN | wc -l)
#ans1=$((total - JJ_O_to_KN_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#JJ_O_to_KN_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#JJ_O_to_KN_Box_down_time=$(echo "scale=0; $JJ_O_to_KN_Box * 2" | bc)

############################### KN O Box ###############################
#KN_O_to_GIST_Box=$(cat /home/netcs/infra_health_checking/result/access_log.txt | grep $(date +"%Y"),KN_O_1 | grep GIST_O_1 | grep DOWN | wc -l)
#ans1=$((total - KN_O_to_GIST_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#KN_O_to_GIST_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#KN_O_to_GIST_Box_down_time=$(echo "scale=0; $KN_O_to_GIST_Box * 2" | bc)

#KN_O_to_JJ_Box=$(cat /home/netcs/infra_health_checking/result/access_log.txt | grep $(date +"%Y"),KN_O_1 | grep JJ_O_1 | grep DOWN | wc -l)
#ans1=$((total - KN_O_to_JJ_Box ))
#frac_perc1=$(echo "scale=2; $ans1/$total" | bc)
#KN_O_to_JJ_Box_up_perc=$(echo "scale=0; $frac_perc1 * 100" | bc)
#KN_O_to_JJ_Box_down_time=$(echo "scale=0; $KN_O_to_JJ_Box * 2" | bc)

################################################Start HTML Generation##########################################################################
TIME=`date +%Y/%m/%d`
echo "<html><head><style>
table {
    width:100%;
}
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}
th, td {
    padding: 5px;
    text-align: left;
}
table#t01 tr:nth-child(even) {
    background-color: #eee;
}
table#t01 tr:nth-child(odd) {
   background-color:#fff;
}
table#t01 th	{
    background-color: black;
    color: white;
}
</style>
</head>
<body>
<p style='color:black;'>Dear KOREN Platform Operators,</p>
<p style='color:red;'>***      This is an automatically generated email, please do not reply      ***</p>
<br>

<table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
  <tr><th style='font-size:120%; color:blue;text-align: center' colspan='3'>KOREN Platform Boxes (Management Plane) Status Summary</th></tr>
  <tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Site</th><th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Up Time Percntage/Day</th><th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Down Time Minutes/Day</th></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_S_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_S_Box_down_time</td></tr>
  <tr style='background-color: #eee;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_C_Box_up_perc</td> <td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_C_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_O_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_O_Box_down_time</td></tr>
  <tr style='background-color: #eee;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_S_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_S_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_C_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_C_Box_down_time</td></tr>
  <tr style='background-color: #eee;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_O_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_O_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_S_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_S_Box_down_time</td></tr>
  <tr style='background-color: #eee;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_C_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_C_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_O_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_O_Box_down_time</td></tr>
</table>
<p></p><p></p>

<table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
  <tr><th style='font-size:120%; color:blue; text-align: center' colspan='4'>SD-WAN Boxes (Data Plane) Status Summary</th></tr>
  <tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>From Box</th><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>To Box</th><th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Up Time Percntage/Day</th><th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Down Time Minutes/Day</th></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_WAN_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_S_to_JJ_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_S_to_JJ_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_WAN_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_S_to_KN_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_S_to_KN_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_WAN_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_S_to_GIST_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_S_to_GIST_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_WAN_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_S_to_KN_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_S_to_KN_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_WAN_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_S_to_GIST_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_S_to_GIST_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_WAN_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_WAN_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_S_to_JJ_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_S_to_JJ_Box_down_time</td></tr>
</table>
<p></p><p></p>

<table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
  <tr><th style='font-size:120%; color:blue; text-align: center' colspan='4'>SD-Cloud Boxes (Data Plane) Status Summary</th></tr>
  <tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>From Box</th><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>To Box</th><th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Up Time Percntage/Day</th><th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Down Time Minutes/Day</th></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_CLOUD_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_C_to_JJ_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_C_to_JJ_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_CLOUD_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_C_to_KN_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_C_to_KN_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_CLOUD_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_C_to_GIST_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_C_to_GIST_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_CLOUD_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_C_to_KN_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_C_to_KN_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_CLOUD_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_C_to_GIST_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_C_to_GIST_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_CLOUD_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_CLOUD_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_C_to_JJ_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_C_to_JJ_Box_down_time</td></tr>
</table>
<p></p><p></p>

<table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
  <tr><th style='font-size:120%; color:blue; text-align: center' colspan='4'>SD-Access Boxes (Data Plane) Status Summary</th></tr>
  <tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>From Box</th><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>To Box</th><th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Up Time Percntage/Day</th><th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Down Time Minutes/Day</th></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_ACCESS_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_O_to_JJ_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_O_to_JJ_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_ACCESS_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_O_to_KN_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$GIST_O_to_KN_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_ACCESS_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_O_to_GIST_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_O_to_GIST_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_ACCESS_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_O_to_KN_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$JJ_O_to_KN_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_ACCESS_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>GIST_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_O_to_GIST_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_O_to_GIST_Box_down_time</td></tr>
  <tr style='background-color: #fff;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>KN_ACCESS_Box</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>JJ_ACCESS_Box</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_O_to_JJ_Box_up_perc</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$KN_O_to_JJ_Box_down_time</td></tr>
</table>" >> result.html

#################################SD-WAN Boxes Iperf TCP/UDP Test############################
echo "<p></p><p></p>
<table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
	<tr><th style='font-size:120%; color:blue; text-align: center;' colspan='4'>SD-WAN Boxes Iperf (TCP) Test</th></tr>
	<tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Server</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Client</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Server Bandwidth</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Client Bandwidth</th></tr>" >> result.html
bgco="#fff"
FILTER=`date +%Y/%m/%d`
rm -rf /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_WAN_BOX.log.today
cat /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_WAN_BOX.log | grep $FILTER >> /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_WAN_BOX.log.today
file1="/home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_WAN_BOX.log.today"
while IFS=" " read -r f1 f2 f3 f4 f5 f6 f7 f8
do
  echo "<tr style='background-color: $bgco;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f2</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f3</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f5 $f6</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f7 $f8</td></tr>" >>result.html
  if [ "$bgco" == "#fff" ]; then
     bgco="#eee"
  else
     bgco="#fff"
  fi
done <"$file1"
echo "</table>" >> result.html

echo "<p></p><p></p><table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
	<tr><th style='font-size:120%; color:blue; text-align: center;' colspan='5'>SD-WAN Boxes Iperf (UDP) Test</th></tr>
	<tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Server</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Client</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Bandwidth</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Jitter</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Packet Loss</th></tr>" >> result.html
bgco="#fff"
rm -rf /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_WAN_BOX.log.today
cat /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_WAN_BOX.log | grep $FILTER >> /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_WAN_BOX.log.today
file1="/home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_WAN_BOX.log.today"
while IFS=" " read -r f1 f2 f3 f4 f5 f6 f7 f8 f9
do
  echo "<tr style='background-color: $bgco;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f2</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f3</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f5 $f6</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f7</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f8 $f9</td></tr>" >>result.html
  if [ "$bgco" == "#fff" ]; then
     bgco="#eee"
  else
     bgco="#fff"
  fi
done <"$file1"
echo "</table>" >> result.html

#################################SD-CLOUD Boxes Iperf TCP/UDP Test############################
echo "<p></p><p></p>
<table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
	<tr><th style='font-size:120%; color:blue; text-align: center;' colspan='4'>SD-CLOUD Boxes Iperf (TCP) Test</th></tr>
	<tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Server</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Client</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Server Bandwidth</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Client Bandwidth</th></tr>" >> result.html
bgco="#fff"
FILTER=`date +%Y/%m/%d`
rm -rf /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_CLOUD_BOX.log.today
cat /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_CLOUD_BOX.log | grep $FILTER >> /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_CLOUD_BOX.log.today
file1="/home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_CLOUD_BOX.log.today"
while IFS=" " read -r f1 f2 f3 f4 f5 f6 f7 f8
do
  echo "<tr style='background-color: $bgco;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f2</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f3</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f5 $f6</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f7 $f8</td></tr>" >>result.html
  if [ "$bgco" == "#fff" ]; then
     bgco="#eee"
  else
     bgco="#fff"
  fi
done <"$file1"
echo "</table>" >> result.html

echo "<p></p><p></p><table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
	<tr><th style='font-size:120%; color:blue; text-align: center;' colspan='5'>SD-CLOUD Boxes Iperf (UDP) Test</th></tr>
	<tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Server</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Client</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Bandwidth</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Jitter</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Packet Loss</th></tr>" >> result.html
bgco="#fff"
rm -rf /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_CLOUD_BOX.log.today
cat /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_CLOUD_BOX.log | grep $FILTER >> /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_CLOUD_BOX.log.today
file1="/home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_CLOUD_BOX.log.today"
while IFS=" " read -r f1 f2 f3 f4 f5 f6 f7 f8 f9
do
  echo "<tr style='background-color: $bgco;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f2</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f3</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f5 $f6</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f7</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f8 $f9</td></tr>" >>result.html
  if [ "$bgco" == "#fff" ]; then
     bgco="#eee"
  else
     bgco="#fff"
  fi
done <"$file1"
echo "</table>" >> result.html

#################################SD-ACCESS Boxes Iperf TCP/UDP Test############################
echo "<p></p><p></p>
<table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
	<tr><th style='font-size:120%; color:blue; text-align: center;' colspan='4'>SD-ACCESS Boxes Iperf (TCP) Test</th></tr>
	<tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Server</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Client</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Server Bandwidth</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Client Bandwidth</th></tr>" >> result.html
bgco="#fff"
FILTER=`date +%Y/%m/%d`
rm -rf /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_ACCESS_BOX.log.today
cat /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_ACCESS_BOX.log | grep $FILTER >> /home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_ACCESS_BOX.log.today
file1="/home/netcs/infra_health_checking/result/IPERF_TCP_RESULT_ACCESS_BOX.log.today"
while IFS=" " read -r f1 f2 f3 f4 f5 f6 f7 f8
do
  echo "<tr style='background-color: $bgco;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f2</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f3</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f5 $f6</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f7 $f8</td></tr>" >>result.html
  if [ "$bgco" == "#fff" ]; then
     bgco="#eee"
  else
     bgco="#fff"
  fi
done <"$file1"
echo "</table>" >> result.html

echo "<p></p><p></p><table style='width:50%; border: 1px solid black; border-collapse:collapse;'>
	<tr><th style='font-size:120%; color:blue; text-align: center;' colspan='5'>SD-ACCESS Boxes Iperf (UDP) Test</th></tr>
	<tr><th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Server</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: left; padding: 5px; border: 1px solid black;'>Client</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Bandwidth</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Jitter</th>
		<th style='background-color: black; color:white; border: 1px solid black; text-align: right; padding: 5px; border: 1px solid black;'>Packet Loss</th></tr>" >> result.html
bgco="#fff"
rm -rf /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_ACCESS_BOX.log.today
cat /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_ACCESS_BOX.log | grep $FILTER >> /home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_ACCESS_BOX.log.today
file1="/home/netcs/infra_health_checking/result/IPERF_UDP_RESULT_ACCESS_BOX.log.today"
while IFS=" " read -r f1 f2 f3 f4 f5 f6 f7 f8 f9
do
  echo "<tr style='background-color: $bgco;'><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f2</td><td style='text-align: left; padding: 5px; border: 1px solid black;'>$f3</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f5 $f6</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f7</td><td style='text-align: right; padding: 5px; border: 1px solid black;'>$f8 $f9</td></tr>" >>result.html
  if [ "$bgco" == "#fff" ]; then
     bgco="#eee"
  else
     bgco="#fff"
  fi
done <"$file1"
echo "</table>" >> result.html

echo "</body></html>" >> result.html
#mail -a "Content-type: text/html;" -s "[$TIME] SmartX Playground Infrastructure Daily Visibility Report" playground@oftein.net < result.html
mail -a "Content-type: text/html;" -s "[$TIME] KOREN Platform Infrastructure Daily Visibility Report" usman@smartx.kr < result.html
#mail -a "Content-type: text/html;" -s "[$TIME] OF@TEIN SmartX Box Daily Status" playground@oftein.net < result.html
