const userOperations = require("./userOperations");
const appointmentOperations = require("./appointmentOperations");
const medicalOperations = require("./medicalOperations");
const medAppointmentOperations = require("./medAppointmentOperations");
const express = require("express");
const router = express.Router();

router.use("/users", userOperations.router);
router.use("/medical", medicalOperations.router);
router.use("/appointments", appointmentOperations.router);
router.use("/medAppointments", medAppointmentOperations.router);

module.exports = { router };
