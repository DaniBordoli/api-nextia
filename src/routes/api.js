const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.status(200).send("API its working, ingresaste correctamente");
});

router.get("/time", (req, res) => {
  res.send(`${Date.now()}`);
});

module.exports = router;
