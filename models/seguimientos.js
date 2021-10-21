'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./user');

var seguimientoSchema = new Schema({
    seguidor: {type: Schema.ObjectId, ref: 'User'}, 
    seguido: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Seguimiento', seguimientoSchema, 'seguimientos');