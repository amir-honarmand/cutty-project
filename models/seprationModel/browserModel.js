const mongoose = require('mongoose');

const browserSchema = new mongoose.Schema({
    chrome: {type: Number, default: 0},
    firefox: {type: Number, default: 0},
    safari: {type: Number, default: 0},
    edge: {type: Number, default: 0},
    url: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'url',
    }
});

module.exports = mongoose.model("browser", browserSchema);
