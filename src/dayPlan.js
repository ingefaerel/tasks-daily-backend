// backend/src/routes/dayPlan.js
const express = require("express");
const router = express.Router();
const DayPlan = require("../models/DayPlan");

// Ensure doc for date exists
async function ensureDay(date) {
  let doc = await DayPlan.findOne({ date });
  if (!doc) doc = await DayPlan.create({ date, sections: [] });
  return doc;
}

// Get a day by date
router.get("/:date", async (req, res) => {
  const doc = await ensureDay(req.params.date);
  res.json(doc);
});

// Add a subcategory under a section
router.post("/:date/sections/:sectionId/subcategories", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const day = await ensureDay(req.params.date);
  const section = day.sections.find((s) => s._id === req.params.sectionId);
  if (!section) return res.status(404).json({ error: "section not found" });
  section.subcategories.push({ title, items: [] });
  await day.save();
  res.json(section.subcategories.at(-1));
});

// Rename or delete a subcategory (delete if title === '' per Jira behavior)
router.patch(
  "/:date/sections/:sectionId/subcategories/:subcategoryId",
  async (req, res) => {
    const { title } = req.body;
    const day = await ensureDay(req.params.date);
    const section = day.sections.find((s) => s._id === req.params.sectionId);
    if (!section) return res.status(404).json({ error: "section not found" });
    const idx = section.subcategories.findIndex(
      (sc) => sc._id === req.params.subcategoryId
    );
    if (idx === -1)
      return res.status(404).json({ error: "subcategory not found" });
    if (title === "") {
      section.subcategories.splice(idx, 1);
    } else if (typeof title === "string") {
      section.subcategories[idx].title = title;
    }
    await day.save();
    res.json({ ok: true });
  }
);

// Add item under subcategory
router.post(
  "/:date/sections/:sectionId/subcategories/:subcategoryId/items",
  async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });
    const day = await ensureDay(req.params.date);
    const section = day.sections.find((s) => s._id === req.params.sectionId);
    if (!section) return res.status(404).json({ error: "section not found" });
    const sub = section.subcategories.find(
      (sc) => sc._id === req.params.subcategoryId
    );
    if (!sub) return res.status(404).json({ error: "subcategory not found" });
    sub.items.push({ text, done: false });
    await day.save();
    res.json(sub.items.at(-1));
  }
);

// Inline edit / delete item (delete if text === '')
router.patch(
  "/:date/sections/:sectionId/subcategories/:subcategoryId/items/:itemId",
  async (req, res) => {
    const { text, done } = req.body;
    const day = await ensureDay(req.params.date);
    const section = day.sections.find((s) => s._id === req.params.sectionId);
    if (!section) return res.status(404).json({ error: "section not found" });
    const sub = section.subcategories.find(
      (sc) => sc._id === req.params.subcategoryId
    );
    if (!sub) return res.status(404).json({ error: "subcategory not found" });
    const idx = sub.items.findIndex((it) => it._id === req.params.itemId);
    if (idx === -1) return res.status(404).json({ error: "item not found" });

    if (typeof done === "boolean") sub.items[idx].done = done;
    if (typeof text === "string") {
      if (text === "") sub.items.splice(idx, 1);
      else sub.items[idx].text = text;
    }
    await day.save();
    res.json({ ok: true });
  }
);

module.exports = router;
