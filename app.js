var express = require('express');
var connect = require('connect');    
var nodejo = require('./lib/nodejo');    
var nodejohttp = require('./lib/nodejo.http');
var nodejowebsocket = require('./lib/nodejo.websocket');

var app = module.exports = express.createServer();

//process.setuid('nobody');

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
nodejohttp.configure(app);
// Websocket-server

nodejowebsocket.configure(app);
 
// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
}