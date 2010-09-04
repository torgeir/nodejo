(function() {

  var conn;
  var code = $('#code');
  var responseDiv = $('#coderesponse')[0]; 
  var submitButton = $('#run');
  var submit;               
  
  if (window["WebSocket"]) {
    
    // Chrome, Safari
    var snippetsWidget = SnippetsManager.createWidget();
    
    conn = new WebSocket("ws://127.0.0.1:3000/");        
    socket.init(conn);
    $(document).unload(function() {
      conn.close();
    });
    
    submit = function() {
      socket.send(JSON.stringify({ code: editor.getCode() }));   
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
      },
      'snippetAdd': function(snippet) {
        snippetsWidget.add(snippet);
      },
      'snippet': function(snippet) {
        editor.setCode(snippet);
      }
    };
 
    socket.onmessage = function(json) {                  
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
    
    window.onhashchange = function() {
      socket.send(JSON.stringify({ snippet: window.location.hash.replace('#', '') }));
    };
  }  
  else {                           
    
    // Others
    
    submit = function() {               
      AjaxStream.request('/eval', 'code=' + encodeURIComponent(editor.getCode()), function(response) {
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