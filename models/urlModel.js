const mongoose = require("mongoose");

const { schemaForUrl, schemaForShortened } = require("./yupSchema");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
    maxlength: 700,
  },

  shortened: {
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
  
  createAt: {
    type: Date,
    default: Date.now,
  },

  totalVisits: {
    type: Number,
    default: 0,
  },

  todayVisits: {
    type: Number,
    default: 0,
  },

  urlId: {
    type: String,
    unique: true,
  },
  
});

urlSchema.statics.urlValidation = function(body){
  return schemaForUrl.validate(body, {abortEarly: false});
};

urlSchema.statics.shortenedValidation = function(body){
  body.shortened = body.updateUrl;
  return schemaForShortened.validate(body , {abortEarly: false});
};

module.exports = mongoose.model("url", urlSchema);
