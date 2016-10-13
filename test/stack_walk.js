/**
 * Created by Mikael Lindahl (mikael) on 10/11/16.
 */

'use strict';

/**
 * Created by mikael on 9/23/16.
 */

const Lab = require( "lab" );
const lab = exports.lab = Lab.script();
const server = require( "../index.js" );
const code = require( "code" );
const Path = require( 'path' );
const debug = require( 'debug' )( 'breakpad:test:stack_walk' );
const Fs = require( 'fs' );

lab.experiment( "Stack walk", function () {

    lab.before( { timeout: 3000 }, function ( done ) {
        var iv = setInterval( function () {
            if ( server.app.readyForTest == true ) {
                clearInterval( iv );
                done();
            }
        }, 50 );
    } );

    lab.test( 'Testing for POST crash_dumps',
        ( done ) => {

            let Crash_dump = server.getModel( 'crash_dump' );
            //let file = Fs.readFileSync( Path.join( Path.resolve(), 'test', 'linux_overflow.dmp' ) );
            let file = Fs.readFileSync( Path.join( Path.resolve(), 'test', 'minidump2.dmp' ) );

            //debug(file.toString())

            Crash_dump.create( {

                file: file

            } ).then( ( crash_dump )=> {

                //debug( 'crash_dump', crash_dump )

                let Symbol = server.getModel( 'symbol' );

                return Symbol.create( [{
                        debug_identifier: 'B0E1FC01EF48E39CAF5C881D2DF0C3840',
                        debug_file: 'overflow',
                        file: Fs.readFileSync( Path.join( Path.resolve(), 'test', 'overflow.sym' ) )

                    },
                    {
                        debug_identifier: 'BCE8785C57B44245A669896B6A19B9542',
                        debug_file: 'kernel32.pdb',
                        file: Fs.readFileSync( Path.join( Path.resolve(), 'test', 'kernel32.sym' ) )

                    },
                    {
                        debug_identifier: 'C32AD7E235EA6112E02A5B9D6219C4850',
                        debug_file: 'ld-2.13.so',
                        file: Fs.readFileSync( Path.join( Path.resolve(), 'test', 'ld-2.13.so.sym' ) )

                    },
                    {
                        debug_identifier: 'F4F8DFCD5A5FB5A7CE64717E9E6AE3890',
                        debug_file: 'libc-2.13.so',
                        file: Fs.readFileSync( Path.join( Path.resolve(), 'test', 'libc-2.13.so.sym' ) )

                    },
                    {
                        debug_identifier: '18B180F90887D8F8B5C35D185444AF4C0',
                        debug_file: 'libgcc_s.so.1',
                        file: Fs.readFileSync( Path.join( Path.resolve(), 'test', 'libgcc_s.so.1.sym' ) )

                    }] )

            } ).then( ( symbol )=> {

                //debug( 'symbol', symbol )

                var options = {
                    method: "POST",
                    url: "/stack_walk",
                    payload: {
                        crash_id: 2,
                        symbol_ids: [1, 2, 3, 4, 5],
                    }
                };

                debug( options )

                server.inject( options, function ( response ) {

                    debug( response.result.report );

                    //code.expect( response.statusCode ).to.equal( 201 );
                    //code.expect( response.result.id ).to.equal( 1 );
                    done();
                } );

            } ).catch( ( err )=> {

                console.error( err )

            } )

        } );

    lab.test( 'Testing for POST crash_dumps',
        ( done ) => {

            var options = {
                method: "POST",
                url: "/stack_walk",
                payload: {
                    crash_id: 2,
                    //symbol_ids:[1],
                }
            };

            debug( options )

            server.inject( options, function ( response ) {

                debug( response.result.report);

                //code.expect( response.statusCode ).to.equal( 201 );
                //code.expect( response.result.id ).to.equal( 1 );
                done();
            } );

        } )

} );