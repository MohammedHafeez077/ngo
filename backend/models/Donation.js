const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    amount: { type: Number, required: true, min: 1 },
    campaign: { type: String, required: true, trim: true },
    method: { type: String, default: "UPI", trim: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Completed" },
    donatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
