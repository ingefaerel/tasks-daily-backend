const Note = require('../models/Note');

exports.get = async (req, res, next) => {
  try {
    const { date, task } = req.params;
    if (!date || !task) return res.status(400).json({ error: 'date and task params are required' });
    const doc = await Note.findOne({ date, task }).lean();
    return res.json({ note: doc?.note ?? '' });
  } catch (e) { next(e); }
};

exports.save = async (req, res, next) => {
  try {
    const { date, area, task, note } = req.body || {};
    if (!date || !area || !task) {
      return res.status(400).json({ error: 'date, area, task are required' });
    }
    const doc = await Note.findOneAndUpdate(
      { date, task },
      { $set: { date, area, task, note: note || '' } },
      { upsert: true, new: true }
    ).lean();
    return res.status(201).json({ message: 'Note saved', note: doc.note });
  } catch (e) { next(e); }
};