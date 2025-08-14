// src/components/Calendars.jsx
import React from "react";
import { format } from "date-fns";

const Calendars = ({ calAreas, monthDays, selectedDays, handleCalendarClick }) => {
  return (
    <div id="calendars" className="calendars">
      {calAreas.map((calArea) => (
        <div key={calArea} className="calendar">
          <h3>{calArea}</h3>
          <div className="calendar-grid">
            {monthDays.map((day) => {
              const dayFormatted = format(day, "yyyy-MM-dd");
              const isCompleted = selectedDays[calArea]?.has(dayFormatted);

              return (
                <div
                  key={dayFormatted}
                  className={`calendar-day ${isCompleted ? "completed" : ""}`}
                  onClick={() => handleCalendarClick(calArea, day)}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Calendars;