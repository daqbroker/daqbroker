from abc import abstractmethod
from pydantic import BaseModel
from fastapi import HTTPException
from typing import List, Dict
from sqlitedict import SqliteDict

#class Index(BaseModel):
#	key: str
#	value = None

#This is an HTTP resource gathered by selecting individual documents from a key:value store
class Resource(BaseModel):

	class Meta:
		_indexes : List = []
		_db: SqliteDict #This has to be changed in the future to be an object that allows multiple kinds of stores
		_new: bool = False


	def __init__(self, db, index_key: str, index_value, **kwargs):
		super().__init__(**{"db": db, index_key: index_value}, **kwargs)
		self.Meta._indexes = [{"key": index_key, "value": index_value}]
		self.Meta._db = db
		if not self.get():
			self.Meta._new = True

	def insert_index(self, index_key: str, index_value):
		self.Meta._indexes.append({"key": index_key, "value": index_value})

	def selected_index(self, index_key : str):
		if index_key:
			for idx, index in enumerate(self.Meta._indexes):
				if index.key == index_key:
					return index
		return self.Meta._indexes[0]

	def get(self):
		if not self.Meta._indexes[0]["value"] in self.Meta._db:
			return False
		stored = self.Meta._db[self.Meta._indexes[0]["value"]]
		for attr, value in stored.items():
			if hasattr(self, attr):
				setattr(self, attr, value)
		return self

	def store(self):
		obj_to_insert = {attr: getattr(self, attr) for attr in (set(dir(self)) - set(dir(BaseModel))) if not attr.startswith('__') and not callable(getattr(self,attr)) and not attr == "indexes"}
		if self.Meta._indexes[0]["key"] in obj_to_insert and obj_to_insert[self.Meta._indexes[0]["key"]] != self.Meta._indexes[0]["value"]:
			self.Meta._db[obj_to_insert[self.Meta._indexes[0]["key"]]] = self.Meta._db.pop(self.Meta._indexes[0]["value"])
			self.Meta._indexes[0]["value"] = obj_to_insert[self.Meta._indexes[0]["key"]]
		self.Meta._db[self.Meta._indexes[0]["value"]] = obj_to_insert

	def delete(self):
		if not self.Meta._indexes[0]["value"] in self.Meta._db:
			return False
		del self.Meta._db[self.Meta._indexes[0]["value"]]