'use strict'

//Cargamos el módulo express
var express = require('express');
var app = express();
app.use(express.json())

//CONEXION CON DB
const mongoose = require('./database');

//CONEXION CON RUTAS
const rutas = require('./routes/rutas')
app.use('/twapi', rutas) //todas las rutas que comiencen por /twapi se iran hacia el archivo rutas

app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
 });