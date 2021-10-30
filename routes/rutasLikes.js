'use strict'

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const auth = require('../middlewares/auth')

//MODELOS
const Tweet = require('../models/tweet')
const User = require('../models/user')
const Like = require('../models/like')

//LocalStorage
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


router.get('/:id', async function(req, res){
    var likeBuscado;

    try{
        likeBuscado = await Like.findOne({ _id: req.params.id })
        res.status(200).send(likeBuscado)
    }
    catch(err){
        if(likeBuscado === undefined || likeBuscado === null){
            return res.status(404).send({mensaje: 'No existe un like con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.post('/', auth.chequeaJWT, async function(req, res) {

    try{
        var tweetBuscado = await Tweet.findOne({ _id: req.body.tweet})
        var usuarioBuscado = await User.findOne({_id: localStorage.idUsuario})
        console.log(tweetBuscado)
        console.log(usuarioBuscado)

        if(tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        var nuevoLike = new Like({
            usuario: usuarioBuscado, //Habra que verificar que se introduce un id de un usuario de la BD
            tweet: tweetBuscado
        })
        console.log(nuevoLike)

        
        //Actualizamos BD al introducir el like
        await User.findByIdAndUpdate(usuarioBuscado._id, {$push: {'likes': nuevoLike}})
        nuevoLike.save()
        await Tweet.findByIdAndUpdate(tweetBuscado._id, {$push: {'likes': nuevoLike}})
        
        console.log("he acabado")
        res.header('Location', 'http://localhost:3000/twapi/likes' + nuevoLike._id)
        return res.status(201).send({mensaje: "Guardado el like", like: nuevoLike})
    }
    catch(err){
        console.log(err)
        if(tweetBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.delete('/:id', auth.chequeaJWT, async function(req, res){
    var likeBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }

    try{
        likeBuscado = await Like.findOneAndDelete({ _id: req.params.id})
        console.log(likeBuscado)
        if(likeBuscado.usuario != localStorage.idUsuario){
            return res.status(401).send({mensaje: "No puedes eliminar un like que no has dado tú"})
        }
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