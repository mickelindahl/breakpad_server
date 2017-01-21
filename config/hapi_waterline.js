/**
 * Created by Mikael Lindahl on 2016-09-16.
 */

'use strict';

const debug = require('debug')('breakpad:config:hapi-waterlines')

module.exports = ( server )=> {

    // Waterline ORM configuration
    var db_connection;
    var adapters;

    // If test switch
    if ( process.env.NODE_ENV == 'test' ) {
        // We are running under test

        debug('memory')

        adapters={ 'memory': require( 'sails-memory')}
        db_connection = {
            adapter: 'memory'
        };
    } else {

        debug('postgres')

        adapters = {'postgresql': require( 'sails-postgresql' )}
        db_connection = {
            adapter: 'postgresql',
            url: process.env.DATABASE_URL,
            pool: false,
            ssl: false
        }

    };

    let options = {
        adapters: adapters,
        connections: {
            'default': db_connection
        },
        models: { // common models parameters, not override exist declaration inside models
            connection: 'default',
            migrate: 'create',
            schema: true
        },
        decorateServer: true, // decorate server by method - getModel
        path: '../../../models' // string or array of strings with paths to folders with models declarations
    };

    return server.register( {
        register: require( 'hapi-waterline' ),
        options: options,
    } )
};





