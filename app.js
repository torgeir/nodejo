
/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect');    

var ws = require('./vendor/websocket-server/lib/ws');
var nodejo = require('./lib/nodejo');    

var sys = require('sys');
var app = module.exports = express.createServer();
                            
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(connect.bodyDecoder());
  app.use(connect.methodOverride());
  app.use(connect.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);         
  app.use(connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(connect.errorHandler()); 
});

// Routes           
app.get('/', function(req, res) {
  res.render(
    'index.jade', 
    {
      locals: {
        title: 'Nodejo'
      }
    }
  );
});          
app.post('/eval', nodejo.routes.eval);

// Websocket-server
var socket = ws.createServer({ server: app });
socket.addListener("listening", function(){});
socket.addListener('close', function(client) {});
socket.addListener('connection', function(client) {
  nodejo.handleWebsocketConnection(client);
});

// Only listen on $ node app.js
if (!module.parent) app.listen(3000);
