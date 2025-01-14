# devwebpen Java daemon

## Introduction

The devwebpen Java daemon is a background service designed to handle various tasks for the devwebpen application. It ensures smooth operation and efficient processing of backend functionalities.

## Compilation and Building

To compile the project, you need to use `mvn clean install`. Make sure you are in the `src-daemon` directory before running the command:

```sh
mvn clean install
```

To build a native image, you can use GraalVM. Download GraalVM from [GraalVM Downloads](https://www.graalvm.org/downloads/). Ensure you are in the `src-daemon` directory and then run the following command:

```sh
native-image -o target/devwebpen-daemon -jar "<target/devwebpen-X.X.X.jar>"
```
