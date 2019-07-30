const WEB_PAGE_PORT = 8080
const MQTT_SERVER_HOST = 'broker.hivemq.com'
const MQTT_SERVER_PORT = '1883'

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

var express = require('express')
var app = express();
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var file_logging = require("./file_logging")
var fs = require('fs')
var mqtt = require('mqtt');

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

var server_start_time = Date.now();
var connected_websockets = new Set();
var last_servo_read = null;
var last_ldr1_read = null;
var last_ldr2_read = null;
var last_current_read = null;
var last_servo_mode_read = "auto";

// Folders where we storage log data
var folders_to_create = [
    'log',
    'log/ldr1',
    'log/ldr2',
    'log/servo',
    'log/current',
    'log/visit']
for( var f of folders_to_create ) if( !fs.existsSync(f) ) fs.mkdirSync(f)

// Web server -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.use(express.static('.')) 
app.get('/', function(req, res){
    res.sendFile( __dirname + '/index.html' );
});
http.listen( WEB_PAGE_PORT , function(){
    console.log( "Serving web page on port " + WEB_PAGE_PORT )
})
console.log( "Server start time: " + Date( server_start_time.valueOf() ) )

// Websocket -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
io.on('connection',function(socket){
    connected_websockets.add(socket)
    socket.on('disconnect',function(args){
        connected_websockets.delete(socket)
    })
    console.log("Websocket connected: " + socket.id )
    socket.emit('server_start_time',server_start_time)
    file_logging.appendValue( 'visit' , socket.id )
    var first_server_data = {
        'current_log' : file_logging.getValues('current'),
        'ldr1_log' : file_logging.getValues('ldr1'),
        'ldr2_log' : file_logging.getValues('ldr2'),
        'servo_log' : file_logging.getValues('servo'),
        'servo_mode' : last_servo_mode_read
    }
    socket.emit('first_server_data', first_server_data )
})

// MQTT -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Subscribing in topics
var mqtt_client = mqtt.connect({host:MQTT_SERVER_HOST,port:MQTT_SERVER_PORT});
mqtt_client.on('connect',function(){
    var topics_to_subscribe = [ 'power_pack/servo' , 'power_pack/ldr1' , 'power_pack/ldr2' , 'power_pack/servo_mode' ]
    for( let topic of topics_to_subscribe ){
        mqtt_client.subscribe(topic,function(err){
            if(err) console.log('Couldn\'t subscribe to topic: ' + topic )
            else    console.log('Subscribed to topic: ' + topic )
        })
    }
})
// Receiving messages
mqtt_client.on('message',function(topic,msg){
    // Para cada caso, atualizamos o último valor lido, armazenamos no arquivo de log e atualizamos cada websocket conectado
    switch(topic){
        case 'power_pack/servo':
            last_servo_read = parseInt(msg)
            file_logging.appendValue('servo',last_servo_read)
            var ws_msg = {topic:'servo',value:last_servo_read}
            for( let socket of connected_websockets )
                socket.emit('periodic_server_data',ws_msg)
            break
        case 'power_pack/ldr1':
            last_ldr1_read = parseInt(msg)
            file_logging.appendValue('ldr1',last_ldr1_read)
            var ws_msg = {topic:'ldr1',value:last_ldr1_read}
            for( let socket of connected_websockets )
                socket.emit('periodic_server_data',ws_msg)
            break
        case 'power_pack/ldr2':
            last_ldr2_read = parseInt(msg)
            file_logging.appendValue('ldr2',last_ldr2_read)
            var ws_msg = {topic:'ldr2',value:last_ldr2_read}
            for( let socket of connected_websockets )
                socket.emit('periodic_server_data',ws_msg)
            break
        case 'power_pack/current_read':
            last_current_read = parseInt(msg)
            file_logging.appendValue('current',last_current_read)
            var ws_msg = {topic:'current',value:last_current_read}
            for( let socket of connected_websockets )
                socket.emit('periodic_server_data',ws_msg)
            break
        case 'power_pack/servo_mode':
            last_servo_mode_read = String.fromCharCode.apply(null,new Uint8Array(msg))
            var ws_msg = {topic:'servo_mode',value:last_servo_mode_read}
            for( let socket of connected_websockets )
                socket.emit('periodic_server_data',ws_msg)
            break
    }
});
