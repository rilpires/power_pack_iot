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

