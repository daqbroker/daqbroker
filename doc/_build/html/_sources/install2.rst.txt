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

The Windows version of the DAQBroker server, when properly installed (See :doc:`install1`) installs on your machine an application called DAQBrokerServer on your operating system. This application can be started and stopped using the windows command line or visual interface.

Linux
""""""""""""""""""""

The Linux version of the DAQBroker server, when properly installed (See :doc:`install1`) creates a compressed folder that can be uncompressed using:

.. code-block:: sh

   tar xvzf daqbroker_server_linux.tar.gz

This produces a folder with the binary version of the DAQBroker server application which can then be called from that directory by calling:

.. code-block:: sh

   ./daqbrokerServer

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

The Windows version of the DAQBroker client, when properly installed (See :doc:`install1`) installs on your machine an application called DAQBrokerClient on your operating system. This application can be started and stopped using the windows command line or visual interface.

Linux
""""""""""""""""""""

The Linux version of the DAQBroker client, when properly installed (See :doc:`install1`) creates a compressed folder that can be uncompressed using:

.. code-block:: sh

   tar xvzf daqbroker_client_linux.tar.gz

This produces a folder with the binary version of the DAQBroker server application which can then be called from that directory by calling:

.. code-block:: sh

   ./daqbrokerClient