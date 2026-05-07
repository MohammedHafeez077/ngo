const express = require("express");
const { getCampaigns, createCampaign, updateCampaignStatus } = require("../controllers/campaignController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getCampaigns);
router.post("/", createCampaign);
router.patch("/:id/status", protect, authorize("admin"), updateCampaignStatus);

module.exports = router;
