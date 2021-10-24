'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./user');
const mongoosePaginate = require('mongoose-paginate-v2')

var seguimientoSchema = new Schema({
    seguidor: {type: Schema.ObjectId, ref: 'User'}, 
    seguido: {type: Schema.ObjectId, ref: 'User'}
},
{
    versionKey: false
})

seguimientoSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Seguimiento', seguimientoSchema, 'seguimientos');