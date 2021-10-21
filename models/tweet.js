'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('../models/user')
const Like = require('../models/like')

var tweetSchema = new Schema({
    mensaje: String,
    autor: {type: Schema.ObjectId, ref: 'User'},
    likes: [{type: Schema.ObjectId, ref: 'Like'}]
})
                            //nombreVariable, nombreSchema, nombreTablaMongoDB
module.exports = mongoose.model('Tweet', tweetSchema, 'tweets');