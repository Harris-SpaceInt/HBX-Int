/**
 * Defines the schema for managers
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ManagerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        enum: [
            "ISR",
            "Space Superiority",
            "Proprietary",
            "Geospatial",
            "Environmental",
            "PNT"
        ],
        required: true
    },
    function: String,
    department: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Manager', ManagerSchema);
