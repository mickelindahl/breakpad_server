/**
 * Created by Mikael Lindahl (mikael) on 10/7/16.
 */

'use strict';

const Boom = require( 'boom' );
const Joi = require( 'joi' );
const Jwt = require( 'jsonwebtoken' );
const Handlebars = require( 'handlebars' );
const Fs = require( 'fs' );
const Path = require( 'path' );
const debug = require( 'debug' )( 'breakpad:login' )
const Util = require('util')

function verifyUser( request, reply ) {

    debug( process.env.BREAKPAD_SERVER_USER, request.payload.user )

    if ( process.env.BREAKPAD_SERVER_USER != request.payload.user ) {
        return reply( Boom.notFound( 'User not valid' ) );
    } else {
        reply( request.payload );
    }

}

function verifyPassword( request, reply ) {

    if ( process.env.BREAKPAD_SERVER_PASSWORD != request.payload.password ) {
        return reply( Boom.forbidden( 'Wrong password' ) );
    } else {
        reply( request.payload );
    }

}

module.exports = [
    {

        method: 'POST',
        path: '/login',
        config: {
            pre: [
                { method: verifyUser },
                { method: verifyPassword },
            ],
            validate: {
                payload: {
                    user: Joi.string().required(),
                    password: Joi.string().required()
                }
            },
            description: 'Login route',
            notes: 'Login to use app'
        },
        handler: function ( request, reply ) {

            let data = {}

            let id_token = Jwt.sign( data, process.env.JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: "12h"
            } );

            var d = new Date();
            d.setTime(d.getTime() + (0.5*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();

            debug(request.info.host);

            let cookie=Util.format('loredge_jwt=%s; Domain=%s; Path=%s; Expires=%s; HttpOnly',
                id_token,
                request.info.host.split(':')[0], //important
                '/',
                expires
            );

            debug(cookie);

            // Rules to set cookie via header in resonse. Appearantly, setting domain
            // to / then one can only change the cookie in the browser if on a page
            // stemming from / e.g. /login /view and /view/myPage will not be able to
            // change it from. Still it will be available.
            reply({ id_token: id_token } ).header( 'Set-Cookie', cookie).code(201);


        }
    },
    {

        method: 'GET',
        path: '/login',
        handler: ( request, reply ) => {

            let head = Fs.readFileSync( Path.join( Path.resolve(), 'views/head.html' ) ).toString();
            head = Handlebars.compile( head, { title: 'Login' } );

            reply.view( 'login', {
                    head: head,
                    title: 'Login'
                } );
        }

    }]