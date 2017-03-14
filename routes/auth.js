/**
 * Created by Mikael Lindahl (mikael) on 10/7/16.
 */

'use strict';

const Boom = require( 'boom' );
const Joi = require( 'joi' );
const debug = require( 'debug' )( 'breakpad:login' );
const controller = require( '../controllers/auth' );
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
        path: '/auth/login',
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
        handler: controller.login,

    },

    {

        method: 'GET',
        path: '/auth',
        handler: controller.loginView

    }]