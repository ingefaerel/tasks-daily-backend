const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  date: { type: String, required: true },      // yyyy-MM-dd
  area: { type: String, required: true },
  subcategory: { type: String, required: true },
  item: { type: String, required: true },
}, { timestamps: true });

taskSchema.index({ date: 1, area: 1, subcategory: 1, item: 1 }, { unique: true });

module.exports = model('Task', taskSchema);