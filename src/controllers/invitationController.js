const invitationController = {};
const { Invitation, User } = require("../models/index");

invitationController.register = async (req, res) => {
  const { invitedName, entryDate, caducatedInvitationDate, qrCode } = req.body;
  const userId = req.user._id;

  try {
    // Verificamos que la invitación no esté registrada en la db
    const invitationCreated = await Invitation.findOne({ invitedName });

    if (invitationCreated) {
      return res.status(403).json({
        message: "La invitación ya fue creada",
        invitationCreate: true,
      });
    }

    // Creamos usuario y hasheamos password
    const newInvitation = new Invitation({
      invitedName,
      entryDate,
      caducatedInvitationDate,
      userId,
    });

    // guardamos invitación en la db
    const savedInvitation = await newInvitation.save();
    const userFound = await User.findById(userId);

    // guardamos la invitación creada en el usuario
    userFound.myInvitations.push(savedInvitation._id);
    await userFound.save();

    res.status(200).json({
      message: "Invitación creada satisfactoriamente",
      savedInvitation,
    });
  } catch (error) {
    res.status(400).json({ message: "Error", error });
  }
};

invitationController.myInvitations = async (req, res, next) => {
  const id = req.user._id;

  try {
    if (!id) throw new Error("No hay ningun usuario logueado");

    const myInvitations = await User.findById(id).populate("myInvitations");

    if (!myInvitations)
      throw new Error("No se han encontrado coincidencias en la DB");

    if (myInvitations < 1)
      return res.status(402).send({ message: "No tenes invitaciones creadas" });

    res.status(200).send(myInvitations);
  } catch (error) {
    res.status(400).json({ message: "Error", error });
  }
};

invitationController.getById = async (req, res, next) => {
  const id = req.user;
  const { invitationId } = req.params;

  try {
    if (!id) throw new Error("No hay ningun usuario logueado");
    const invitation = await Invitation.findById(invitationId);
    if (!invitation)
      throw new Error("No se han encontrado coincidencias en la DB");
    res.status(200).send(invitation);
  } catch (error) {
    res.status(400).json({ message: "Error", error });
  }
};

invitationController.deleteInvitation = async (req, res) => {
  const id = req.user;
  const { invitationId } = req.params;

  try {
    //verificamos que el usuario exista
    if (!id) throw new Error("No hay ningun usuario logueado");

    const invitationDeleted = await Invitation.findByIdAndDelete({
      _id: invitationId,
    });
    if (!invitationDeleted) {
      res.status(400).json({
        message: "La invitación que desea eliminar no existe",
      });
    }

    //eliminamos el id de la invitación asignada en el usuario
    const userClean = await User.findById(id);
    const myInvitations = userClean.myInvitations;
    const index = myInvitations.indexOf(invitationId);

    if (index > -1) {
      myInvitations.splice(index, 1); // 2nd parameter means remove one item only
      await User.findByIdAndUpdate(userClean, { myInvitations });
    }

    res.status(200).json({
      message: "Cuenta de juego eliminada correctamente",
      invitationDeletedBol: true,
    });
  } catch (error) {
    res.status(400).json({ message: "Error", emailAccountDeletedBol: false });
  }
};

module.exports = invitationController;
