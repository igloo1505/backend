const millisecondsToHours = 3600000;
const millisecondsToDay = 86400000;
const millisecondsToWeek = 604800000;

const intervalTypes = ["perDay", "perWeek", "hours", "notMoreThan"];

const validateIntervalType = (intervalType) => {
  if(intervalTypes.indexOf(intervalType) === -1){
    return false
  }
  else {
    return true
  }
}

const getByHours = (hrs, currentTimeStamp) => {
  let hrsInMilliseconds = hrs * millisecondsToHours;
  let newAlert;
  if (currentTimeStamp) {
    newAlert = currentTimeStamp + hrsInMilliseconds;
  } else if (!currentTimeStamp) {
    newAlert = Date.now() + hrsInMilliseconds;
  }
  return newAlert;
};

const getByTimesWeekly = (freq, currentTimeStamp) => {
  let interval = millisecondsToWeek / freq;
  let newAlert;
  if (currentTimeStamp) {
    newAlert = currentTimeStamp + interval;
  } else if (!currentTimeStamp) {
    newAlert = Date.now() + interval;
  }
  return newAlert;
};
const getByTimesDaily = (freq, currentTimeStamp) => {
  let interval = millisecondsToDay / freq;
  let newAlert;
  if (currentTimeStamp) {
    newAlert = currentTimeStamp + interval;
  } else if (!currentTimeStamp) {
    newAlert = Date.now() + interval;
  }
  return newAlert;
};

const setIntervalByType = (type, freq) => {
  let intervalObject = {};
  intervalObject.intervalType = type;
  intervalObject.frequency = freq;
  if (intervalTypes.indexOf(type) === -1) {
    console.error("Ah Shit... there was a problem setting an interval");
  }
  if (type === "perDay") {
    intervalObject.intervalMilliseconds = millisecondsToDay / freq;
  }
  if (type === "perWeek") {
    intervalObject.intervalMilliseconds = millisecondsToWeek / freq;
  }
  if (type === "hours") {
    intervalObject.intervalMilliseconds = millisecondsToHours * freq;
  }
  intervalObject.nextAlert = Date.now() + intervalObject.intervalMilliseconds
  return intervalObject;
};

module.exports = {
  getByHours,
  getByTimesWeekly,
  getByTimesDaily,
  setIntervalByType,
  validateIntervalType,
  intervalTypes,
};

// console.log("hour", 1000 * 60 * 60);
// console.log("day", 1000 * 60 * 60 * 24);
// console.log("week", 1000 * 60 * 60 * 24 * 7);
