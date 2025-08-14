// src/components/DoneToday.jsx
import React from "react";
import { formatYMD } from "../utils/date";

const DoneToday = ({
  areas,
  date,
  filterCompletedTasks,
  notes,
  activeTextArea,
  handleNoteFocus,
  handleNoteChange,
  handleSaveNote,
  handleDeleteTask
}) => {
  const currentKey = formatYMD(date);

  return (
    <div id="done-today" className="done-today">
      <h2>Done today</h2>
      <div className="done-areas">
        {areas.map((area) => (
          <div key={area.name} className={area.name}>
            <h3 className="area-name">{area.name}</h3>
            <ul className="done-tasks">
              {filterCompletedTasks(area).map(({ task, subcategory }) => (
                <li key={task}>
                  <span className="done-task">
                    <strong>{subcategory}</strong>: {task}
                  </span>
                  <button
                    className="delete"
                    onClick={() => handleDeleteTask(area.name, subcategory, task)}
                  >
                    ❌
                  </button>
                  <textarea
                    className="note"
                    type="text"
                    value={notes[currentKey]?.[task] || ""}
                    onFocus={() => handleNoteFocus(task)}
                    onChange={(e) => handleNoteChange(task, e.target.value)}
                    onBlur={() => handleSaveNote(task, area.name)}
                  ></textarea>

                  {activeTextArea === task && (
                    <button
                      className="save"
                      onClick={() => handleSaveNote(task, area.name)}
                    >
                      Save
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoneToday;