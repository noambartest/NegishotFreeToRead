import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Menu({ user, restaurant }) {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    if (!restaurant?._id) return;

    axios
      .get(`http://localhost:5000/api/dishes?restaurantId=${restaurant._id}`)
      .then((res) => setDishes(res.data))
      .catch((err) => console.error("Failed to load dishes:", err));
  }, [restaurant]);

  useEffect(() => {
    if (!dishes.length) return;
  
    const speak = (text) => {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
  
        utterance.onend = () => {
          const waitUntilDone = () => {
            if (!speechSynthesis.speaking) {
              setTimeout(resolve, 300);
            } else {
              setTimeout(waitUntilDone, 50);
            }
          };
          waitUntilDone();
        };
  
        speechSynthesis.speak(utterance);
      });
    };
  
    const listen = () => {
      return new Promise((resolve) => {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
  
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          resolve(transcript);
        };
  
        recognition.onerror = () => resolve(null);
        recognition.start();
      });
    };
  
    const runInteraction = async () => {
      let understood = false;
  
      while (!understood) {
        await speak("Hello, are you ready to hear our menu?");
        const answer = await listen();
  
        if (answer && (answer.includes("yes") || answer.includes("ready"))) {
          understood = true;
        } else {
          await speak("I didn’t understand. Are you ready to hear our menu?");
        }
      }
  
      await speak("Great. Let's begin.");
    };
  
    runInteraction();
  }, [dishes]);
  

  return (
    <div>
      <h2>{restaurant.name} – Menu</h2>
      <ul>
        {dishes.map((dish) => {
          const name = user.lang === "he" ? dish.name.he : dish.name.en;
          const desc = user.lang === "he" ? dish.description.he : dish.description.en;
          return (
            <li key={dish._id} tabIndex="0" aria-label={`${name}. ${desc}`}>
              <strong>{name}</strong>: {desc}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
