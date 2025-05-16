import React, { useState } from "react";
import Menu from "../components/menu/Menu";

export default function OnboardingFlow() {
  const [user, setUser] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error submitting onboarding:", err);
    }
  };

  if (user) {
    return <Menu user={user} />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = {
          lang: e.target.lang.value,
          autoSpeech: e.target.autoSpeech.checked,
          highContrast: e.target.highContrast.checked,
        };
        handleSubmit(formData);
      }}
    >
      <h2>Welcome to Free to Read</h2>

      <label>
        Language:
        <select name="lang">
          <option value="he">עברית</option>
          <option value="en">English</option>
        </select>
      </label>

      <label>
        <input type="checkbox" name="autoSpeech" /> Enable automatic speech
      </label>

      <label>
        <input type="checkbox" name="highContrast" /> High contrast mode
      </label>

      <button type="submit">Continue</button>
    </form>
  );
}
