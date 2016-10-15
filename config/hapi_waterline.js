
/**
 * Created by Mikael Lindahl on 2016-09-16.
 */

'use strict';

module.exports=(server)=>{

    // Waterline ORM configuration
    var db_connection = {
        adapter: 'postgresql',
        url: process.env.DATABASE_URL,
        pool: false,
        ssl: process.env.POSTGRES_REQUIRE_SSL || false
    }

    delete process.env.DATABASE_URL

    console.log('!process.env.DATABASE_URL', process.env.DATABASE_URL)

    // If test switch
    if (!process.env.DATABASE_URL) {
        // We are running under test

        db_connection = {
            adapter: 'memory'
        };
    };


    console.log('!process.env.DATABASE_URL', db_connection)

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





