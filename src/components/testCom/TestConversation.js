import React, { useEffect, useState, useRef } from "react";

export default function TestConversation() {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const speak = (text) => {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.onend = () => setTimeout(resolve, 300);
        speechSynthesis.speak(utterance);
      });
    };

    const playIntro = async () => {
      await speak(
        "Hello, I’m Fredo. I’m here to help you choose a meal today. In a moment, I will read out our list of restaurants. When I finish, just press the spacebar and say the name of the restaurant you'd like. If you want me to repeat everything, just press the Alt key."
      );
    };

    playIntro();

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toLowerCase();
      setTranscript(result);
    };

    recognition.onerror = () => setTranscript("Error or no input.");

    recognitionRef.current = recognition;

    const handleKeyDown = (e) => {
      if (e.code === "Space" && !recognition._listening) {
        recognition.start();
        recognition._listening = true;
      }

      if (e.code === "AltLeft" || e.code === "AltRight") {
        playIntro();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" && recognition._listening) {
        recognition.stop();
        recognition._listening = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div>
      <h2>Welcome to Fredo's Menu Assistant</h2>
      <p>Press and hold the spacebar to speak.</p>
      <p>Press Alt at any time to repeat the instructions.</p>
      <p><strong>You said:</strong> {transcript}</p>
    </div>
  );
}
