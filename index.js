
/**
 * Test Code
 */
// var Ping = require('./lib/ping');
// Ping.ping();
// Ping.flash();
//
//
//

// var
//     gpio = require('rpi-gpio');

// var
//     pin = 16;


// var p = {
//     setup: function () {
//         return new Promise(
//             function (resolve, reject) {
//                 console.log('setup');
//                 gpio.setup(pin, gpio.DIR_OUT, function () {
//                     resolve(pin);
//                 });
//             }
//             )
//     },
//     on: function () {
//         return new Promise(
//             function (resolve, reject) {
//                 console.log('on');
//                 gpio.write(pin, true, function () {
//                     setTimeout(function () {
//                         resolve(pin);
//                     }, 5000);
//                 });
//             }
//             )
//     },
//     off: function () {
//         return new Promise(
//             function (resolve, reject) {
//                 console.log('off');
//                 gpio.write(pin, false, function () {
//                     resolve('ping');
//                 });
//             }
//             )
//     },
// }

// var rej = function (reject) {
//     console.log('off rejected!');
//     gpio.destroy();
// }


/*
p.setup().then(
    function (resolve) {
        p.on().then(
            function (resolve) {
                p.off().then(
                    function (resolve) {
                        gpio.destroy();
                    },
                    rej
                    );
            },
            rej
            );
    },
    rej
    );
*/
var s = require('./lib/server');
s.start();

