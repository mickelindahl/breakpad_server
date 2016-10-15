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
const Rmdir = require( 'rmdir' );
const Util = require( 'util' )
const file_exists = require( 'file-exists' );

function handlerStackWalk( request, reply ) {
    let Crash_dump = request.server.getModel( 'crash_dump' );

    debug( 'request.payload', request.payload );

    request.payload.symbol_ids = request.payload.symbol_ids
        ? JSON.parse( request.payload.symbol_ids )
        : []

    Crash_dump.find( { id: request.payload.crash_id } ).then( ( crash_dump )=> {

        return new Promise( ( resolve, reject )=> {
            let Symbols = request.server.getModel( 'symbol' );

            if ( request.payload.symbol_ids ) {
                let criteria = request.payload.symbol_ids.map( ( e )=> {return { id: e }} )
                Symbols.find( criteria ).then( ( symbols )=> {

                    resolve( {
                        crash_dump: crash_dump[0],
                        symbols: symbols
                    } )
                } )
            } else {

                resolve( {
                    crash_dump: crash_dump[0],
                    symbols: []
                } )
            }

        } )
    } ).then( ( results )=> {

        return new Promise( ( resolve, reject )=> {

            results.crash_dump_path='crash_dump_'+Uuid.v4();

            let path = Path.join( Path.resolve(), results.crash_dump_path );
            let name = Uuid.v4();
            Mkdirp.sync( path );

            debug( 'Creating', Path.join( path, name ) );

            Fs.writeFileSync( Path.join( path, name ), results.crash_dump.file );

            results.crash_dump_file = Path.join( path, name );
            results.symbol_files = [];
            results.symbol_path='symbol_'+Uuid.v4();

            results.symbols.forEach( ( sym )=> {

                let path = Path.join( Path.resolve(), results.symbol_path, sym.debug_file, sym.debug_identifier )
                let name = sym.debug_file + '.sym';
                Mkdirp.sync( path );

                debug( 'Creating', Path.join( path, name ) );
                Fs.writeFileSync( Path.join( path, name ), sym.file );
                results.symbol_files.push( { path: path, name: name } )

            } );

            let parse = ( error, report )=> {

                let header = Util.format( '<font size="3" color="blue">Symbols used: %s<br />Ip: %s<br />User agent: %s<br /><br /></font>',
                    results.symbols.map( ( e )=> {return e.id + '-' + e.version + '-' + e.debug_file} ).join( ', ' ),
                    results.crash_dump.ip,
                    results.crash_dump.user_agent );

                if ( error ) {

                    debug( error.toString().replace( /(?:\r\n|\r|\n)/g, '<br />' ) )
                    results.crash_dump.report = error.toString();
                    results.crash_dump.report_html = Util.format(
                        '<p>%s<font size="3" color="red">%s</font><br/></p><h4>Crash dump raw</h4><p>%s</p>',
                        header,
                        error.toString().replace( /(?:\r\n|\r|\n)/g, '<br />' ),
                        results.crash_dump.file ? results.crash_dump.file.toString() : results.crash_dump.file )

                    return resolve( results )

                }

                debug('Symbol files:', results.symbol_files.map( ( e )=> {return e.name} ) );

                results.crash_dump.report = report.toString();
                results.crash_dump.report_html = header + report.toString().replace( /(?:\r\n|\r|\n)/g, '<br />' );

                resolve( results )

            }

            if ( results.symbols.length > 0 ) {

                Minidump.walkStack( results.crash_dump_file, Path.join( Path.resolve(), 'symbols' ),
                    ( error, report )=> {

                        parse( error, report );

                    } )
            } else {

                Minidump.walkStack( results.crash_dump_file, ( error, report )=> {

                    parse( error, report );

                } );
            }

        } )

    } ).then( ( results )=> {

        // delete files

        debug( 'Deleting', results.crash_dump_file );
        Fs.unlinkSync( results.crash_dump_file );
        Fs.rmdir( Path.join( Path.resolve(), results.crash_dump_path) )

        results.symbol_files.forEach( ( file )=> {

            debug( 'Deleting', file );
            let f = Path.join( file.path, file.name );

            if ( file_exists( f ) ) {

                Fs.unlinkSync( f );

            }

        } );

        return new Promise( ( resolve, reject )=> {
            if ( results.symbols.length > 0 ) {
                Rmdir( Path.join( Path.resolve(), results.symbol_path ), function ( err, dirs, files ) {

                    if ( err ) {
                        reject( err )
                    }

                    debug( dirs );
                    debug( files );
                    debug( 'all files are removed' );
                    resolve( results )
                } );
            } else {
                resolve( results )
            }

        } )

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
                    symbol_ids: Joi.string().description( 'Optional JSON string list of symbol file ids' )
                }
            }
        }
    },
];


