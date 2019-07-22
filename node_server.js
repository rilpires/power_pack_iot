var express = require('express')
var app = express();
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var mqtt = require('mqtt');
var mqtt_client = mqtt.connect({host:'192.168.1.5',port:'1883'});//alterar para a porta do nosso server na hora


const WEB_PAGE_PORT = 8080
var server_start_time = Date.now();
var battery_log = new Array();
var servo;
var battery;
var ldr1;
var ldr2;

console.log( "Server start time: " + Date( server_start_time.valueOf() ) )

app.use(express.static('.')) 
app.get('/', function(req, res){
    console.log("Toma")
    res.sendFile( __dirname + '/index.html' );
});

http.listen( WEB_PAGE_PORT , function(){
    console.log( "Serving web page on port " + WEB_PAGE_PORT )
})

io.on('connection',function(socket){
    console.log("Someone connected");
    console.log("Websocket connected: " + socket.id );
    socket.emit('server_start_time',server_start_time);
    socket.emit('battery_read',battery);
    socket.emit('servo_read',servo);
    socket.emit('ldr1_read',ldr1);
    socket.emit('ldr2_read',ldr2);
})

//se inscreve no mqtt que cada sensor vai mandar

mqtt_client.on('connect',function(){
    
    mqtt_client.subscribe('servo_read',function(err){
        if(!err){
            console.log("mqtt conected")
        }
    });
    mqtt_client.subscribe('battery_read',function(err){
        if(!err){
            console.log("mqtt conected")
        }
    });
    mqtt_client.subscribe('ldr1_read',function(err){
        if(!err){
            console.log("mqtt conected")
        }
    });
    mqtt_client.subscribe('ldr2_read',function(err){
        if(!err){
            console.log("mqtt conected")
        }
    });
})

//repassa as mensagens para o front, se for de bateria salva no log
//        io.emit('battery_log',String(battery_log));


mqtt_client.on('message',function(topic,msg){
    if(topic =="battery_read"){
        //como o grafico é de carga da bateria acho que salvar dês de que o server inicia faz sentido,
        // só temos que ver uma estrutura boa para isso, botei num array só por questoes de fazer agora 
        battery=parseFloat(msg.toString());
        battery_log.push(battery);
    }
    if(topic=="servo_read")
        servo = msg.toString();
    if(topic == "ldr1_read")
        ldr1 = msg.toString();
    if(topic == "ldr2_read")
        ldr2 = msg.toString();
    io.emit(topic,msg.toString());
});

setInterval(function(){
    io.emit('battery_log',battery_log);
    console.log('sending battery log')
},5000);