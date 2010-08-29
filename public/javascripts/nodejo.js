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
    if (window["WebSocket"]) {
        conn = new WebSocket("ws://localhost:3000/");        
        nodejo.init(conn);
    }  
    $(document).unload(function() {
         conn.close();
    });
                       
                 
    var code = $('#code');
    var responseDiv = $('#response')[0]; 
    var submitButton = $('#submit');
                      
    var update = function(text) {
        var previousHtml = responseDiv.innerHTML;
        responseDiv.innerHTML = previousHtml + text;
    };
                     
    var submit = function() {
        nodejo.send(code.val());
    };
    submitButton.click(submit);
    code.keyup(function(e) {
        if (event.keyCode == '13' && event.ctrlKey) {
            submit();
        }        
    });         

    var actions = {
        'codeStart': function() {
            responseDiv.innerHTML = '<pre>';
        },
        'codeChunk': function(chunk) {
            update(chunk);
        },
        'codeEnd': function() {
            var content = responseDiv.innerHTML;
            responseDiv.innerHTML = content + '</pre>';
        },
        'codeErr': function() {
            
        }
    };
    nodejo.onmessage = function(json) { 
        try {
            var message = jQuery.parseJSON(json);
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
      
    
  
})();