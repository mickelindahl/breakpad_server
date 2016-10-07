/**
 * Created by Mikael Lindahl on 2016-09-16.
 */
'use strict';

const Promise = require('bluebird');

module.exports=(server)=> {

    let plugins = [
        require('./hapi_log'),
        require('./hapi_auth_jwt'), //need to be registered before swagger for jwt to be present
        require('./hapi_redirect'),
        (s) => {
            return s.register(require('inert'))
        },
        require('./vision'),
    ];

    let promise = Promise.resolve(server);

    plugins.forEach((p)=>{

        promise=promise.then((server)=>{

            return p(server).then(()=>{
                    return server;
            });

        })
    });

    return promise

};