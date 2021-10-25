'use strict'

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//MODELOS
const Tweet = require('../models/tweet')
const User = require('../models/user')
const Like = require('../models/like')

//Esta ruta es un poco rara ya que siempre vamos a buscar los likes de un determinado tweet no todos los likes de todos los tweets
router.get('/', async function(req, res) {
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }
    
    try{
        var lista_likes = await Like.paginate({}, options)
        if(lista_likes.docs.length === 0){
            return res.status(404).send({mensaje: 'No hay likes'})
        }
        if(lista_likes.hasPrevPage){
            lista_likes.prevPage = 'http://localhost:3000/twapi/likes?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_likes.hasNextPage){
            lista_likes.nextPage = 'http://localhost:3000/twapi/likes?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }
        res.status(200).send(lista_likes)
    }
    catch(err){
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.get('/:id', async function(req, res){
    var likeBuscado;

    try{
        likeBuscado = await Like.findOne({ _id: req.params.id })
        res.status(200).send(likeBuscado)
    }
    catch(err){
        if(likeBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un like con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.post('/likes', async function(req, res) {
    var idTweet = '6175c9aacfb9802d70b76540';
    var idUsuario = '6171870f4f761a62baca127a';

    try{
        var tweetBuscado = await Tweet.findOne({ _id: idTweet})
        var usuarioBuscado = await User.findOne({_id: idUsuario})
        console.log(tweetBuscado)
        console.log(usuarioBuscado)

        var nuevoLike = new Like({
            usuario: idUsuario, //Habra que verificar que se introduce un id de un usuario de la BD
            tweet: idTweet
        })
        console.log(nuevoLike)

        
        tweetBuscado.likes.push(nuevoLike)
        usuarioBuscado.likes.push(tweetBuscado)
        await tweetBuscado.save()
        await nuevoLike.save()
        await usuarioBuscado.save()

        res.header('Location', '/twapi/tweets/' + idTweet + '/likes' + nuevoLike._id)
        res.status(201).send({mensaje: "Guardado el like"})
    }
    catch(err){
        console.log(err)
        if(tweetBuscado === undefined || tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.delete('/:id', async function(req, res){
    var likeBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    //Mas adelante deberemos comparar que el usuario que elimina el like coincide con el que tiene la sesion iniciada
    //si no no se podrá eliminar el like
    try{
        likeBuscado = await Like.findOneAndDelete({ _id: req.params.id})
        console.log(likeBuscado)
        //Eliminamos la referencia del like a borrar del array de likes de su tweet relacionado
        await Tweet.findOneAndUpdate({ _id: likeBuscado.tweet}, {$pull: {likes: likeBuscado._id}}, options)
        //Eliminamos la referencia del like a borrar del array de likes de su usuario relacionado
        await User.findOneAndUpdate({ _id: likeBuscado.usuario}, {$pull: {likes: likeBuscado.tweet}}, options)
        
        res.status(200).send({mensaje: "Like eliminado"})
    }
    catch(err){
        if(likeBuscado === undefined || likeBuscado === null){
            return res.status(404).send({mensaje: 'No existe un like con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

module.exports = router