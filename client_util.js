function tempoEmString( ms ){
    var segundos , minutos , horas , dias , meses , anos
    
    segundos = Math.floor(ms/1000);
    minutos = Math.floor(segundos/60);
    horas = Math.floor(minutos/60);
    dias = Math.floor(horas/24);
    meses = Math.floor(dias/30);
    anos = Math.floor(meses/12);
    
    segundos = segundos % 60;
    minutos = minutos % 60;
    horas = horas % 24;
    dias = dias % 30;
    meses = meses % 12;

    var ret = segundos + " segundos."
    if( minutos > 0 ) ret = minutos + " minutos, " + ret
    if( horas > 0 ) ret = horas + " horas, " + ret
    if( dias > 0 ) ret = dias + " dias, " + ret
    if( meses > 0 ) ret = meses + " meses, " + ret
    if( anos > 0 ) ret = anos + " anos, " + ret

    return ret;
}

function createLdrChart( ldr1_log , ldr2_log , canvas_dom ){
    var data_points_ldr1 = Array( ldr1_log[0].length )
    var data_points_ldr2 = Array( ldr2_log[0].length )
    for( var i in ldr1_log[0] ){
        var point = {
            x: (ldr1_log[0])[i],
            y: (ldr1_log[1])[i],
        }
        data_points_ldr1[i] = point
    }
    for( var i in ldr2_log[0] ){
        var point = {
            x: (ldr2_log[0])[i],
            y: (ldr2_log[1])[i],
        }
        data_points_ldr2[i] = point
    }
    var ldr_chart_context = new Chart( canvas_dom , {
        type : "scatter" , 
        
        // Opcoes pra otimizar processamento com muitos pontos
        options: {
            responsive: false,
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0 
            },
            responsiveAnimationDuration: 0,
            elements:{
                line:{
                    tension: 0
                },
                point:{
                    radius:2,
                }
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        min:0,
                        max:100
                    }
                }],
                xAxes:[{
                    type: 'linear',
                    ticks:{
                        min:0,
                        max:(3600*24),
                        stepSize:3600,
                        maxTicksLimit:24,
                        callback:(value,index,values)=>{
                            return Math.floor(value/3600)
                        }
                    }
                }]
            },
            showLines:true,
            
        },
        
        data: {
            datasets: [{
                label: "LDR 1",
                data : data_points_ldr1,
                fill: 'origin',
                backgroundColor: "rgba(240,240,60,1)"
            },{
                label: "LDR 2",
                data : data_points_ldr2,
                fill: 'origin',
                backgroundColor: "rgba(140,140,60,1)"
            }]
        }

    })

}

function createAngleChart( servo_log , canvas_dom ){
    var data_points = Array( servo_log[0].length )
    for( var i in servo_log[0] ){
        var point = {
            x: (servo_log[0])[i],
            y: (servo_log[1])[i],
        }
        data_points[i] = point
    }
    var angle_chart_context = new Chart( canvas_dom , {
        type : "scatter" , 
        
        // Opcoes pra otimizar processamento com muitos pontos
        options: {
            responsive: false,
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0 
            },
            responsiveAnimationDuration: 0,
            elements:{
                line:{
                    tension: 0
                },
                point:{
                    radius:2,
                }
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        min:-90,
                        max:90
                    }
                }],
                xAxes:[{
                    type: 'linear',
                    ticks:{
                        min:0,
                        max:(3600*24),
                        stepSize:3600,
                        maxTicksLimit:24,
                        callback:(value,index,values)=>{
                            return Math.floor(value/3600)
                        }
                    }
                }]
            },
            showLines:true,
            
        },
        
        data: {
            datasets: [{
                label: "Ângulo do painel",
                data : data_points,
                fill: 'origin',
                backgroundColor: "rgba(120,60,120,1)"
            }]
        }

    })

}

function createCurrentChart( current_log , canvas_dom ){
    var data_points = Array( current_log[0].length )
    for( var i in current_log[0] ){
        var point = {
            x: (current_log[0])[i],
            y: (current_log[1])[i],
        }
        data_points[i] = point
    }
    var current_chart_context = new Chart( canvas_dom , {
        type : "scatter" , 
        
        // Opcoes pra otimizar processamento com muitos pontos
        options: {
            responsive: false,
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0 
            },
            responsiveAnimationDuration: 0,
            elements:{
                line:{
                    tension: 0
                },
                point:{
                    radius:2,
                }
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        min:-100,
                        max:100
                    }
                }],
                xAxes:[{
                    type: 'linear',
                    ticks:{
                        min:0,
                        max:(3600*24),
                        stepSize:3600,
                        maxTicksLimit:24,
                        callback:(value,index,values)=>{
                            return Math.floor(value/3600)
                        },
                    }
                }]
            },
            showLines:true,
            
        },
        
        data: {
            datasets: [{
                label: "Corrente elétrica",
                data : data_points,
                fill: 'origin',
                backgroundColor: "rgba(90,90,225,1)"
            }]
        }

    })

}

