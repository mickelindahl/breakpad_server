/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */

'use strict';

const Joi = require( 'joi' );
const debug = require( 'debug' )( 'breakpad:route:symbols' );

module.exports = [
    {
        method: 'POST',
        path: '/symbols',
        handler: ( request, reply  )=> {

            debug( request.payload )

            let record = {
                user_agent: request.headers['user-agent'],
                version: request.payload.version,
                cpu:request.payload.cpu,
                ip: request.info.remoteAddress,
                file: request.payload.symbol_file,
                code_file:request.payload.code_file,
                debug_file:request.payload.debug_file,
                debug_identifier:request.payload.debug_identifier,
            };


            var Model = request.server.getModel( 'symbol' );

            Model.create( record ).then( ( models )=> {

                reply( models ).code( 201 );

            } ).catch( function ( err ) {

                request.server.app.log.error( err );
                reply( Boom.badImplementation( err.message ) );

            } );
            /**/

        },
        config: {
            //auth:'jwt',
            description: 'Create symbol file entry',
            notes: 'Creates an symbol file entry',
            tags: ['api', 'symbol'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                options: {
                    allowUnknown: true
                },
                //headers: {
                //    Authorization: Joi.string().description('Jwt token')
                //},
                //payload: {
                //    version:  Joi.string().required().description('Software version symbol file belong to'),
                //    crash_dump: Joi.binary().required().description('Symbol file'),
                //}
            }
        }
    },

    {
        method: 'GET',
        path: '/symbols',
        handler: (request, reply)=>{


            let Model = request.server.getModel('symbol');

            Model.find().then((models)=>{

                debug(models)

                models=models.map((e)=>{

                    e.file_as_string=e.file.toString();

                    e.file_as_string = e.file_as_string.replace(/(?:\r\n|\r|\n)/g, '<br />');

                    return e
                })


                reply(models);


            }).catch(function (err) {

                request.server.app.log.error(err);
                reply(Boom.badImplementation(err.message));

            });

        },
        config: {
            auth: 'jwt',
            description: 'Get all symbol files',
            notes: 'Gets all symbols files',
            tags: ['api', 'symbol'],
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
];