const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    availability: { type: String, default: "Weekends" },
    city: { type: String, default: "India", trim: true },
    hours: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
