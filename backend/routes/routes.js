const userOperations = require("./userOperations");
const appointmentOperations = require("./appointmentOperations");
const medicalOperations = require("./medicalOperations");
const express = require("express");
const router = express.Router;

router.use("/users", userOperations);
router.use("/medical", medicalOperations);
router.use("appointments", appointmentOperations);

module.exports = { router };
