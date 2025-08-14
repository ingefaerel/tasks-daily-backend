const CalendarEntry = require('../models/CalendarEntry');

exports.listForArea = async (req, res, next) => {
  try {
    const { area } = req.params;
    if (!area) return res.status(400).json({ error: 'area param is required' });
    const docs = await CalendarEntry.find({ area }).select('date -_id').lean();
    return res.json(docs);
  } catch (e) { next(e); }
};

exports.toggle = async (req, res, next) => {
  try {
    const { date, calArea } = req.body || {};
    if (!date || !calArea) return res.status(400).json({ error: 'date and calArea are required' });

    const existing = await CalendarEntry.findOne({ area: calArea, date }).lean();
    if (existing) {
      await CalendarEntry.deleteOne({ area: calArea, date });
      const remaining = await CalendarEntry.find({ area: calArea }).select('date -_id').lean();
      return res.status(201).json({ message: 'Removed', area: calArea, dates: remaining.map(d => d.date) });
    } else {
      await CalendarEntry.create({ area: calArea, date });
      const all = await CalendarEntry.find({ area: calArea }).select('date -_id').lean();
      return res.status(201).json({ message: 'Saved', area: calArea, dates: all.map(d => d.date) });
    }
  } catch (e) {
    if (e.code === 11000) return res.status(201).json({ message: 'Saved (duplicate ignored)' });
    next(e);
  }
};