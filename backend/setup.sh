#!/bin/bash

echo "Setting up LostCity Backend..."

# Check Java version
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed. Please install Java 17 or higher."
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "Error: Java 17 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "Error: Maven is not installed. Please install Maven 3.6+."
    exit 1
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "Warning: PostgreSQL client not found. Make sure PostgreSQL is installed and running."
fi

# Generate JWT secret if not set
if [ -z "$JWT_SECRET" ]; then
    echo "Generating JWT secret..."
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    export JWT_SECRET
    echo "JWT_SECRET generated. Add this to your environment:"
    echo "export JWT_SECRET=\"$JWT_SECRET\""
fi

# Install dependencies
echo "Installing dependencies..."
mvn clean install -DskipTests

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create PostgreSQL database: CREATE DATABASE lostcity;"
echo "2. Update database credentials in src/main/resources/application.yml"
echo "3. Run: mvn spring-boot:run"
echo ""
