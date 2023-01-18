const router = require("express").Router();

const Api = require("./api");
const User = require("./user");
const Invitation = require("./invitation");

router.use("/api", Api);
router.use("/user", User);
router.use("/invitation", Invitation);

module.exports = router;
