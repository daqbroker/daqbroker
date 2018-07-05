Installation
------------------

This section provides information on the different ways of setting up DAQBroker on your machine

Native Python
^^^^^^^^^^^^^

DAQBroker can be installed as a python module with all functionalities. It is simply a matter of using `pip`_


.. _pip: https://pypi.org/project/pip/

.. code-block:: sh

   pip install daqbroker

.. warning::

   DAQBroker is not guaranteed to work for python below 3.4


Windows
^^^^^^^^^^^^^

A Windows self-extractor is available for both the client and the server applications, you can access them via `this link`_. Follow the prompts from the installer and you will have a working binary distribution of DAQBroker


.. Several installers built with `pyinstaller`_ are available for windows environment. Follow `this link`_ to check them out

.. _pyinstaller: https://www.pyinstaller.org/
.. _this link: https://daqbroker.com/services.html

Linux
^^^^^^^^^^^^^

A Linux binary distribution is also available for both client and server versions of DAQBroker and can be accessed via `this link`_. You can also get these files without a browser by way of the ``wget`` utility:

.. code-block:: sh

   wget https://www.daqbroker.com/downloads/daqbroker_client_linux.tar.gz #Client version
   wget https://www.daqbroker.com/downloads/daqbroker_server_linux.tar.gz #Server version

.. note::

   This version has only been tested in an 18.04 version of Ubuntu, while it might work on other Debian distributions, it might not work in other Linux flavours. Contact us for binaries for specific flavours.
