const express = require("express");
const {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
  updateDocument,
} = require("../controllers/documentController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth); // fire before all other route handlers and next() will trigger subsequent defined routes call by client

// GET all documents
router.get("/user/:song_id", getDocuments);

// GET a single document
router.get("/document/:document_id", getDocument);

//POST a new document
router.post("/user/", createDocument);

//DELETE a  document
router.delete("/document/:document_id", deleteDocument);

//UPDATE a  document
router.patch("/document/:document_id", updateDocument);

module.exports = router;
