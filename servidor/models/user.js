'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema
const Tweet = require('../models/tweet')
const Mensaje = require('../models/mensaje')
const mongoosePaginate = require('mongoose-paginate-v2')

const userSchema = new Schema({
    nickname: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    tweets: [{type: Schema.ObjectId, ref: 'Tweet'}],
    seguidores: [{type: Schema.ObjectId, ref: 'User'}],
    seguidos: [{type: Schema.ObjectId, ref: 'User'}],
    mensajes: [{type: Schema.ObjectId, ref: 'Mensaje'}],
    likes: [{type: Schema.ObjectId, ref: 'Tweet'}],
    imagenes: [{type: String}]
},
{
    versionKey: false
})

userSchema.plugin(mongoosePaginate)

                            //nombreVariable, nombreSchema, nombreTablaMongoDB
module.exports = mongoose.model('User', userSchema, 'usuarios');