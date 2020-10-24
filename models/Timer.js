const mongoose = require("mongoose");
const User = require("./User");

const TimerSchema = mongoose.Schema({
  medicationName: {
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
  lastTaken: {
    type: Date,
    required: false,
  },
  interval: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  nextAlert: {
    type: Date,
    required: false,
  },
});
TimerSchema.methods.setLastTaken = function () {
  this.lastTaken = Date.now();
};
TimerSchema.methods.setNextAlert = function () {
  this.nextAlert = Date.now() + this.interval.intervalMilliseconds;
};
TimerSchema.methods.setScannable = function (scanned) {
  this.Scannable = scanned;
};
TimerSchema.methods.getTimeUntil = function () {
  let timeUntil = this.nextAlert - Date.now();
  return timeUntil;
};

module.exports = mongoose.model("Timer", TimerSchema);
