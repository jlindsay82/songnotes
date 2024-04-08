const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  //verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  // split authorization token as is reeived in format 'Bearer 123456789abxcdskke...' and only required part after the space
  const token = authorization.split(" ")[1];

  // try verification of token using jwt and the SECRET, if ok locate user on DB to pass correct valid user to next route - 'workouts'
  try {
    const { _id } = jwt.verify(token, process.env.SECRET); // decode user from token
    req.user = await User.findOne({ _id }).select("_id"); //store database id of decoded user passed in request
    next(); // execute next function in route handler
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
