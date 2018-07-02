from tornado.wsgi import WSGIContainer
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer

#import gevent.monkey
# gevent.monkey.patch_all()
import time
import sys
import json
import traceback
import logging
import multiprocessing
import ntplib
import socket
import psutil
import struct
import shutil
import uuid
import platform
import os
import math
import signal
import sqlite3
import pyAesCrypt
import snowflake
import simplejson
import re
import ctypes
import requests
import concurrent.futures
import monitorServer
import backupServer
import commServer
import logServer
import daqbrokerSettings
import webbrowser
import zipfile
import io
from asteval import Interpreter
from concurrent_log_handler import ConcurrentRotatingFileHandler
from subprocess import call
from subprocess import check_output
#from bcrypt import gensalt
from functools import reduce
from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy import bindparam
from sqlalchemy import func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session
from logging.handlers import RotatingFileHandler
from sqlalchemy_utils.functions import database_exists
from sqlalchemy_utils.functions import drop_database
from sqlalchemy_utils.functions import create_database
from flask import Flask
from flask import Markup
from flask import request
from flask import render_template
from flask import redirect
from flask import send_from_directory
from flask import url_for
from flask import session
from flask import flash
from flask import jsonify
from flask import request_tearing_down
#fom gevent.pywsgi import WSGIServer
#from sympy import *
from numpy import asarray, linspace
from scipy.interpolate import interp1d
from numbers import Number
import app
from bpApp import multiprocesses


class daqbrokerServer:
    """
    Main server application class. This class can be used to start the DAQBroker server environment and contains the following members

    :ivar localSettings: (string) name of the local settings database file (defaults to `localSettings`)
    :ivar appPort: (integer) network port for the DAQBroker server REST API (defaults to `7000`)
    :ivar logFileName: (string) name of the logging file (defaults to `logFIle`)

    """
    def __init__(self, localSettings='localSettings', appPort=7000, logFileName='logFile.txt'):
        self.logFile = logFileName
        self.appPort = appPort
        self.localSettings = localSettings
        #print(self.logFile, self.appPort, self.localSettings)

    def start(self, detached=False):
        """
        Starts the DAQBroker server environment.

        .. warning::

            This is a long running process and blocks execution of the main task, it should therefore be called on a separate process.

        :param detached: Unusable in current version. Meant to be used to launch a background (daemon-like) environment to continue to be used in the same python session
        """
        startServer(localSettings=self.localSettings,appPort=self.appPort, logFilename=self.localSettings)


alphabets = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z']
VERSION = "0.1"
timeStart = time.time()
strings = []

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def setupLocalSettings(localSettings='localSettings'):
    try:
        if not os.path.isdir('static'):
            print("Server files not found on this directory. Setting up required files . . .")
            canUseLocal = False
            if os.path.isfile('server.zip'):
                canUseLocal = True
            if canUseLocal:
                useLocal = False
                choice = input("Server files found in local compressed file, use these? (Could be out of date)\n\t1. Yes\n\t2. No\nMake a choice[1]:")
                if choice == '1':
                    useLocal = True
            if useLocal:
                zipFiles = zipfile.ZipFile('server.zip')
                z = zipfile.ZipFile(io.BytesIO(zipFiles.content))
                z.extractall()
                print("done")
            else:
                zipFiles = requests.get("https://daqbroker.com/downloads/server.zip")
                if zipFiles.ok:
                    z = zipfile.ZipFile(io.BytesIO(zipFiles.content))
                    z.extractall()
                    print("done")
                else:
                    sys.exit("Files not found on remote server. Make sure you have internet connection before trying again.")
        if os.path.isfile(localSettings):  # Must create new local settings
            isNewDB = False
        else:  # Already there, let's hope with no problems
            isNewDB = True
        databases = []
        session = daqbrokerSettings.scoped()
        daqbrokerSettings.daqbroker_settings_local.metadata.create_all(
            daqbrokerSettings.localEngine)
        #id = snowflake.make_snowflake(snowflake_file='snowflake')
        if isNewDB:
            newGlobal = daqbrokerSettings.Global(
                clock=time.time(),
                version=VERSION,
                backupfolder="backups",
                importfolder="import",
                tempfolder="temp",
                ntp="NONE",
                logport=9092,
                commport=9090,
                remarks="{}")
            session.add(newGlobal)
            newFolder = daqbrokerSettings.folder(
                clock=time.time(), path="backups", type="0", remarks="{}")
            session.add(newFolder)
            newFolder = daqbrokerSettings.folder(
                clock=time.time(), path="imports", type="0", remarks="{}")
            session.add(newFolder)
            newFolder = daqbrokerSettings.folder(
                clock=time.time(), path="temp", type="0", remarks="{}")
            session.add(newFolder)
            newNode = daqbrokerSettings.nodes(
                node=monitorServer.globalID,
                name="localhost",
                address="127.0.0.1",
                port=9091,
                local="127.0.0.1",
                active=True,
                lastActive=time.time(),
                tsyncauto=False,
                remarks="{}")
            session.add(newNode)
            globals = {
                'clock': time.time(),
                'version': VERSION,
                'backupfolder': 'backups',
                'importfolder': 'import',
                'tempfolder': 'temp',
                'ntp': None,
                'remarks': {},
                'commport': 9090,
                'logport': 9092,
                'isDefault': True}  # Default values, should I use this?
        else:
            maxGlobal = session.query(
                daqbrokerSettings.Global).filter_by(
                clock=session.query(
                    func.max(
                        daqbrokerSettings.Global.clock))).first()
            if maxGlobal:
                globals = {}
                for field in maxGlobal.__dict__:
                    if not field.startswith('_'):
                        globals[field] = getattr(maxGlobal, field)
            else:
                pass  # Something very wrong happened with the local settings, this should be handled with a GUI
        session.commit()
        return globals
    except Exception as e:
        traceback.print_exc()
        session.rollback()
        sys.exit('Could not set up local settings, make sure you have the correct access rights for this folder and restart the application!')


