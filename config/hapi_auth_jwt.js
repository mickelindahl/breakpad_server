/**
 * Created by Mikael Lindahl (mikael) on 9/24/16.
 */

'use strict';

let debug = require( 'debug' )( 'breakpad:config:hapi_auth_jwt' );
const Jwt = require( 'jsonwebtoken' );

// Modify header authorization if JWT cookei is present
function onPreAuth( request, reply ) {

    let cookies = {};

    debug(request.headers.cookie, request.headers.authorization);

    if ( !request.headers.cookie || request.headers.authorization ) {
        return reply.continue();
    }

    request.headers.cookie.split( ';' ).forEach( ( v )=> {
        cookies[v.split( '=' )[0].replace(/\s+/, "") ] = v.split( '=' )[1]
    } );

    if ( cookies.token == undefined ) {
        return reply.continue();
    }


    Jwt.verify( cookies.token, process.env.JWT_SECRET,
        ( err, decoded )=> {

            if ( err ) {
                return reply.continue();
            }

            request.headers.authorization = 'Bearer ' + cookies.token;
            request.auth.credentials = decoded;
            reply.continue();
        }
    );
}

module.exports = ( server )=> {

    let options = {
        key: process.env.JWT_SECRET
    };

    return server.register( {

        register: require( 'hapi-auth-jwt' ),
        options: options,

    } ).then( ()=> {


        server.auth.strategy( 'jwt', 'jwt', {
            key: process.env.JWT_SECRET,
            verifyOptions: { algorithms: ['HS256'] }
        } );

        // Register extension point
        server.ext( {
            type: 'onPreAuth',
            method: onPreAuth
        } );

    } )
};