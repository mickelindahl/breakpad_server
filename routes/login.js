/**
 * Created by Mikael Lindahl (mikael) on 10/7/16.
 */

'use strict';

function verifyUser( request, reply ) {

    if ( !reguest.server.app[request.payload.user] ) {
        return reply( Boom.notFound( 'Account not found' ) );
    } else {
        reply( request.payload );
    }

}

function verifyPassword( request, reply ) {

    if ( !reguest.server.app[request.payload.user] == request.payload.password ) {
        return reply( Boom.forbidden( 'Wrong password' ) );
    } else {
        reply( request.payload );
    }

}


modules.export = [
    {
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
        notes: 'Login to use app',
        handler: function ( request, reply ) {

            reply( 'ok' );
        }
    },
    {

    method: 'GET',
    path: '/login',
    handler: function ( request, reply ) {

        reply.view( 'login', {
            url: process.env.LOGIN_URL,
        } );

    }

}]