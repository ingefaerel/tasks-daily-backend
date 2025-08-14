const { Schema, model } = require('mongoose');

// One document per (area,date)
const calendarSchema = new Schema({
  area: { type: String, required: true },
  date: { type: String, required: true }, // yyyy-MM-dd
}, { timestamps: true });

calendarSchema.index({ area: 1, date: 1 }, { unique: true });

module.exports = model('CalendarEntry', calendarSchema);