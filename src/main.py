from __future__ import annotations

PATH = "C:\\Users\\rjinf\\AppData\\Local\\Discord"
WAIT = 2

import os
import sys
import json
from comunicator import ElectronComunicator
from flask import Flask,send_file,request,send_from_directory
from flask_cors import CORS, cross_origin
import requests
from time import sleep


server = Flask(__name__)
cors = CORS(server)
server.config['CORS_HEADERS'] = 'Content-Type'

def launchDiscord():
	port = 8473
	EComunic = ElectronComunicator("Discord",None,PATH,port,True)
	EComunic.use_most_recent_version()
	EComunic.find_first_open_process()
	open = EComunic.is_already_open()
	print(open)
	if open == ElectronComunicator.OpenStates.DefaultOpen:
		EComunic.kill_app() #if it is open but not in debug mode close it
	if open != ElectronComunicator.OpenStates.DebugOpen:
		EComunic.launch() # if it isnt in debug mode it is closed as it should have been closed previously
		sleep(WAIT)
	return EComunic

@server.route("/bootloader.js")
@cross_origin()
def code():
	return send_file("bootloader.js",mimetype="text/plain")

@server.route("/filesList")
@cross_origin()
def files():
	files_list = []
	for path, _, files in os.walk(os.path.join("..","scripts")):
		for file in files:
			files_list.append(os.path.join(path, file)[len(os.path.join("..","scripts","")):].replace("\\","/"))
	return json.dumps({"files":files_list})


@server.route("/scripts/<path:filename>")
@cross_origin()
def scripts(filename):
	return send_from_directory("..\\scripts\\",filename)


def get_data_stream(url):
	with requests.Session().get(url, headers=None, stream=True) as resp:
		for data in resp.iter_content():
			yield data

def get_mime_type(url):
	response = requests.Session().head(url)
	contentType = response.headers['content-type']
	return contentType

@server.route('/portal',methods=['POST'])
def catch_all():
	data = json.loads(request.data)
	if "url" not in data:
		return "{\"error\":\"there was no url component to the data\"}", 400
	if type(data["url"]) == str:
		return "{\"error\":\"the url component to the data was not a string\"}", 400
	url = data["url"]
	return server.response_class(get_data_stream(url), mimetype=get_mime_type(url))






if __name__ == "__main__":
	if "--no-inject" not in sys.argv:
		discordDebugger = launchDiscord()
		try:
			for w in discordDebugger.get_windows():
				print(w)
				discordDebugger.run_code(w, """fetch('http://127.0.0.1:2829/bootloader.js').then((response) => response.text()).then(data => eval(data));""")
		except requests.exceptions.ConnectionError:
			print("Error: The electron app failed the debug connection (posibly not in debug mode)",file=sys.stderr)
			sys.exit(1)
	server.run(debug=False,port=2829)