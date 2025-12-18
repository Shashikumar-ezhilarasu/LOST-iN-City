// MongoDB script to update all existing users to have 1000 coins

// Connect to your MongoDB database
use lostcity;

// Update all users to have 1000 coins if they have less
db.users.updateMany(
  { coins: { $lt: 1000 } },
  { 
    $set: { 
      coins: 1000.0
    } 
  }
);

// Show the results
print("Updated users with less than 1000 coins to 1000 coins");
print("Total users: " + db.users.countDocuments());

// Show all users with their coin balance
db.users.find({}, { displayName: 1, email: 1, coins: 1, _id: 0 }).forEach(user => {
  print(`User: ${user.displayName || user.email} - Coins: ${user.coins}`);
});
