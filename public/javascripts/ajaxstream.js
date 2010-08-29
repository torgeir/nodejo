var AjaxStream = {
  request : function(url, data, callback) {
    var request = this.createXMLHTTPRequest();
  	request.open('POST', url, true);
  	request.setRequestHeader('User-Agent','XMLHTTP/1.0');
  	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  	request.onreadystatechange = function () {
  		if (request.readyState == 3 && request.status == 200)  {
        callback.call(this, request);
      }
  	}
  	request.send(data);
  	return request;
  }, 
  XMLHttpFactories : [
  	function () { return new XMLHttpRequest() },
  	function () { return new ActiveXObject("Msxml2.XMLHTTP") },
  	function () { return new ActiveXObject("Msxml3.XMLHTTP") },
  	function () { return new ActiveXObject("Microsoft.XMLHTTP") }
  ],
  createXMLHTTPRequest : function() {
  	for (var i = 0; i < this.XMLHttpFactories.length; i++) {
  		try {
  			this.createXMLHTTPRequest = this.XMLHttpFactories[i];
  		}
  		catch (e) {
  			continue;
  		}
  		break;
  	}
  	return this.createXMLHTTPRequest();
  }
};