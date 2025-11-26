const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ message: 'User registered!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign({ id: user.id }, 'yoursecret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};