def startServer(localSettings='localSettings', appPort=7000, logFilename="logFile.log"):
    global theApp
    bufferSize = 64 * 1024
    password = str(snowflake.make_snowflake(snowflake_file='snowflake'))
    manager = multiprocessing.Manager()
    servers = manager.list()
    workers = manager.list()
    backupInfo = manager.dict()
    for i in range(0, 10000):
        workers.append(-1)
    if os.path.isfile('secretEnc'):
        pyAesCrypt.decryptFile(
            "secretEnc",
            "secretPlain",
            password,
            bufferSize)
        file = open("secretPlain", 'r')
        aList = json.load(file)
        for server in aList:
            servers.append(server)
        file.close()
        os.remove("secretPlain")
    globals = setupLocalSettings(localSettings)
    theApp = app.createApp(theServers=servers, theWorkers=workers)
    p = multiprocessing.Process(
        target=backupServer.startBackup, args=(
            'static/rsync', backupInfo))
    p.start()
    multiprocesses.append(
        {'name': 'Backup', 'pid': p.pid, 'description': 'DAQBroker backup process'})
    time.sleep(1)
    p = multiprocessing.Process(
        target=logServer.logServer, args=(
            globals["logport"],), kwargs={
            'logFilename': logFilename})
    p.start()
    multiprocesses.append(
        {'name': 'Logger', 'pid': p.pid, 'description': 'DAQBroker log process'})
    time.sleep(1)
    p = multiprocessing.Process(
        target=commServer.collector,
        args=(
            servers,
            globals["commport"],
            globals["logport"],
            backupInfo))
    p.start()
    multiprocesses.append({'name': 'Collector', 'pid': p.pid,
                           'description': 'DAQBroker message collector process'})
    time.sleep(1)
    p = multiprocessing.Process(
        target=monitorServer.producer,
        args=(
            servers,
            globals["commport"],
            globals["logport"],
            False,
            backupInfo,
            workers
        ))
    p.start()
    multiprocesses.append({'name': 'Producer', 'pid': p.pid,
                           'description': 'DAQBroker broadcasting server process'})
    time.sleep(1)
    http_server = HTTPServer(WSGIContainer(theApp))
    http_server.listen(appPort)
    webbrowser.open('http://localhost:'+str(appPort)+"/daqbroker")
    IOLoop.instance().start()


if __name__ == "__main__":
    multiprocessing.freeze_support()
    theArguments = ['localSettings', 'appPort', 'logFileName']
    obj = {}
    if len(sys.argv) < 5:
        for i, val in enumerate(sys.argv):
            if i == len(theArguments) + 1:
                break
            if i < 1:
                continue
            obj[theArguments[i - 1]] = val
    else:
        sys.exit(
            "Usage:\n\tdaqbrokerServer localSettings apiPort logFile\nOr:\n\tdaqbrokerServer localSettings apiPort\nOr:\n\tdaqbrokerServer localSettings\nOr:\n\tdaqbroker")
    if os.path.isfile('pid'):
        if 'appPort' in obj:
            appPort = int(obj['appPort'])
        else:
            appPort = 7000
        with open('pid', 'r') as f:
            existingPID = f.read().strip('\n').strip('\r').strip('\n')
        processExists = False
        if existingPID:
            if psutil.pid_exists(int(existingPID)):
                processExists = True
        if not processExists:
            with open('pid', 'w') as f:
                f.write(str(os.getpid()))
                f.flush()
            newServer = daqbrokerServer(**obj)
            newServer.start()
        else:
            webbrowser.open('http://localhost:' + str(appPort) + "/daqbroker")
    else:
        with open('pid', 'w') as f:
            f.write(str(os.getpid()))
            f.flush()
        newServer = daqbrokerServer(**obj)
        newServer.start()
