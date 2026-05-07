const Subscription = require("../models/Subscription");
const sendEmail = require("../utils/sendEmail");

const subscribeUpdates = async (req, res) => {
  const { email, topics } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required for updates" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const selectedTopics = Array.isArray(topics) ? topics : String(topics || "general").split(",").map((topic) => topic.trim()).filter(Boolean);

  const subscription = await Subscription.findOneAndUpdate(
    { email: normalizedEmail },
    {
      email: normalizedEmail,
      topics: selectedTopics.length > 0 ? selectedTopics : ["general"],
      subscribedAt: new Date()
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await sendEmail({
    to: subscription.email,
    subject: "Subscription confirmed: Seva Foundation updates",
    text: `You are subscribed to updates for: ${subscription.topics.join(", ")}. We will send you important campaign, donation and volunteer updates.`
  });

  return res.json({ message: "Subscription saved", subscription });
};

module.exports = { subscribeUpdates };
