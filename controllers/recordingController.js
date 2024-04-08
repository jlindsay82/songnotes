const Recording = require("../models/recordingModel");
const mongoose = require("mongoose");

// get all recordings
const getRecordings = async (req, res) => {
  const { song_id } = req.params;
  const recordings = await Recording.find({ song_id }).sort({ createdAt: -1 }); // sort descending filtered by user
  res.status(200).json(recordings);
};

// get a single recording
const getRecording = async (req, res) => {
  const { recording_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recording_id)) {
    return res.status(404).json({ error: "No such recording" }); //use return statement to stop method
  }

  const recording = await Recording.findById(recording_id);
  if (!recording) {
    return res.status(404).json({ error: "No such recording" }); //use return statement to stop method
  }
  res.status(200).json(recording);
  console.log(recording);
};

// create new recording
const createRecording = async (req, res) => {
  const { title, data, song_id } = req.body;

  //add recording
  try {
    const recording = await Recording.create({
      title,
      data,
      song_id,
    });
    res.status(200).json(recording);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// delete a recording
const deleteRecording = async (req, res) => {
  const { recording_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recording_id)) {
    return res.status(404).json({ error: "No such recording" }); //use return statement to stop method
  }

  const recording = await Recording.findOneAndDelete({ _id: recording_id });

  if (!recording) {
    return res.status(400).json({ error: "No such recording" }); //use return statement to stop method
  }

  res.status(200).json(recording);
};

module.exports = {
  getRecordings,
  getRecording,
  createRecording,
  deleteRecording,
};
