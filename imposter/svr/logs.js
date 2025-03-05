const mongoose = require('mongoose');
const log = new mongoose.Schema({
    req_type: {
        type: String,
        required: true,
    },
    timestamp:{
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    }
})
const logs = mongoose.model('log',log);
module.exports = logs;