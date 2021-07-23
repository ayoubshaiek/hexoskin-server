const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity:{type:Number , require:true},
    product:{type:mongoose.Schema.Types.ObjectId, ref : 'products'}
});
exports.OrderItem = mongoose.model('ordersitems',orderItemSchema);