const bodyParser = require("body-parser");
const { Connection, Request, TYPES } = require("tedious");
const jwt = require("jsonwebtoken");

const config = {
  server: "erick-server.database.windows.net",
  authentication: {
    type: "default",
    options: {
      userName: "Erick2254",
      password: "Evangelion01",
    },
  },
  options: {
    encrypt: true,
    database: "prosalud",
  },
};

const connection = new Connection(config);

module.exports = { connection };
