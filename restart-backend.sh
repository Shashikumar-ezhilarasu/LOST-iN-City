#!/bin/bash

echo "🔄 Restarting Lost City Backend..."
echo ""

cd "/Users/shashikumarezhil/Documents/SECTOR-17 /lostCity/backend"

# Stop any running backends
echo "Stopping existing backend processes..."
pkill -f "spring-boot:run" 2>/dev/null
sleep 3

# Start fresh
echo "Starting backend on port 8080..."
nohup mvn spring-boot:run > backend.log 2>&1 &
NEW_PID=$!
echo $NEW_PID > backend.pid

echo "✅ Backend starting - PID: $NEW_PID"
echo ""
echo "Waiting for backend to start (this takes ~15 seconds)..."
sleep 15

# Check if it's running
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend is UP and running!"
    echo "✅ API available at: http://localhost:8080/api"
else
    echo "⚠️  Backend is still starting... Check backend.log for status"
    echo "Run: tail -f backend/backend.log"
fi

echo ""
echo "📋 Quick Commands:"
echo "  • View logs:  tail -f backend/backend.log"
echo "  • Stop backend: kill \$(cat backend/backend.pid)"
echo "  • Check status: curl http://localhost:8080/actuator/health"
