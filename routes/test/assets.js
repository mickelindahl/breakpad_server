/**
 * Created by Mikael Lindahl (mikael) on 10/15/16.
 */

'use strict';

const mock=require('mock-require');

require('dotenv').config({ path: './testenv'})

mock('dotenv', {config:(smile)=>{}});

const Lab = require( "lab" );
const lab = exports.lab = Lab.script();
const serverPromise = require( "../../index.js" ).promise;
const code = require( "code" );
const debug = require( 'debug' )( 'breakpad_server:test:assets' );

let _server;

lab.experiment( "Assets", function () {

    lab.before( function ( done ) {

        serverPromise.then(server=>{

            _server=server;

            done();

        });
    } );

    lab.test( "Testing for GET for browserify bundle",
        function ( done ) {
            var options = {
                method: "GET",
                url: "/bundle/symbols.js",
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
                url: "/bundle/no.js",
                credentials: {}, // To bypass auth strategy
            };

            _server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 500 );
                done();
            } );
        } );
});