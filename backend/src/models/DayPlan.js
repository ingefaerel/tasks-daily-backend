// backend/src/models/DayPlan.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const SubcategorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    title: { type: String, required: true },
    items: { type: [ItemSchema], default: [] },
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    key: { type: String, required: true }, // e.g., 'checkbox'
    title: { type: String, required: true },
    subcategories: { type: [SubcategorySchema], default: [] },
  },
  { _id: false }
);

const DayPlanSchema = new mongoose.Schema(
  {
    date: { type: String, index: true, unique: true }, // 'YYYY-MM-DD'
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DayPlan", DayPlanSchema);
