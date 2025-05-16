import express from "express";
import Dish from "../models/Dish.js";
import mongoose from "mongoose";


const router = express.Router();

router.get("/", async (req, res) => {
  console.log("dishes");
  try {
    const dishes = await Dish.find();
    console.log("Found dishes:", dishes);
    res.json(dishes);
  } catch (error) {
    console.error("Failed to fetch dishes:", error);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("freom dish adding")
    const { role, dish } = req.body;

    if (role !== "admin") {
      return res.status(403).json({ error: "Unauthorized to add dish" });
    }

    const newDish = new Dish(dish);
    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (error) {
    res.status(500).json({ error: "Failed to save dish" });
  }
});

export default router;
