import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true }
  },
  category: {
    type: String,
    enum: ["dairy", "meat", "vegan", "gluten-free", "vegetarian"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Dish", dishSchema);
