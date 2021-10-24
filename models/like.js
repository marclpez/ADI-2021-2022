'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('../models/user');
const Tweet = require('../models/tweet');
const mongoosePaginate = require('mongoose-paginate-v2');

var likeSchema = new Schema({
    usuario: {type: Schema.ObjectId, ref: 'User'}, //usuario que da el like
    tweet: {type: Schema.ObjectId, ref: 'Tweet'} //tweet al que le da like
},
{
    versionKey: false
})

likeSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Like', likeSchema, 'likes');