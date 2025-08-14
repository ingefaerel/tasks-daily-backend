const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const tasksRouter = require("./routes/tasks");
const calendarRouter = require("./routes/calendar");
const notesRouter = require("./routes/notes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes mounted to match existing frontend usage
app.use("/tasks/note", notesRouter); // mount this first
app.use("/tasks", tasksRouter);
app.use("/api/calendar", calendarRouter);

app.get("/", (_req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
