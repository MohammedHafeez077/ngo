const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "General", trim: true },
    description: { type: String, required: true, trim: true },
    goalAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    beneficiaries: { type: Number, default: 0, min: 0 },
    location: { type: String, default: "India", trim: true },
    status: { type: String, enum: ["Active", "Paused", "Completed"], default: "Active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
