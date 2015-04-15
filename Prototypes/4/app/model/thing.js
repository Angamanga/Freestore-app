var mongoose = require('mongoose');

module.exports = mongoose.model('Thing',{
    title:String,
    description:String
});
                                