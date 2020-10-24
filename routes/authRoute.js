const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./auth");
const User = require("../models/User.js");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.id).isSelected("-password");

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "not authorized" });
  }
});

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    console.log(email, password);
    try {
      let user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(500).json({ msg: "invalid user credentials" });
      }
      let checkPassword = await user.checkPassword(password);
      console.log('checkPassword: ', checkPassword);

      if (!checkPassword) {
        return res.status(500).json({ msg: "invalid password" });
      }
      ``;

      const payload = {
        user: {
          id: user.id,
        },
      };
      console.log(payload);
      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user });
        }
      );
    } catch (error) {
      res.status(500).json({msg: "Error at authenticate route"});
    }
  }
);

module.exports = router;
