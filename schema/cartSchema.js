var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CartProductSchema = new Schema({
    id: Number
}, {
    strict: false
});
mongoose.model('CartProduct', CartProductSchema);
