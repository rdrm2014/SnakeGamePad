/**
 * Created by ricardomendes on 14/05/15.
 */

var config = require('./package.json');

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

var routes = require('./routes/routes.js');

//Server IP
app.set("ipaddr", config.server.ipaddr);

//Server Port
app.set('port', process.env.PORT || config.server.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/about', routes.about);

server.listen(app.get("port"), app.get("ipaddr"), function() {
    console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});