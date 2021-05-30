const mongoose = require('mongoose');

const browserSchema = new mongoose.Schema({
    chrome: Number,
    firefox: Number,
    safari: Number,
    edge: Number,
    url: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'url',
    }
});

module.exports = mongoose.model("browser", browserSchema);
