from flask import Flask, request, make_response
from flask_restful import Resource, Api
from flask_restful import reqparse
from flaskext.mysql import MySQL
import configparser
import subprocess
import requests
import json
from collections import defaultdict


app = Flask(__name__)
api = Api(app)




# get the MySQL HOST from init.conf
config = configparser.ConfigParser()
config.read('../configuration/init.ini')
Host= config.get('database','MySQL_HOST')

# get the MySQL PASS from init.conf
Pass= config.get('database','MySQL_PASS')


mysql = MySQL()

# MySQL Config
app.config['MYSQL_DATABASE_USER'] ='Slicing_Management'
app.config['MYSQL_DATABASE_PASSWORD'] = Pass
app.config['MYSQL_DATABASE_DB'] = 'Slicing_Management'
app.config['MYSQL_DATABASE_HOST'] = Host

mysql.init_app(app)







@app.route("/")
def hello_world():  


  name = request.authorization.username
  password = request.authorization.password

  cmd="cd ../cred && bash auth_check.sh " + name + " " + password


  result = subprocess.check_output (cmd , shell=True)

  response= result.decode()
  response= response.replace("\n","")

  print (response)

  if response == "True":
    return "success"



#  if request.authorization and request.authorization.username == 'username' and request.authorization.password == 'password':
#    return "success"

  return make_response('Coud not verify!', 401, {'WWW-Authenticate' : 'Basic realm="Login Required"'})


@app.route("/slices")
def slice_list():

  name = request.authorization.username
  password = request.authorization.password

  # create slices
  cmd="cd ../ && bash Slicing_list.sh " + name + " " + password


  result = subprocess.check_output (cmd , shell=True)

  response= result.decode()
  response= response.replace("\n","")


  return response + "\n"



@app.route("/slices", methods=['POST'])
def slice_create():

  name = request.authorization.username
  password = request.authorization.password

  # create slices
  cmd="cd ../ && bash Slice_Create.sh " + name + " " + password


  result = subprocess.check_output (cmd , shell=True)

  response= result.decode()
  response= response.replace("\n","")




  # Ready for JSON file
  d1 = defaultdict(list)
 
  d1["Slice_ID"] = response


  print(json.dumps(d1, ensure_ascii=False, indent="\t") )

  return (json.dumps(d1, ensure_ascii=False, indent="\t"))


@app.route("/slices", methods=['DELETE'])
def slice_delete():

  name = request.authorization.username
  password = request.authorization.password

  slice_id = request.get_json()["slice_id"]



  # create slices
  cmd="cd ../ && bash Slice_delete.sh " + name + " " + password + " " + slice_id


  result = subprocess.check_output (cmd , shell=True)

  response= result.decode()
  response= response.replace("\n","")


  return response + "\n"




@app.route("/cloud_slices")
def cloud_slice_list():

  name = request.authorization.username
  password = request.authorization.password


  # Check Authentication

  cmd="cd ../cred && bash auth_check.sh " + name + " " + password

  result = subprocess.check_output (cmd , shell=True)
  response= result.decode()
  response= response.replace("\n","")

  print (response)

  if response != "True":
    return "Error: Authentication failed\n"


  # Json format 
 
  cur = mysql.connect().cursor()
  cur.execute("select distinct Instance_ID,IP,Instance.Slicing_ID from Slicing join Instance where Tenant_ID='" + name +"';")


  result = []

  columns = tuple( [d[0] for d in cur.description])
 
  for row in cur:
    result.append(dict(zip(columns, row)))

  print(result)

  return json.dumps(result) + "\n"




@app.route("/cloud_slices", methods=['POST'])
def cloud_slice_create():

  name = request.authorization.username
  password = request.authorization.password

  # parmeters
  slice_id = request.get_json()["slice_id"]
  region = request.get_json()["region"]
  flavor = request.get_json()["flavor"]
  image = request.get_json()["image"]
  instance_name = request.get_json()["instance_name"]
  key_name = request.get_json()["key_name"]


  # create slices
  cmd="cd ../ && bash Cloud_Slicing.sh " + name + " " + password + " " + slice_id + " " + region + " " + flavor + " " + image + " " + instance_name + " " + key_name


  result = subprocess.check_output (cmd , shell=True)

  response= result.decode()
  response= response.replace("\n","")

  return response + "\n"


@app.route("/cloud_slices", methods=['DELETE'])
def cloud_slice_delete():

  name = request.authorization.username
  password = request.authorization.password

  # parmeters
  instance_id = request.get_json()["instance_id"]
  region = request.get_json()["region"]


  # create slices
  cmd="cd ../ && bash Cloud_delete.sh " + name + " " + password + " " + instance_id + " " + region


  result = subprocess.check_output (cmd , shell=True)

  response= result.decode()
  response= response.replace("\n","")

  return response + "\n"



