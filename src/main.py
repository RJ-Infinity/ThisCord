from __future__ import annotations
import os
import sys
import json
import io
from flask import Flask, send_file,request, send_from_directory, Response
from flask_cors import CORS, cross_origin
import requests
from time import sleep
from threading import Thread
import base64
import websocket
import asyncio

USER_PATH = os.path.expanduser("~")
PATH = f"{USER_PATH}\\AppData\\Local\\Discord"
FILENAME = __file__
EXECUTING_PATH = os.path.dirname(os.path.abspath(FILENAME))
COMMUNICATOR_PATH = EXECUTING_PATH.replace("src","electron-comunicator")
sys.path.insert(0, COMMUNICATOR_PATH)
from comunicator import ElectronComunicator

server = Flask(__name__)
cors = CORS(server)
server.config["CORS_HEADERS"] = "Content-Type"

def launchDiscord(args):
	port = 8473
	EComunic = ElectronComunicator("Discord",None,PATH,port,True)
	EComunic.use_most_recent_version()
	EComunic.find_first_open_process()
	open = EComunic.is_already_open()
	print(open)
	if open == ElectronComunicator.OpenStates.DefaultOpen:
		EComunic.kill_app() #if it is open but not in debug mode close it
	if open != ElectronComunicator.OpenStates.DebugOpen:
		EComunic.launch(args) # if it isnt in debug mode it is closed as it should have been closed previously
		# sleep(WAIT)
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
	mains = []
	if os.path.exists(os.path.join("..","main.json")):
		try:
			mains = json.load(open(os.path.join("..","main.json"),"r"))
		except json.decoder.JSONDecodeError:
			mains = []
	return json.dumps({"files":files_list, "mains":mains})


@server.route("/scripts/<path:filename>")
@cross_origin()
def scripts(filename):
	return send_from_directory("..\\scripts\\",filename)


@server.route("/portal/<urlB64>", methods=['GET', 'POST', 'DELETE', 'PUT', 'PATCH'])
def portalUrl(urlB64:str):
	# https://stackoverflow.com/a/36601467/15755351
	resp = requests.request(
		method=request.method,
		url = base64.b64decode(urlB64.replace("-","/")),
		headers={key: value for (key, value) in request.headers if key != 'Host'},
		data=request.get_data(),
		cookies=request.cookies,
		allow_redirects=False)

	excluded_headers = [
		"content-encoding",
		"content-length",
		"transfer-encoding",
		"connection"
		"keep-alive",
		"proxy-authenticate",
		"proxy-authorization",
		"te",
		"trailers",
		"upgrade"
	]
	headers = [
		(name, value)for (name, value) in
		resp.raw.headers.items()
		if name.lower() not in excluded_headers
	]

	response = Response(resp.content, resp.status_code, headers)
	return response

class Return:
	def __init__(self):
		self.returned = False
		self.returnValue = None
	def Return(self,value=None):
		print("returned "+str(value))
		self.returned = True
		self.returnValue = value

def mainLaunch(r,args):
	discordDebugger = launchDiscord(args)
	try:
		for w in discordDebugger.get_windows():
			print(w)
			try:
				discordDebugger.run_code(w, """fetch('http://127.0.0.1:2829/bootloader.js').then((response) => response.text()).then(data => eval(data));""")
			except websocket._exceptions.WebSocketBadStatusException:
				print("Error: The injection failed standard discord opended")
	except requests.exceptions.ConnectionError:
		print("Error: The electron app failed the debug connection (posibly not in debug mode)",file=sys.stderr)
		return r.Return(False)
	return r.Return(True)

def parseArgs(args:list[str]):
	flags = []
	discordArgs = []
	for arg in args:
		if arg != "--" and len(discordArgs) == 0:
			flags.append(arg)
		else:
			discordArgs.append(arg)
	print(discordArgs)
	return flags,discordArgs[1:]

class popupIO(io.StringIO):
	def __init__(self, title:str, mirrorIo:io.StringIO=None):
		self.title = title
		self.mirrorIo = mirrorIo
	def write(self, text: str):
		if self.mirrorIo != None:
			self.mirrorIo.write(text)
		if os.name == "nt":
			import ctypes
			ctypes.windll.user32.MessageBoxW(0, text, self.title, 1)
		# if os.name == ""
	def read(self,*args,**kwargs):
		return self.mirrorIo.read(*args,**kwargs)


import ctypes
if __name__ == "__main__":
	os.chdir(os.path.dirname(__file__))
	oldStdErr = sys.stderr
	oldStdOut = sys.stdout
	if sys.executable.endswith("pythonw.exe"):
		logger = open("logging.log","w")
		sys.stderr = logger
		sys.stdout = logger
	try:
		flags, args = parseArgs(sys.argv)
		if "--no-inject" not in flags:
			ITR = Return()
			injectThread = Thread(target = mainLaunch,args=(ITR,args,))
			injectThread.start()
		if "--no-server" not in flags:
			server.run(debug=False,port=2829)
	except KeyboardInterrupt:
		ctypes.windll.user32.MessageBoxW(0, "exiting keybard interupt", "DISCORD DEBUG", 1)
		print("Exiting",file=sys.stderr)
	sys.stderr = oldStdErr
	sys.stdout = oldStdOut
