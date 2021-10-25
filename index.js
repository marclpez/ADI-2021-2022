'use strict'

//Cargamos el módulo express
var express = require('express');
var app = express();
app.use(express.json())

//CONEXION CON DB
const mongoose = require('./database');

//CONEXION CON RUTAS
const rutasUsuarios = require('./routes/rutasUsuarios');
const rutasTweets = require('./routes/rutasTweets');
const rutasLikes = require('./routes/rutasLikes');
const rutasMensajes = require('./routes/rutasMensajes');
const rutasSeguimientos = require('./routes/rutasSeguimientos');


app.use('/twapi/usuarios', rutasUsuarios);
app.use('/twapi/tweets', rutasTweets);
app.use('/twapi/likes', rutasLikes);
app.use('/twapi/mensajes', rutasMensajes);
app.use('/twapi/seguimientos', rutasSeguimientos);



app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
 });
