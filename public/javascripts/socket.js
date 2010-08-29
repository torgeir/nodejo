this.socket = {
  init: function(conn) {
    this.attachListeners(conn);
  },
  attachListeners: function(conn) {
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
    if (this.conn) {
      this.conn.send(message);
    }
  }
};