// Connect to your MongoDB and run this script
// This updates all users to have minimum 1000 coins

db = db.getSiblingDB('lostcity');

// Update all users with less than 1000 coins to have 1000 coins
const result = db.users.updateMany(
  { $or: [ { coins: { $lt: 1000 } }, { coins: { $exists: false } } ] },
  { $set: { coins: 1000.0 } }
);

print(`Matched ${result.matchedCount} users`);
print(`Modified ${result.modifiedCount} users to have 1000 coins`);

// Show some sample users to verify
print('\nSample users after update:');
db.users.find({}, { displayName: 1, email: 1, coins: 1, _id: 0 }).limit(5).forEach(printjson);
