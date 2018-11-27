#!/bin/bash


if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi


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



cp api/slices/static/koren.json api/slices/static/test.json



# find Instance Tuples

sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select count(*) from Instance;")


count=`echo $sql | awk '{print $2}'`



sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select * from Instance;" | column -t | sed 1d )


#sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select * from Instance;")

#echo $sql



for ((i=0;i<$count;i++)); do


	    let num=$i*4+2
            IP=`echo $sql | awk '{print $'$num'}'`
            #echo $IP

	    let num=$i*4+3
            SID=`echo $sql | awk '{print $'$num'}'`
            #echo $SID

	    let num=$i*4+4
            RE=`echo $sql | awk '{print $'$num'}'`
            #echo $RE


	    bash json_cloud_create.sh $IP $SID $RE

done




# find IoT Tuples

sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select count(*) from IoT where direction='IoT';")


count=`echo $sql | awk '{print $2}'`



sql=$(mysql -u root -h $DB_HOST --password=$DB_PASS -e "use Slicing_Management; select * from IoT where direction='IoT';" | column -t | sed 1d )



for ((i=0;i<$count;i++)); do


            let num=$i*6+2
            IP=`echo $sql | awk '{print $'$num'}'`
            #echo $IP

            let num=$i*6+3
            SID=`echo $sql | awk '{print $'$num'}'`
            #echo $SID

            let num=$i*6+6
            RE=`echo $sql | awk '{print $'$num'}'`
            #echo $RE


            bash json_access_create.sh $IP $SID $RE

done