@app.route("/access_slices")
def access_slice_list():
  

  name = request.authorization.username
  password = request.authorization.password


  # Check Authentication

  cmd="cd ../cred && bash auth_check.sh " + name + " " + password

  result = subprocess.check_output (cmd , shell=True)
  response= result.decode()
  response= response.replace("\n","")

  print (response)

  if response != "True":
    return "Error: Authentication failed\n"


  # Json format

  cur = mysql.connect().cursor()
  cur.execute("select distinct MAC, IP, IoT.Slicing_ID, Intent, direction from Slicing join IoT where Tenant_ID='" + name +"';")


  result = []

  columns = tuple( [d[0] for d in cur.description])

  for row in cur:
    result.append(dict(zip(columns, row)))

  print(result)

  return json.dumps(result) + "\n"












  return "method"



@app.route("/access_slices", methods=['POST'])
def access_slice_create():



  # MySQL Ready
  con = mysql.connect()
  cur = con.cursor()




  # get User and password
  name = request.authorization.username
  password = request.authorization.password


  # get parameters 
  slice_id = request.get_json()["slice_id"]
  mac = request.get_json()["mac"]
  location = request.get_json()["location"]
  ip = request.get_json()["ip"]
  
  dpid =""


  # get the information from init.conf
  config = configparser.ConfigParser()
  config.read('../configuration/init.ini')


  if (location == "GJ"):
    dpid = config.get('sd-access', 'Type_O_GJ') 
  elif (location == "JJ"):
    dpid = config.get('sd-access', 'Type_O_JJ')
  elif (location == "JNU"):
    dpid = config.get('sd-access', 'Type_O_JNU')
  elif (location == "KU"):
    dpid = config.get('sd-access', 'Type_O_KU')
  else:
    return ("Error: Location is not valid\n")



  # check Slicing ID & User
  cur = mysql.connect().cursor()
  cur.execute("select * from Slicing where Slicing_ID='" + slice_id + "' and Tenant_ID='" + name + "';")

  
  flag = 0
  for row in cur:
    flag = flag + 1

  if (flag == 0):
    return "Error: slice id is not valid\n"





  # get the ONOS Access IP
  ONOS_Access = config.get('controller', 'ONOS_SD_Access')
 
  # get the ONOS Port
  ONOS_Access_Port = config.get('controller', 'ONOS_SD_Access_Port')



  # get the port information from ONOS API
  url = "http://" + ONOS_Access + ":8181/onos/v1/devices/" + dpid +"/ports"
  response = requests.get(url, auth=('karaf', 'karaf'))
  data = response.text
  output = json.loads(data)


  # Find port number
  for port in output['ports']:
    if port['annotations']['portName'] == 'patch-br-tun':
      Cloud_Interface = port['port']
    if port['annotations']['portName'] == 'patch-IoT':
      IoT_Interface = port['port']





   # Check cloud_slice is existed
  para = "select * from IoT where Slicing_ID='" + slice_id + "' and direction='cloud'"
  cur.execute(para)

  flag = 0
  for row in cur:
    flag = flag + 1

  print ("Flag: ")
  print (flag)

  if (flag == 0):
    # we need to create cloud_slice
    data = {
   "type": "PointToPointIntent",
   "appId": "org.onosproject.cli",
   "priority": 40100,
   "selector":
    {
      "criteria":
      [
        {"type": "VLAN_VID",
         "vlanId": slice_id
        }
      ]
    },
   "treatment":
     {
      "instructions":
      [
        {"type": "L2MODIFICATION",
         "subtype": "VLAN_POP"
        }
      ]
     },
   "ingressPoint":
     {
      "device": dpid,
      "port": Cloud_Interface
     },
   "egressPoint":
     {"device": dpid,
      "port": IoT_Interface
     }
    }

    # get url
    url = "http://" + ONOS_Access + ":8181/onos/v1/intents"

    # request POST method
    res = requests.post(url, data =json.dumps(data), auth=('karaf', 'karaf'))

    # get the Intent key
    intent_key = res.headers['location']
    url_app = url + "/org.onosproject.cli/"
    intent_key = intent_key.replace(url_app, "")
    

    # Save information to MySQL
    con = mysql.connect()
    cur = con.cursor()

    cmd = "insert into IoT values('" + mac + "', '" + ip + "', '"  + slice_id + "', '" + intent_key + "', 'cloud');"
    cur.execute(cmd)
    con.commit()


  


  # Call ONOS API data
  data = { "type": "PointToPointIntent",
   "appId": "org.onosproject.cli",
   "priority": 40100,
   "selector":
    {
      "criteria":
      [
        {"mac": mac,
         "type": "ETH_SRC"
        }
      ]
    },
   "treatment":
     {
      "instructions":
      [
        {"type": "L2MODIFICATION",
         "subtype": "VLAN_PUSH"
        },
        {"type": "L2MODIFICATION",
         "subtype": "VLAN_ID",
         "vlanId": slice_id
        }
      ]
     },
   "ingressPoint":
     {
      "device": dpid,
      "port": IoT_Interface
     },
   "egressPoint":
     {"device": dpid,
      "port": Cloud_Interface
     }}

  # get url
  url = "http://" + ONOS_Access + ":8181/onos/v1/intents"

  # request POST method
  res = requests.post(url, data =json.dumps(data), auth=('karaf', 'karaf'))

  # get the Intent key
  intent_key = res.headers['location']
  url_app = url + "/org.onosproject.cli/"
  intent_key = intent_key.replace(url_app, "")


  # Save information to MySQL

  con = mysql.connect()
  cur = con.cursor()


  cmd = "insert into IoT values('" + mac + "', '" + ip + "', '" +  slice_id + "', '" + intent_key + "', 'IoT');"

  cur.execute(cmd)
  con.commit()
  

  

  print (Cloud_Interface)
  print (IoT_Interface)



  # Json format

  cur = mysql.connect().cursor()
  cur.execute("select * from IoT where MAC='" + mac +"';")


  result = []

  columns = tuple( [d[0] for d in cur.description])

  for row in cur:
    result.append(dict(zip(columns, row)))

  print(result)

  return json.dumps(result) +"\n"
  



