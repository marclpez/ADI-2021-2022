'use strict'

//Cargamos el módulo express
var express = require('express');
var app = express();
app.use(express.json())

const mongoose = require('./database');
const rutas = require('./routes/rutas')
app.use(rutas)

//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
 });