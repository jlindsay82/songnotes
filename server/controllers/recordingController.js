const Recording = require("../models/recordingModel");
const mongoose = require("mongoose");
const { BlobServiceClient } = require("@azure/storage-blob");

// Azure Blob Storage configuration
const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || "recordings";

// Initialize Azure Blob Service Client
const blobServiceClient =
  BlobServiceClient.fromConnectionString(CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

// get all recordings
const getRecordings = async (req, res) => {
  const { song_id } = req.params;
  const recordings = await Recording.find({ song_id }).sort({ createdAt: -1 }); // sort descending filtered by user
  res.status(200).json(recordings);

  //server log data retrieved
  recordings.forEach(function (recording) {
    console.log("get recording: ", recording._id, recording.title);
  });
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

  //server log data retrieved
  console.log("get recording: ", recording._id, recording.title);
};

// create new recording
const createRecording = async (req, res) => {
  try {
    const { title, song_id, duration } = req.body;
    let blobUrl = null;
    let fileSize = null;

    // Check if a file was uploaded
    if (req.file) {
      // Generate unique blob name
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const blobName = `${song_id}/${uniqueSuffix}.webm`;

      // Get blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload buffer to Azure
      await blockBlobClient.upload(req.file.buffer, req.file.buffer.length, {
        blobHTTPHeaders: {
          blobContentType: req.file.mimetype
        }
      });

      blobUrl = blockBlobClient.url;
      fileSize = req.file.size;

      console.log(`Uploaded to Azure: ${blobName}`);
    }

    const recording = await Recording.create({
      title,
      data: req.body.data, // Keep backward compatibility for blob URL
      filePath: blobUrl, // Store Azure blob URL instead of local path
      fileSize,
      duration: duration ? parseInt(duration) : null,
      song_id,
    });

    res.status(200).json(recording);
    console.log("created recording: ", recording._id, recording.title);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// delete a recording
const deleteRecording = async (req, res) => {
  const { recording_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recording_id)) {
    return res.status(404).json({ error: "No such recording" });
  }

  const recording = await Recording.findOneAndDelete({ _id: recording_id });

  if (!recording) {
    return res.status(400).json({ error: "No such recording" });
  }

  // Delete the blob from Azure if it exists
  if (recording.filePath) {
    try {
      // Extract blob name from URL
      const url = new URL(recording.filePath);
      const blobName = url.pathname.split('/').slice(2).join('/'); // Remove container name from path

      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.deleteIfExists();

      console.log("Deleted Azure blob: ", blobName);
    } catch (error) {
      console.error("Error deleting Azure blob: ", error);
    }
  }

  res.status(200).json(recording);
  console.log("deleted recording: ", recording._id, recording.title);
};

// serve audio file
const serveAudioFile = async (req, res) => {
  try {
    const { recording_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recording_id)) {
      return res.status(404).json({ error: "No such recording" });
    }

    const recording = await Recording.findById(recording_id);

    if (!recording) {
      return res.status(404).json({ error: "No such recording" });
    }

    if (!recording.filePath) {
      return res.status(404).json({ error: "Audio file not found" });
    }

    console.log("Serving audio for recording:", recording._id, "filePath:", recording.filePath);

    // Check if filePath is an Azure URL
    let blobName;
    if (recording.filePath.startsWith('http')) {
      // Extract blob name from Azure URL
      // URL format: https://<account>.blob.core.windows.net/<container>/<blobName>
      const url = new URL(recording.filePath);
      const pathParts = url.pathname.split('/').filter(p => p); // Remove empty strings
      // First part is container name, rest is blob name
      blobName = pathParts.slice(1).join('/');
    } else {
      // Legacy local file path - not supported anymore
      console.error("Legacy local file path detected:", recording.filePath);
      return res.status(404).json({ error: "Audio file migration required" });
    }

    console.log("Extracted blob name:", blobName);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Check if blob exists
    const exists = await blockBlobClient.exists();
    if (!exists) {
      console.error("Blob not found in Azure:", blobName);
      return res.status(404).json({ error: "Audio file not found in storage" });
    }

    // Get blob properties for content length
    const properties = await blockBlobClient.getProperties();
    const fileSize = properties.contentLength;
    const range = req.headers.range;

    console.log("Blob size:", fileSize, "Range:", range);

    // Download entire blob to buffer
    const downloadResponse = await blockBlobClient.download(0);
    const buffer = await streamToBuffer(downloadResponse.readableStreamBody);

    console.log(`Downloaded buffer size: ${buffer.length}`);

    if (range) {
      // Support for audio seeking with range requests
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1;
      const chunksize = end - start + 1;
      const chunk = buffer.slice(start, end + 1);

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${buffer.length}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": properties.contentType || "audio/webm",
      });
      res.end(chunk);
    } else {
      res.writeHead(200, {
        "Content-Length": buffer.length,
        "Content-Type": properties.contentType || "audio/webm",
        "Accept-Ranges": "bytes",
      });
      res.end(buffer);
    }

    console.log("Audio sent successfully");
  } catch (error) {
    console.error("Error serving audio file:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to convert stream to buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

module.exports = {
  getRecordings,
  getRecording,
  createRecording,
  deleteRecording,
  serveAudioFile,
};
