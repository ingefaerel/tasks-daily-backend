// Backend: Express and Mongoose setup
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/dailyTracker", {
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
  date: { type: String, required: true },
  task: { type: String, required: true },
  area: { type: String, required: true },
  note: { type: String, required: false },
});

const Note = mongoose.model("Note", noteSchema);

app.post("/tasks/note", async (req, res) => {
  try {
    const { date, task, note, area } = req.body;

   
    let existingNote = await Note.findOne({ date, task });

    if (existingNote) {

      existingNote.note = note;
      existingNote.area = area;
      await existingNote.save();
      return res.json({ message: "Note updated successfully" });
    } else {
      const newNote = new Note({ date, task, note, area });
      await newNote.save();
      return res.json({ message: "Note saved successfully" });
    }
  } catch (err) {
    console.error("Error saving note:", err);
    return res.status(500).json({ message: "Failed to save note" });
  }
});

app.get("/tasks/note/:date/:task", async (req, res) => {
  try {
    const { date, task } = req.params;

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

app.get("/tasks/:date", async (req, res) => {
  try {
    const tasks = await Task.find({ date: req.params.date });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

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

app.delete("/tasks", async (req, res) => {
  try {
    const { date, area, subcategory, item } = req.body;

    const result = await Task.deleteOne({ date, area, subcategory, item });

    if (result.deletedCount > 0) {
      return res.json({ message: "Task deleted successfully" });
    } else {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ message: "Failed to delete task" });
  }
});


app.post("/api/calendar", async (req, res) => {
  try {
    const { date, calArea } = req.body;
    const existingClick = await CalendarClick.findOne({ date, calArea });

    if (existingClick) {

      await CalendarClick.deleteOne({ date, calArea });
      res.json({ message: "Calendar date unmarked" });
    } else {
      const calendarClick = new CalendarClick({ date, calArea });
      await calendarClick.save();
      res.status(201).json(calendarClick);
    }
  } catch (error) {
    res.status(400).json({ message: "Error saving clicked date", error });
  }
});

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

app.listen(port, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${port}`);
});
