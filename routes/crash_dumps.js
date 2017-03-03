/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */

'use strict';

const Joi = require( 'joi' );
const Boom = require( 'boom' );
const debug = require( 'debug' )( 'breakpad:route:crash_dumps' );
const controllers = require('../controllers/crash_dumps,js')
const Path = require( 'path' );
const Fs = require( 'fs' );
const Handlebars = require( 'handlebars' );

module.exports = [
    {
        method: 'POST',
        path: '/crash_dumps',
        handler: controllers.create,
        config: {
            payload:{ "maxBytes": 1048576*20 },
            //auth:'jwt',
            description: 'Create crash dump',
            notes: 'Creates an crash dump',
            tags: ['api', 'crash_dump'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                options: {
                    allowUnknown: true
                },
                payload: {
                    prod: Joi.string().required().description( 'Software' ),
                    ver: Joi.string().required().description( 'Software version crash dump belong to' ),
                    upload_file_minidump: Joi.binary().required().description( 'Crash dump file' ),
                }
            }
        }
    },

    {
        method: 'GET',
        path: '/crash_dumps',
        handler:controllers.get,
        config: {
            auth: 'jwt',
            description: 'Get all crash dumps',
            tags: ['api', 'crash_dump'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        { code: 404, message: 'Not found' }
                    ]
                }
            },
            validate: {
                options: {
                    allowUnknown: true
                },
                headers: {
                    Authorization: Joi.string().description( 'Jwt token' )
                },
            }
        }
    },

    {

        method: 'GET',
        config: {
            tags: ['api', 'crash_dump'],
            auth: 'jwt'
        },
        path: '/crash-dump',
        handler: controllers.getView

    },

    // This route is required for serving assets referenced from our html files
    //{
    //    method: 'GET',
    //    path: '/crash_dumps/view',
    //    config: {
    //        tags: ['api', 'crash_dump'],
    //        auth: 'jwt'
    //    },
    //    handler: function ( request, reply ) {
    //
    //        let head = Fs.readFileSync( Path.join( Path.resolve(), 'views/head.html' ) ).toString();
    //        let nav = Fs.readFileSync( Path.join( Path.resolve(), 'views/nav.html' ) ).toString();
    //
    //        head = Handlebars.compile( head )( { title: 'Crash dumps' } );
    //        nav = Handlebars.compile( nav )( { crash_dump: 'bajs' } );
    //
    //        reply.view( 'crash_dump', {
    //            head: head,
    //            nav: nav
    //        } );
    //
    //    }
    //},
];
