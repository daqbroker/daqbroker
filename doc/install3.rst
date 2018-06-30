Database engines
------------------------

DAQBroker allows users to connect and retrieve info from specifically created databases over a large amount of compatible database engines. This section aims to provide users with a list of databases compatible with DAQBroker. Since DAQBroker uses the `SQLAlchemy`_ Object Relational Mapper (ORM) to handle the general purpose DAQBroker model, most relational database engines should be compatible with DAQBroker. However, certain administrative tasks such as user creation and management are handled in a drastically different way. Thus this section will contain a list of database engines compatible with DAQBroker.

Compatible databases
^^^^^^^^^^^^^^^^^^^^^^

* `MySQL`_ - Fully tested
* `PostgresSQL`_ - Fully tested
* `OracleDB`_ - Untested (Administrative tasks should fail)
* `MS SQL Server`_ - Untested (Administrative tasks should fail)


.. _`SQLAlchemy` : https://www.sqlalchemy.org/
.. _`MySQL` : https://www.mysql.com/
.. _`PostgresSQL` : https://www.postgresql.org/
.. _`OracleDB` : https://www.oracle.com/database/index.html
.. _`MS SQL Server` : https://www.microsoft.com/en-us/sql-server