from __future__ import annotations

import os
from subprocess import Popen
import psutil
from version import version
from enum import Enum,auto
from electron_inject import ElectronRemoteDebugger as ERB


def remove_exe(procname:str)->str:
	return procname[:-4]if procname[-4:] == ".exe" else procname

class ElectronComunicator:
	def __init__(
		self,
		name:str=None,
		version:version=None,
		location:str=None,
		port:int=None,
		use_versioning:bool=True
	):
		self.name:str = name
		self.version:version = version
		self.location:str = location
		self.port:int = port
		self.use_versioning:bool = use_versioning

		self.electron_process:psutil.Process=None


	@property
	def port(self):
		return self.__port
	@port.setter
	def port(self,value):
		self.__port=value
		self.__ERB = ERB("localhost",self.port)

	def launch(self,args = []):
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
			"--remote-debugging-port="+str(self.port).zfill(5),
			*args
		],shell=True,creationflags=0x00000008|0x00000200)
		return self.electron_process
	def is_already_open(self)->ElectronComunicator.OpenStates:
		found = False
		for proc in psutil.process_iter():
			if self.name in proc.name():
				found = True
				cmdArgs = proc.cmdline()
				for arg in cmdArgs:
					if arg.startswith("--remote-debugging-port") and arg.endswith(str(self.port)):
						return ElectronComunicator.OpenStates.DebugOpen
		return ElectronComunicator.OpenStates.DefaultOpen if found else ElectronComunicator.OpenStates.NotOpen
	def kill_app(self):
		if (self.electron_process != None):
			self.electron_process.kill()
	def find_first_open_debug_version(self):
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
				return
				# print(mainP)
				# print("MAIN")
	def use_most_recent_version(self):
		if (not self.use_versioning):
			raise ValueError("To use Version make sure UseVrsioning is true")
		dirs = [ f.name for f in os.scandir(self.location) if f.is_dir() ]
		largest_version = version(0, 0)#initilisation so it can compare the lowest value
		for dir in dirs:
			if (dir.startswith("app-") and version.Parse(dir[4:]) > largest_version):
				largest_version = version.Parse(dir[4:])
		self.version = largest_version
	def get_windows(self):
		return self.__ERB.windows()
	def run_code(self,window,code):
		return self.__ERB.eval(window,code)

	class OpenStates(Enum):
		NotOpen=auto()
		DebugOpen=auto()
		DefaultOpen=auto()
