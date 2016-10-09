/**
 * Created by Mikael Lindahl (mikael) on 10/7/16.
 */

'use strict';

const Boom = require( 'boom' );
const Joi = require( 'joi' );
const Jwt = require( 'jsonwebtoken' );
const Handlebars = require('handlebars');
const Fs = require('fs');
const Path = require('path');
const debug = require('debug')('breakpad:login')

function verifyUser( request, reply ) {


    debug(process.env.BREAKPAD_SERVER_USER, request.payload.user)

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

            reply( { id_token: id_token } ).code( 201 );

        }
    },
    {

        method: 'GET',
        path: '/login',
        handler: ( request, reply ) => {

            let head = Fs.readFileSync(Path.join(Path.resolve(),'views/head.html')).toString();
            head= Handlebars.compile(head, {title:'Login'});

            reply.view( 'login', {
                head: head,
                title:'Login'
            } );
        }

    }]