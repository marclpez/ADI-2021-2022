'use strict'

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const auth = require('../middlewares/auth')

//MODELOS
const User = require('../models/user')
const Mensaje = require('../models/mensaje');

//LocalStorage
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

//Simularia la bandeja de entrada de un usuario
router.get('/', auth.chequeaJWT, async function(req, res){
    var usuarioBuscado;
    const options = {
        limit: req.query.limit || 5,
        page: req.query.page || 1,
    }

    try{
        usuarioBuscado = await User.findOne({_id: localStorage.idUsuario})
        console.log(usuarioBuscado)
        if(usuarioBuscado.mensajes.length === 0){
            return res.status(200).send({mensaje: 'El usuario no tiene mensajes'})
        }

        var lista_mensajes = await Mensaje.paginate({ $or: [ { emisor: usuarioBuscado._id }, { receptor: usuarioBuscado._id } ] }, options)
        if(lista_mensajes.hasPrevPage){
            lista_mensajes.prevPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/mensajes?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_mensajes.hasNextPage){
            lista_mensajes.nextPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/mensajes?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }

        res.status(200).send(lista_mensajes)
    }
    catch(err){
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})

router.get('/:id', auth.chequeaJWT, async function(req, res) {
    var mensajeBuscado;

    try{
        mensajeBuscado = await Mensaje.findOne({ _id: req.params.id })
        if(mensajeBuscado.emisor == localStorage.idUsuario || mensajeBuscado.receptor == localStorage.idUsuario){
            return res.status(200).send(mensajeBuscado)
        }
        return res.status(401).send({mensaje: "El mensaje con ese ID no te pertenece"})
    }
    catch(err){
        if(mensajeBuscado === undefined || mensajeBuscado === null){
            return res.status(404).send({mensaje: 'No existe un mensaje con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.post('/', auth.chequeaJWT, async function (req, res) {
    try{
        var emisor = await User.findOne({_id: localStorage.idUsuario});
        var receptor = await User.findOne({_id: req.body.receptor});
        console.log(emisor)
        console.log(receptor)

        if(emisor !== null && receptor !== null){
            var nuevoMensaje = new Mensaje({
                emisor: emisor,
                receptor: receptor,
                mensaje: req.body.mensaje
            })
            console.log(nuevoMensaje)
            nuevoMensaje.save()
    
            emisor.mensajes.push(nuevoMensaje);
            receptor.mensajes.push(nuevoMensaje);
            emisor.save();
            receptor.save();
    
            res.header('Location', 'http://localhost:3000/twapi/mensajes/' + nuevoMensaje._id)
            res.status(201).send({mensaje: "Guardado el mensaje", mensaje_creado: nuevoMensaje})
        }
        else{
            if(emisor === null){
                return res.status(404).send({mensaje: 'No existe un usuario con ese ID (emisor)'})
            }
            res.status(404).send({mensaje: 'No existe un usuario con ese ID (receptor)'})
        }
    }
    catch(err){
        if(emisor === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID (emisor)'})
        }
        if(receptor === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID (receptor)'})
        }
        console.log(err)
        res.status(500).send({mensaje: "Error"})
    }
})

router.delete('/:id', auth.chequeaJWT, async function(req, res){
    var mensajeBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    try{
        mensajeBuscado = await Mensaje.findOne({ _id: req.params.id })
        if(mensajeBuscado === null){
            return res.status(404).send({mensaje: 'No existe un mensaje con ese ID'})
        }
        if(mensajeBuscado.emisor != localStorage.idUsuario && mensajeBuscado.receptor != localStorage.idUsuario){
            return res.status(401).send({mensaje: "Ese mensaje no te pertenece"})
        }
        await Mensaje.deleteOne({ _id: req.params.id})
        console.log(mensajeBuscado)
        //Eliminamos la referencia del mensaje a borrar del array de mensajes del emisor
        await User.findOneAndUpdate({ _id: mensajeBuscado.emisor}, {$pull: {mensajes: mensajeBuscado._id}}, options)
        //Eliminamos la referencia del mensaje a borrar del array de mensajes del receptor
        await User.findOneAndUpdate({ _id: mensajeBuscado.receptor}, {$pull: {mensajes: mensajeBuscado._id}}, options)
        
        res.status(200).send({mensaje: "Mensaje eliminado"})
    }
    catch(err){
        if(mensajeBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un mensaje con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

module.exports = router