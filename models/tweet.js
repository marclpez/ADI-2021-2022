'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('../models/user')

var tweetSchema = new Schema({
    mensaje: String,
    autor: {type: Schema.ObjectId, ref: 'User'}
})
                            //nombreVariable, nombreSchema, nombreTablaMongoDB
module.exports = mongoose.model('Tweet', tweetSchema, 'tweets');