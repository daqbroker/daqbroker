Server application
----------------------------------

This section provides a description and reference of all functions and objects used in the main DAQBroker server application. This application consists of several subprocesses, each responsible to ensure that the relevant services and automatic tasks are preformed

Monitoring Server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Description
"""""""""""""""""""""""""""

The monitoring server is the workhorse of DAQBroker. It is responsible for recognizing all the database engines users have connected to, gathering the state of each database associated with each engine and collecting gathering and storing the most recent data from all instruments associated with each database. The following is a list of all objects and functions associated with the monitoring server.

Reference
"""""""""""""""""""""""""""

.. automodule:: monitorServer
   :members:

Backup Server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Description
"""""""""""""""""""""""""""

The backup server is responsible for ensuring that the relevant data from each instrument is properly gathered and updated in a central folder structure. The following is a list of all objects and functions associated with the backup server.

Reference
"""""""""""""""""""""""""""

.. automodule:: backupServer
   :members:


Communications Server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Description
"""""""""""""""""""""""""""

The communications server allows remote machines to connect to a central DAQBroker server application and send instrument information from instruments that would otherwise be out of reach from the main server application. The following is a list of all objects and functions associated with the communications server.

Reference
"""""""""""""""""""""""""""

.. automodule:: commServer
   :members:

Event Log Server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Description
"""""""""""""""""""""""""""

The event server is a background process that is responsible for creating an ordered list of events that occurr in the DAQBroker framework. An event can be of one of three types:

   * Information - information on an event that should regularly occur.
   * Warning - information on possible exceptions that don't break the framework flow
   * Error - information on unexpected exceptions that break the framework flow

Each event is also associated with a specific subprocess or function on which it occurred. The following is a list of all objects and functions associated with the logging server.

Reference
"""""""""""""""""""""""""""

.. automodule:: logServer
   :members:
