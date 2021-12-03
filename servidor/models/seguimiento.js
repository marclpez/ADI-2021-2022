'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./user');
const mongoosePaginate = require('mongoose-paginate-v2')

var seguimientoSchema = new Schema({
    seguidor: {type: String}, 
    seguido: {type: String}
},
{
    versionKey: false
})

seguimientoSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Seguimiento', seguimientoSchema, 'seguimientos');