const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems:[{type: mongoose.Schema.Types.ObjectId , ref : 'ordersitems', required : true}],
    shippingAdresse1:{ type:String , require:true},
    shippingAdresse2:{ type:String },
    city:{ type:String , require:true},
    zip:{ type:String , require:true},
    country:{ type:String , require:true},
    phone:{ type:String , require:true},
    status:{ type:String , require:true , default:'Pending'},
    totalPrice:{ type:Number },
    user:{type : mongoose.Schema.Types.ObjectId, ref:'users'},
    dateOrdred:{ type:Date , default:Date.now},
});
orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
orderSchema.set('toJSON',{
    virtuals:true
});
exports.Order = mongoose.model('orders',orderSchema);