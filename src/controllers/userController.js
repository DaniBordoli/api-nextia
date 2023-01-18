const jwt = require("jsonwebtoken");
const axios = require("axios");
const userController = {};
const { User } = require("../models/index");
const { encryptPassword } = require("../utils");
const { emailSender } = require("../services/email");

userController.register = async (req, res) => {
  const {
    firstName,
    lastName,
    userEmail,
    password,
    passwordConfirm,
    departmentNumber,
  } = req.body;
  try {
    // Verificamos que el usuario no este registrado en la db
    const userRegistered = await User.findOne({ userEmail });

    if (userRegistered) {
      return res.status(403).json({
        message: "El email ya se encuentra registrado, utilice uno nuevo.",
        userRegister: true,
      });
    }

    // Verificamos que las claves coincidan
    if (password !== passwordConfirm)
      return res
        .status(403)
        .json({ message: "Las contraseñas deben ser iguales." });

    // Creamos usuario y hasheamos password
    const newUser = new User({
      firstName,
      lastName,
      userEmail,
      password,
      departmentNumber,
    });

    newUser.password = await newUser.encryptPassword(password);

    // guardamos usuario en la db
    const savedUser = await newUser.save();

    res
      .status(200)
      .json({ message: "Usuario creado satisfactoriamente", savedUser });
  } catch (error) {
    res.status(400).json({ message: "Error", error });
  }
};

userController.login = async (req, res, next) => {
  const { userEmail, password } = req.body;

  try {
    // Validamos que el usuario ingresado exista.
    const user = await User.findOne({ userEmail });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    // Validamos que la contrasena sea correcta
    const validPassword = await user.matchPassword(password);
    if (!validPassword)
      return res.status(400).json({ message: "Password Incorrecta" });

    // Creamos token de login y le indicamos que dura 24 horas
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: "Error", error });
  }
};

userController.logout = async (req, res) => {
  const id = req.user;
  try {
    if (!id)
      return res.status(400).json({
        message:
          "No se puede llevar a cabo esta accion, ya que no hay ningun usuario logueado",
      });

    req.user = undefined;
    res.status(200).json({ message: "Usuario deslogueado satisfactoriamente" });
  } catch (error) {
    res.status(400).json({ message: "Error", error });
  }
};

userController.sendResetCode = async (req, res) => {
  const { userEmail } = req.body;

  try {
    // verificamos que el email se encuentre en la db
    const checkEmail = await User.findOne({ userEmail });
    if (!checkEmail)
      throw new Error("El correo electronico ingresado no existe");
    // creamos una función que genere un codigo random.
    const generateCode = () => {
      let code = Math.floor(Math.random() * 99999).toString(); // verify
      return "0".repeat(5 - code.length) + code;
    };

    const code = generateCode();

    await User.updateOne({ userEmail }, { resetCode: code });

    await emailSender(code, userEmail);
    res.status(200).json({ message: "Email enviado satisfactoriamente" });
  } catch (error) {
    res.status(400).send(error);
  }
};

userController.checkResetCode = async (req, res) => {
  const { userEmail, resetCode } = req.body;

  try {
    const user = await User.findOne({ userEmail });
    if (!user) throw new Error("El correo electronico ingresado no existe");
    if (parseInt(resetCode) !== user.resetCode)
      throw new Error("Codigo incorrecto");

    res.status(200).json({ message: "Codigo ingresado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

userController.changePassword = async (req, res) => {
  const { userEmail, password, passwordConfirm } = req.body;
  try {
    const user = await User.findOne({ userEmail });
    if (!user) throw new Error("No existe usuario con el email ingresado");
    if (password !== passwordConfirm)
      throw new Error("Las contraseñas no coinciden");
    const newPassword = await encryptPassword(password);
    user.password = newPassword;
    await user.save();
    // create and assign jwt, ya que todo está ok
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).status(200).send({ token });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
};

module.exports = userController;
