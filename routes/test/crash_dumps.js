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
const debug = require( 'debug' )( 'breakpad:test:crash_dumps' );
const Jwt = require( 'jsonwebtoken' );

let _server;

lab.experiment( "Crash dump", function () {

    lab.before( function ( done ) {

        serverPromise.then(server=>{

            _server=server;

            done();

        });
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

            _server.inject( options, function ( response ) {
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

            _server.inject( options, function ( response ) {

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

            _server.inject( options,  ( response )=> {
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

            _server.inject( options,  ( response ) =>{
                process.env.BAD_IMPLEMENTATION=false;
                code.expect( response.statusCode ).to.equal( 500 );
                done();
            } );
        } );

    lab.test( "Testing for GET all crash dumps with JWT",
         ( done ) => {

             process.env.JWT_SECRET='secret';

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

                _server.inject( options,  ( response )=> {
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

            _server.inject( options, function ( response ) {
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

            _server.inject( options, function ( response ) {

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

            _server.inject( options, function ( response ) {

                code.expect( response.statusCode ).to.equal( 200 );
                done();

            } );
        } );
} );