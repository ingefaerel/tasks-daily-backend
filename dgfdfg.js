const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000", // Make sure it points to your frontend
  methods: ["GET", "POST"],
};

app.use(cors());
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
  date: { type: String, required: true }, // Store the clicked date (e.g., 2025-01-06)
  calArea: { type: String, required: true }, // Store the area (e.g., physical, intellectual)
});

const CalendarClick = mongoose.model("CalendarClick", calendarClickSchema);

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

// Route to save clicked calendar date
app.post("/api/calendar", async (req, res) => {
  try {
    const { date, calArea } = req.body;
    console.log("Received clicked date:", { date, calArea });

    // Save the clicked date in the CalendarClick collection
    const calendarClick = new CalendarClick({ date, calArea });
    await calendarClick.save();

    res.status(201).json(calendarClick); // Success response
  } catch (error) {
    res.status(400).json({ message: "Error saving clicked date", error });
  }
});

// Route to get all clicked dates for an area
app.get("/api/calendar/:calArea", async (req, res) => {
  try {
    // Fetch clicked dates for a specific calendar area
    const clickedDates = await CalendarClick.find({
      calArea: req.params.calArea,
    });

    // Respond with an array of the clicked dates
    res.status(200).json(clickedDates);
  } catch (error) {
    res.status(400).json({ message: "Error fetching clicked dates", error });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
