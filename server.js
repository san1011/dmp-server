var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var dbconfig = require('./config/db_config.js');
var fs = require('fs');
var jquery = require('jquery');

var connection;

function handleDisconnect(){
    connection = mysql. createConnection(dbconfig);

    connection.connect(function(err){
        if(err){
            console.log('error when connecting to be:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error',function(err){
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

var url = require('url')
var app = express();

// configuration --------------------------------------------------------

app.set('port', process.env.PORT || 1338);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var server = app.listen(app.get('port'), function(){
    console.log("Server has started on port 1338");
});

//app.use(express.static('public'));

var router = require('./router/main')(app, connection, url);

