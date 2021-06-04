const mongoose = require('mongoose');

const devicesSchema = new mongoose.Schema({
    desktop: {type: Number, default: 0},
    mobile: {type: Number, default: 0},
    urlId: {
        type: String,
        unique: true,
    },
});

module.exports = mongoose.model("devices", devicesSchema);