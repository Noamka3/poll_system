const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");

router.get("/", pollController.getAllPolls);
router.post("/", pollController.createPoll);
router.get("/:id/results", pollController.getPollResults); // ספציפי קודם!
router.get("/:id", pollController.getPollById);            // דינמי אחרון
router.post("/:id/vote", pollController.vote);

module.exports = router;