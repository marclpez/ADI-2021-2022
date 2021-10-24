'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema
const Tweet = require('../models/tweet')
const Seguimiento = require('../models/seguimiento')
const Mensaje = require('../models/mensaje')
const mongoosePaginate = require('mongoose-paginate-v2')

const userSchema = new Schema({
    nickname: {type: String, require: true},
    password: {type: String, require: true},
    email: {type: String, require: true},
    tweets: [{type: Schema.ObjectId, ref: 'Tweet'}],
    seguidores: [{type: Schema.ObjectId, ref: 'Seguimiento'}],
    seguidos: [{type: Schema.ObjectId, ref: 'Seguimiento'}],
    mensajes: [{type: Schema.ObjectId, ref: 'Mensaje'}]
},
{
    versionKey: false
})

userSchema.plugin(mongoosePaginate)

                            //nombreVariable, nombreSchema, nombreTablaMongoDB
module.exports = mongoose.model('User', userSchema, 'usuarios');