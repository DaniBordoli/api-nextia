const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NODEMAILER,
    pass: process.env.PASSWORD_NODEMAILER,
  },
});

const emailSender = async (password, email) => {
  const subject = `Nextia: Recuperación de contraseña!`;
  const message = `<b>Hola, este es tu codigo de recuperación de contraseña: ${password}, por favor, ingresalo en la web para poder cambiar tu clave! </b>`;
  const mailOptions = {
    from: process.env.EMAIL_NODEMAILER,
    to: email,
    subject: subject,
    html: message,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return info;
    }
    return info.accepted
      ? res
          .status(200)
          .json({ message: "Se ha enviado un email con tu codigo" })
      : res
          .status(422)
          .json({ message: "Hubo un problema al enviar tu correo" });
  });
};

module.exports = {
  emailSender,
};
