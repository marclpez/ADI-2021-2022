'use strict'

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//MODELOS
const User = require('../models/user')
const Mensaje = require('../models/mensaje');


router.get('/:id', async function(req, res) {
    var mensajeBuscado;

    try{
        mensajeBuscado = await Mensaje.findOne({ _id: req.params.id })
        res.status(200).send(mensajeBuscado)
    }
    catch(err){
        if(mensajeBuscado === undefined || mensajeBuscado === null){
            return res.status(404).send({mensaje: 'No existe un mensaje con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.post('/', async function (req, res) {
    var idEmisor = '61719a6a5d0f156b31f22379';
    var idReceptor = '6171a211b7b1e76e8e789cc8';

    try{
        var emisor = await User.findOne({_id: idEmisor});
        var receptor = await User.findOne({_id: idReceptor});
        console.log(emisor)
        console.log(receptor)

        var nuevoMensaje = new Mensaje({
            emisor: idEmisor,
            receptor: idReceptor,
            mensaje: req.body.mensaje
        })
        console.log(nuevoMensaje)
        await nuevoMensaje.save()

        emisor.mensajes.push(nuevoMensaje);
        receptor.mensajes.push(nuevoMensaje);
        await emisor.save();
        await receptor.save();

        res.header('Location', '/twapi/mensajes/' + nuevoMensaje._id)
        res.status(201).send({mensaje: "Guardado el mensaje"})

    }
    catch(err){
        if(emisor === undefined || emisor === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID (emisor)'})
        }
        if(receptor === undefined || receptor === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID (receptor)'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.delete('/:id', async function(req, res){
    var mensajeBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    //Mas adelante deberemos comparar que el usuario que elimina el mensaje coincide con el que tiene la sesion iniciada
    //si no no se podrá eliminar el mensaje
    try{
        mensajeBuscado = await Mensaje.findOneAndDelete({ _id: req.params.id})
        console.log(mensajeBuscado)
        //Eliminamos la referencia del mensaje a borrar del array de mensajes del emisor
        await User.findOneAndUpdate({ _id: mensajeBuscado.emisor}, {$pull: {mensajes: mensajeBuscado._id}}, options)
        //Eliminamos la referencia del mensaje a borrar del array de mensajes del receptor
        await User.findOneAndUpdate({ _id: mensajeBuscado.receptor}, {$pull: {mensajes: mensajeBuscado._id}}, options)
        
        res.status(200).send({mensaje: "Mensaje eliminado"})
    }
    catch(err){
        if(mensajeBuscado === undefined || mensajeBuscado === null){
            return res.status(404).send({mensaje: 'No existe un mensaje con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

module.exports = router