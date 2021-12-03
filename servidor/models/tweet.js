'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('../models/user')
const Like = require('../models/like')
const mongoosePaginate = require('mongoose-paginate-v2')

var tweetSchema = new Schema({
    mensaje: String,
    autor: String,
    likes: [{type: Schema.ObjectId, ref: 'Like'}]
},
{
    versionKey: false
})

tweetSchema.plugin(mongoosePaginate)

                            //nombreVariable, nombreSchema, nombreTablaMongoDB
module.exports = mongoose.model('Tweet', tweetSchema, 'tweets');