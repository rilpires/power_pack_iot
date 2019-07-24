const WEB_PAGE_PORT = 8080
const MQTT_SERVER_HOST = '192.168.1.5'
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

// Folders where we storage log data
var folders_to_create = [
    'log',
    'log/ldr1',
    'log/ldr2',
    'log/servo',
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
    socket.emit('server_data', file_logging.getValues('visit') )
})

// MQTT -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Subscribing in topics
var mqtt_client = mqtt.connect({host:MQTT_SERVER_HOST,port:MQTT_SERVER_PORT});
mqtt_client.on('connect',function(){
    var topics_to_subscribe = [ 'servo_read' , 'ldr1_read' , 'ldr2_read' ]
    for( let topic of topics_to_subscribe ){
        mqtt_client.subscribe(topic,function(err){
            if(err) console.log('Couldn\'t subscribe to topic: ' + topic )
            else    console.log('Subscribed to topic: ' + topic )
        })
    }
})
// Receiving messages
mqtt_client.on('message',function(topic,msg){
    switch(topic){
        case 'servo_read':
            last_servo_read = parseInt(msg)
            file_logging.appendValue('servo',last_servo_read)
        case 'ldr1_read':
            last_ldr1_read = parseInt(msg)
            file_logging.appendValue('ldr1',last_ldr1_read)
        case 'ldr2_read':
            last_ldr2_read = parseInt(msg)
            file_logging.appendValue('ldr2',last_ldr2_read)
    }
});
