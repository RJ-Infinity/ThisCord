from __future__ import annotations

#note this is a barebones version of the dotnet Version class but in python
class version:
	def __init__(
		self,
		major:int=None,
		minor:int=None,
		build:int=None,
		revision:int=None,
		majorRevision:int=None,
		minorRevision:int=None
	):
		if (major==None):
			self.__Major = 0
		if (minor==None):
			self.__Minor = 0
		if (build==None):
			self.__Build = -1
		if (revision==None):
			self.__Revision = -1
		if (majorRevision==None):
			self.__MajorRevision = -1
		if (minorRevision==None):
			self.__MinorRevision = -1
		if (
			(major != None and major < 0) or
			(minor != None and minor < 0) or
			(build != None and build < 0) or
			(revision != None and revision < 0) or
			(majorRevision != None and majorRevision < 0) or
			(minorRevision != None and minorRevision < 0)
		):
			raise ValueError("Error Values must be positive")
		if (
			(major != None and type(major) != int) or
			(minor != None and type(minor) != int) or
			(build != None and type(build) != int) or
			(revision != None and type(revision) != int) or
			(majorRevision != None and type(majorRevision) != int) or
			(minorRevision != None and type(minorRevision) != int)
		):
			raise TypeError("Error Values must be int")
		if major != None:
			self.Major = major
		if minor != None:
			self.Minor = minor
		if build != None:
			self.Build = build
		if revision != None:
			self.Revision = revision
		if majorRevision != None:
			self.MajorRevision = majorRevision
		if minorRevision != None:
			self.MinorRevision = minorRevision


	@property
	def Major(self):return self.__Major
	@Major.setter
	def Major(self,value):
		self.__Major = value
	@property
	def Minor(self):return self.__Minor
	@Minor.setter
	def Minor(self,value):
		if self.__Major < 0:
			raise ValueError("Major must be defined before Minor can be defined")
		self.__Minor = value
	@property
	def Build(self):return self.__Build
	@Build.setter
	def Build(self,value):
		if self.__Minor < 0:
			raise ValueError("Minor must be defined before Build can be defined")
		self.__Build = value
	@property
	def Revision(self):return self.__Revision
	@Revision.setter
	def Revision(self,value):
		if self.__Build < 0:
			raise ValueError("Build must be defined before Revision can be defined")
		self.__Revision = value
	@property
	def MajorRevision(self):return self.__MajorRevision
	@MajorRevision.setter
	def MajorRevision(self,value):
		if self.__Revision < 0:
			raise ValueError("Revision must be defined before MajorRevision can be defined")
		self.__MajorRevision = value
	@property
	def MinorRevision(self):return self.__MinorRevision
	@MinorRevision.setter
	def MinorRevision(self,value):
		if self.__MajorRevision < 0:
			raise ValueError("MajorRevision must be defined before MinorRevision can be defined")
		self.__MinorRevision = value

	@classmethod
	def Parse(cls, input:str, seperatorChar:str=".")->version:
		if type(input) != str:
			raise TypeError("input must be str")
		array = input.split(seperatorChar)
		result = []
		if len(array) < 2 or len(array) > 6:
			raise ValueError("Incorect number of version points must be between two and six (inclusive)")
		for value in array:
			if not value.isdigit():
				raise ValueError("All Components must be positive integers")
			result.append(int(value))
		return cls(*result)
	
	def __eq__(self,other):
		return (
			self.Major == other.Major and
			self.Minor == other.Minor and
			self.Build == other.Build and
			self.Revision == other.Revision and
			self.MajorRevision == other.MajorRevision and
			self.MinorRevision == other.MinorRevision
		)
	def __ne__(self,other): return not self == other
	def __gt__(self,other):
		if self.Major != other.Major:
			return self.Major>other.Major
		if self.Minor != other.Minor:
			return self.Minor > other.Minor
		if self.Build != other.Build:
			return self.Build > other.Build
		if self.Revision != other.Revision:
			return self.Revision > other.Revision
		if self.MajorRevision != other.MajorRevision:
			return self.MajorRevision > other.MajorRevision
		return self.MinorRevision > other.MinorRevision
	def __ge__(self,other): return not self < other
	def __lt__(self,other):return False if self==other else self<=other
	def __le__(self,other): return not self > other
	