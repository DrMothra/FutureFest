/**
 * Created by atg on 09/03/2015.
 */
//Sets up and manages connection

var connectionManager = (function() {

    var connected = false;
    var gotData = false;
    var data = null;
    var currentStatusHandler = null;
    var currentConnectHandler = null;
    var requestHandler = null;
    var currentURL = "ws://192.168.50.195";
    var socket;

    var defaultStatusHandler = function() {
        console.log('Default status handler');
    };

    var defaultConnectHandler = function() {
        connected = true;
        console.log('Default connect handler');
    };

    var requestHandler = function() {
        console.log('Default request handler');
    };

    var dataHandler = function(data) {
        return data;
    };

    function getArgumentObject(request) {
        var args = {};
        args.request = request;
        return args;
    }

    function sendRequest(args) {
        if(!socket) {
            console.log('Not connected to server');
            return;
        }

        var json = JSON.stringify(args);
        socket.send(json);
    }

    return {
        getConnectionStatus: function() {
            return connected;
        },

        connect: function(statusHandler, connectHandler) {
            currentStatusHandler = (statusHandler != undefined) ? statusHandler : defaultStatusHandler;
            currentConnectHandler = (connectHandler != undefined) ? connectHandler : defaultConnectHandler;

            socket = new WebSocket(currentURL);
            socket.onopen = function() {
                console.log('Socket opened');
                currentConnectHandler();
            };
            socket.onmessage = function(event) {
                data = event.data;
                gotData = true;
            };
            socket.onerror = function() {
                console.log("Socket error!");
            };
            socket.onclose = function(event) {
                console.log('Socket closed');
            };
        },

        requestData: function() {
            var args = getArgumentObject('GetState');
            sendRequest(args);
        },

        getData: function() {
            if(gotData) {
                gotData = false;
                return data;
            } else {
                return null;
            }
        }
    }
})();
