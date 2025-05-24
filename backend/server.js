const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");

const app = express();
app.use(bodyParser.json());
app.use("/", routes.router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
