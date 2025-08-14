import React, { useState, useEffect } from "react";
import {
  addDays,
  subDays,
  format,
  startOfMonth,
  eachDayOfInterval,
} from "date-fns";
import "./App.css";
import api from "./axios";

// data
import { areas, calAreas } from "./areas";

// utils & components
import { formatDisplayDate, formatYMD, getMonthDays } from "./utils/date";
import Header from "./components/Header";
import Arrows from "./components/Arrows";
import AreasList from "./components/AreasList";
import DoneToday from "./components/DoneToday";
import Calendars from "./components/Calendars";
import ExportPDFButton from "./components/ExportPDFButton";

function App() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [completedTasksByDate, setCompletedTasksByDate] = useState({});
  const [selectedDays, setSelectedDays] = useState({});
  const [notes, setNotes] = useState({});
  const [activeTextArea, setActiveTextArea] = useState(null);

  const handleNoteFocus = (task) => {
    setActiveTextArea(task);
  };

  // Fetch notes for all tasks that are loaded for the day
  useEffect(() => {
    const fetchNotes = async () => {
      const formattedDate = formatYMD(date);
      const tasksForDate = completedTasksByDate[formattedDate];
      if (!tasksForDate) return;

      for (const area of Object.keys(tasksForDate)) {
        for (const subcategory of Object.keys(tasksForDate[area])) {
          for (const task of tasksForDate[area][subcategory]) {
            try {
              const response = await api.get(
                `/tasks/note/${formattedDate}/${encodeURIComponent(task)}`
              );
              if (response.data) {
                setNotes((prevNotes) => ({
                  ...prevNotes,
                  [formattedDate]: {
                    ...(prevNotes[formattedDate] || {}),
                    [task]: response.data.note,
                  },
                }));
              }
            } catch (err) {
              if (err.response?.status === 404) {
                setNotes((prevNotes) => ({
                  ...prevNotes,
                  [formattedDate]: {
                    ...(prevNotes[formattedDate] || {}),
                    [task]: "",
                  },
                }));
              } else {
                console.error(`Error fetching note for task "${task}":`, err);
              }
            }
          }
        }
      }
    };

    fetchNotes();
  }, [completedTasksByDate, date]);

  // Fetch tasks by date
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const formattedDate = formatYMD(date);
        const response = await api.get(`/tasks/${formattedDate}`);
        const tasks = response.data;
        const newCompletedTasksByDate = {};

        for (const task of tasks) {
          if (!newCompletedTasksByDate[task.date]) {
            newCompletedTasksByDate[task.date] = {};
          }
          if (!newCompletedTasksByDate[task.date][task.area]) {
            newCompletedTasksByDate[task.date][task.area] = {};
          }
          if (
            !newCompletedTasksByDate[task.date][task.area][task.subcategory]
          ) {
            newCompletedTasksByDate[task.date][task.area][task.subcategory] =
              [];
          }
          newCompletedTasksByDate[task.date][task.area][task.subcategory].push(
            task.item
          );
        }

        setCompletedTasksByDate(newCompletedTasksByDate);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [date]);

  // Fetch calendar clicked dates on mount
  useEffect(() => {
    const fetchClickedDates = async () => {
      try {
        const clickedDays = {};

        for (const area of calAreas) {
          const response = await api.get(`/api/calendar/${area}`);
          const clickedDates = response.data;

          clickedDays[area] = new Set(
            clickedDates.map((clickedDate) => clickedDate.date)
          );
        }

        setSelectedDays(clickedDays);
      } catch (err) {
        console.error("Error fetching clicked dates:", err);
      }
    };

    fetchClickedDates();
  }, []);

  const handleTaskCompletion = async (
    area,
    subcategory,
    item,
    deleteTask = false
  ) => {
    const newCompletedTasksByDate = { ...completedTasksByDate };
    const formattedDate = formatYMD(date);

    if (deleteTask) {
      try {
        await api.delete(`/tasks`, {
          data: { date: formattedDate, area, subcategory, item },
        });

        newCompletedTasksByDate[formattedDate][area][subcategory] =
          newCompletedTasksByDate[formattedDate][area][subcategory].filter(
            (task) => task !== item
          );

        if (
          newCompletedTasksByDate[formattedDate][area][subcategory].length === 0
        ) {
          delete newCompletedTasksByDate[formattedDate][area][subcategory];
        }

        setCompletedTasksByDate(newCompletedTasksByDate);
      } catch (err) {
        console.error("Error deleting task:", err);
      }
      return;
    }

    if (!newCompletedTasksByDate[formattedDate]) {
      newCompletedTasksByDate[formattedDate] = {};
    }
    if (!newCompletedTasksByDate[formattedDate][area]) {
      newCompletedTasksByDate[formattedDate][area] = {};
    }
    if (!newCompletedTasksByDate[formattedDate][area][subcategory]) {
      newCompletedTasksByDate[formattedDate][area][subcategory] = [];
    }

    const isTaskCompleted =
      newCompletedTasksByDate[formattedDate][area][subcategory].includes(item);
    if (isTaskCompleted) {
      newCompletedTasksByDate[formattedDate][area][subcategory] =
        newCompletedTasksByDate[formattedDate][area][subcategory].filter(
          (task) => task !== item
        );
    } else {
      newCompletedTasksByDate[formattedDate][area][subcategory].push(item);
      try {
        await api.post("/tasks", {
          date: formattedDate,
          area,
          subcategory,
          item,
        });
      } catch (err) {
        console.error("Error saving task:", err);
      }
    }

    setCompletedTasksByDate(newCompletedTasksByDate);
  };

  const handleNoteChange = (task, note) => {
    const formattedDate = formatYMD(date);
    setNotes((prevNotes) => ({
      ...prevNotes,
      [formattedDate]: {
        ...(prevNotes[formattedDate] || {}),
        [task]: note,
      },
    }));
  };

  const handleSaveNote = async (task, area) => {
    const formattedDate = formatYMD(date);
    const taskNote = notes[formattedDate]?.[task] || "";
    if (!taskNote.trim()) {
      console.warn("Note is empty. Nothing to save.");
      return;
    }

    try {
      await api.post("/tasks/note", {
        date: formattedDate,
        area,
        task,
        note: taskNote,
      });
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".note")) {
        setActiveTextArea();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeDate = (direction) => {
    let newDate = new Date(date);
    if (direction === 1) newDate = addDays(newDate, 1);
    else newDate = subDays(newDate, 1);
    setDate(newDate);
  };

  const monthDays = getMonthDays(date);

  const handleCalendarClick = async (calArea, day) => {
    const formattedDay = format(day, "yyyy-MM-dd");
    const newSelectedDays = { ...selectedDays };

    if (!newSelectedDays[calArea]) newSelectedDays[calArea] = new Set();

    if (newSelectedDays[calArea].has(formattedDay)) {
      newSelectedDays[calArea].delete(formattedDay);
    } else {
      newSelectedDays[calArea].add(formattedDay);
    }

    setSelectedDays(newSelectedDays);

    try {
      await api.post("/api/calendar", { date: formattedDay, calArea });
    } catch (err) {
      console.error("Error saving clicked date:", err);
    }
  };

  const filterCompletedTasks = (area) => {
    const completedForArea =
      completedTasksByDate[formatYMD(date)]?.[area.name] || {};
    const completedItems = [];

    area.subcategories.forEach((subcategory) => {
      const completedForSubcategory = completedForArea[subcategory.name] || [];
      completedForSubcategory.forEach((task) => {
        completedItems.push({ task, subcategory: subcategory.name });
      });
    });

    return completedItems;
  };

  return (
    <div className="App">
      <Header date={date} />
      <Arrows
        onPrev={() => handleChangeDate(-1)}
        onNext={() => handleChangeDate(1)}
      />
      <AreasList
        areas={areas}
        date={date}
        completedTasksByDate={completedTasksByDate}
        handleTaskCompletion={handleTaskCompletion}
      />

      <DoneToday
        areas={areas}
        date={date}
        filterCompletedTasks={filterCompletedTasks}
        notes={notes}
        activeTextArea={activeTextArea}
        handleNoteFocus={handleNoteFocus}
        handleNoteChange={handleNoteChange}
        handleSaveNote={handleSaveNote}
        handleDeleteTask={(areaName, subcategory, task) =>
          handleTaskCompletion(areaName, subcategory, task, true)
        }
      />

      <Calendars
        calAreas={calAreas}
        monthDays={monthDays}
        selectedDays={selectedDays}
        handleCalendarClick={handleCalendarClick}
      />

      <ExportPDFButton
        date={date}
        areas={areas}
        notes={notes}
        filterCompletedTasks={filterCompletedTasks}
      />
    </div>
  );
}

export default App;
