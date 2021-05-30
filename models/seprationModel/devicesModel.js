const mongoose = require('mongoose');

const devicesSchema = new mongoose.Schema({
    desktop: Number,
    mobile: Number,
    url: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'url',
    }
});

module.exports = mongoose.model("devices", devicesSchema);