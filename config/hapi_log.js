/**
 * Created by Mikael Lindahl on 2016-09-16.
 */

'use strict';

const Bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');

let prettyStdOut = new PrettyStream();

function logger(options) {

    // Create logger
    let streams = [{
        level: 'info',
        type: 'raw',
        stream: prettyStdOut
    }];

    prettyStdOut.pipe(process.stdout);
    let log = Bunyan.createLogger({
        name: 'hapi-logger',
        streams: streams

    });

    return log
}


module.exports=(server)=>{

    let options={
        log: logger()
    };

    return server.register({
        register: require('../plugins/hapi_log'),
        options: options,
    })
}

