var socket = io();
var server_start_time = Date.now();
var uptime_text = document.getElementById("uptime");
var angle_text = document.getElementById("angle");
var charge_text = document.getElementById("charge");
var ldr1_text = document.getElementById("ldr1");
var ldr2_text = document.getElementById("ldr2");

// Atualizando o server uptime
socket.on('server_start_time',function(arg){
    server_start_time = arg
    uptime_text.innerText = tempoEmString(Date.now() - server_start_time ); 
    setInterval(function(){
        uptime_text.innerText = tempoEmString(Date.now() - server_start_time ); 
    } , 1000 );
});

socket.on('servo_read', function(arg){
    angle_text.innerHTML = arg;
});

socket.on('battery_read', function(arg){
    charge_text.innerHTML = arg;
});

socket.on('battery_log', function(arg){
    //do something
});

socket.on('ldr1_read', function(arg){
    ldr1.innerHTML = arg;
});

socket.on('ldr2_read', function(arg){
    ldr2.innerHTML = arg;
});