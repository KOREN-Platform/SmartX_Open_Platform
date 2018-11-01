from flask import Flask, request, make_response
import subprocess

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



