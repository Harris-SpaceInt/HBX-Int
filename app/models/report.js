/**
 * Defines the schema for reports
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    savings: {
        type: Number,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    project: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }],
        required: true
    }
});

module.exports = mongoose.model('Report', ReportSchema);
