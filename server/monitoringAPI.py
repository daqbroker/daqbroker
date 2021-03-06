import time
import traceback
import struct
import shutil
import json
import sqlite3
import daqbrokerDatabase
import daqbrokerSettings
from sqlalchemy import text
from sqlalchemy import bindparam
from sqlalchemy import func
from sqlalchemy.orm import sessionmaker
from flask import Blueprint
from flask import request
from flask import render_template
from flask import session
from flask_login import login_required
from flask_login import current_user
from supportFuncs import *

monitoringBP = Blueprint('monitoring', __name__, template_folder='templates')

base_dir = '.'
if getattr(sys, 'frozen', False):
    base_dir = os.path.join(sys._MEIPASS)

@monitoringBP.route("/", methods=['GET'])
@login_required
def main():
    connection = connect(request)
    session['currentURL'] = url_for('monitoring.main')
    return render_template('monitoring/main.html')


@monitoringBP.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    if request.method == 'POST':
        return response
    else:
        return render_template("error.html", errorMsg=error.to_dict()["message"], errorNo=error.status_code)


@monitoringBP.route("/queryNodes", methods=['POST'])
@login_required
def queryNodes():
    """ Get the list of local active network DAQBroker clients

    .. :quickref: Get node list; Get list of active remote DAQBroker clients

    :param: nodeName : (String) unique identifier sting of a node

    :returns: JSON encoded object of requested node if **nodeName** is specified. List of existing nodes if not. A node is an object with the following attributes

            | ``node`` : (String) unique node identifier
            | ``name`` : (String) visible name of node
            | ``address`` : (String) network address as seen from the server application
            | ``port`` : (Integer) remote communications port
            | ``active`` : (Boolean) flagged for monitoring
            | ``lastActive`` : (Integer) last activity timestamp
            | ``tsyncauto`` : (Boolean) flagged for software synchronization
            | ``remarks`` : (String) Extra health information

    """
    nodes = []
    nodes2 = []
    processes = []
    #daqbrokerSettings.setupLocalVars(localPath)
    scoped = daqbrokerSettings.getScoped()
    localConn = scoped()
    if ('nodeName' in request.form) or ('nodeName' in request.args):
        if 'nodeName' in request.form:
            nodeName = request.form['nodeName']
        elif 'nodeName' in request.args:
            nodeName = request.args['nodeName']
        theNode = localConn.query(daqbrokerSettings.nodes).filter_by(node=nodeName).first()
        #for row in localConn.execute("SELECT * FROM nodes WHERE node = ?", (nodeName,)):
        #    theNode = row
        if not (theNode is None):
            theObjct2 = {}
            for field in theNode.__dict__:
                if not field.startswith('_'):
                    theObjct2[field] = getattr(theNode, field)
            return jsonify(theObjct2)
        else:
            raise InvalidUsage('Could not find the requested node', status_code=500)
    else:
        for node in localConn.query(daqbrokerSettings.nodes).all():
            theObjct2 = {}
            for field in node.__dict__:
                if not field.startswith('_'):
                    theObjct2[field] = getattr(node, field)
            nodes.append(theObjct2)
        #localConn.close()
        return jsonify(nodes)


@monitoringBP.route("/toggleNodeSync", methods=['POST'])
@login_required
@require_admin
def toggleNodeSync():
    """ Toggles the node's automated software time synchronization routine. If turned on, the server will provide a node with a specific time server to issue synchronization requests

    .. :quickref: Toggle node synchronization; Toggle node software synchronization flag

    :param: nodeName : (String) Unique node identifier

    """
    nodes = []
    if 'nodeName' in request.form:
        nodeName = request.form['nodeName']
    elif 'nodeName' in request.args:
        nodeName = request.args['nodeName']
    else:
        raise InvalidUsage('No node name provided', status_code=500)
    result = connection.execute(
        text("UPDATE daqbroker_settings.nodes SET tsyncauto=NOT tsyncauto WHERE node=:name"),
        name=nodeName)
    return jsonify('done')


