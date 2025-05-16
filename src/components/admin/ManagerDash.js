import React, { useState, useEffect } from "react";
import AddDish from "./AddDish";
import "./ManagerDashboard.css";

export default function ManagerDashboard() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = { role: "admin" };

  useEffect(() => {
    fetch("http://localhost:5000/api/dishes")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dishes");
        return res.json();
      })
      .then((data) => {
        setDishes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="manager-dashboard">
        <p>Loading dishes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-dashboard">
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>

      <section className="section">
        <h2>Current Dishes</h2>
        {dishes.length ? (
          <ul className="dish-list">
            {dishes.map((dish) => (
              <li key={dish._id} className="dish-item">
                <h3>{dish.name.en}</h3>
                <p>{dish.category}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No dishes available.</p>
        )}
      </section>

      <section className="section">
        <AddDish user={user} />
      </section>
    </div>
  );
}
