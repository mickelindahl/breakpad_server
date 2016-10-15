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

lab.experiment( "Symbol dump", function () {

    lab.before( { timeout: 3000 }, function ( done ) {
        var iv = setInterval( function () {
            if ( server.app.readyForTest == true ) {
                clearInterval( iv );
                done();
            }
        }, 50 );
    } );

    lab.test( 'Testing for POST symbols',

        function ( done ) {

            let name='dump_file';
            let file=Path.join(Path.resolve(), 'test',name)

            var options = {
                method: "POST",
                url: "/symbols",
                payload: {
                    user_agent: 'the man',
                    version: '0.0.1',
                    cpu:'AMD',
                    ip: '0.0.0.0',
                    file: 'i am a binary string',
                    code_file:'hej',
                    debug_file:'ho',
                    debug_identifier:'there'
                }
            };

            debug(options)

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 201 );
                code.expect( response.result.id ).to.equal( 6 );
                done();
            } );
        } );

    lab.test( "Testing for GET all symbols",
        function ( done ) {
            var options = {
                method: "GET",
                url: "/symbols",
                credentials: {  }, // To bypass auth strategy
            };


            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 200 );
                code.expect( response.result[5].debug_identifier ).to.equal( 'there' );
                done();
            } );
        } );

} );