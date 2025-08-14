// src/components/Header.jsx
import React from "react";
import { formatDisplayDate } from "../utils/date";

const Header = ({ date }) => {
  return (
    <div className="header">
      <p className="date"> Today is {formatDisplayDate(date)}</p>
      <div className="navbar">
        <span>
          <a href="#areas">areas</a>
        </span>
        <span>
          <a href="#done-today">done</a>{" "}
        </span>
        <span>
          <a href="#calendars">calendars</a>{" "}
        </span>
      </div>
    </div>
  );
};

export default Header;