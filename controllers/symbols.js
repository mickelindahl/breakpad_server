/**
 * Created by Mikael Lindahl (mikael) on 2/24/17.
 */

'use strict';

const moment = require('moment');
const handler = require( '../index' ).server.methods.handler
const debug = require( 'debug' )( 'breakpad:controllers:symbols' );

module.exports = {
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

    delete: handler.delete(
        {
            model: 'symbols',
        } ),

    getDetails: ( request, reply ) => {


        let Symbol = request.server.getModel( 'symbol' );

        debug('get', request.params.id)

        Symbol.findOne({id:request.params.id}).then( ( model ) => {

            if ( process.env.BAD_IMPLEMENTATION == 'true' ) {
                throw 'err';
            }

              reply( model );

        } ).catch( function ( err ) {

            request.server.app.log.error( '!!!!!!!', err );
            reply( Boom.badImplementation( err.message ) );

        } );

    },//handler.getAll({model:'crash_dump'}),

    getView: handler.getOrchestraView( {

        callbacks: [
            ( request, params, done ) => {

                debug('request.server.getModel!!!')

                request.server.getModel( 'symbol' ).find( {
                    select: ['id', 'version', 'debug_file','created_at']
                } ).then( models => {

                    debug('models',models)

                    models.forEach( m => {

                        m.createdAt = moment( m.created_at ).format( 'YYYY-MM-DD HH:mm' )

                    } );

                    params.symbols = models;

                    debug( models )

                    done()

                } )

            }],
        director: 'director',
        include: [
            'icons',
            'head',
            'nav',
            'symbols',
            'symbol_details',
            'scripts'],
        params: {
            bundle: '/bundle/symbols.js',

        },
    })
}