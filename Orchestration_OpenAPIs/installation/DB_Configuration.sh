#!/bin/bash

if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi


M_IP=1.1.1.1
C_IP=1.1.1.1
D_IP=1.1.1.1
#RABBIT_PASS=secrete
PASSWORD='Pass'
#ADMIN_TOKEN=ADMIN
#MAIL=jshan@nm.gist.ac.kr



# Install & Configure MYSQL

sudo debconf-set-selections <<< "mariadb-server mysql-server/root_password password $PASSWORD"
sudo debconf-set-selections <<< "mariadb-server mysql-server/root_password_again password $PASSWORD"
sudo apt-get -y install mariadb-server python-pymysql

sudo touch /etc/mysql/conf.d/mysqld_openstack.cnf

echo "[mysqld]" >> /etc/mysql/conf.d/mysqld_openstack.cnf
echo "bind-address = $C_IP" >> /etc/mysql/conf.d/mysqld_openstack.cnf
echo "default-storage-engine = innodb" >> /etc/mysql/conf.d/mysqld_openstack.cnf
echo "innodb_file_per_table" >> /etc/mysql/conf.d/mysqld_openstack.cnf
echo "collation-server = utf8_general_ci" >> /etc/mysql/conf.d/mysqld_openstack.cnf
#echo "init-connect = 'SET NAMES utf8'" >> /etc/mysql/conf.d/mysqld_openstack.cnf
echo "character-set-server = utf8" >> /etc/mysql/conf.d/mysqld_openstack.cnf

service mysql restart

echo -e "$PASSWORD\nn\ny\ny\ny\ny" | mysql_secure_installation


# Install & Configure MongoDB

sudo apt-get install -y mongodb-server mongodb-clients python-pymongo

sed -i "s/bind_ip = 127.0.0.1/bind_ip = $C_IP/g" /etc/mongodb.conf

# By default, MongoDB Crete serveral 1 GB journal files in the /var/lib/mongodb/journal directory.
# If you want to reduce the size of each journal file to 128 MB and limit total journal space consumption to 512 MB, assert the smallfiles key: 
# sed -i "s/journal=true/journal=true\n smallfiles=true/g" /etc/mongodb.conf

service mongodb restart


