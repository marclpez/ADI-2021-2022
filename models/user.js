'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const Tweet = require('../models/tweet')


const userSchema = new Schema({
    nickname: {type: String, require: true},
    password: {type: String, require: true},
    email: {type: String, require: true}
    //seguidores
    //mensajes directos
})

                            //nombreVariable, nombreSchema, nombreTablaMongoDB
module.exports = mongoose.model('User', userSchema, 'usuarios');