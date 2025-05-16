import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  lang: { type: String, default: "en" },
  autoSpeech: { type: Boolean, default: false },
  highContrast: { type: Boolean, default: false },
  restaurantId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
