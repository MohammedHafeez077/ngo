const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const sendEmail = require("../utils/sendEmail");
const { isDatabaseEnabled } = require("../config/db");
const { findDemoCampaignByTitle } = require("./campaignController");

let demoDonations = [
  { _id: "d1", donorName: "Aisha Khan", email: "aisha@example.com", amount: 25000, campaign: "Learning Without Limits", method: "UPI", status: "Completed", donatedAt: "2026-04-28" },
  { _id: "d2", donorName: "Rahul Mehta", email: "rahul@example.com", amount: 50000, campaign: "Meals With Dignity", method: "Bank Transfer", status: "Completed", donatedAt: "2026-04-29" },
  { _id: "d3", donorName: "Sara Ali", email: "sara@example.com", amount: 12000, campaign: "Mobile Health Camps", method: "Card", status: "Pending", donatedAt: "2026-05-01" },
  { _id: "d4", donorName: "Vikram Nair", email: "vikram@example.com", amount: 7600, campaign: "Learning Without Limits", method: "UPI", status: "Completed", donatedAt: "2026-05-02" }
];

const getDonations = async (req, res) => {
  if (!isDatabaseEnabled()) {
    return res.json(demoDonations);
  }

  const donations = await Donation.find().sort({ createdAt: -1 });
  return res.json(donations);
};

const createDonation = async (req, res) => {
  const { donorName, email, amount, campaign, method, status } = req.body;
  const normalizedStatus = status ? String(status).trim() : "Completed";

  if (!donorName || !amount || !campaign) {
    return res.status(400).json({ message: "Donor name, amount and campaign are required" });
  }

  if (!isDatabaseEnabled()) {
    const selectedCampaign = findDemoCampaignByTitle(campaign);

    if (!selectedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (selectedCampaign.status !== "Active") {
      return res.status(400).json({ message: "Donations are allowed only for active campaigns" });
    }

    const donation = {
      _id: Date.now().toString(),
      donorName,
      email,
      amount: Number(amount),
      campaign,
      method: method || "UPI",
      status: normalizedStatus,
      donatedAt: new Date().toISOString().slice(0, 10)
    };
    demoDonations = [donation, ...demoDonations];

    let updatedCampaign;
    if (normalizedStatus === "Completed") {
      selectedCampaign.raisedAmount += Number(amount);
      if (selectedCampaign.raisedAmount >= selectedCampaign.goalAmount) {
        selectedCampaign.status = "Completed";
      }
      updatedCampaign = selectedCampaign;
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@sevafoundation.test";
    try {
      await sendEmail({
        to: adminEmail,
        subject: `New donation received: ${donorName}`,
        text: `A new donation has been recorded:\n\nDonor: ${donorName}\nEmail: ${email || "N/A"}\nAmount: Rs ${Number(amount).toLocaleString("en-IN")}\nCampaign: ${campaign}\nMethod: ${method || "UPI"}\nStatus: ${normalizedStatus}\nDate: ${donation.donatedAt}\n\n${normalizedStatus === "Completed" ? `Campaign raised amount is now ${updatedCampaign.raisedAmount} of ${updatedCampaign.goalAmount}.` : "Donation is not yet completed."}`
      });
    } catch (emailError) {
      console.error("Donation email failed:", emailError.message);
    }

    return res.status(201).json({ donation, campaign: updatedCampaign });
  }

  const selectedCampaign = await Campaign.findOne({ title: { $regex: new RegExp(`^${campaign.trim()}$`, 'i') } });

  if (!selectedCampaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  if (!selectedCampaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  if (selectedCampaign.status !== "Active") {
    return res.status(400).json({ message: "Donations are allowed only for active campaigns" });
  }

  console.log("Creating donation for campaign:", campaign);
  console.log("Selected campaign before update:", selectedCampaign.title, "raisedAmount:", selectedCampaign.raisedAmount);

  const donation = await Donation.create({ donorName, email, amount, campaign, method, status: normalizedStatus });

  let updatedCampaign = selectedCampaign;
  if (normalizedStatus === "Completed") {
    selectedCampaign.raisedAmount += Number(amount);
    if (selectedCampaign.raisedAmount >= selectedCampaign.goalAmount) {
      selectedCampaign.status = "Completed";
    }
    try {
      updatedCampaign = await selectedCampaign.save();
    } catch (saveError) {
      console.error("Failed to save campaign:", saveError.message);
      return res.status(500).json({ message: "Failed to update campaign" });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@sevafoundation.test";
  try {
    await sendEmail({
      to: adminEmail,
      subject: `New donation received: ${donorName}`,
      text: `A new donation has been recorded:\n\nDonor: ${donorName}\nEmail: ${email || "N/A"}\nAmount: Rs ${Number(amount).toLocaleString("en-IN")}\nCampaign: ${campaign}\nMethod: ${method || "UPI"}\nStatus: ${normalizedStatus}\nDate: ${new Date().toISOString().slice(0, 10)}\n\n${normalizedStatus === "Completed" && updatedCampaign ? `Campaign raised amount is now ${updatedCampaign.raisedAmount} of ${updatedCampaign.goalAmount}.` : "Donation is not yet completed."}`
    });
  } catch (emailError) {
    console.error("Donation email failed:", emailError.message);
  }

  return res.status(201).json({ donation, campaign: updatedCampaign });
};

module.exports = { getDonations, createDonation };
