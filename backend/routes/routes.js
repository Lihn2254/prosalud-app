const userOperations = require("./userOperations");
const express = require("express");
const router = express.Router;

router.use("/users", userOperations);
router.use("/medical");

module.exports = { router };
