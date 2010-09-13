(function() {                        

  var ListDisplay = function(conf) {
    var list = $('<ul></ul>');
    var parent = $(conf.parent);
    this.itemClass = conf.itemClass;
    list.id = conf.id;
    this.list = $(list);
    parent.append(list);        
  };
  
  ListDisplay.prototype = {
    prepend: function(el) {
      var li = $('<li></li>');
      li.addClass(this.itemClass);
      li.append(el);                       
      li.fadeIn(1000);
      this.list.prepend(li);
      return li;
    }
  };
                                                       
  var formatDate = function(date) {
    date = new Date(date) || new Date();
    
    var format = function(date) {
      return date < 10 ? '0' + date : date;
    };
    
    return [
      format(date.getHours()),
      ':',
      format(date.getMinutes()),
      ':',
      format(date.getSeconds())
    ].join('');
  }   
  
  var SnippetsWidget = function(display) {
    this.display = display;        
    this.speed = 0;
    this.attachMouseScrollListeners();
    this.attachMouseOverListeners();
    this.queue = [];
    this.useQueue = false;
  };
  SnippetsWidget.prototype = {
    attachMouseScrollListeners: function() {
      var that = this;
      setInterval(function() {
        that.move();
      }, 10);                                   
      
      var l = this.display.list;               
      l.bind('mousemove', function(e) {
        var speed = e.clientX - (l.width() / 2);
        if (Math.abs(speed) < 200) {
          that.speed = 0;
        }                                    
        else {
          that.speed = speed * Math.abs(speed) * 0.00003;
        }                 
      });                          
      l.bind('mousedown', function() {
        that.speed = 0;
      });
    },                     
    attachMouseOverListeners: function() {
      var l = this.display.list;
      var mouseIsOver = false;
      var that = this;
      l.bind('mouseover', function() {
        mouseIsOver = true;
        that.freeze();
      });
      l.bind('mouseout', function() {              
        if (mouseIsOver) {        
          that.speed = 0;
          that.unfreeze();
          mouseIsOver = false;            
        }
      });
    },
    move: function() {               
      this.display.list.scrollLeft( this.display.list.scrollLeft() + this.speed);
    },
    add: function(key, date, name) {          
      if (this.useQueue) {
        this.queue.push(arguments);
        return;
      }
      var div = document.createElement('div');
      var title = document.createTextNode(name);
      div.appendChild(title);
      var li = this.display.prepend(div.innerHTML + ' (' + formatDate(date) + ')');
      li.data('hash', key);  
    },
    freeze: function() {
      this.useQueue = true;
    },
    unfreeze: function() {                       
      var that = this;
      this.useQueue = false;   
      if (this.queue.length) {
        that.speed = -10;
      }
      while (this.queue.length) {
        var args = this.queue.pop();
        this.add.apply(this, args);
      }
    }
  };

  var SnippetsManager = {
    createWidget: function(conf) {          
      conf = conf || {
        id: 'snippets-display',
        parent: '#snippets',
        itemClass: 'item'
      };                                                      
               
      if (!conf.parent) {    
        throw 'SnippetsManager: you need to provide a parent';
      }                 

      $('.' + conf.itemClass).live('click', function(item) {  
        var li = $(item.target);
        window.location.hash = li.data('hash');
      });

      var display = new ListDisplay(conf);
      var snippetsWidget = new SnippetsWidget(display);
      return snippetsWidget;
    }
  };                                                       
  
  window.SnippetsManager = SnippetsManager;                 
  
})();
