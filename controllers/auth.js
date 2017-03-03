/**
 * Created by Mikael Lindahl (mikael) on 2/24/17.
 */

'use strict';

const Jwt = require( 'jsonwebtoken' );
const Path = require( 'path' );
const Util = require('util')
const handler = require( '../index' ).server.methods.handler;


module.exports = {

    login: function ( request, reply ) {

        let data = {}

        let id_token = Jwt.sign( data, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: "12h"
        } );

        var d = new Date();
        d.setTime( d.getTime() + (0.5*24*60*60*1000) );
        var expires = "expires=" + d.toUTCString();

        debug( request.info.host );

        let cookie = Util.format( 'loredge_jwt=%s; Domain=%s; Path=%s; Expires=%s; HttpOnly',
            id_token,
            request.info.host.split( ':' )[0], //important
            '/',
            expires
        );

        debug( cookie );

        // Rules to set cookie via header in resonse. Appearantly, setting domain
        // to / then one can only change the cookie in the browser if on a page
        // stemming from / e.g. /login /view and /view/myPage will not be able to
        // change it from. Still it will be available.
        reply( { id_token: id_token } ).header( 'Set-Cookie', cookie ).code( 201 );

    },

loginView: handler.getOrchestraView( {
    director:'director',
    include: ['head', 'auth', 'scripts'],
    params:{bundle:'/bundle/main.js'},
} )

}
;

