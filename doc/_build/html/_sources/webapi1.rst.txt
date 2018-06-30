Usage Examples
--------------------------------------------

This section provides examples of using DAQBroker's different interfaces

Login
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When attempting to access any DAQBroker interface, if no session is initiated, a user is prompted to provide both a server and login credentials. If no server registered with the machine running the application, the user is required to provide a server AND an engine as well as user login credentials 

.. note::

   When providing a database engine that has not used DAQBroker before it is highly suggested that the user provides credentials with global access to edit the database engine. DAQBroker will require to create new databases with the supplied user and errors will occur if the supplied user does not have write access to the database. DAQBroker does not store passwords locally it simply stores the username in a database local to the database engine supplied.

GIF HERE

Logout
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A user's session will remain active as long as the browser remains open. Closing all DAQBroker tabs will not close the session, only completely ending the browser process will remove the user session. Users can force a session to close by clicking the Logout button on the right-hand-side menu of the web interface, while a session is active

.. note::

   A DAQBroker session is unlike regular database sessions, as a single user can connect with several databases. When clicking the Logout button, a user will log out of all connected database engines and servers.

GIF HERE

Instrument interfaces
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This section refers to the interfaces that relate to instrument and node manipulation. Each interface can be accessed on the left-hand-side menu of the DAQBroker web interface

Instruments
""""""""""""""""""""""""""""""""""""

Foo

GIF HERE

Data
""""""""""""""""""""""""""""""""""""

Foo

GIF HERE

Runs
""""""""""""""""""""""""""""""""""""

Foo

GIF HERE

Nodes
""""""""""""""""""""""""""""""""""""

Foo

GIF HERE

Database interfaces
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This section refers to the interfaces that relate to global database choosing and administration. Each interface can be found on the right hand side menu of the DAQBroker web interface

Servers
""""""""""""""""""""""""""""""""""""

Foo

GIF HERE

Databases
""""""""""""""""""""""""""""""""""""

Foo

GIF HERE

Database Administrator
""""""""""""""""""""""""""""""""""""

Foo

GIF HERE

Local Administrator
""""""""""""""""""""""""""""""""""""

Foo

GIF HERE

.. _webapi: