(function() {
  var conn;
  
  if (window["WebSocket"]) {
    conn = new WebSocket("ws://localhost:3000/");    
 
    var code = $('#code');
    var responseDiv = $('#response')[0]; 
    var submitButton = $('#submit');
  
    var update = function(text) {
        var previousHtml = responseDiv.innerHTML;
        responseDiv.innerHTML = previousHtml + text;
    };
    var submit = function() {
        conn.send(code.val());
    };
    
    submitButton.click(submit);
    code.keyup(function(e) {
        if (event.keyCode == '13' && event.ctrlKey) {
            e.preventDefault();
            submit();
        }
    });

    conn.onopen = function() {};                                               
    conn.onclose = function() {};                                               
    conn.onmessage = function(e) {                 
        var message = e.data;
        if (message == 'start') {
            responseDiv.innerHTML = '<pre>';
        }                                   
        else if (message == 'end') {
            responseDiv.innerHTML = responseDiv.innerHTML + '</pre>';
        }                              
        else {
            update(message);
        }
    };
  }  
  
  $(document).unload(function() {
     conn.close();
  });
  
})();