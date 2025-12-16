#!/bin/bash

# Script to check MongoDB connection and user count
# This helps debug "User not found" errors

echo "========================================="
echo "Lost City - User Database Check"
echo "========================================="
echo ""

# Check if MongoDB is running
echo "1. Checking MongoDB connection..."
mongosh --eval "db.version()" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ MongoDB is running"
else
    echo "   ✗ MongoDB is not running or not accessible"
    echo "   Please start MongoDB with: brew services start mongodb-community"
    exit 1
fi

echo ""
echo "2. Checking Lost City database..."

# Check if lostcity database exists
DB_EXISTS=$(mongosh --quiet --eval "db.getMongo().getDBNames().includes('lostcity')" 2>/dev/null)
if [ "$DB_EXISTS" = "true" ]; then
    echo "   ✓ Database 'lostcity' exists"
else
    echo "   ✗ Database 'lostcity' does not exist"
    echo "   The database will be created when you register your first user"
fi

echo ""
echo "3. Checking users collection..."

# Count users
USER_COUNT=$(mongosh lostcity --quiet --eval "db.users.countDocuments()" 2>/dev/null)
if [ ! -z "$USER_COUNT" ]; then
    echo "   Total users in database: $USER_COUNT"
    
    if [ "$USER_COUNT" -gt 0 ]; then
        echo ""
        echo "4. Sample users (emails only):"
        mongosh lostcity --quiet --eval "db.users.find({}, {email: 1, displayName: 1, _id: 0}).limit(5).forEach(u => print('   - ' + u.email + ' (' + u.displayName + ')'))" 2>/dev/null
    else
        echo ""
        echo "   ⚠ No users found in database"
        echo "   If you're getting 'User not found' errors:"
        echo "   1. Clear your browser's local storage"
        echo "   2. Register a new account"
        echo "   3. Or restore your database backup"
    fi
else
    echo "   ✗ Could not query users collection"
fi

echo ""
echo "========================================="
echo ""
echo "Troubleshooting Tips:"
echo "- If you have a valid token but no user in DB:"
echo "  → Clear browser localStorage and re-register"
echo "- If MongoDB is not running:"
echo "  → Run: brew services start mongodb-community"
echo "- To reset the database completely:"
echo "  → Run: mongosh lostcity --eval 'db.dropDatabase()'"
echo ""
echo "========================================="
