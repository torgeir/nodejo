var app = require('../app');
var sys = require('sys');    
var querystring = require('querystring');
                             
module.exports = {
    'should evaluate code posted to /eval': function(assert) {
        var code = "var sys = require('sys'); sys.puts(1 + 2);";
        var data = "code=" + querystring.escape(code);
        assert.response(
            app,
            { 
                url: '/eval', 
                method: 'POST', 
                data: data, 
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded' 
                } 
            }, 
            { 
                status: 200,
                headers: {
                    'Content-Type': 'text/plain'
                } 
            },
            function(res) {
                assert.includes(res.body, '3');
            }
        );
    },
    'should return empty response when no code is posted to /eval': function(assert) {
        assert.response(
            app, 
            { 
                url: '/eval', 
                method: 'POST'
            }, 
            { 
                status: 204 
            }
       );
    },
    'should serve index page with title nodejo': function(assert) {
        assert.response(app,
            { 
                url: '/' 
            },
            { 
                status: 200, 
                headers: { 
                    'Content-Type': 'text/html; charset=utf-8' 
                }
            },
            function(res) {
                assert.includes(res.body, '<title>Nodejo</title>');
            }
        );
    }
};