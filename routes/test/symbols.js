/**
 * Created by Mikael Lindahl (mikael) on 10/11/16.
 */

'use strict';
const mock=require('mock-require');

require('dotenv').config({ path: './testenv'})

mock('dotenv', {config:(smile)=>{}});

const Lab = require( "lab" );
const lab = exports.lab = Lab.script();
const serverPromise = require( "../../index.js" );
const code = require( "code" );
const Path = require('path');
const debug=require('debug')('breakpad:test:crash_dumps');

let _server;

lab.experiment( "Symbol dump", function () {

    lab.before( function ( done ) {

        serverPromise.then(server=>{

            _server=server;

            done();

        });
    } );

    lab.test( 'Testing for POST symbols',

        function ( done ) {

            var options = {
                method: "POST",
                url: "/symbols",
                payload: {
                    user_agent: 'the man',
                    version: '0.0.1',
                    os: 'linux',
                    cpu:'AMD',
                    ip: '0.0.0.0',
                    symbol_file: 'i am a binary string',
                    code_file:'hej',
                    debug_file:'ho',
                    debug_identifier:'there'
                }
            };

            debug(options)

            _server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 201 );
                code.expect( response.result.id>0 ).to.be.true();
                done();
            } );
        } );


    lab.test( 'Testing for POST symbolsn bad implementation',

        function ( done ) {

            process.env.BAD_IMPLEMENTATION=true;

            var options = {
                method: "POST",
                url: "/symbols",
                payload: {
                    user_agent: 'the man',
                    version: '0.0.1',
                    os: 'linux',
                    cpu:'AMD',
                    ip: '0.0.0.0',
                    symbol_file: 'i am a binary string',
                    code_file:'hej',
                    debug_file:'ho',
                    debug_identifier:'there'
                }
            };

            debug(options)

            _server.inject( options, function ( response ) {

                process.env.BAD_IMPLEMENTATION=false

                code.expect( response.statusCode ).to.equal( 500 );
                done();
            } );
        } );


    //lab.test( "Testing for GET all symbols",
    //    function ( done ) {
    //
    //        var options = {
    //            method: "GET",
    //            url: "/symbols",
    //            credentials: {  }, // To bypass auth strategy
    //        };
    //
    //        server.inject( options, function ( response ) {
    //
    //            code.expect( response.statusCode ).to.equal( 200 );
    //            code.expect( response.result[response.result.length-1].debug_identifier ).to.equal( 'there' );
    //            done();
    //        } );
    //    } );

    //lab.test( "Testing for GET all symbols bas implementation",
    //    function ( done ) {
    //
    //        process.env.BAD_IMPLEMENTATION=true;
    //
    //        var options = {
    //            method: "GET",
    //            url: "/symbols",
    //            credentials: {  }, // To bypass auth strategy
    //        };
    //
    //        server.inject( options, function ( response ) {
    //
    //            process.env.BAD_IMPLEMENTATION=false;
    //
    //            code.expect( response.statusCode ).to.equal( 500 );
    //            done();
    //        } );
    //    } );
    //
    lab.test( "Testing for GET crash dump view",
        function ( done ) {

            var options = {
                method: "GET",
                url: "/symbols/view",
                credentials: {  }, // To bypass auth strategy
            };

            _server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 200 );
                done();
            } );
        } );

} );