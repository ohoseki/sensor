var express = require('express');
var basicAuth = require('basic-auth');
var five = require('johnny-five');

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.eclipse.org')

var app = express();
var board = new five.Board({'port':'COM3'});


var led;
board.on("ready", function() {
 led = new five.Led(10);
 });

 //ROTA SEM AUTENTICACAO
app.get('/', function(req, res) {
res.send('Benvindo ao mundo das APIs');
});

//ROTA COM AUTENTICACAO
app.put('/led/ligar', function(req, res) {
    led.on();
    client.publish('led88',1)
res.sendStatus(200);
});

app.put('/led/desligar', function(req, res) {
    led.off();
    client.publish('led88',0)
    res.sendStatus(200);
});

app.listen(3000, function (){
    console.log('Servidor esta rodando');
});