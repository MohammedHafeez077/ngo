const express = require("express");
const { subscribeUpdates } = require("../controllers/notificationController");

const router = express.Router();

router.post("/subscribe", subscribeUpdates);

module.exports = router;
