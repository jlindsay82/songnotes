const express = require("express");
const {
  getRecordings,
  getRecording,
  createRecording,
  deleteRecording,
} = require("../controllers/recordingController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth); // fire before all other route handlers and next() will trigger subsequent defined routes call by client

// GET all Recordings
router.get("/user/:song_id", getRecordings);

// GET a single recording
router.get("/recording/:recording_id", getRecording);

//POST a new recording
router.post("/user/", createRecording);

//DELETE a  recording
router.delete("/recording/:recording_id", deleteRecording);

module.exports = router;
