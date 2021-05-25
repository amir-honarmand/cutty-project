const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const { schemaForUser, schemaForEditUser } = require("./yupSchema");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 255,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 30,
  },
  avatar:{
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.userValidation = function (body) {
  return schemaForUser.validate(body);
};

userSchema.statics.editUserValidation = function(body){
  return schemaForEditUser.validate(body);
};

userSchema.pre('save', function(next){
  let user = this;
  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (err, hash)=>{
    if(err) return next(err);

    user.password = hash;
    next();
  })
})

module.exports = mongoose.model("user", userSchema);
