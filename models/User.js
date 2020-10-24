const mongoose = require("mongoose");
const Timer = require("./Timer");
const bcrypt = require("bcryptjs");

const CapitalizeEmail = (em) => {
  return `${em.charAt(0).toUpperCase()}${em.slice(1)}`;
};

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      get: CapitalizeEmail,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
    },
    timers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Timer",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("email")) {
    next();
  }
  this.email = this.email.toLowerCase();
});
UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
