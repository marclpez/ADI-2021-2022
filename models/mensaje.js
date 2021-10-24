'use strict'

var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
var Schema = mongoose.Schema;
const User = require('./user');

var mensajeSchema = new Schema({
    emisor: {type: Schema.ObjectId, ref: 'User'}, 
    receptor: {type: Schema.ObjectId, ref: 'User'},
    mensaje: String
},
{
    versionKey: false
})

mensajeSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Mensaje', mensajeSchema, 'mensajes');