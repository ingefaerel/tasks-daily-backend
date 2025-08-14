// src/components/Arrows.jsx
import React from "react";

const Arrows = ({ onPrev, onNext }) => (
  <div className="arrows">
    <button onClick={onPrev}>←</button>
    <button onClick={onNext}>→</button>
  </div>
);

export default Arrows;