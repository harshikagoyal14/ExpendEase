const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
