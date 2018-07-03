# DAQBroker

This is the main repository page for the DAQBroker code. This page is meant for developers wishing to learn more about the code behind DAQBroker or who want to contribute to this project.

## What is DAQBroker?

DAQBroker is an instrument monitoring framework. It is a set of programs, classes, models and functions that allow data to be collected from an instrument and stored in a centralized and protected repository for authenticated users to access. By providing a flexible and integrated environment, instrument operators can easily access their instrument's data as well as easily share their data with any collaborators such as scientists or R&D staff that require access to that data.

### Language

DAQBroker is built in Python, meaning it is not also very flexible in implementation, it can also take advantage of a highly specialized set of scientific analysis tools and algorithms to analyse data.

### Network

DAQBroker can be deployed on a single machine or on a network of computers by using the lightweight client application. As long as there is an internet connection to your instrument's machine, geographical distance will not be a problem for DAQBroker!

### Storage

Collected instrument data is stored in a centralized relational database which can be powered by any of the most popular engines freely and commercially available.

## Contents

This repository is divided into two main sections of code:

* [The server application](https://github.com/daqbroker/daqbroker/tree/master/server) - which contains the code for the bulk of DAQBroker's code, this application contains the persistent monitoring processes and provides the interfaces for users to create, edit, add, delete and manipulate instruments and their data
* [The client application](https://github.com/daqbroker/daqbroker/tree/master/client) - a small but still important part of the code, since it can be used as a lightweight proxy to the server application to collect data from remote instruments.

## More info

* [Main project website](https://daqbroker.com)
* [Documentation](https://daqbroker.com/documentation)