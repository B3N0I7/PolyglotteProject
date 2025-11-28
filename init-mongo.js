// Switch to admin database
db = db.getSiblingDB("admin");

// Create application database
db = db.getSiblingDB("PolyglotteDb");

// Create collections
db.createCollection("users");
db.createCollection("words");

// Create indexes
// Unique index on email for users
db.users.createIndex({ email: 1 }, { unique: true });

// Index on userId for words (faster queries)
db.words.createIndex({ userId: 1 });

// Compound index for better query performance
db.words.createIndex({ userId: 1, createdAt: -1 });

print("MongoDB initialization completed successfully");