@monitoringBP.route("/testNode", methods=['POST'])
@login_required
@require_admin
def testNode():
    """ Attempt to contact a DAQBroker client machine, validate its sharing link and adding the node to the monitoring link

    .. :quickref: Setup client node; Setup a DAQBroker client network node

    :param: id: (String) unique node identifier
    :param: shareStr: (String) share string generated by the client application

    """
    #localConn = sqlite3.connect('localSettings')
    scoped = daqbrokerSettings.getScoped()
    localConn = scoped()
    #localConn.row_factory = dict_factory
    if('id' in request.form):
        idToTest = request.form['id']
    elif('id' in request.args):
        idToTest = request.args['id']
    else:
        raise InvalidUsage("No ID provided", status_code=403)
    if('shareStr' in request.form):
        shareStr = request.form['shareStr']
    elif('shareStr' in request.args):
        shareStr = request.args['shareStr']
    else:
        raise InvalidUsage("No share string provided", status_code=403)
    smallestClock = time.time() - 24 * 60 * 60
    responses = idTest(idToTest, shareStr)
    if responses:
        if responses[0]["result"]:
            try:
                newNode = daqbrokerSettings.nodes(
                    node=responses[0]["node"]["id"],
                    name=responses[0]["node"]["node"],
                    address=responses[0]["address"],
                    port=responses[0]["node"]["port"],
                    local=responses[0]["node"]["serverAddr"],
                    active=True,
                    lastActive=time.time(),
                    tsyncauto=False,
                    remarks=json.dumps(responses[0]["node"]["details"])
                )
                localConn.add(newNode)
                localConn.commit()
                localConn.close()
                return jsonify("done")
            except Exception as e:
                #localConn.close()
                traceback.print_exc()
                localConn.rollback()
                raise InvalidUsage(str(e), status_code=500)
        else:
            #localConn.close()

            raise InvalidUsage("Share string comparison failed!", status_code=500)
    else:
        #localConn.close()

        raise InvalidUsage("No node replied, are you sure you are contacting the correct node?", status_code=500)


@monitoringBP.route("/getNodes", methods=['POST'])
@login_required
@require_admin
def getNodes():
    """ Get a list of existing local area DAQBroker clients not connected to the machine

    .. :quickref: Get nodes to setup; List local nodes still to setup

    :returns: List of node objects that require connection to the machine

            | ``id`` : (String) unique node identifier
            | ``node`` : (String) visible name of node
            | ``address`` : (String) network address as seen from the server application
            | ``serverAddr`` : (String) server application address as seen from the node
            | ``port`` : (Integer) remote communications port
            | ``details`` : (String) Extra health information

    """
    #localConn = sqlite3.connect('localSettings')
    #localConn.row_factory = dict_factory
    results = sendNodeQuery("0.1", {})
    return jsonify(results)


@monitoringBP.route("/daqbroker/gatherNodeData", methods=['POST', 'GET'])
@login_required
def gatherNodeData():
    """ Gathers general purpose information from a supplied node

            :param type: (Integer) type of request

                    | ``1`` : Network port data request
                    | ``2`` : Serial port data request

            :param order: (String) type of request. Required when **type=2**

                    | ``getPorts`` : Get serial port list
                    | ``getPortData`` : Get data from specific port

            :param remarks: (string) JSON encoded string with relevant extra information. Required when **type=2** and **order='getPortData'**

    """
    processRequest = request.get_json()
    scoped = daqbrokerSettings.getScoped()
    localConn = scoped()
    #localConn = sqlite3.connect('localSettings')
    #localConn.row_factory = dict_factory
    theNode = localConn.query(daqbrokerSettings.nodes).filter_by(name=processRequest["node"]).first()
    #for row in localConn.execute("SELECT * FROM nodes WHERE name = ?", (processRequest["node"],)):
    #    theNode = row
    if int(processRequest["type"]) == 1:
        unique = uuid.uuid1()
        p = workerpool.submit(getPortData,
                              int(processRequest["remarks"]["port"]),
                              theNode,
                              int(processRequest["remarks"]["parseInterval"]),
                              processRequest["remarks"]["command"],
                              str(unique),
                              app.config['workers'],
                              False)
        # p.start()
        current_app.config['workers'].append({'id': str(unique), 'process': p.pid,
                                      'status': 0, 'data': [], 'time': time.time()})
        return json.dumps({'id': str(unique), 'type': 'peripheralRequest'})
    elif int(processRequest["type"]) == 2:
        if 'order' in processRequest:
            if processRequest["order"] == "getPorts":
                unique = uuid.uuid1()
                p = workerpool.submit(getCommPorts, theNode, str(unique), current_app.config['workers'])
                # p.start()
                current_app.config['workers'].append({'id': str(unique), 'process': p.pid,
                                              'status': 0, 'data': [], 'time': time.time()})
                return json.dumps({'id': str(unique), 'type': 'peripheralRequest'})
            elif processRequest["order"] == "getPortData":
                unique = uuid.uuid1()
                p = workerpool.submit(
                    getCOMData, processRequest["remarks"]["device"], theNode, int(
                        processRequest["remarks"]["parseInterval"]), processRequest["remarks"]["command"], int(
                        processRequest["remarks"]["baudRates"]), processRequest["remarks"]["parity"], int(
                        processRequest["remarks"]["dataBits"]), processRequest["remarks"]["stopBits"], str(unique), app.config['workers'])
                # p.start()
                current_app.config['workers'].append({'id': str(unique), 'process': p.pid,
                                              'status': 0, 'data': [], 'time': time.time()})
                return json.dumps({'id': str(unique), 'type': 'peripheralRequest'})
            else:
                raise InvalidUsage('Wrong order issued', status_code=400)
    elif int(processRequest["type"]) == 3:
        print("External")
    else:
        raise InvalidUsage('Wrong routine type', status_code=400)


