Deployment
--------------------------

This section provides information deploying a DAQBroker server on your machine.

DAQBroker Server
^^^^^^^^^^^^^^^^^^^^^^^

This section contains information on different strategies for deploying a DAQBroker server environment. Controlling the launching of its persistent monitoring applications and/or web API.

Python CLI
""""""""""""""""""""

The native Python version of DAQBroker exposes the :class:`daqbrokerServer <daqbrokerServer.daqbrokerServer>`. This class can be used to start the DAQBroker environment, controlling which DAQBroker services are launched:

.. automodule:: daqbrokerServer
   :members:


Windows
""""""""""""""""""""

The Windows version of the DAQBroker server, when properly installed (See REF) installs a callable application called ``DAQBrokerS`` on your operating system. This application can be started and stopped using the windows command line or visual interface.

PUT GIF HERE

.. _net.exe: https://docs.microsoft.com/en-us/windows/desktop/WinSock/net-exe-2

Linux
""""""""""""""""""""

The Linux version of the DAQBroker server, when properly installed (See REF) produces a daemon called ``daqbrokerS`` that can be started and stopped using the ``service`` command line tool:

.. code-block:: sh

   service daqbrokerS start/stop/restart

DAQBroker Client
^^^^^^^^^^^^^^^^^^^^^^^

This section contains information on different strategies for deploying a DAQBroker client.

Python CLI
""""""""""""""""""""

The native Python version of DAQBroker exposes the :class:`daqbrokerClient <daqbrokerClient.daqbrokerClient>`. This class can be used to start the DAQBroker client application, which can interface with existing DAQBroker server applications on other networked machines:

.. automodule:: daqbrokerClient
   :members:


Windows
""""""""""""""""""""

The Windows version of the DAQBroker client, when properly installed (See REF) installs a callable application called ``DAQBrokerC`` on your operating system. This application can be started and stopped using the windows command line or visual interface.

PUT GIF HERE

.. _net.exe: https://docs.microsoft.com/en-us/windows/desktop/WinSock/net-exe-2

Linux
""""""""""""""""""""

The Linux version of DAQBroker, when properly installed (See REF) produces a daemon called ``daqbrokerC`` that can be started and stopped using the ``service`` command line tool:

.. code-block:: sh

   service daqbrokerC start/stop/restart