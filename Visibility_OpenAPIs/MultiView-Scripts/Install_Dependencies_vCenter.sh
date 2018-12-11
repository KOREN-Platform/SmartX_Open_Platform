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
# Name          : Install_Dependencies_vCenter.sh
# Description   : Script for Installing Dependencies on Visibility Center
#
# Created by    : usman@smartx.kr
# Version       : 0.3
# Create Data   : October, 2016
# Last Update   : April, 2017

MGMT_IP=$1

wget_check ()
{
  if command -v wget > /dev/null; then
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] wget Already Installed.\n"
  else
    echo -n "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] wget Installing .................... "
    apt-get -y install wget nmap &> /dev/null
	echo -e "Done.\n"
  fi
}

java_check ()
{
  if command -v java > /dev/null; then
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] JAVA Already Installed.\n"
	echo -e `java -version`
  else
	echo -n "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] JAVA Installing .................... "
	sudo add-apt-repository -y ppa:webupd8team/java &> /dev/null
	sudo apt-get -y update &> /dev/null
	echo debconf shared/accepted-oracle-license-v1-1 select true | sudo debconf-set-selections
	echo debconf shared/accepted-oracle-license-v1-1 seen true | sudo debconf-set-selections
	sudo apt-get -y install oracle-java8-installer &> /dev/null
	sudo apt-get -y install oracle-java8-set-default &> /dev/null
	echo -e "Done.\n"
	java -version
  fi
}

influxDB_check()
{
influxdb=`dpkg -l | grep influx`
if [ "$influxdb" == "" ]; then
echo -n "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] InfluxDB Installing .................... "
wget --secure-protocol=TLSv1 https://dl.influxdata.com/influxdb/releases/influxdb_1.0.2_amd64.deb &> /dev/null
sudo dpkg -i influxdb_1.0.2_amd64.deb &> /dev/null
rm -rf influxdb_1.0.2_amd64.deb
echo -e "Done."
echo `influx -version`
else
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] InfluxDB Already Installed."
echo `influx -version`
fi
}

elasticsearch_check()
{
Elasticsearch=`dpkg -l | grep elasticsearch`

if [ "$Elasticsearch" == "" ]; then
echo -e "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Elasticsearch Installing .................... "
CurrentDir=`pwd`
cd /tmp/
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list
sudo apt-get update && sudo apt-get install elasticsearch &> /dev/null
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service

#wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.0.0.deb &> /dev/null
#sudo dpkg -i elasticsearch-5.0.0.deb &> /dev/null
#sudo update-rc.d elasticsearch defaults 95 10 &> /dev/null

# Configure Elasticsearch
sed -i "s/#cluster.name: elasticsearch/cluster.name: elasticsearch/g" /etc/elasticsearch/elasticsearch.yml
sed -i "s/#network.host: 192.168.0.1/network.host: $MGMT_IP/g" /etc/elasticsearch/elasticsearch.yml

sudo service elasticsearch restart &> /dev/null
echo -e "Done.\n"
#cd /usr/share/elasticsearch
#bin/elasticsearch-plugin install mobz/elasticsearch-head
cd $CurrentDir
else
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Elasticsearch Already Installed."
#echo `curl -XGET '$MGMT_IP:9200'`
fi
}

mongoDB_check()
{
mongoExist=`ls | grep mongo`
if [ "$mongoExist" == "" ]; then
echo -e "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] MongoDB Installing .................... "
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 &> /dev/null
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update &> /dev/null
sudo apt-get install -y mongodb-org &> /dev/null
sed -i "s/bindIp: 127.0.0.1/bindIp: 0.0.0.0/g" /etc/mongod.conf
service mongod restart &> /dev/null
echo -e "Done. \n"
else
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] MongoDB Already Installed."
fi
}

nodeJS_check()
{
NodeJSExist=`dpkg -l | grep  nodejs`
if [ "$NodeJSExist" == "" ]; then
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] NodeJS Installing .................... "
apt-get install -y nodejs npm
ln -s /usr/bin/nodejs /usr/bin/node
echo -e "Done.\n"
echo `node -v`
else
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] NodeJS Already Installed."
echo `node -v`
fi
}

kafka_check()
{
kafkaExist=`ls | grep kafka`
if [ "$kafkaExist" == "" ]; then
echo -e ""
echo -n "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Get Zookeeper .................... "
wget http://apache.mirror.cdnetworks.com/zookeeper/zookeeper-3.4.9/zookeeper-3.4.9.tar.gz &> /dev/null
tar -xvzf zookeeper-3.4.9.tar.gz &> /dev/null
rm -rf zookeeper-3.4.9.tar.gz
mv zookeeper-3.4.9 zookeeper
mv zookeeper/conf/zoo_sample.cfg zookeeper/conf/zoo.cfg
echo -e "Done.\n"
#zookeeper/bin/zkServer.sh start

echo -n "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Get Kafka .................... "
wget http://ftp.jaist.ac.jp/pub/apache/kafka/0.10.0.0/kafka_2.11-0.10.0.0.tgz &> /dev/null
tar -xvzf kafka_2.11-0.10.0.0.tgz &> /dev/null
rm -rf kafka_2.11-0.10.0.0.tgz
mv kafka_2.11-0.10.0.0 kafka 
echo "delete.topic.enable = true" >> kafka/config/server.properties
#kafka/bin/kafka-server-start.sh kafka/config/server.properties
#In case kafka server can't start then add IP to /etc/hosts
echo -e "Done. \n"
else
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Kafka Already Installed."
fi
}

grafana_check ()
{
grafana=`dpkg -l | grep grafana`
if [ "$grafana" == "" ]; then
echo -n "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Grafana Installing .................... "
echo 'deb https://packagecloud.io/grafana/stable/debian/ jessie main' | sudo tee -a /etc/apt/sources.list
curl https://packagecloud.io/gpg.key | sudo apt-key add - &> /dev/null
sudo apt-get update &> /dev/null
sudo apt-get install grafana &> /dev/null
sudo systemctl enable grafana-server.service 
echo -e "Done."
echo `grafana-server -v`
else
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Grafana Already Installed."
echo `grafana-server -v`
fi
}

kibana_check ()
{
kibana=`dpkg -l | grep kibana`
if [ "$kibana" == "" ]; then
echo -n "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Kibana Installing .................... "
wget https://artifacts.elastic.co/downloads/kibana/kibana-5.3.0-amd64.deb &> /dev/null
sudo dpkg -i kibana-5.3.0-amd64.deb
#sed -i "s/#server.port:.*/server.port: 5601/" /etc/kibana/kibana.yml
#sed -i "s/#server.host:.*/server.host: $MGMT_IP/" /etc/kibana/kibana.yml
#sed -i "s/#elasticsearch.url:.*/elasticsearch.url: '"http://$MGMT_IP:9200"'/" /etc/kibana/kibana.yml
#sed -i "/#kibana.index:/c\kibana.index: .kibana/" /etc/kibana/kibana.yml

sudo systemctl daemon-reload
sudo systemctl enable kibana
sudo systemctl start kibana

rm -rf kibana-5.3.0-amd64.deb
echo -e "Done."
else
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Kibana Already Installed."
fi
}

nodeJSlib_check()
{
echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] NodeJS Libraries Installing .................... "
sudo npm install npm -g 
currentDir=`pwd`
cd Visibility-Visualization/pvcT-Visualization
npm config set registry https://registry.npmjs.org/
npm cache clean
npm install
sudo npm install -g nodemon
echo -e "Done.\n"
cd $currentDir
}

wget_check
java_check
influxDB_check
elasticsearch_check
mongoDB_check
nodeJS_check
kafka_check
grafana_check
kibana_check
nodeJSlib_check
