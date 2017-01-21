/**
 * Created by Mikael Lindahl (mikael) on 10/15/16.
 */

'use strict';

const mock=require('mock-require');

require('dotenv').config({ path: './testenv'})

mock('dotenv', {config:(smile)=>{}});

const Lab = require( "lab" );
const lab = exports.lab = Lab.script();
const serverPromise = require( "../../index.js" );
const code = require( "code" );
const debug = require( 'debug' )( 'breakpad:test:assets' );

let _server;

lab.experiment( "Assets", function () {

    lab.before( function ( done ) {

        serverPromise.then(server=>{

            _server=server;

            done();

        });
    } );

    lab.test( "Testing for GET for bootstrap table test route",
        function ( done ) {
            var options = {
                method: "GET",
                url: "/test",
                credentials: {}, // To bypass auth strategy
            };

            _server.inject( options, function ( response ) {
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

            _server.inject( options, function ( response ) {
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

            _server.inject( options, function ( response ) {
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

            _server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 500 );
                done();
            } );
        } );
});