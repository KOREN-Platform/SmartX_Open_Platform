#!/bin/bash

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

DB_HOST=$(get_config_value ../configuration/init.ini database MySQL_HOST)
PASS=$(get_config_value ../configuration/init.ini database MySQL_PASS)



cat << EOF | mysql -h $DB_HOST -uroot -p$PASS
CREATE DATABASE Slicing_Management;
GRANT ALL PRIVILEGES ON Slicing_Management.* TO 'Slicing_Management'@'localhost' IDENTIFIED BY '$PASS';
GRANT ALL PRIVILEGES ON Slicing_Management.* TO 'Slicing_Management'@'%' IDENTIFIED BY '$PASS';
use Slicing_Management;
CREATE TABLE Slicing (
Slicing_ID VARCHAR(100) NOT NULL,
Tenant_ID VARCHAR(100) Not NULL,
Authority VARCHAR(100) Not NULL,
VLAN_ID VARCHAR (100) Not NULL,
PRIMARY KEY(Slicing_ID)
);
CREATE TABLE Instance (
Instance_ID VARCHAR (100) NOT NULL,
IP VARCHAR (100) NOT NULL,
Slicing_ID VARCHAR (100) Not NULL,
PRIMARY KEY(Instance_ID),
FOREIGN KEY (Slicing_ID) references Slicing(Slicing_ID)
);
CREATE TABLE IoT (
MAC VARCHAR (100) NOT NULL,
IP VARCHAR (100) NOT NULL,
Slicing_ID VARCHAR (100) Not NULL,
Intent VARCHAR (100) Not NULL,
direction VARCHAR (100) NOT NULL,
location VARCHAR (100) NOT NULL,
PRIMARY KEY(MAC),
FOREIGN KEY (Slicing_ID) references Slicing(Slicing_ID)
);
quit
EOF


