/**
 * Created by Mikael Lindahl (mikael) on 9/30/16.
 */

'use strict';

// Load environment variables from .env or testenv
if ( process.env.NODE_ENV == 'production' ) {
    //do nothing
}
else if ( process.env.NODE_ENV == 'test' ) {
    require( 'dotenv' ).config( { path: __dirname + '/testenv' } );
} else {
    require( 'dotenv' ).load();
}

const Hapi = require( 'hapi' );
const routes = require( './routes/index' );
const register = require( './config/plugins' );

// Create a server with a host and port
var server = new Hapi.Server();
server.connection( {

    host: process.env.HOST,
    port: parseInt( process.env.PORT, 10 )

} );


register( server ).then( ()=> {

    //Plugins loaded. Set up the rest and get kickin'

    // Add the routes
    routes( server );

    server.app.uri = process.env.HEROKU_WEB_URL || server.info.uri;

    // Start the server if not running under test (required by other module)
    if  (process.env.NODE_ENV=='error' ){
        throw 'error'
    }else if ( process.env.NODE_ENV!='test' ) {
        server.start( function () {
            server.app.log.info( 'Server running at:', server.info.uri );
            server.app.readyForTest = true;
        } );
    } else {
        // Running from test, don't start server
        server.app.readyForTest = true;
    }

} ).catch( ( err )=> {

    server.app.readyForTest = true
    console.error( 'Error when loading plugins',  err )

} );

module.exports = server;
