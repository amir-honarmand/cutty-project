const mongoose = require('mongoose');

const osSchema = new mongoose.Schema({
    windows: Number,
    mac: Number,
    ios: Number,
    android: Number,
    url: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'url',
    }
});

module.exports = mongoose.model("os", osSchema);