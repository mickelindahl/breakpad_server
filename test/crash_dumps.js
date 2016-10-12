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
const Path = require('path');
const debug=require('debug')('breakpad:test:crash_dumps');

lab.experiment( "Anchor", function () {

    lab.before( { timeout: 3000 }, function ( done ) {
        var iv = setInterval( function () {
            if ( server.app.readyForTest == true ) {
                clearInterval( iv );
                done();
            }
        }, 50 );
    } );

    lab.test( 'Testing for POST crash_dumps',

        function ( done ) {

            let name='dump_file';
            let file=Path.join(Path.resolve(), 'test',name)

            var options = {
                method: "POST",
                url: "/crash_dumps",
                payload: {
                    prod: 'cool',
                    ver: '1.0.0',
                    upload_file_minidump: 'i am a binary string'
                }
            };

            debug(options)

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 201 );
                code.expect( response.result.id ).to.equal( 1 );
                done();
            } );
        } );

    lab.test( "Testing for GET all crash dumps",
        function ( done ) {
            var options = {
                method: "GET",
                url: "/crash_dumps",
                credentials: {  }, // To bypass auth strategy
            };

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 200 );
                code.expect( response.result[0].product ).to.equal( 'cool' );
                done();
            } );
        } );

} );