const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    (process.env.MONGO_HOSTPORT
      ? `mongodb://${process.env.MONGO_HOSTPORT}/${process.env.MONGO_DB_NAME || "proton-social"}`
      : "");

  if (!mongoUri) {
    throw new Error("MONGO_URI or MONGO_HOSTPORT is missing in environment variables");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
