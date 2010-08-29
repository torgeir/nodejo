(function() {

  var nodejo = {
    init: function(conn) {
      this.attachListeners(conn);
    },
    attachListeners: function() {
      var that = this;
      conn.onopen = function() {
        that.conn = conn;
      };                                               
      conn.onclose = function() {
        that.conn = undefined;
      };                                               
      conn.onmessage = function(e) {                 
        var message = e.data;
        if (that.onmessage) {
          that.onmessage(message);
        }
      };
    },                                  
    onmessage: function(message) { /* override */ },
    send: function(message) {
      if (conn) {
        conn.send(message);
      }
    }
  };

  var conn;
  var code = $('#code');
  var responseDiv = $('#response')[0]; 
  var submitButton = $('#submit');
  var submit;  
  
  if (window["WebSocket"]) {
    
    // Chrome, Safari
    
    
    conn = new WebSocket("ws://127.0.0.1:3000/");        
    nodejo.init(conn);
    $(document).unload(function() {
      conn.close();
    });
    
    submit = function() {
      nodejo.send(code.val());
    };

    var actions = {
      'codeStart': function() {
        responseDiv.innerHTML = '<pre>';
      },
      'codeChunk': function(chunk) {
        responseDiv.innerHTML = responseDiv.innerHTML + chunk;
      },
      'codeEnd': function() {
        responseDiv.innerHTML = responseDiv.innerHTML + '</pre>';
      },
      'codeErr': function(err) {
        responseDiv.innerHTML = '<pre>' + err + '</pre>';
      }
    };
 
    nodejo.onmessage = function(json) { 
      try {
        var message = $.parseJSON(json);
        for(var key in message) {        
          var data = message[key];
          var action = actions[key];
          if (action) { 
            action(data);
          };
        }                                              
      } catch(e) {
        responseDiv.innerHTML = '<pre>Error parsing json from server.</pre>';
      }
    };
  }  
  else {                           
    
    // Others
    
    submit = function() {
      AjaxStream.request('/eval', 'code=' + encodeURIComponent(code.val()), function(response) {
        responseDiv.innerHTML = response.responseText;
      });
    };
    
  }
     
  submitButton.click(submit);
  code.keyup(function(e) {
    if (event.keyCode == '13' && event.ctrlKey) {
      submit();
    }        
  });
})();