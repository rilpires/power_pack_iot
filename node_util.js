const fs = require('fs')

exports.appendValue = function( f_preffix , value ){
    var date        = new Date( Date.now() )
    console.log("Dia de hoje: " + date )
    var f_suffix    = date.getDate() + "_" + (date.getMonth()+1) + "_" + date.getFullYear()
    var filename    = f_preffix + "_" + f_suffix;
    var filepath    = "log/"+f_preffix+"/"+filename
    var timestamp   = date.getSeconds() + date.getMinutes()*60 + date.getHours()*3600
    var line        = timestamp + " " + value + "\n"
    fs.appendFile( filepath , line , "utf8" , (err)=>{
        if( err ){
            console.log("Error in writing to file \'" + filename + "\':" + err.message )
            throw err
        }
    })
}

exports.getValues = function( f_preffix , date = new Date(Date.now()) ){
    var f_suffix    = date.getDate() + "_" + (date.getMonth()+1) + "_" + date.getFullYear()
    var filename = f_preffix + "_" + f_suffix
    var filepath    = "log/"+f_preffix+"/"+filename
    var ret = [ [] , [] ]
    console.log("Abrindo : " + filepath )
    var data = fs.readFileSync(filepath,'utf-8')
    if(data){
        var lines = data.split('\n')
        for( var line of lines )if( line.length > 1){
            var splitted = line.split(' ')
            var x = Math.floor(parseInt( splitted[0] ))
            var y = Math.floor(parseInt( splitted[1] ))
            ret[0].push(x)
            ret[1].push(y)
        }
    }
    return ret
}
