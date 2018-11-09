from flask import Flask, request, make_response
import subprocess
import json
from collections import defaultdict


app = Flask(__name__)



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

  #name = request.authorization.username
  #password = request.authorization.password

  # create slices
  #cmd="cd ../ && bash Slicing_list.sh " + name + " " + password


  #result = subprocess.check_output (cmd , shell=True)

  #response= result.decode()
  #response= response.replace("\n","")


  return "Get Method"



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





