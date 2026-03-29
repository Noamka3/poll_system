const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");
const limiter = require("../middleware/rateLimiter");

router.get("/", pollController.getAllPolls);
router.post("/", limiter, pollController.createPoll);
router.get("/:id/results", pollController.getPollResults); // ספציפי קודם!
router.get("/:id", pollController.getPollById);            // דינמי אחרון
router.post("/:id/vote", limiter, pollController.vote);

module.exports = router;