const mongoose = require("mongoose");
require("dotenv").config();
const colors = require("colors");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: false,
      autoIndex: false,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Medication Database Connected".bgRed.black));
};
module.exports = connectDB;
