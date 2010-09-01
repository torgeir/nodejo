var express = require('express');
var connect = require('connect');    
var nodejo = require('./lib/nodejo');    
var nodejohttp = require('./lib/nodejo.http');
var nodejowebsocket = require('./lib/nodejo.websocket');

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

  // Become nobody
  process.setuid('nobody');
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

// Websocket evalutation
nodejowebsocket.configure(app);

// Fallback HTTP POST evaluation
nodejohttp.configure(app);

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
}
