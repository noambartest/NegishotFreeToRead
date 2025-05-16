// src/components/menu/MenuReader.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./MenuReader.css";

export default function MenuReader() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentStage, setCurrentStage] = useState("idle");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const isSpeaking = useRef(false);

  const speak = (text) =>
    new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.onstart = () => (isSpeaking.current = true);
      u.onend = () => {
        isSpeaking.current = false;
        setTimeout(resolve, 200);
      };
      speechSynthesis.speak(u);
    });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dishes")
      .then((res) => {
        setDishes(res.data);
        setCategories([...new Set(res.data.map((d) => d.category))]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (currentStage !== "categories" || !categories.length) return;
    (async () => {
      await speak("Welcome to the menu. Please choose a category.");
      for (let i = 0; i < categories.length; i++) {
        await speak(`Press ${i + 1} for ${categories[i]}.`);
      }
    })();
  }, [categories, currentStage]);

  useEffect(() => {
    if (currentStage !== "dishes" || !selectedCategory) return;
    const list = dishes.filter((d) => d.category === selectedCategory);
    (async () => {
      await speak(`You chose ${selectedCategory}. Here are the dishes.`);
      for (let i = 0; i < list.length; i++) {
        await speak(`Press ${i + 1} to add ${list[i].name.en}.`);
      }
      await speak("Press zero to go back, or press Enter when you are finished.");
    })();
  }, [dishes, currentStage, selectedCategory]);

  useEffect(() => {
    const onKeyDown = async (e) => {
      if (isSpeaking.current) return;
      if (e.code === "Space") {
        setCurrentStage("categories");
        setSelectedCategory(null);
        setSelectedDishes([]);
        return;
      }
      const key = e.key;
      if (currentStage === "categories") {
        const n = parseInt(key, 10);
        if (n >= 1 && n <= categories.length) {
          setSelectedCategory(categories[n - 1]);
          setCurrentStage("dishes");
        }
      } else if (currentStage === "dishes") {
        if (key === "0") {
          setCurrentStage("categories");
          setSelectedCategory(null);
          return;
        }
        const list = dishes.filter((d) => d.category === selectedCategory);
        const n = parseInt(key, 10);
        if (n >= 1 && n <= list.length) {
          const name = list[n - 1].name.en;
          setSelectedDishes((prev) => [...prev, name]);
          await speak(`${name} added to your order.`);
          await speak("Press zero to go back, or press Enter when you are finished.");
        }
      }
    };

    const onKeyUp = async (e) => {
      if (currentStage === "dishes" && e.key === "Enter") {
        if (!selectedDishes.length) {
          await speak("You have not selected any dishes.");
        } else {
          await speak(`Your order is ${selectedDishes.join(", ")}.`);
          await speak("Thank you, your order has been sent to the kitchen.");
          setCurrentStage("done");
          setSelectedCategory(null);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [
    categories,
    dishes,
    currentStage,
    selectedCategory,
    selectedDishes,
  ]);

  return (
    <div className="menu-reader">
      <h2>Menu Reader</h2>

      {currentStage === "done" ? (
        <>
          <p className="info">Your order is on its way to the kitchen.</p>
          <p className="info">Press Space to start again.</p>
        </>
      ) : (
        <>
          <p>
            Stage: <span className="stage">{currentStage}</span>
          </p>
          {selectedCategory && (
            <p className="info">Category: {selectedCategory}</p>
          )}
          {selectedDishes.length > 0 && (
            <div className="orders">
              <h3>Your choices:</h3>
              <ul>
                {selectedDishes.map((dish, i) => (
                  <li key={i}>{dish}</li>
                ))}
              </ul>
              <p className="info">Press Enter to confirm, or Space to restart.</p>
            </div>
          )}
          {!selectedDishes.length && (
            <p className="info">Press Space at any time to restart.</p>
          )}
        </>
      )}
    </div>
  );
}
