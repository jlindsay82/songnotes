const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recordingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: false,
    },
    song_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recording", recordingSchema);
