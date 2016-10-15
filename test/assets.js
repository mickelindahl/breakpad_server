/**
 * Created by Mikael Lindahl (mikael) on 10/15/16.
 */

'use strict';

const Lab = require( "lab" );
const lab = exports.lab = Lab.script();
const server = require( "../index.js" );
const code = require( "code" );
const Path = require( 'path' );
const debug = require( 'debug' )( 'breakpad:test:crash_dumps' );
const Jwt = require( 'jsonwebtoken' );

lab.experiment( "Crash dump", function () {

    lab.before( { timeout: 3000 }, function ( done ) {

        process.env.NODE_ENV = 'test';

        var iv = setInterval( function () {
            if ( server.app.readyForTest == true ) {
                clearInterval( iv );
                done();
            }
        }, 50 );
    } );

    lab.test( "Testing for GET for bootstrap table test route",
        function ( done ) {
            var options = {
                method: "GET",
                url: "/test",
                credentials: {}, // To bypass auth strategy
            };

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 200 );
                done();
            } );
        } );

    lab.test( "Testing for GET root redirect to crash_dump/view",
        function ( done ) {
            var options = {
                method: "GET",
                url: "/",
                credentials: {}, // To bypass auth strategy
            };

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 302 );
                done();
            } );
        } );



    lab.test( "Testing for GET for browserify bundle",
        function ( done ) {
            var options = {
                method: "GET",
                url: "/bundles/symbol.js",
                credentials: {}, // To bypass auth strategy
            };

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 200 );
                done();
            } );
        } );

    lab.test( "Testing for GET for browserify bundle file do not exist",
        function ( done ) {
            var options = {
                method: "GET",
                url: "/bundles/no.js",
                credentials: {}, // To bypass auth strategy
            };

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 500 );
                done();
            } );
        } );


});