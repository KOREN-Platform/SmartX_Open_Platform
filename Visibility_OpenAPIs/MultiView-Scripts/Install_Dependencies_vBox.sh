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
# Name          : Install_Dependencies_vBox.sh
# Description   : Script for Installing Dependencies on Visibility Box
#
# Created by    : usman@smartx.kr
# Version       : 0.1
# Last Update   : December, 2016

MGMT_IP=$1

wget_check ()
{
  if command -v wget > /dev/null; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] wget Already Installed.\n"
  else
    echo -n "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] wget Installing .................... "
    apt-get -y install wget &> /dev/null
	echo -e "Done.\n"
  fi
}

nmap_check ()
{
  if command -v nmap > /dev/null; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] nmap Already Installed.\n"
  else
    echo -n "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] nmap Installing .................... "
    apt-get -y install nmap &> /dev/null
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

iostat_check ()
{
  if command -v iostat > /dev/null; then
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] iostat Already Installed."
  else
    echo -n "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] iostat Installing .................... "
    apt-get install -y sysstat &> /dev/null
	echo -e "Done.\n"
  fi
}

snap_check ()
{
  if command -v snaptel > /dev/null; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Intel Snap Already Installed.\n"
  else
    echo -n "[$(date '+%Y-%m-%d %H:%M:%S')][INFO][INSTALL] Intel Snap Installing .................... "
    curl -s https://packagecloud.io/install/repositories/intelsdi-x/snap/script.deb.sh | sudo bash &> /dev/null
	sudo apt-get install -y snap-telemetry &> /dev/null
	service snap-telemetry start &> /dev/null
	echo -e "Done.\n"
  fi
}

wget_check
nmap_check
java_check
snap_check
iostat_check


