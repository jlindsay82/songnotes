const Document = require("../models/documentModel");
const mongoose = require("mongoose");

// get all documents
const getDocuments = async (req, res) => {
  const { song_id } = req.params;
  const documents = await Document.find({ song_id }).sort({ createdAt: -1 }); // sort descending filtered by song_id
  res.status(200).json(documents);
};

// get a single document
const getDocument = async (req, res) => {
  const { document_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(document_id)) {
    return res.status(404).json({ error: "No such document" }); //use return statement to stop method
  }

  const document = await Document.findById(document_id);
  if (!document) {
    return res.status(404).json({ error: "No such document" }); //use return statement to stop method
  }
  res.status(200).json(document);
  //console.log(document);
};

// create new document
const createDocument = async (req, res) => {
  const { title, content, song_id } = req.body;

  //add doc to
  try {
    //const _id = req.user._id;
    const document = await Document.create({
      title,
      content,
      song_id,
    });
    res.status(200).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// delete a document
const deleteDocument = async (req, res) => {
  const { document_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(document_id)) {
    return res.status(404).json({ error: "No such document" }); //use return statement to stop method
  }

  const document = await Document.findOneAndDelete({ _id: document_id });

  if (!document) {
    return res.status(400).json({ error: "No such document" }); //use return statement to stop method
  }

  res.status(200).json(document);
};

//update a document

const updateDocument = async (req, res) => {
  const { document_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(document_id)) {
    return res.status(404).json({ error: "No such document" }); //use return statement to stop method
  }

  const document = await Document.findOneAndUpdate(
    { _id: document_id },
    {
      ...req.body, //spread out body data as second parameter to update with values passed
    }
  );
  res.status(200).json(await Document.findById(document_id));
  //console.log(await Document.findById(document_id));
};

module.exports = {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
  updateDocument,
};
