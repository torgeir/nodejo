var conn;
var connect = function() {

  if (window["WebSocket"]) {
    conn = new WebSocket("ws://127.0.0.1:8888/");    

    conn.onopen = function() {
      log("Connecting..");
    };                                               
                                                 
    conn.onmessage = function(evt) {                 
      var json = jQuery.parseJSON(evt.data);         
      for(var key in json) {                         
        handle(key, json[key]);                      
      }                                              
    };                                               
                                                 
    conn.onclose = function() {                      
    };                                               
                                                 
  }
};