import pytest
import json
import os
from pathlib import Path
from sqlitedict import SqliteDict
from daqbroker.storage.users import User

test_storage = SqliteDict(str(Path(__file__).parent / 'test_storage.sqlite'), tablename='users', autocommit=True, flag="n")
obj = {"username": "test_user", "password": "pass"}

def test_new_user():
	test_user=User(**obj)
	test_user.insert(test_storage, new = True)

	assert type(test_storage["test_user"]) is dict

def test_alter_user():
	test_user=User(**obj)
	test_user.get(test_storage)
	test_user.email = "email"
	test_user.insert(test_storage)

	assert test_storage["test_user"]["email"] == "email"

def test_get_user():
	test_user=User(**obj)
	test_user.get(test_storage)

	assert test_storage["test_user"]["email"] == "email"

def test_delete_user():
	test_user=User(**obj)
	test_user.remove(test_storage)

	assert ("test_user" in test_storage) == False