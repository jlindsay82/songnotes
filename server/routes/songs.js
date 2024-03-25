const express = require("express");
const {
  getsongs,
  getsong,
  createsong,
  deletesong,
  updatesong,
} = require("../controllers/songController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth); // fire before all other route handlers and next() will trigger subsequent defined routes call by client

// GET all songs
router.get("/", getsongs);

// GET a single song
router.get("/:id", getsong);

//POST a new song
router.post("/", createsong);

//DELETE a  song
router.delete("/:id", deletesong);

//UPDATE a  song
router.patch("/:id", updatesong);

module.exports = router;
