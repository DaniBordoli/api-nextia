const router = require("express").Router();
const invitationController = require("../controllers/invitationController");
const verifyJWT = require("../middlewares/tokens/jwtController");

//* Registrar a un usuario
router.post("/add", verifyJWT, invitationController.register);

//* Trae todas las invitaciones del usuario
router.get("/myinvitations", verifyJWT, invitationController.myInvitations);

//* Trae una invitación por su id
router.get("/:invitationId", verifyJWT, invitationController.getById);

// Elimina una cuenta de juego
router.delete(
  "/:invitationId",
  verifyJWT,
  invitationController.deleteInvitation
);

module.exports = router;
