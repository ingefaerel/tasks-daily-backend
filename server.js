// Backend: Express and Mongoose setup
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000", // Make sure it points to your frontend
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/dailyTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  date: String,
  area: String,
  subcategory: String,
  item: String,
});

const Task = mongoose.model("Task", taskSchema);

const calendarClickSchema = new mongoose.Schema({
  date: { type: String, required: true },
  calArea: { type: String, required: true },
});

const CalendarClick = mongoose.model("CalendarClick", calendarClickSchema);

const noteSchema = new mongoose.Schema({
  date: { type: String, required: true }, // The date for which the note is created
  task: { type: String, required: true }, // The task description (e.g., "Yoga")
  note: { type: String, required: false }, // The note content
});

const Note = mongoose.model("Note", noteSchema);

// Route to save or update a note for a specific task
app.post("/tasks/note", async (req, res) => {
  try {
    const { date, task, note } = req.body;

    // Check if the note already exists for this task on the specific date
    let existingNote = await Note.findOne({ date, task });

    if (existingNote) {
      // If a note exists, update it
      existingNote.note = note;
      await existingNote.save();
      return res.json({ message: "Note updated successfully" });
    } else {
      // If no note exists, create a new one
      const newNote = new Note({ date, task, note });
      await newNote.save();
      return res.json({ message: "Note saved successfully" });
    }
  } catch (err) {
    console.error("Error saving note:", err);
    return res.status(500).json({ message: "Failed to save note" });
  }
});

// Route to get a note for a specific task on a specific date
app.get("/tasks/note/:date/:task", async (req, res) => {
  try {
    const { date, task } = req.params;

    // Find the note for the given date and task
    const note = await Note.findOne({ date, task });

    if (note) {
      return res.json(note);
    } else {
      return res.json({ note: null, message: "Note not found" });
    }
  } catch (err) {
    console.error("Error fetching note:", err);
    return res.status(500).json({ message: "Failed to fetch note" });
  }
});

// Route to get tasks for a specific date
app.get("/tasks/:date", async (req, res) => {
  try {
    const tasks = await Task.find({ date: req.params.date });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Route to save completed tasks
app.post("/tasks", async (req, res) => {
  try {
    const { date, area, subcategory, item } = req.body;
    const task = new Task({ date, area, subcategory, item });
    await task.save();
    res.json({ message: "Task saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save task" });
  }
});

// Route to save clicked calendar date (with upsert logic)
app.post("/api/calendar", async (req, res) => {
  try {
    const { date, calArea } = req.body;

    // Check if the date is already marked
    const existingClick = await CalendarClick.findOne({ date, calArea });

    if (existingClick) {
      // If exists, remove it (unmark the day)
      await CalendarClick.deleteOne({ date, calArea });
      res.json({ message: "Calendar date unmarked" });
    } else {
      // If not, add it (mark the day)
      const calendarClick = new CalendarClick({ date, calArea });
      await calendarClick.save();
      res.status(201).json(calendarClick);
    }
  } catch (error) {
    res.status(400).json({ message: "Error saving clicked date", error });
  }
});

// Route to get all clicked dates for an area
app.get("/api/calendar/:calArea", async (req, res) => {
  try {
    const clickedDates = await CalendarClick.find({
      calArea: req.params.calArea,
    });
    res.status(200).json(clickedDates);
  } catch (error) {
    res.status(400).json({ message: "Error fetching clicked dates", error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
