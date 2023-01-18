const express = require("express");
const app = express();
require('./config') 

const morgan = require("morgan");

const cors = require("cors");
app.use(cors({ origin: true }));

// // Conectando DB
require("./config/db");

// Middlewars y PORT
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use("/", require("./routes"));

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(process.env.PORT, () => console.log(`Hello world app listening on port 8100!`))