@app.route("/access_slices", methods=['DELETE'])
def access_slice_delete():
    # MySQL Ready
  con = mysql.connect()
  cur = con.cursor()




  # get User and password
  name = request.authorization.username
  password = request.authorization.password


  # get parameters
  slice_id = request.get_json()["slice_id"]
  mac = request.get_json()["mac"]
  location = request.get_json()["location"]

  dpid =""


  # get the information from init.conf
  config = configparser.ConfigParser()
  config.read('../configuration/init.ini')


  if (location == "GJ"):
    dpid = config.get('sd-access', 'Type_O_GJ')
  elif (location == "JJ"):
    dpid = config.get('sd-access', 'Type_O_JJ')
  elif (location == "JNU"):
    dpid = config.get('sd-access', 'Type_O_JNU')
  elif (location == "KU"):
    dpid = config.get('sd-access', 'Type_O_KU')
  else:
    return ("Error: Location is not valid\n")

  
  # check Slicing ID & User
  cur = mysql.connect().cursor()
  cur.execute("select * from Slicing where Slicing_ID='" + slice_id + "' and Tenant_ID='" + name + "';")


  flag = 0
  for row in cur:
    flag = flag + 1

  if (flag == 0):
    return "Error: slice id is not valid\n"




  # get the ONOS Access IP
  ONOS_Access = config.get('controller', 'ONOS_SD_Access')

  # get the ONOS Port
  ONOS_Access_Port = config.get('controller', 'ONOS_SD_Access_Port')



  # get the port information from ONOS API
  url = "http://" + ONOS_Access + ":8181/onos/v1/devices/" + dpid +"/ports"
  response = requests.get(url, auth=('karaf', 'karaf'))
  data = response.text
  output = json.loads(data)


  # Find port number
  for port in output['ports']:
    if port['annotations']['portName'] == 'patch-br-tun':
      Cloud_Interface = port['port']
    if port['annotations']['portName'] == 'patch-IoT':
      IoT_Interface = port['port']



  


  # find MYSQL tuple
  con = mysql.connect()
  cur = con.cursor()
  para = "select * from IoT where MAC='" + mac + "' and direction='IoT';"
  cur.execute(para)

  flag = 0
  for row in cur:
    flag = flag + 1

  if (flag == 0):
    return ("Error: slice does not existed!\n")


  # find intent_key
  intent_key = str(row[3])
    

  # get url
  url = "http://" + ONOS_Access + ":8181/onos/v1/intents/org.onosproject.cli/" + intent_key

  # request POST method
  res = requests.delete(url, auth=('karaf', 'karaf'))


  # Delete MySQL tuple
  con = mysql.connect()
  cur = con.cursor()

  cmd = "delete from IoT where MAC ='" + mac +"' and direction='IoT';" 
  cur.execute(cmd)
  con.commit()

  # Delete Intent of ONOS
    


  # find another slice with same id
  para = "select * from IoT where Slicing_ID='" + slice_id + "' and direction='IoT';"
  cur.execute(para)
  
  flag = 0
  for row in cur:
    flag = flag + 1

  if (flag == 0):
    # we need to delete cloud_slice
    para = "select * from IoT where Slicing_ID='" + slice_id + "' and direction='cloud';"
    cur.execute(para)

    for row in cur:
      flag = 0

    intent_key = str(row[3])

    # get url
    url = "http://" + ONOS_Access + ":8181/onos/v1/intents/org.onosproject.cli/" + intent_key

    # request POST method
    res = requests.delete(url, auth=('karaf', 'karaf'))

    # delete mysql
    cmd = "delete from IoT where MAC ='" + mac +"' and direction='cloud';"
    cur.execute(cmd)
    con.commit()


  return ("Success\n")



