
/**
 * Created by Mikael Lindahl on 2016-09-16.
 */

'use strict';

module.exports=(server)=>{

    var db_connection;

    // Waterline ORM configuration
    if (!process.env.DATABASE_URL) {
        // We are running under test
        db_connection = {
            adapter: 'memory'
        };
    } else {
        db_connection = {
            adapter: 'postgresql',
            url: process.env.DATABASE_URL,
            pool: false,
            ssl: process.env.POSTGRES_REQUIRE_SSL || false
        }
    }

    let options={
        adapters: { // adapters declaration
            'postgresql': require('sails-postgresql'),
            'memory': require('sails-memory')
        },
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

    return server.register({
        register: require('hapi-waterline'),
        options: options,
    })
};





