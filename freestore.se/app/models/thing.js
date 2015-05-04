var mongoose = require('mongoose');

module.exports = mongoose.model('Thing', {
    title: String,
    category: String,
    description: String,
    contact: {
        telephone: String,
        email: String
    },
    time: Date,
    location: String,
    photopath: String
});