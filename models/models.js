const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const SignSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  femail: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fpassword: {
    type: String,
    required: true,
  },
  password2: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

SignSchema.methods.generateAuthtoken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      "mynameisranveerkumarsinghmynameisranveerkumarsingh"
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

SignSchema.pre("save", async function (next) {
  if (this.isModified("fpassword")) {
    this.fpassword = await bcrypt.hash(this.fpassword, 10);
    // this.password2 = await bcrypt.hash(this.password2, 10);
  }
  next();
});

const Register = new mongoose.model("Register", SignSchema);
module.exports = Register;
