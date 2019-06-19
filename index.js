var express = require('express');
var basicAuth = require('basic-auth');
var five = require('johnny-five');

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.20.34.31')

var app = express();
var board = new five.Board({'port':'COM3'});

var led;
var ultimoStatusVaga = "0";

board.on("ready", function() {
    var proximity = new five.Proximity({
      controller: "HCSR04",
      pin: 7
    });
  
    led = new five.Led(10);

    proximity.on("data", function() {
      //console.log("Proximity: ");
      //console.log("  cm  : ", this.cm);
      //console.log("  in  : ", this.in);
      //console.log("-----------------");
    });
  
    proximity.on("change", function() {
      //console.log("The obstruction has moved.");
  
      if(this.cm <= 5){
          if (ultimoStatusVaga != "1")
          {
          client.publish('vaga02','1')
          led.on();
        client.publish('led88','1')
        ultimoStatusVaga = "1";
          }
          //console.log("Ocupado");
      } else {
        if (ultimoStatusVaga != "0")
        {
          client.publish('vaga02','0')
          led.off();
        client.publish('led88','0')
          //console.log("Livre");
          ultimoStatusVaga = "0";
        }
      }
  
    });
  });

 //ROTA SEM AUTENTICACAO
app.get('/', function(req, res) {
res.send('Benvindo ao mundo das APIs');
});

//ROTA COM AUTENTICACAO
app.put('/led/ligar', function(req, res) {
    led.on();
    client.publish('led88','1')
res.sendStatus(200);
});

app.put('/led/desligar', function(req, res) {
    led.off();
    client.publish('led88','0')
    res.sendStatus(200);
});

app.listen(3000, function (){
    console.log('Servidor esta rodando');
});