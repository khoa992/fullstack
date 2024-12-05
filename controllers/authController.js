const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
require("dotenv").config();

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("Invalid credentials");

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) return res.status(401).send("Invalid credentials");
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("welcome");
    res.json({ token });
  } catch (err) {
    res.status(500).send("Error logging in");
  }
};

const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) return res.status(409).send("Username is existed");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword, role });
    newUser.save();

    const id = newUser.id;
    const token = jwt.sign({ id: id, role: role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).send("Error register");
  }
};

module.exports = { login, register };
