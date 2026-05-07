const Volunteer = require("../models/Volunteer");
const { isDatabaseEnabled } = require("../config/db");

let demoVolunteers = [
  { _id: "v1", name: "Neha Sharma", email: "neha@example.com", phone: "9876543210", skills: ["Teaching", "Mentoring"], availability: "Weekends", city: "Hyderabad", hours: 42 },
  { _id: "v2", name: "Arjun Rao", email: "arjun@example.com", phone: "9876501234", skills: ["Logistics", "Driving"], availability: "Evenings", city: "Bengaluru", hours: 31 },
  { _id: "v3", name: "Farah Qureshi", email: "farah@example.com", phone: "9988776655", skills: ["Nursing", "Community Outreach"], availability: "Weekdays", city: "Pune", hours: 56 }
];

const getVolunteers = async (req, res) => {
  if (!isDatabaseEnabled()) {
    return res.json(demoVolunteers);
  }

  const volunteers = await Volunteer.find().sort({ createdAt: -1 });
  return res.json(volunteers);
};

const createVolunteer = async (req, res) => {
  const { name, email, phone, skills, availability, city, hours } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const skillList = Array.isArray(skills)
    ? skills
    : String(skills || "").split(",").map((skill) => skill.trim()).filter(Boolean);

  if (!isDatabaseEnabled()) {
    const volunteer = {
      _id: Date.now().toString(),
      name,
      email,
      phone,
      skills: skillList,
      availability: availability || "Weekends",
      city: city || "India",
      hours: Number(hours || 0)
    };
    demoVolunteers = [volunteer, ...demoVolunteers];
    return res.status(201).json(volunteer);
  }

  const volunteer = await Volunteer.create({ name, email, phone, skills: skillList, availability, city, hours });
  return res.status(201).json(volunteer);
};

module.exports = { getVolunteers, createVolunteer };
