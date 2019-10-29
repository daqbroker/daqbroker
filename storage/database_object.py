from pathlib import Path
from sqlitedict import SqliteDict

import asyncio

from daqbroker.storage.observer import Subject, UpdateData

class DatabaseObject(Subject, SqliteDict):

	def __init__(self, filename, **kwargs):
		super().__init__(filename, **kwargs)


	def __setitem__(self, key, value):
		super().__setitem__(key, value)
		try:
			loop = asyncio.get_running_loop()
		except Exception as e:
			loop = None
		if key in self and loop:
			loop.create_task(self.notify(UpdateData(table = self.tablename, type= "alter", key=key, value=value)))

	def __delitem__(self, key):
		super().__delitem__(key)
		loop = asyncio.get_running_loop()
		try:
			loop = asyncio.get_running_loop()
		except Exception as e:
			loop = None
		if loop:
			loop.create_task(self.notify(UpdateData(table = self.tablename, type= "delete", key=key)))

