'use strict'

const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    mensaje: String,
    likes: Number
})
                            //nombreVariable, nombreSchema, nombreTablaMongoDB
module.exports = mongoose.model('Tweet', tweetSchema, 'tweets');