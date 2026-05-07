const express = require("express");
const { getVolunteers, createVolunteer } = require("../controllers/volunteerController");

const router = express.Router();

router.get("/", getVolunteers);
router.post("/", createVolunteer);

module.exports = router;
