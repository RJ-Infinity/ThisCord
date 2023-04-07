from __future__ import annotations

import os
from subprocess import Popen
import psutil
from version import version
from enum import Enum,auto


def remove_exe(procname:str)->str:
	return procname[:-4]if procname[-4:] == ".exe" else procname

class ElectronComunicator:
	def __init__(
		self,
		name:str,
		location:str,
		rendererport:int=None,
		mainprocport:int=None,
		use_versioning:bool=True,
		version:version=None
	):
		self.name:str = name
		self.version:version = version
		self.location:str = location
		self.rendererport:int = rendererport
		self.mainprocport:int = mainprocport
		self.use_versioning:bool = use_versioning

		self.electron_process:psutil.Process=None

	def launch(self,args = []):
		if self.rendererport != None:
			args.insert(0,"--remote-debugging-port="+str(self.rendererport).zfill(5))
		if self.mainprocport != None:
			args.insert(0,"--inspect="+str(self.mainprocport).zfill(5))
		self.electron_process = Popen([
			(
				os.path.join(
					self.location,
					"app-" +
					str(self.version.Major) + "." +
					str(self.version.Minor) + "." +
					str(self.version.Build),
					self.name
				)
				if self.use_versioning else
				os.path.join(
					self.location,
					self.name
				)
			),
			*args
		],shell=True,creationflags=0x00000008|0x00000200)
		return self.electron_process
	def is_already_open(self)->ElectronComunicator.OpenStates:
		self.electron_process = None
		for proc in psutil.process_iter():
			if self.name in proc.name():
				parentP = proc
				while (parentP != None and parentP.name() == proc.name()):
					self.electron_process = parentP
					parentP = self.electron_process.parent()
				cmdArgs = self.electron_process.cmdline()
				renderer = False
				mainproc = False
				for arg in cmdArgs:
					renderer = renderer or (arg.startswith("--remote-debugging-port") and arg.endswith(str(self.rendererport)))
					mainproc = mainproc or (arg.startswith("--inspect") and arg.endswith(str(self.mainprocport)))
				if mainproc and renderer:
					return ElectronComunicator.OpenStates.InspectDebugOpen
				if mainproc:
					return ElectronComunicator.OpenStates.InspectOnlyOpen
				if renderer:
					return ElectronComunicator.OpenStates.DebugOnlyOpen
				return ElectronComunicator.OpenStates.DefaultOpen
		return ElectronComunicator.OpenStates.NotOpen
	def kill_app(self):
		if (self.electron_process != None):
			self.electron_process.kill()
		else:
			raise AttributeError("no electron process to kill find one with `is_already_open` or `find_first_open_process` or create on with `launch`")
	def find_first_open_renderer_version(self):
		for proc in psutil.process_iter():
			if self.name in proc.name():
				cmdArgs = proc.cmdline()
				for arg in cmdArgs:
					if arg.startswith("--remote-debugging-port") and arg.endswith(str(self.port)):
						return proc

	def find_first_open_process(self):
		for proc in psutil.process_iter():
			if self.name in proc.name():
				mainP = proc
				parentP = proc.parent()

				while (parentP != None and parentP.name() == proc.name()):
					mainP = parentP
					parentP = mainP.parent()
				self.electron_process = mainP
				return self.electron_process
	def use_most_recent_version(self):
		if (not self.use_versioning):
			raise ValueError("To use Version make sure UseVrsioning is true")
		dirs = [ f.name for f in os.scandir(self.location) if f.is_dir() ]
		largest_version = version(0, 0)#initilisation so it can compare the lowest value
		for dir in dirs:
			if (dir.startswith("app-") and version.Parse(dir[4:]) > largest_version):
				largest_version = version.Parse(dir[4:])
		self.version = largest_version
	def _init_windows(self, windows):
		rv = []
		for w in windows:
			rv.append(self.Window(w))
		return rv
	def get_renderer_windows(self):
		import requests # this is delayed as it is a slow operation
		import time
		return self._init_windows(requests.get(
			f"http://localhost:{self.rendererport}/json/list?t={str(int(time.time()))}"
		).json())
	def get_mainproc_windows(self):
		import requests # this is delayed as it is a slow operation
		return self._init_windows(requests.get(
			f"http://localhost:{self.mainprocport}/json/list"
		).json())

	class Window(object):
		# https://github.com/tintinweb/electron-inject
		def __init__(self, data):
				self.url = data.get("webSocketDebuggerUrl")
				if not self.url:
					raise ValueError("no debugger url int the data")
				self.data = data
				self.ws = None

		def _get_ws(self):
			if not self.ws:
				import websocket
				self.ws = websocket.create_connection(self.url)
			return self.ws

		def run_code(self,code):
			import json
			ret = json.loads(self.sendrcv(json.dumps({
				"id": 1,
				"method": "Runtime.evaluate",
				"params": {
					"contextId": 1,
					"doNotPauseOnExceptionsAndMuteConsole": False,
					"expression": code,
					"generatePreview": False,
					"includeCommandLineAPI": True,
					"objectGroup": "console",
					"returnByValue": False,
					"userGesture": True
				}
			})))
			if "result" not in ret:
				return ret
			if ret["result"].get("wasThrown"):
				raise Exception(ret["result"]["result"])
			return ret["result"]

		def send(self, *args, **kwargs):
			return self._get_ws().send(*args, **kwargs)

		def recv(self, *args, **kwargs):
			return self.ws.recv(*args, **kwargs)

		def sendrcv(self, msg):
			self.send(msg)
			return self.recv()

		def close(self):
			self.ws.close()


	class OpenStates(Enum):
		NotOpen=auto()
		DebugOnlyOpen=auto()
		InspectOnlyOpen=auto()
		InspectDebugOpen=auto()
		DefaultOpen=auto()
