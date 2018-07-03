# DAQBroker Client

## Introduction

This is a lesser important part of the DAQBroker framework, which consists of a network listener that is capable of being registered to a DAQBroker server application and to register itself with a DAQBroker application. Once registered and while the application is running, this client transmits relevant information about the machine running it. It is also capable of interpreting orders from server applications to provide an instrument's data, provided the [virtual instrument representation]( https://daqbroker.com/documentation/server1.html ) was correctly associated to the machine.

## Resources

This page is a repository to contain the most up-to-date version of DAQBroker's code as well as a forum for users, developers and contributors to start a conversation about specific issues and to suggest new features to the framework.

* [Main project website](https://daqbroker.com)
* [Documentation](https://daqbroker.com/documentation)

## Instalation

A binary distribution of this project exists for both Windows and Linux. This section focuses on installation of DAQBroker on a python environment.

You should install DAQBroker using the regular `pip` installation method (as per the rules in a virtual environment):

### Install daqbroker Server

```
pip install daqbrokerClient
```
