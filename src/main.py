from __future__ import annotations
import os
import sys
from threading import Thread
import pathnav

# THE FIRST THING WE DO IS OPEN DISCORD
# this is because it is slow doing everything else
# so they can all wait whilst discord opens

USER_PATH = os.path.expanduser("~")
PATH = f"{USER_PATH}\\AppData\\Local\\Discord"
FILENAME = __file__
EXECUTING_PATH = pathnav.path(os.path.abspath(FILENAME)).parent_dir
COMMUNICATOR_PATH = EXECUTING_PATH.up().into("electron-comunicator")
SCRIPTS_PATH = EXECUTING_PATH.up().into("scripts")
VERSION_URL = "https://raw.githubusercontent.com/RJ-Infinity/ThisCord/master/version.json"
RENDERERPORT = 8473
MAINPROCPORT = 8474
SERVERPORT = 2829
sys.path.insert(0, COMMUNICATOR_PATH.path)
from comunicator import ElectronComunicator

def discordClosed(DiscordProcess):
	os.kill(DiscordProcess.pid, 0)
	os.system("TASKKILL /f /IM discord.exe > nul")
	os._exit(0)

def handleDiscordClose(DiscordProcess):
	DiscordProcess.communicate()
	discordClosed(DiscordProcess)

def launchDiscord(args):
	global DiscordProcess
	EComunic = ElectronComunicator("Discord",PATH,RENDERERPORT,MAINPROCPORT,True)
	EComunic.use_most_recent_version()
	open = EComunic.is_already_open()
	print(open)
	if open == ElectronComunicator.OpenStates.DefaultOpen:
		EComunic.kill_app() #if it is open but not in debug mode close it
	if open != ElectronComunicator.OpenStates.DebugOnlyOpen:
		DiscordProcess = EComunic.launch(args) # if it isnt in debug mode it is closed as it should have been closed previously
		CloseThread = Thread(target=handleDiscordClose, args=(DiscordProcess,)) # create and start new thread to handle discord closing also closing script
		CloseThread.start()
	return EComunic

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

if __name__ == "__main__":
	flags, args = parseArgs(sys.argv)
	if "--no-launch" not in flags:
		discordDebugger = launchDiscord(args)

# THIS IS THE REST OF THE FILE
# this file is essentialy split into two files
# so that there is no additional overhead loading discord
import json
import io
from fastapi import FastAPI, Request, Response
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import base64
import websocket
import ctypes
import uvicorn

server = FastAPI()
server.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost", "https://discord.com"],
	allow_credentials=False,
	allow_methods=["*"],
	allow_headers=["*"],
)
NoCache = {"Cache-Control": "no-cache"}

@server.get("/bootloader.js")
async def code(request: Request, response: Response):
	return FileResponse("bootloader.js", headers=NoCache, media_type="text/plain")

@server.get("/filesList")
def files(request: Request, response: Response):
	files_list = []
	for path, _, files in os.walk(os.path.join("..","scripts")):
		for file in files:
			files_list.append(os.path.join(path, file)[len(os.path.join("..","scripts","")):].replace("\\","/"))
	return JSONResponse(content={
		"files":files_list,
		"install_dir":os.path.abspath(os.path.join(os.path.curdir,"..")),
		"install_dir_unc":"file://"+os.path.abspath(os.path.join(os.path.curdir,"..")).replace("\\","/"),
	}, headers=NoCache)

@server.get("/scripts/{filename:path}")
async def scripts(request: Request, response: Response, filename: str):
	script_path = SCRIPTS_PATH.get_file(filename)
	if script_path == None:
		return Response(json.dumps({"error": "script not present"}), status_code = 404)
	if not script_path.is_subdir(SCRIPTS_PATH):
		return Response(json.dumps({"error": "cannot serve file that is not in the verified scripts folder"}), status_code = 401)
	return FileResponse(script_path.path, headers=NoCache)

@server.route("/portal/{urlB64}", methods=['GET', 'POST', 'DELETE', 'PUT', 'PATCH'])
def portalUrl(request: Request, response: Response, urlB64:str):
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

	response = Response(resp.content, status_code=resp.status_code, headers=headers)
	return response

@server.get("/version")
async def scripts(request: Request):
	response = requests.get(VERSION_URL)
	with open("../version.json", "r") as version:
		currentVersion = json.load(version)
		return JSONResponse(content={"latest": response.json(), "current": currentVersion}, headers=NoCache)

@server.post("/events/close")
async def close(request: Request, response: Response):
	print("Received close event. Cleanup initiated")
	discordClosed(DiscordProcess)

def inject(flags):
	try:
		discordDebugger
	except NameError:
		discordDebugger = ElectronComunicator("Discord",PATH,RENDERERPORT,MAINPROCPORT,True)
		discordDebugger.use_most_recent_version()
		open = discordDebugger.is_already_open()
		if open == ElectronComunicator.OpenStates.DefaultOpen or open == ElectronComunicator.OpenStates.NotOpen:
			print("Error: discord debug mode not open try running without `--no-launch`")
			return
	try:
		for w in (
			[] if "--no-inject-renderer" in flags else
			discordDebugger.get_renderer_windows()
		):
			print(w.data)
			try:
				w.run_code(f"""fetch("http://127.0.0.1:{SERVERPORT}/bootloader.js").then(response => response.text()).then(data => eval(data));""")
			except websocket._exceptions.WebSocketBadStatusException:
				print("Error: The injection failed discord opened")
		for w in (
			[] if "--no-inject-mainproc" in flags else
			discordDebugger.get_mainproc_windows()
		):
			print(w.data)
			try:
				w.run_code(f"""(this.require = require)("http").get("http://127.0.0.1:{SERVERPORT}/bootloader.js",resp=>resp.on("data",d=>{{try{{eval(d.toString())}}catch(e){{console.error(e)}}}}))""")
			except websocket._exceptions.WebSocketBadStatusException:
				print("Error: The injection failed discord opended")
	except requests.exceptions.ConnectionError:
		print("Error: The electron app failed the debug connection (posibly not in debug mode)",file=sys.stderr)

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


if __name__ == "__main__":
	os.chdir(os.path.dirname(__file__))
	oldStdErr = sys.stderr
	oldStdOut = sys.stdout
	injectThread = None
	if sys.executable.endswith("pythonw.exe"):
		logger = open("logging.log","w")
		sys.stderr = logger
		sys.stdout = logger
	try:
		if "--no-inject-renderer" not in flags and "--no-inject-mainproc" not in flags:
			injectThread = Thread(target = inject, args=(flags,))
			injectThread.start()
		if "--no-server" not in flags:
			uvicorn.run(server, port=SERVERPORT)
	except KeyboardInterrupt:
		ctypes.windll.user32.MessageBoxW(0, "exiting keybard interupt", "DISCORD DEBUG", 1)
		print("Exiting",file=sys.stderr)
	sys.stderr = oldStdErr
	sys.stdout = oldStdOut
	if injectThread != None:
		injectThread.join()
	os._exit(0) # make sure all thread exit
