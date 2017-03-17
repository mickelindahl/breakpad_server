/**
 * Created by Mikael Lindahl (mikael) on 2/24/17.
 */

'use strict';

const moment = require('moment');
const handler = require( '../index' ).server.methods.handler;
const debug = require( 'debug' )( 'breakpad:controllers:crash_dumps' );

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
            model: 'crash_dump',
        } ),

    getDetails: ( request, reply ) => {

        let Model = request.server.getModel( 'crash_dump' );

        let Symbol = request.server.getModel( 'symbol' );

        debug('get', request.params.id)

        Model.findOne({id:request.params.id}).then( ( model ) => {

            if ( process.env.BAD_IMPLEMENTATION == 'true' ) {
                throw 'err';
            }

            Symbol.find({select:['version', 'code_file', 'id']})
                   .then(symbols=>{

                        model.symbols=symbols;
                       reply( model );

                   })



        } ).catch( function ( err ) {

            request.server.app.log.error( '!!!!!!!', err );
            reply( Boom.badImplementation( err.message ) );

        } );

    },//handler.getAll({model:'crash_dump'}),

    getView: handler.getOrchestraView( {

        callbacks: [
            ( request, options, done ) => {

                debug('request.server.getModel!!!')

                request.server.getModel( 'crash_dump' ).find( {
                    select: ['id', 'product', 'version', 'createdAt']
                } ).then( models => {

                    debug('models',models)

                    models.forEach( m => {

                        m.createdAt = moment( m.createdAt ).format( 'YYYY-MM-DD HH:mm' )

                    } );

                    options.crash_dumps = models;

                    debug( models )

                    done()

                } )

            }],
            director: 'director',
            include: [
                'icons',
                'head',
                'nav',
                'crash_dumps',
                'crash_dump_details',
                'scripts'],
            params: {
                bundle: '/bundle/crash_dumps.js',

            },
    })
}