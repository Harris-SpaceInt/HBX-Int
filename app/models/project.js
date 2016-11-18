/**
 * Defines the schema for projects
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    generated: {
        type: Boolean,
        default: false
    },
    discipline: {
        type: [{
            type: String,
            enum: [
                'Software',
                'Systems',
                'Electrical',
                'Mechanical',
                'Production',
                'Integration and Test',
                'Corportate',
                'Program Management'
            ]
        }],
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    team: {
        type: String,
        default: null
    },
    image: {
        type: String, 
        default: null
    },
    savings: {
        type: Number,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
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
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager',
        required: true
    },
    result: [{
        summary: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        },
        savings: {
            type: Number,
            required: true
        },
        hours: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('Project', ProjectSchema);
