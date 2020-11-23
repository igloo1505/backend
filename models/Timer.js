const mongoose = require("mongoose");
const User = require("./User");

const TimerSchema = mongoose.Schema({
  timerName: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Scannable: {
    type: String,
    required: false,
  },
  interval: {
    // type: mongoose.Schema.Types.Mixed,
    // required: true,
    intervalType: {
      type: String, 
      required: true
    },
    frequency: {
      type: Number,
      required: true
    },
    intervalMilliseconds: {
      type: Number,
      required: true
    },
    lastTaken: {
      type: Number,
      required: false,
    },
    nextAlert: {
      type: Number,
      required: true,
    },
  },
});
TimerSchema.methods.setLastTaken = function () {
  this.interval.lastTaken = Date.now();
};
TimerSchema.methods.setNextAlert = function () {
  this.interval.nextAlert = Date.now() + this.interval.intervalMilliseconds;
};
TimerSchema.methods.setScannable = function (scanned) {
  this.Scannable = scanned;
};
TimerSchema.methods.getTimeUntil = function () {
  let timeUntil = this.interval.nextAlert - Date.now();
  return timeUntil;
};

module.exports = mongoose.model("Timer", TimerSchema);
