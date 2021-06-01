const mongoose = require('mongoose');

const devicesSchema = new mongoose.Schema({
    desktop: {type: Number, default: 0},
    mobile: {type: Number, default: 0},
    url: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'url',
    }
});

module.exports = mongoose.model("devices", devicesSchema);