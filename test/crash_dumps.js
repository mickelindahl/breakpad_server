/**
 * Created by Mikael Lindahl (mikael) on 10/11/16.
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

    lab.test( 'Testing for POST crash_dumps',

         ( done )=> {

            var options = {
                method: "POST",
                url: "/crash_dumps",
                payload: {
                    prod: 'cool',
                    ver: '1.0.0',
                    upload_file_minidump: 'i am a binary string'
                }
            };

            debug( options )

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 201 );
                code.expect( response.result.id ).to.equal( 1 );
                done();
            } );
        } );

    lab.test( 'Testing for POST crash_dumps bad_implementation',

        function ( done ) {
            process.env.BAD_IMPLEMENTATION=true;
            var options = {
                method: "POST",
                url: "/crash_dumps",
                payload: {
                    prod: 'cool',
                    ver: '1.0.0',
                    upload_file_minidump: 'i am a binary string',

                }
            };

            debug( options )

            server.inject( options, function ( response ) {

                delete process.env.BAD_IMPLEMENTATION

                code.expect( response.statusCode ).to.equal( 500 );
                done();
            } );
        } );



    lab.test( "Testing for GET all crash dumps",
         ( done ) =>{
            var options = {
                method: "GET",
                url: "/crash_dumps",
                credentials: {}, // To bypass auth strategy
            };

            server.inject( options,  ( response )=> {
                code.expect( response.statusCode ).to.equal( 200 );
                code.expect( response.result[0].product ).to.equal( 'cool' );
                done();
            } );
        } );

    lab.test( "Testing for GET all crash dumps bad implementation",
         ( done )=> {
            process.env.BAD_IMPLEMENTATION=true;
            var options = {
                method: "GET",
                url: "/crash_dumps",
                credentials: {}, // To bypass auth strategy
            };

            server.inject( options,  ( response ) =>{
                process.env.BAD_IMPLEMENTATION=false;
                code.expect( response.statusCode ).to.equal( 500 );
                done();
            } );
        } );

    lab.test( "Testing for GET all crash dumps with JWT",
         ( done ) => {

            Jwt.sign( { foo: 'bar' }, 'secret', {
                algorithm: 'HS256',
                expiresIn: "12h"
            },  ( err, token )=> {
                console.log( token );
                console.error( err )

                var options = {
                    method: "GET",
                    url: "/crash_dumps",
                    headers: { cookie: 'loredge_jwt=' + token },
                    //credentials: {  }, // To bypass auth strategy
                };

                server.inject( options,  ( response )=> {
                    code.expect( response.statusCode ).to.equal( 200 );
                    code.expect( response.result[0].product ).to.equal( 'cool' );
                    done();
                } );
            } );

        } );

    lab.test( "Testing for GET all crash dumps bad JWT",
        function ( done ) {

            var options = {
                method: "GET",
                url: "/crash_dumps",
                headers: { cookie: 'loredge_jwt=' + 'wrong' },
                //credentials: {  }, // To bypass auth strategy
            };

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 302 );
                done();
            } );


        } );

    lab.test( "Testing for GET not a jwt cookie",
        function ( done ) {

            var options = {
                method: "GET",
                url: "/crash_dumps",
                headers: { cookie: 'other=' + 'wrong' },
                //credentials: {  }, // To bypass auth strategy
            };

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 302 );
                done();
            } );
        } );


    lab.test( "Testing for GET crash dump view",
        function ( done ) {

            var options = {
                method: "GET",
                url: "/crash_dumps/view",
                credentials: {  }, // To bypass auth strategy
            };

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 200 );
                done();
            } );
        } );
} );