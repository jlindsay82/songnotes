const Song = require("../models/songModel");
const mongoose = require("mongoose");

// get all songs
const getsongs = async (req, res) => {
  const user_id = req.user._id;
  const songs = await Song.find({ user_id }).sort({ createdAt: -1 }); // sort descending filtered by user
  res.status(200).json(songs);
};

// get a single song
const getsong = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such song" }); //use return statement to stop method
  }

  const song = await Song.findById(id);
  if (!song) {
    return res.status(404).json({ error: "No such song" }); //use return statement to stop method
  }
  res.status(200).json(song);
};

// create new song
const createsong = async (req, res) => {
  const { title, genre, key, tempo } = req.body;

  //add doc to
  try {
    const user_id = req.user._id;
    const song = await Song.create({ title, genre, key, tempo, user_id });
    res.status(200).json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// delete a song

const deletesong = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such song" }); //use return statement to stop method
  }

  const song = await Song.findOneAndDelete({ _id: id });

  if (!song) {
    return res.status(400).json({ error: "No such song" }); //use return statement to stop method
  }

  res.status(200).json(song);
};

//update a song

const updatesong = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such song" }); //use return statement to stop method
  }

  const song = await Song.findOneAndUpdate(
    { _id: id },
    {
      ...req.body, //spread out body data as second parameter to update with values passed
    }
  );
  res.status(200).json(song);
};

module.exports = {
  getsongs,
  getsong,
  createsong,
  deletesong,
  updatesong,
};
