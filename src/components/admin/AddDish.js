// src/components/admin/AddDish.js
import React, { useState } from "react";
import "./AddDish.css";

export default function AddDish({ user }) {
  const [form, setForm] = useState({
    name_he: "",
    name_en: "",
    desc_he: "",
    desc_en: "",
    category: "dairy"
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dish = {
      name: { he: form.name_he, en: form.name_en },
      description: { he: form.desc_he, en: form.desc_en },
      category: form.category
    };
    try {
      const res = await fetch("http://localhost:5000/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: user.role, dish })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Dish added successfully");
      setForm({ name_he: "", name_en: "", desc_he: "", desc_en: "", category: "dairy" });
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <form className="add-dish-form" onSubmit={handleSubmit}>
      <h2>Add New Dish</h2>

      <label>
        <span>Name (Hebrew):</span>
        <input name="name_he" value={form.name_he} onChange={handleChange} required />
      </label>

      <label>
        <span>Name (English):</span>
        <input name="name_en" value={form.name_en} onChange={handleChange} required />
      </label>

      <label>
        <span>Description (Hebrew):</span>
        <input name="desc_he" value={form.desc_he} onChange={handleChange} required />
      </label>

      <label>
        <span>Description (English):</span>
        <input name="desc_en" value={form.desc_en} onChange={handleChange} required />
      </label>

      <label>
        <span>Category:</span>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="dairy">Dairy</option>
          <option value="meat">Meat</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten-free">Gluten-Free</option>
        </select>
      </label>

      <button type="submit">Add Dish</button>

      {message && <p className="message">{message}</p>}
    </form>
  );
}
