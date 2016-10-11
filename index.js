/**
 * Created by Mikael Lindahl (mikael) on 9/30/16.
 */

'use strict';


// Load environment variables from .env or testenv
if ( process.env.NODE_ENV == 'production' ) {
    //do nothing
}
else if ( !module.parent ) {
    require( 'dotenv' ).load();
} else {
    require( 'dotenv' ).config( { path: __dirname + '/testenv' } );
}

const Hapi = require( 'hapi' );
const routes = require( './routes/index' );
const register = require( './config/plugins' );
const debug = require( 'debug' )( 'server' );

// Create a server with a host and port
var server = new Hapi.Server();
server.connection( {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt( process.env.PORT, 10 ) || 3000
} );


register( server ).then( ()=> {

    //Plugins loaded. Set up the rest and get kickin'

    // Add the routes
    routes( server );

    server.app.uri = process.env.HEROKU_WEB_URL || server.info.uri;

    // Start the server if not running under test (required by other module)
    if ( !module.parent ) {
        server.start( function () {
            server.app.log.info( 'Server running at:', server.info.uri );
            server.app.readyForTest = true;
        } );
    } else {
        // Running from test, don't start server
        server.app.readyForTest = true;
    }

} ).catch( ( err )=> {

    if ( typeof server.app.log == 'function' ) {
        server.app.log( err )
    } else {
        console.error( 'Error when loading plugins', err )
    }

} );

module.exports = server;
