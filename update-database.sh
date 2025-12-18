#!/bin/bash

# Script to update all users to have minimum 1000 coins
# This calls the backend admin endpoint

echo "🔄 Updating all users to have minimum 1000 coins..."
echo ""

# First, let's check current user's token by calling the API
# You'll need to run this while logged in to get a valid JWT token

# For now, we'll create a simple HTML page to call the endpoint
cat > /tmp/update-coins.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Update All Users - LostCity Admin</title>
    <script>
        async function updateAllUsers() {
            const status = document.getElementById('status');
            status.innerHTML = '⏳ Updating all users...';
            
            try {
                // Get token from Clerk
                const token = await window.Clerk?.session?.getToken();
                
                if (!token) {
                    status.innerHTML = '❌ Error: Not logged in. Please sign in first.';
                    return;
                }

                const response = await fetch('http://localhost:8080/api/wallet/admin/update-all-balances', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    status.innerHTML = `✅ Success! ${data.data.message}<br>Users updated: ${data.data.users_updated}`;
                } else {
                    const error = await response.text();
                    status.innerHTML = `❌ Error: ${response.status} - ${error}`;
                }
            } catch (error) {
                status.innerHTML = `❌ Error: ${error.message}`;
            }
        }
    </script>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        button {
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #45a049;
        }
        #status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 4px;
            background: #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏛️ LostCity Admin Panel</h1>
        <h2>Update All User Balances</h2>
        <p>This will update all users in the database to have a minimum of 1000 coins.</p>
        <p><strong>Note:</strong> You must be logged in to use this function.</p>
        
        <button onclick="updateAllUsers()">Update All Users to 1000 Coins</button>
        
        <div id="status">Ready to update</div>
    </div>

    <script src="https://precise-bee-37.clerk.accounts.dev/.well-known/clerk.json"></script>
</body>
</html>
EOF

echo "✅ Created admin page at: /tmp/update-coins.html"
echo ""
echo "To update all users:"
echo "1. Make sure you're logged into http://localhost:3000"
echo "2. Open /tmp/update-coins.html in your browser"
echo "3. Click the 'Update All Users' button"
echo ""
echo "OR run this curl command with your JWT token:"
echo "curl -X POST http://localhost:8080/api/wallet/admin/update-all-balances \\"
echo "  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\"
echo "  -H 'Content-Type: application/json'"
