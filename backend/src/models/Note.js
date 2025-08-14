const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
  date: { type: String, required: true },
  area: { type: String, required: true },
  task: { type: String, required: true },
  note: { type: String, default: '' },
}, { timestamps: true });

noteSchema.index({ date: 1, task: 1 }, { unique: true });

module.exports = model('Note', noteSchema);