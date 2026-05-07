const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const Volunteer = require("../models/Volunteer");

const demoUsers = [
  {
    name: "Mohammed Hafeez",
    email: "admin@sevafoundation.test",
    password: "admin123",
    role: "admin",
    title: "Owner & Executive Director"
  },
  {
    name: "Amaan Khan",
    email: "manager@sevafoundation.test",
    password: "manager123",
    role: "staff",
    title: "Program Manager"
  },
  {
    name: "Sana Ahmed",
    email: "volunteer@sevafoundation.test",
    password: "volunteer123",
    role: "volunteer",
    title: "Field Volunteer"
  }
];

const demoCampaigns = [
  {
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

const demoDonations = [
  {
    donorName: "Aisha Khan",
    email: "aisha@example.com",
    amount: 25000,
    campaign: "Learning Without Limits",
    method: "UPI",
    status: "Completed"
  },
  {
    donorName: "Rahul Mehta",
    email: "rahul@example.com",
    amount: 50000,
    campaign: "Meals With Dignity",
    method: "Bank Transfer",
    status: "Completed"
  },
  {
    donorName: "Sara Ali",
    email: "sara@example.com",
    amount: 12000,
    campaign: "Mobile Health Camps",
    method: "Card",
    status: "Pending"
  },
  {
    donorName: "Vikram Nair",
    email: "vikram@example.com",
    amount: 7600,
    campaign: "Learning Without Limits",
    method: "UPI",
    status: "Completed"
  }
];

const demoVolunteers = [
  {
    name: "Neha Sharma",
    email: "neha@example.com",
    phone: "9876543210",
    skills: ["Teaching", "Mentoring"],
    availability: "Weekends",
    city: "Hyderabad",
    hours: 42
  },
  {
    name: "Arjun Rao",
    email: "arjun@example.com",
    phone: "9876501234",
    skills: ["Logistics", "Driving"],
    availability: "Evenings",
    city: "Bengaluru",
    hours: 31
  },
  {
    name: "Farah Qureshi",
    email: "farah@example.com",
    phone: "9988776655",
    skills: ["Nursing", "Community Outreach"],
    availability: "Weekdays",
    city: "Pune",
    hours: 56
  }
];

const seedDatabase = async () => {
  try {
        const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create(demoUsers);
      console.log("Seeded demo users.");
    } else {
      const adminEmail = demoUsers[0].email;
      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        await User.create(demoUsers[0]);
        console.log(`Seeded admin user: ${adminEmail}`);
      }
    }

    const campaignCount = await Campaign.countDocuments();
    if (campaignCount === 0) {
      await Campaign.create(demoCampaigns);
      console.log("Seeded demo campaigns.");
    }

    const donationCount = await Donation.countDocuments();
    if (donationCount === 0) {
      await Donation.create(demoDonations);
      console.log("Seeded demo donations.");
    }

    const volunteerCount = await Volunteer.countDocuments();
    if (volunteerCount === 0) {
      await Volunteer.create(demoVolunteers);
      console.log("Seeded demo volunteers.");
    }
  } catch (error) {
    console.error("Failed to seed database:", error.message);
  }
};

module.exports = { seedDatabase };
