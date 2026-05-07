const Campaign = require("../models/Campaign");
const { isDatabaseEnabled } = require("../config/db");

let demoCampaigns = [
  {
    _id: "c1",
    title: "Learning Without Limits",
    category: "Education",
    description: "School kits, tutoring circles and digital learning support for children in low-income neighborhoods.",
    goalAmount: 250000,
    raisedAmount: 164500,
    beneficiaries: 820,
    location: "Hyderabad",
    status: "Active"
  },
  {
    _id: "c2",
    title: "Meals With Dignity",
    category: "Food Security",
    description: "Nutritious cooked meals and ration support for families facing temporary crisis.",
    goalAmount: 180000,
    raisedAmount: 132300,
    beneficiaries: 1460,
    location: "Bengaluru",
    status: "Active"
  },
  {
    _id: "c3",
    title: "Mobile Health Camps",
    category: "Health",
    description: "Preventive health checkups, medicine distribution and referral support in underserved areas.",
    goalAmount: 300000,
    raisedAmount: 98500,
    beneficiaries: 530,
    location: "Pune",
    status: "Active"
  }
];

const getCampaigns = async (req, res) => {
  if (!isDatabaseEnabled()) {
    return res.json(demoCampaigns);
  }

  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  return res.json(campaigns);
};

const createCampaign = async (req, res) => {
  const { title, category, description, goalAmount, raisedAmount, beneficiaries, location, status } = req.body;

  if (!title || !description || !goalAmount) {
    return res.status(400).json({ message: "Title, description and goal amount are required" });
  }

  if (!isDatabaseEnabled()) {
    const campaign = {
      _id: Date.now().toString(),
      title,
      category: category || "General",
      description,
      goalAmount: Number(goalAmount),
      raisedAmount: Number(raisedAmount || 0),
      beneficiaries: Number(beneficiaries || 0),
      location: location || "India",
      status: status || "Active"
    };
    demoCampaigns = [campaign, ...demoCampaigns];
    return res.status(201).json(campaign);
  }

  const campaign = await Campaign.create({ title, category, description, goalAmount, raisedAmount, beneficiaries, location, status });
  return res.status(201).json(campaign);
};

const updateCampaignStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ["Active", "Paused", "Completed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Status must be Active, Paused or Completed" });
  }

  if (!isDatabaseEnabled()) {
    const campaign = demoCampaigns.find((item) => item._id === id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    campaign.status = status;
    return res.json(campaign);
  }

  const campaign = await Campaign.findByIdAndUpdate(id, { status }, { new: true });

  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  return res.json(campaign);
};

const findDemoCampaignByTitle = (title) => {
  return demoCampaigns.find((campaign) => campaign.title === title);
};

module.exports = { getCampaigns, createCampaign, updateCampaignStatus, findDemoCampaignByTitle };
