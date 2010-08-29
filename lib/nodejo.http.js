var nodejo = require('./nodejo');

var serveCode = function(req, res) {
  var code = req.body && req.body.code;
  if (code) {
    nodejo.serveCode(code, function(err, fileName) {
      if (err) {
        res.send(500);
      }
      var node = nodejo.spawnNodeFromFile(fileName);
      attachEventListeners(node, res);
    });
  }            
  else {
    res.send(204);
  }
};
  
var attachEventListeners = function(node, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  node.stdout.on('data', function(data) {
    res.write(data.toString());
  });
  node.stderr.on('data', function(data) {
    res.write(data.toString());
  });
  node.on('exit', function(exitCode) {
    res.end();
  });
};

module.exports = {
  configure: function(app) {
    app.post('/eval', serveCode);
  }
};