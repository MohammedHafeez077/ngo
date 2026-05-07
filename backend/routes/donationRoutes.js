const express = require("express");
const { getDonations, createDonation } = require("../controllers/donationController");

const router = express.Router();

router.get("/", getDonations);
router.post("/", createDonation);

module.exports = router;
