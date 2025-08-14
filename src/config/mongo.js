const mongoose = require("mongoose");

// accept either URI or URL env names
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "mongodb://127.0.0.1:27017/habit_tracker";

async function connectMongo() {
  mongoose.set("strictQuery", true);
  // optional: see what's happening
  // mongoose.set('debug', true);

  mongoose.connection.on("error", (err) => {
    console.error("Mongo connection error:", err?.message || err);
  });
  mongoose.connection.once("open", () => {
    console.log("MongoDB connected");
  });

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000, // fail fast
  });
}

module.exports = { connectMongo };
