const mongoose = require("mongoose");
const { schemaForUrl, schemaForCutUrl } = require("./yupSchema");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
    maxlength: 700,
  },

  cutUrl: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 500,
    lowercase: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  
  date: {
    type: Date,
    default: Date.now,
  },
});

urlSchema.statics.urlValidation = function(body){
  return schemaForUrl.validate(body, {abortEarly: false});
};

urlSchema.statics.cutUrlValidation = function(body){
  body.cutUrl = body.updateUrl;
  return schemaForCutUrl.validate(body , {abortEarly: false});
};

module.exports = mongoose.model("url", urlSchema);
