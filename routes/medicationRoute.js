const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Timer = require("../models/Timer");
const auth = require("./auth");

// !! Post new medication timer for authenticated user
router.post("/", auth, async (req, res) => {
  const { userID, medicationName, intervalType, intervalFrequency } = req.body;
  try {
    const user = User.findById(userID);
    if (!user) {
      return res
        .status(500)
        .json({ msg: "You need to be logged in to post a medication timer" });
    }
    const newTimer = new Timer({
      medicationName,
      userID,
      intervalType,
      intervalFrequency,
    });
    await newTimer.save();
  } catch (error) {
    return res.status(500).json({
      msg: "Oh no. There was an error posting a new medication timer",
    });
  }
});

// Mark as "Just Taken" by timerID
router.put("/markAsTaken/:timerID", auth, async (req, res) => {
  const { timerID } = req.params.timerID;
  const { userID } = req.body;
  try {
    const timerToChange = await Timer.findById(timerID);
    if (!timerToChange) {
      return res
        .status(500)
        .json({ msg: `Could not find a timer with an ID of ${timerID}` });
    }
    if (timerToChange.userID !== userID) {
      return res.status(500).json({
        msg: `The user with ID ${userID} does not have permission to update the timer with an ID of ${timerID}. Please check the DB to verify. `,
      });
    }
    let timerHasBeenChanged = await Timer.findById(timerID);
    timerHasBeenChanged.setLastTaken();
    timerHasBeenChanged.setNextAlert();
    let x = await timerHasBeenChanged.save();
    return res.json(x);
  } catch (error) {
    return res.status(500).json({
      msg: `Error marking that medication as taken. Please try again, but for the love of God don't take the medication again.`,
    });
  }
});

router.put("/:timerID", auth, async (req, res) => {
  const {
    userID,
    medicationName,
    scannable,
    lastTaken,
    interval,
    nextAlert,
  } = req.body;
  const { timerID } = req.params.timerID;
  try {
    const timer = await Timer.findById(timerID);
    if (!timer) {
      return res.status(500).json({
        msg: `Error editing timer. Could not find timer with ID of ${timerID}`,
      });
    }
    if (timer.userID !== userID) {
      return res.status(500).json({
        msg: `This user does not have permission to edit that timer. If you feel this is an error please log back in and try again.`,
      });
    }
    let fields = {};
    if (medicationName) {
      fields.medicationName = medicationName;
    }
    if (scannable) {
      fields.scannable = scannable;
    }
    if (lastTaken) {
      fields.lastTaken = lastTaken;
    }
    if (interval) {
      fields.interval = interval;
    }
    if (nextAlert) {
      fields.nextAlert = nextAlert;
    }
    let updatedTimer = await Timer.findByIdAndUpdate(
      timerID,
      { $set: fields },
      { new: true }
    );
    return res.json(updatedTimer);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Error editing timer with ID ${req.params.timerID}` });
  }
});

router.delete("/:timerID", auth, async (req, res) => {
  const { userID } = req.body;
  try {
    const timer = await Timer.findById(req.params.timerID);
    if (!timer) {
      return res.status(500).json({
        msg: "Ah shit. That timer can't be found by ID",
      });
    }
    if (timer.userID !== userID) {
      return res
        .status(500)
        .json({ msg: "This user does not have permission to edit that timer" });
    }
    await Timer.findByIdAndDelete(req.params.timerID);
    return res.json({ msg: "Timer was successfully deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "error removing timer" });
  }
});

module.exports = router;
