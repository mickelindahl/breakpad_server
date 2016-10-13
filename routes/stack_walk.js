/**
 * Created by Mikael Lindahl (mikael) on 10/11/16.
 */

'use strict';

const Joi = require( 'joi' );
const Boom = require( 'boom' );
const debug = require( 'debug' )( 'breakpad:route:stack_walk' );
const Minidump = require( 'minidump' );
const Fs = require( 'fs' );
const Path = require( 'path' );
const Uuid = require( 'uuid' );
const Promise = require( 'bluebird' );
const Mkdirp = require( 'mkdirp' );
var Rmdir = require('rmdir');

function handlerStackWalk(request, reply) {
    let Crash_dump = request.server.getModel( 'crash_dump' );

    Crash_dump.find( { id: request.payload.crash_id } ).then( ( crash_dump )=> {

        return new Promise( ( resolve, reject )=> {
            let Symbols = request.server.getModel( 'symbol' );

            if (request.payload.symbol_ids){
                let criteria = request.payload.symbol_ids.map( ( e )=> {return { id: e }} )
                Symbols.find( criteria ).then( ( symbols )=> {

                    resolve( {
                        crash_dump: crash_dump[0],
                        symbols: symbols
                    } )
                } )
            }else{

                resolve( {
                    crash_dump: crash_dump[0],
                    symbols: []
                } )
            }

        } )
    } ).then( ( results )=> {

        return new Promise( ( resolve, reject )=> {

            let path = Path.join( Path.resolve(), 'crash_dump' );
            let name = Uuid.v4();
            Mkdirp.sync( path );

            debug( 'Creating', Path.join( path, name ) );

            //debug(results.crash_dump.file.toString() )

            Fs.writeFileSync( Path.join( path, name ), results.crash_dump.file );

            results.crash_dump_file = Path.join( path, name );
            results.symbol_files = []
            results.symbols.forEach( ( sym )=> {

                let path = Path.join( Path.resolve(), 'symbols', sym.debug_file, sym.debug_identifier )
                let name = sym.debug_file + '.sym';
                Mkdirp.sync( path );

                debug( 'Creating', Path.join( path, name ) );
                Fs.writeFileSync( Path.join( path, name ), sym.file );
                results.symbol_files.push( {path:path, name:name} )

            } );

            if ( results.symbols.length > 0 ) {

                Minidump.walkStack( results.crash_dump_file,  Path.join( Path.resolve(), 'symbols' ),
                    ( error, report )=> {

                        if ( error ) {
                            return reject( error )
                        }

                        results.crash_dump.report = report.toString();
                        results.crash_dump.report_html= report.toString().replace( /(?:\r\n|\r|\n)/g, '<br />' );

                        resolve( results );

                    } )
            } else {

                Minidump.walkStack( results.crash_dump_file, ( error, report )=> {

                    if ( error ) {
                        return reject( error )
                    }

                    results.crash_dump.report = report.toString();
                    results.crash_dump.report_html= report.toString().replace( /(?:\r\n|\r|\n)/g, '<br />' );

                    resolve( results );

                } );
            }


        } )

    } ).then( ( results )=> {

        // delete files

        debug( 'Deleting', results.crash_dump_file );
        Fs.unlinkSync( results.crash_dump_file );
        Fs.rmdir(Path.join( Path.resolve(), 'crash_dump' ))

        results.symbol_files.forEach( ( file )=> {

            debug( 'Deleting', file )
            Fs.unlinkSync(  Path.join( file.path, file.name )  );

        } );


        return new Promise((resolve, reject)=>{
            if (results.symbols.length>0){
                Rmdir(Path.join( Path.resolve(), 'symbols' ), function (err, dirs, files) {

                    if(err){
                        reject(err)
                    }

                    debug(dirs);
                    debug(files);
                    debug('all files are removed');
                    resolve(results)
                });
            }else{
                resolve(results)
            }

        })

    } ).then( ( results )=> {

        return Crash_dump.update( { id: request.payload.crash_id }, results.crash_dump )

    } ).then( ( models )=> {

        reply( models[0] );

    } ).catch( function ( err ) {

        request.server.app.log.error( err );
        reply( Boom.badImplementation( err.message ) );

    } );
}

module.exports = [

    {
        method: 'POST',
        path: '/stack_walk',
        handler: handlerStackWalk,
        config: {
            description: 'Do stack walk',
            notes: 'Perform a stack wall without or with symbol files',
            tags: ['api', 'stack_walk'],
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
                payload: {
                    crash_id: Joi.number().required().description( 'Crash dump file id' ),
                    symbol_ids: Joi.array().items( Joi.number() ).description( 'Optional list of symbol file ids' )
                }
            }
        }
    },
];


