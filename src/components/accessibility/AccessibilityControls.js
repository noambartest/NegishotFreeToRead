import React, { useEffect } from "react";

export default function AccessibilityControls({ contrast }) {
  useEffect(() => {
    document.body.classList.toggle("high-contrast", contrast);
  }, [contrast]);

  return React.createElement(
    "div",
    { style: { marginBottom: "1rem" } },
    [
      React.createElement("button", {
        onClick: () => {
          const html = document.documentElement;
          const currentSize = parseFloat(getComputedStyle(html).fontSize);
          html.style.fontSize = currentSize >= 20 ? "16px" : (currentSize + 2) + "px";
        },
        style: { marginRight: "1rem" }
      }, "Toggle Font Size"),

      React.createElement("button", {
        onClick: () => speechSynthesis.cancel()
      }, "Toggle Contrast")
    ]
  );
}
