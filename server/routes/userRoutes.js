import express from "express";
import User from "../models/User.js";

const router = express.Router();



router.post("/signup", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Missing username" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      username,
      password: "client",
      role: "user"
    });

    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("from login");
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username, role: "user" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/signupManager", async (req, res) => {
  try {
    const { username, password } = req.body;
    

    if (!username) {
      return res.status(400).json({ error: "Missing username" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      username,
      password: password,
      role: "admin"
    });
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});


router.post("/adminLogin", async (req, res) => {
  try {
    console.log("from admin login");
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username, role: "admin" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
