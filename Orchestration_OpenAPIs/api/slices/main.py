from flask import Flask, request, make_response
from flask_restful import Resource, Api
from flask_restful import reqparse
from flaskext.mysql import MySQL
import configparser
import subprocess
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

  return json.dumps(result)




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





