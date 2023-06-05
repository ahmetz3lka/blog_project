const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connec = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to db ${connec.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDb;
