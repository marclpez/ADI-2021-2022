'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const Tweet = require('../models/tweet')
const Seguimiento = require('../models/seguimiento')
const Mensaje = require('../models/mensaje')


const userSchema = new Schema({
    nickname: {type: String, require: true},
    password: {type: String, require: true},
    email: {type: String, require: true},
    tweets: [{type: Schema.ObjectId, ref: 'Tweet'}],
    seguidores: [{type: Schema.ObjectId, ref: 'Seguimiento'}],
    seguidos: [{type: Schema.ObjectId, ref: 'Seguimiento'}],
    mensajes: [{type: Schema.ObjectId, ref: 'Mensaje'}]
})

                            //nombreVariable, nombreSchema, nombreTablaMongoDB
module.exports = mongoose.model('User', userSchema, 'usuarios');