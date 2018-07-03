# DAQBroker Server

## Introduction

This is the most important part of the DAQBroker framework, which consists of several automated persistent monitoring services along with a flask-based web application with included front-end interface that allows users to create or edit virtual instrument representations, gather instrument data of said instruments and easily chart, manipulate and share that data with other collaborators in your scientific projects.

## Resources

This page is a repository to contain the most up-to-date version of DAQBroker's code as well as a forum for users, developers and contributors to start a conversation about specific issues and to suggest new features to the framework.

* [Main project website](https://daqbroker.com)
* [Documentation](https://daqbroker.com/documentation)

## Instalation

A binary distribution of this project exists for both Windows and Linux. This section focuses on installation of DAQBroker on a python environment.

You should install DAQBroker using the regular `pip` installation method (as per the rules in a virtual environment):

### Install daqbroker Server

```
pip install daqbrokerServer
```

## Supported databases

DAQBroker uses the [SQLAlchemy](https://www.sqlalchemy.org/) ORM for database access and manipulation. However, DAQBroker also handles administrator tasks, specifically database and user creation/edit/deletion. These actions are not supported via the ORM meaning that specific code must be created for these administrative tasks for each database engine. This section contains a list of database engines that are currently supported as well as database engines that are on track for full support. If you would like to suggest a database engine to be supported by DAQBroker, feel free to issue or pull request if you have your own code to handle DAQBroker with.

* MySQL - Fully tested and compatible
* Postgres - Fully tested and compatible
* Oracle - Missing adminstrator tasks (ongoing)
* MSSQL - Missing adminstrator tasks (ongoing)