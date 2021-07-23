const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
        
    DateTime: String,
    stats:Object

})

exports.Record = mongoose.model('Records',recordSchema);