def getCommPorts(theNode, id, workerList):
    """Auxiliary function used by :py:func:`gatherNodeData` to gather information about existing serial communication ports on a local or remote machine

    :param theNode: (Dict) node to search for ports
    :param id: (String) unique identifier of the job in progress
    :param workerList: (List) a list where the result of the request will be stored

    :returns: 0 if request completed, None if not

    """
    try:
        portData = []
        if theNode["active"]:
            if theNode["name"] == "localhost":
                for port in serial.tools.list_ports.comports():
                    portData.append({'device': port.device, 'info': port.description, 'hwid': port.hwid,
                                     'vid': port.vid, 'serial': port.serial_number, 'manufacturer': port.manufacturer})
            else:
                context = zmq.Context()
                portServer = random.randrange(8000, 8999)
                checkSocket = SOCKETS.socket()
                checkSocket.settimeout(1)
                checkSocket.connect((theNode["address"], theNode["port"]))
                ipLocal = checkSocket.getsockname()[0]
                checkSocket.close()
                machine = "tcp://*:" + str(portServer)
                machine2 = "tcp://" + theNode["address"] + ":" + str(theNode["port"])
                message = {'order': 'GETCOMMPORTS', 'server': ipLocal, 'sendBack': portServer}
                client = context.socket(zmq.PUSH)
                server = context.socket(zmq.REP)
                server.setsockopt(zmq.RCVTIMEO, 5000)
                server.bind(machine)
                client.connect(machine2)
                client.send_json(message)
                getBack = server.recv_json()
                portData = getBack["portData"]
                client.close()
                server.close()
        for i, p in enumerate(workerList):
            if p["id"] == id:
                sideways = workerList[i]
                sideways['status'] = 1
                sideways['data'] = portData
                workerList[i] = sideways
        return 0
    except Exception as e:
        traceback.print_exc()
        for i, p in enumerate(workerList):
            if p["id"] == id:
                sideways = workerList[i]
                sideways['status'] = -1
                sideways['error'] = str(e)
                workerList[i] = sideways


def idTest(id, shareStr):
    multicast_group = ('224.224.224.224', 10090)
    # Create the datagram socket
    sock = SOCKETS.socket(SOCKETS.AF_INET, SOCKETS.SOCK_DGRAM)
    # Set a timeout so the socket does not block indefinitely when trying
    # to receive data.
    sock.settimeout(5)
    # Set the time-to-live for messages to 1 so they do not go past the
    # local network segment.
    ttl = struct.pack('b', 1)
    sock.setsockopt(SOCKETS.IPPROTO_IP, SOCKETS.IP_MULTICAST_TTL, ttl)
    nodes = []
    try:
        # Send data to the multicast group
        info = {'idTest': id, 'shareStr': shareStr, 'message': 'test'}
        toSend = json.dumps(info).encode()
        sent = sock.sendto(toSend, multicast_group)
        replies = False
        while True:
            try:
                data, server = sock.recvfrom(10240)
                try:
                    processed = json.loads(data.decode())
                    nodes.append(processed)
                    nodes[-1]['address'] = server[0]
                except BaseException:
                    # traceback.print_exc()
                    poop = 'poop'
            except BaseException:  # timeout
                # traceback.print_exc()
                break
    finally:
        sock.close()
        return nodes
