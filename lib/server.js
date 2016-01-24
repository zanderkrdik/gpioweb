//Lets require/import the HTTP module
var
    http = require('http'),
    url = require('url'),
    qstring = require('querystring'),
    gpio = require('rpi-gpio');

//Lets define a port we want to listen to
var PORT = 8080;


var pinctrl = {
    on: function (pin) {
        pinctrl.pin = pin;
        gpio.setup(pinctrl.pin, gpio.DIR_OUT, gpio.EDGE_NONE, pinctrl._on);
    },
    off: function (pin) {
        pinctrl.pin = pin;
        gpio.setup(pinctrl.pin, gpio.DIR_OUT, gpio.EDGE_NONE, pinctrl._off);
    },
    _on: function () {
        if (!pinctrl.pin)
            throw new Error("Pin is undefined");
        gpio.write(pinctrl.pin, true, pinctrl._destroy);
        console.log('On:  %s', pinctrl.pin);
    },
    _off: function () {
        if (!pinctrl.pin)
            throw new Error("Pin is undefined");
        gpio.write(pinctrl.pin, false, pinctrl._destroy);
        console.log('Off: %s', pinctrl.pin);
    },
    _destroy: function () {
        if (!pinctrl.pin)
            throw new Error("Pin is undefined");
        // gpio.destroy(function () {
        //     pinctrl.pin = null;
        // });
    }
};


//We need a function which handles requests and send response
function handleRequest(request, response) {
    var uri = url.parse(request.url);
    var qs = qstring.parse(uri.query);
    var keys = Object.keys(qs);
    for (var i = 0; i < keys.length; i++) {
        var pin = qs[keys[i]];

        switch (keys[i]) {
            case "n":
                pinctrl.on(pin);
                break;
            case "f":
                pinctrl.off(pin);
                break;
            default:
                console.log('unrecognized command: "%s" : "%s"', keys[i], pin);
        }
    }

    response.end('It Works!! Path Hit: ' + request.url);
}


module.exports = {
    start: function () {
        //Create a server
        var server = http.createServer(handleRequest);

        //Lets start our server
        server.listen(PORT, function () {
            //Callback triggered when server is successfully listening. Hurray!
            console.log("Server listening on: http://localhost:%s", PORT);
        });
        server.on('close', function() {
            console.log('closing');
            gpio.destroy();
        });
    }
};