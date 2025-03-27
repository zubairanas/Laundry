const { Schema, default: mongoose } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate');
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');


const userSchema = new Schema(
  {
    firstName: {
      type: String,
      // minlength: 3,
      default : ""
      // required: true,
    },
    lastName: {
      type: String,
      // minlength: 3,
      default : ""
      // required: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      minlength: 3,
      required: true,
      unique: true,
      dropDups: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      required: true,
    },
   
    phoneNumber: {
      type: String,
    },
    address: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'address'
      }
    ],
    Reg_Date:{
      type : Date,
      default : Date.now()
    },
    image: {
      type: String,
      default : ""
    },
    hashed_password: {
      type: String,
    },
    salt: String,

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      required: true,
      default: "ACTIVE"
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return "";

    try {

      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      console.log(err.message);
      return "";
    }
  },
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("user", userSchema);
