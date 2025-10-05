const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getRecordings,
  getRecording,
  createRecording,
  deleteRecording,
  serveAudioFile,
} = require("../controllers/recordingController");
const requireAuth = require("../middleware/requireAuth");

// Configure multer for file uploads (using memory storage for Azure)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

const router = express.Router();

router.use(requireAuth); // fire before all other route handlers and next() will trigger subsequent defined routes call by client

// GET all Recordings
router.get("/user/:song_id", getRecordings);

// GET a single recording
router.get("/recording/:recording_id", getRecording);

//POST a new recording
router.post("/user/", upload.single('audioFile'), createRecording);

// GET audio file
router.get("/audio/:recording_id", serveAudioFile);

//DELETE a  recording
router.delete("/recording/:recording_id", deleteRecording);

module.exports = router;
