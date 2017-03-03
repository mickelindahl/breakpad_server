/**
 * Created by Mikael Lindahl (mikael) on 9/30/16.
 */

'use strict';

// Load environment variables from .env or testenv
require( 'dotenv' ).config();

const Hapi = require( 'hapi' );
const Promise = require( 'bluebird' );
const routes = require( './routes/index' );
const register = require( './config/plugins' );

// Create a server with a host and port
var server = new Hapi.Server();
server.connection( {

    host: process.env.HOST,
    port: parseInt( process.env.PORT, 10 )

} );


let p = new Promise((resolve, reject)=>{

    register( server ).then( ()=> {

        //Plugins loaded. Set up the rest and get kickin'

        // Add the routes
        routes( server );

        server.app.uri = process.env.HEROKU_WEB_URL || server.info.uri;

        if ( process.env.NODE_ENV == 'test' ) {

            resolve(server)

        }else {

            // Start the server if not running under most tests
            server.start( function () {

                server.app.log.info( 'Server running at:', server.info.uri );

                resolve(server)

            } );

        }

    } ).catch( ( err )=> {

        console.error( err );
        reject(server)

    } );

});



module.exports = {promise:p, server:server};
