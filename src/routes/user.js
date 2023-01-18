const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middlewares/tokens/jwtController");

//* Registrar a un usuario
router.post("/register", userController.register);

//* Loguear a un usuario
router.post("/login", userController.login);

//* Desloguear a un usuario
router.get("/logout", verifyJWT, userController.logout);

//* Enviar email al usuario para recuperar la contraseña
router.post("/send-code", userController.sendResetCode);

//* Verificar que el codigo de reseteo de contraseña es correcto
router.post("/check-code", userController.checkResetCode);

//* Cambiar clave de usuario una vez despues de validar que el codigo de reseteo ingresado es correcto.
router.post("/change-password", userController.changePassword);

module.exports = router;
