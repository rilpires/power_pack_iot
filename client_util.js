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

function createLdrChart( arg , canvas_dom ){
    var data_points = Array( arg[0].length )
    for( var i in arg[0] ){
        var point = {
            x: (arg[0])[i],
            y: (arg[1])[i],
        }
        data_points[i] = point
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
                        stepSize:1,
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
                label: "Intensidade",
                data : data_points,
                fill: 'origin',
                backgroundColor: "rgba(240,240,60,1)"
            }]
        }

    })

}

function createAngleChart( arg , canvas_dom ){
    var data_points = Array( arg[0].length )
    for( var i in arg[0] ){
        var point = {
            x: (arg[0])[i],
            y: (arg[1])[i],
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
                        stepSize:1,
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

