#!/bin/bash

# Set Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH=$JAVA_HOME/bin:$PATH

echo "Using Java: $(java -version 2>&1 | head -1)"
echo "Starting LostCity Backend..."

cd "$(dirname "$0")"
mvn spring-boot:run
