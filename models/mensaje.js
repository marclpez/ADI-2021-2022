'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./user');

var mensajeSchema = new Schema({
    mensaje: String,
    emisor: {type: Schema.ObjectId, ref: 'User'}, 
    receptor: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Mensaje', mensajeSchema, 'mensajes');