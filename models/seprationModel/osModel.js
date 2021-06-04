const mongoose = require('mongoose');

const osSchema = new mongoose.Schema({
    windows: {type: Number, default: 0},
    mac: {type: Number, default: 0},
    ios: {type: Number, default: 0},
    android: {type: Number, default: 0},
    urlId: {
        type: String,
        unique: true,
    },
});

module.exports = mongoose.model("os", osSchema);