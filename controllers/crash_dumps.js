/**
 * Created by Mikael Lindahl (mikael) on 2/24/17.
 */

'use strict';

const handler = require( '../index,js' ).handler.getOrchestraView
const debug = require( 'debug' )( 'breakpad:controllers:crash_dumps' );

module.export = {
    create: ( request, reply ) => {

        let record = {
            user_agent: request.headers['user-agent'],
            product: request.payload.prod,
            version: request.payload.ver,
            ip: request.info.remoteAddress,
            file: request.payload.upload_file_minidump
        };

        debug( request.payload )

        if ( process.env.BAD_IMPLEMENTATION == 'true' ) {
            record.file = 1
        }

        debug( record )

        var Model = request.server.getModel( 'crash_dump' );

        Model.create( record ).then( ( models ) => {

            reply( models ).code( 201 );

        } ).catch( ( err ) => {

            request.server.app.log.error( err );
            reply( Boom.badImplementation( err.message ) );

        } );
        /**/

    },

    get: ( request, reply ) => {

        let Model = request.server.getModel( 'crash_dump' );

        Model.find().then( ( models ) => {

            if ( process.env.BAD_IMPLEMENTATION == 'true' ) {
                throw 'err';
            }

            reply( models );

        } ).catch( function ( err ) {

            request.server.app.log.error( '!!!!!!!', err );
            reply( Boom.badImplementation( err.message ) );

        } );

    },//handler.getAll({model:'crash_dump'}),

    getView: () => {
        return handler( {
            substitute: {
                body: '../crash_dump.html'
            },
            params: {
                scripts: ["/bundles/crash_dump.js", "/js/crash_dump.js"],
                callbacks: [
                    ( request, options, done ) => {

                        request.server.getModel( 'crash_dump' ).find( {
                            select: ['id', 'product', 'version', 'createdAt']
                        } ).then( models => {

                            models.forEach( m => {

                                m.createdAt = moment( m.createdAt ).format( 'YYYY-MM-DD HH:mm' )

                            } );

                            options.crash_dumps = models;

                            debug( models )

                            done()

                        } )

                    }]
            }
        } )
    }
}