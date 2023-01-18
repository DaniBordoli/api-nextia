const { model, Schema } = require("../config/db/index");

const InvitationSchema = new Schema({
  invitedName: {
    type: String,
    required: true,
  },
  entryDate: {
    type: String,
    required: true,
  },
  caducatedInvitationDate: {
    type: String,
    required: true,
  },

  qrCode: {
    type: String,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

module.exports = model("invitations", InvitationSchema);
