var express = require('express')
var app = express();
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var util = require("./node_util")
var fs = require('fs')

const WEB_PAGE_PORT = 8080
var server_start_time = Date.now();

// Criando as pastas onde serão armazenados os arquivos de log
var folders_to_create = [
    'log',
    'log/ldr',
    'log/visit']
for( var f of folders_to_create ) if( !fs.existsSync(f) ) fs.mkdirSync(f)


app.use(express.static('.')) 
app.get('/', function(req, res){
    res.sendFile( __dirname + '/index.html' );
});
http.listen( WEB_PAGE_PORT , function(){
    console.log( "Serving web page on port " + WEB_PAGE_PORT )
})
console.log( "Server start time: " + Date( server_start_time.valueOf() ) )

io.on('connection',function(socket){
    console.log("Websocket connected: " + socket.id )
    socket.emit('server_start_time',server_start_time)
    util.appendValue( 'visit' , socket.id )

    socket.emit('server_data', util.getValues('visit') )
})

