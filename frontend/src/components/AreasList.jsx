// src/components/AreasList.jsx
import React from "react";
import { formatYMD } from "../utils/date";

const AreasList = ({ areas, date, completedTasksByDate, handleTaskCompletion }) => {
  const currentKey = formatYMD(date);

  return (
    <div id="areas" className="areas">
      {areas.map((area) => (
        <div className={area.name} key={area.name}>
          <h2 className="area-name">{area.name}</h2>
          <div className="area-list">
            {area.subcategories.map((subcategory) => (
              <div key={subcategory.name} className="subcategory">
                <h3 className="subCategory-name">{subcategory.name}</h3>
                <div className="checklist">
                  {subcategory.items.map((item, index) => (
                    <div key={item} className="task">
                      <label>
                        <input
                          type="checkbox"
                          checked={
                            completedTasksByDate[currentKey]?.[area.name]?.[subcategory.name]?.includes(item) || false
                          }
                          onChange={() => handleTaskCompletion(area.name, subcategory.name, item)}
                        />
                        <span className="tooltip">
                          {item}
                          <span className="tooltip-text">
                            {subcategory.tooltips[index]}
                          </span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AreasList;