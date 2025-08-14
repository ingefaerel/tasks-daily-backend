const Task = require('../models/Task');

exports.listByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    if (!date) return res.status(400).json({ error: 'date param is required' });
    const tasks = await Task.find({ date }).lean();
    return res.json(tasks);
  } catch (e) { next(e); }
};

exports.add = async (req, res, next) => {
  try {
    const { date, area, subcategory, item } = req.body || {};
    if (!date || !area || !subcategory || !item) {
      return res.status(400).json({ error: 'date, area, subcategory, item are required' });
    }
    const doc = await Task.findOneAndUpdate(
      { date, area, subcategory, item },
      { $setOnInsert: { date, area, subcategory, item } },
      { upsert: true, new: true }
    ).lean();
    return res.status(201).json(doc);
  } catch (e) {
    if (e.code === 11000) return res.status(201).json({ ok: true, duplicate: true });
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { date, area, subcategory, item } = req.body || {};
    if (!date || !area || !subcategory || !item) {
      return res.status(400).json({ error: 'date, area, subcategory, item are required' });
    }
    const result = await Task.deleteOne({ date, area, subcategory, item });
    return res.json({ ok: true, removed: result.deletedCount });
  } catch (e) { next(e); }
};