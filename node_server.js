var express = require('express')
var app = express();
var http = require('http').createServer(app)
var io = require('socket.io')(http)

const WEB_PAGE_PORT = 8080
var server_start_time = Date.now();

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
    console.log("Someone connected")
    console.log("Websocket connected: " + socket.id )
    socket.emit('server_start_time',server_start_time)
})

