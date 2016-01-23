var gpio = require("rpi-gpio");

// TODO: Make this work
gpio.on('change', function (channel, val) {
    console.log('Channel set: ' + channel, + " : " + val);
});

var pin = 16;

module.exports = {
    ping: function () {
        console.log('ping.js | ping');
    },
    flash: function () {
        gpio.setup(pin, gpio.DIR_OUT, function () {
            gpio.write(pin, true, function (err) {
                if (err) throw err;
                console.log('Written to pin: ' + pin);
                setTimeout(function () {
                    gpio.write(pin, false, function (err) {
                        if (err) throw err;
                        console.log('Written to pin: ' + pin);
                        gpio.destroy();
                    });
                }, 3000);
            });
        });
    }
};