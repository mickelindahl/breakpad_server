/**
 * Created by Mikael Lindahl on 2016-09-16.
 */

'use strict';

let _server;

exports.register = function (server, options, next) {

    _server = server; // Keep a handle to server object

    _server.app.log=options.log; //make available safely

    // log error as fatal at creash
    process.on('uncaughtException', function (err) {
        process.env.FATAL=true; //tricggers process.exit(1); when email have been sent
        //_server.app.log.fatal
        console.error(err, 'Something fatal bas happened');
    });

    next();
};

exports.register.attributes = {
    name: 'hapi-log',
    version: '1.0.0'
};