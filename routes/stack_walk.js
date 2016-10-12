/**
 * Created by Mikael Lindahl (mikael) on 10/11/16.
 */

'use strict';

const Joi = require( 'joi' );
const Boom = require( 'boom' );
const Formidable = require( 'formidable' );
const debug = require( 'debug' )( 'breakpad:route:crash_dumps' );
const Minidump = require( 'minidump' );
const Fs = require( 'fs' );
const Path = require( 'path' );
const Uuid = require( 'uuid' );
const Promise = require( 'bluebird' );
const Mkdirp = require('mkdirp');

module.exports = [

    {
        method: 'POST',
        path: '/stack_walk',
        handler: ( request, reply )=> {
            let Crash_dump = request.server.getModel( 'crash_dump' );

            Crash_dump.find( { id: request.payload.crash_id } ).then( ( crash_dump )=> {

                return new Promise( ( resolve, reject )=> {
                    let Symbols = request.server.getModel( 'symbols' );

                    let criteria = request.payload.symbol_ids.map( ( e )=> {return { id: e }} )
                    Symbols.find( criteria ).then( ( symbols )=> {

                        resolve( {
                            crash_dump: crash_dump[0],
                            symbols: symbols
                        } )
                    } )
                } )
            } ).then( ( results )=> {


                let path=Path.join( Path.resolve(),'crash_dump');
                let name = Uuid.v4();
                Mkdirp.sync(path);
                Fs.writeFileSync( Path.join( path, name), results.crash_dump.file );

                results.crash_dump_file = {path:path, name:name};
                results.symbol_files=[]
                results.symbols.forEach((sym)=>{

                    let path=Path.join( Path.resolve(),'symbols', sym.debug_file, sym.debug_identifier)
                    let name=sym.debug_file+'.sym';
                    Mkdirp.sync(path);
                    Fs.writeFileSync( Path.join( path, name), sym.file );
                    results.symbol_files.push({path:path, name:name})

                })


                // setup symbol files
                //SimpleSymbolSupplier simply looks for symbol files in a known
                // directory structure given a list of symbol directories.
                // <debug filename>/<debug identifier>/<debug filename>.sym
                //ref:https://wiki.mozilla.org/Breakpad:Symbols




            } ).then( ( results )=> {

                //debug(models)
                //
                ////let i=0;
                //models.forEach((val)=>{
                //
                //    if (!val.file){
                //        return
                //    }

                //val.file=val.file.toString();
                //
                //val.file = val.file.replace(/(?:\r\n|\r|\n)/g, '<br />');
                //
                //
                //let file=Path.join(Path.resolve(), 'test', Uuid.v4());
                //Fs.writeFileSync(file, val.file);
                //Minidump.walkStack(file, (error, report)=>{
                //   //debug(error, report.toString());
                //    //

                //
                //    if (error){
                //        console.log(error)
                //    }
                //
                //    if (!report){
                //        return
                //    }
                //
                //    val.file=report.toString();
                //
                //    val.file = val.file.replace(/(?:\r\n|\r|\n)/g, '<br />');
                //
                ////
                //    i++;
                //    if(models.length-1==i){
                //
                //    }
                ////
                //     Fs.unlink(file, function(err){
                //         if(err) return console.log(err);
                //         console.log(file+' file deleted successfully');
                //     });
                //
                //
                //})

                //});
                reply( models );

            } ).catch( function ( err ) {

                request.server.app.log.error( err );
                reply( Boom.badImplementation( err.message ) );

            } );
        },//handler.getAll({model:'crash_dump'}),
        config: {
            description: 'Get all crash dumps',
            notes: 'Gets all crash dumps',
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
                params: {
                    version: Joi.string().required().description( 'Hmmm' )
                }
            }
        }
    },
];


