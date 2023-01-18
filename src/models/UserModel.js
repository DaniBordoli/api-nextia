const { model, Schema } = require("../config/db/index");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  departmentNumber: {
    type: Number,
    required: true,
  },

  resetCode: {
    type: Number,
  },

  myInvitations: [
    {
      type: Schema.Types.ObjectId,
      ref: "invitations",
    },
  ],
});

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  const resu = await bcrypt.compare(password, this.password);
  return resu;
};

module.exports = model("users", UserSchema);
