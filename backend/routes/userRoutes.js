const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST - Register a new user
router.post('/register', async (req, res) => {
  const { name, email, username, password, country } = req.body;

  try {
    const newUser = new User({ name, email, username, password, country });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

module.exports = router;
