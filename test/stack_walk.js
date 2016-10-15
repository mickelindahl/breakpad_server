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

        process.env.NODE_ENV = 'test';

        var iv = setInterval( function () {
            if ( server.app.readyForTest == true ) {
                clearInterval( iv );
                done();
            }
        }, 50 );
    } );

    lab.test( 'Testing for POST crash_dumps with symbols',
        ( done ) => {

            let Symbol = server.getModel( 'symbol' );

            Symbol.create( [{
                debug_identifier: 'B0E1FC01EF48E39CAF5C881D2DF0C3840',
                debug_file: 'overflow',
                file: Fs.readFileSync( Path.join( Path.resolve(), 'test', 'overflow.sym' ) )

            },
                {
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

                }] ).then( ( symbols )=> {

                let Crash_dump = server.getModel( 'crash_dump' );
                return Crash_dump.create( {
                    product: 'string',
                    version: 'string',
                    file: Fs.readFileSync( Path.join( Path.resolve(), 'test', 'minidump2.dmp' ) ),
                    ip: 'string',
                    user_agent: 'string',
                    report: 'string',
                    report_html: 'string'
                } )

            } ).then( ( crash_dump )=> {

                debug( 'crash_dump', crash_dump )

                var options = {
                    method: "POST",
                    url: "/stack_walk",
                    credentials: {}, // To bypass auth strategy
                    payload: {
                        crash_id: crash_dump.id,
                        symbol_ids: JSON.stringify( [1, 3, 4, 5, 6] ),
                    }
                };

                debug( options )

                server.inject( options, function ( response ) {

                    code.expect( response.statusCode ).to.equal( 200 );
                    code.expect( response.result.id ).to.equal( crash_dump.id );
                    done();
                } );

            } ).catch( ( err )=> {

                console.error( err )

            } )

        } );

    lab.test( 'Testing for POST crash_dumps with symbols',
        ( done ) => {

            var options = {
                method: "POST",
                url: "/stack_walk",
                credentials: {}, // To bypass auth strategy
                payload: {
                    crash_id: 1,
                }
            };

            debug( options );

            server.inject( options, function ( response ) {

                code.expect( response.statusCode ).to.equal( 200 );
                code.expect( response.result.id ).to.equal( 1 );
                done();
            } );

        } );

    lab.test( 'Testing for POST stack_walk with duplicated symbol files',
        ( done ) => {

            var options = {
                method: "POST",
                url: "/stack_walk",
                credentials: {}, // To bypass auth strategy
                payload: {
                    crash_id: 1,
                    symbol_ids: JSON.stringify( [1, 2
                    ] ),
                }
            };

            debug( options );

            server.inject( options, function ( response ) {

                code.expect( response.statusCode ).to.equal( 200 );
                code.expect( response.result.id ).to.equal( 1 );
                done();
            } );

        } );


    lab.test( 'Testing for POST stack_walk with null file',
        ( done ) => {

            let Crash_dump = server.getModel( 'crash_dump' );
            Crash_dump.create( {
                product: 'string',
                version: 'string',
                file: null,
                ip: 'string',
                user_agent: 'string',
                report: 'string',
                report_html: 'string'
            } ).then((crash_dump)=>{
                var options = {
                    method: "POST",
                    url: "/stack_walk",
                    credentials: {}, // To bypass auth strategy
                    payload: {
                        crash_id: crash_dump.id,
                        symbol_ids: JSON.stringify( [1, 2
                        ] ),
                    }
                };

                debug( options );

                server.inject( options, function ( response ) {

                    code.expect( response.statusCode ).to.equal( 200 );
                    code.expect( response.result.id ).to.equal( crash_dump.id );
                    done();
                } );
            })


        } );


    lab.test( 'Testing for POST crash_dumps',
        ( done ) => {

            var options = {
                method: "POST",
                url: "/stack_walk",
                payload: {
                    crash_id: 1,
                    //symbol_ids:[1],
                }
            };

            debug( options )

            server.inject( options, function ( response ) {

                code.expect( response.statusCode ).to.equal( 200 );
                code.expect( response.result.id ).to.equal( 1 );
                done();
            } );

        } );

    lab.test( 'Testing for POST crash_dumps error',
        ( done ) => {

            var options = {
                method: "POST",
                url: "/stack_walk",
                payload: {
                    crash_id: 100,
                    //symbol_ids:[1],
                }
            };

            debug( options )

            server.inject( options, function ( response ) {

                code.expect( response.statusCode ).to.equal( 500 );
                done();
            } );

        } )

} );