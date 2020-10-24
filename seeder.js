const dotenv = require("dotenv");
var colors = require("colors");
const connectDB = require("./config/db");
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const User = require("./models/User");
const Timer = require("./models/Timer");
const {
  getByHours,
  getByTimesWeekly,
  getByTimesDaily,
  intervalTypes,
  setIntervalByType,
} = require("./utils/timerFunctions");
dotenv.config();
connectDB();

app.use("/users", require("./routes/userRoute"));
app.use("/authenticate", require("./routes/authRoute"));
app.use("/timers", require("./routes/medicationRoute"));

const users = [
  {
    name: "Andrew Iglinski",
    email: "aiglinski@icloud.com",
    password: "SomePassword123",
    age: 31,
  },
  {
    name: "Katy",
    email: "SuperAwesome@icloud.com",
    password: "SomePassword123",
    age: 30,
  },
  {
    name: "Tyler Durden",
    email: "KindaAwesome@icloud.com",
    password: "SomePassword123",
    age: 35,
  },
];
let userIDReturned;
const saveUsers = async () => {
  console.log("running seed Users");
  for (var i = 0; i < users.length; i++) {
    let newUser = new User(users[i]);
    let userReturned = await newUser.save();
    console.log("userReturned", userReturned);
    if (userReturned.name === "Andrew Iglinski") {
      console.log("running inside if statement", userReturned._id);
      userIDReturned = userReturned._id;
    }
    console.log(`${users[i].name} was saved`);
  }
};
// saveUsers();

const medications = [
  {
    medicationName: "gabapentin",
    intervalType: "perDay",
    intervalFrequency: 3,
  },
  {
    medicationName: "test cypionate",
    intervalType: "perWeek",
    intervalFrequency: 2,
  },
  {
    medicationName: "vitamin D",
    intervalType: "perWeek",
    intervalFrequency: 1,
  },
];
const saveMedTimers = async () => {
  console.log("running seed timers....".red.inverse);
  for (var i = 0; i < medications.length; i++) {
    let newTimer = medications[i];
    // console.log("userIDReturned", userIDReturned);
    newTimer.userID = userIDReturned;
    // newTimer = new Timer(newTimer);
    // let timerReturned = newTimer.save()
    if (intervalTypes.indexOf(newTimer.intervalType) === -1) {
      console.error(`${newTimer.name} returned an error!`);
    }
    newTimer.interval = setIntervalByType(
      medications[i].intervalType,
      medications[i].intervalFrequency
    );
    console.log(newTimer);
    let timerFromModel = new Timer(newTimer);
    timerFromModel.setLastTaken();
    timerFromModel.setNextAlert();
    await timerFromModel.save();
    console.log(`${timerFromModel} was saved `);
  }
  process.exit();
};

// saveMedTimers();
const seedFunction = async () => {
  console.log("running IIFE");
  await saveUsers();
  await saveMedTimers();
};

console.log("getByHours", getByHours(4, null));

const PORT = process.env.PORT || 5000;

const clearSeedData = async () => {
  for (var i = 0; i < users.length; i++) {
    let returnedUser = await User.find({
      name: users[i].name,
      age: users[i].age,
    });
    if (returnedUser) {
      returnedUser.delete();
    }
  }
  for (var z = 0; z < medications.length; z++) {
    let returnedTimer = await Timer.find({
      medicationName: medications[z].name,
    });
    if (returnedTimer) {
      returnedTimer.delete();
    }
  }
  process.exit();
};

const CompletelyWipe = async () => {
  await Timer.deleteMany();
  await User.deleteMany();
  process.exit();
};

if (process.argv[2] === "--delete" || process.argv[2] === "-D") {
  clearSeedData();
}

if (process.argv[2] === "--wipe") {
  CompletelyWipe();
}

if (!process.argv[2]) {
  seedFunction()
}

app.listen(PORT, () => console.log(`running seeder script on port ${PORT}`));
