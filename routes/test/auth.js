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
const debug = require( 'debug' )( 'breakpad:test:crash_dumps' );

let _server;

lab.experiment( "Login", function () {

    lab.before( function ( done ) {

        serverPromise.then(server=>{

            _server=server;

            done();

        });
    } );

    lab.test( 'Testing for POST login',

        ( done )=> {

            var options = {
                method: "POST",
                url: "/auth/login",
                payload: {
                    user: 'user',
                    password: 'password'
                }
            };

            debug( options )

            _server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 201 );
                done();
            } );
        } );

    lab.test( 'Testing for POST login wrong user',

        ( done )=> {

            var options = {
                method: "POST",
                url: "/auth/login",
                payload: {
                    user: 'wrong',
                    password: 'password'
                }
            };

            debug( options )

            _server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 404 );
                done();
            } );
        } );

    lab.test( 'Testing for POST login wrong password',

        ( done )=> {

            var options = {
                method: "POST",
                url: "/auth/login",
                payload: {
                    user: 'user',
                    password: 'wrong'
                }
            };

            debug( options )

            _server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 403 );
                done();
            } );
        } );

    lab.test( "Testing for GET login page",
        ( done ) => {
            var options = {
                method: "GET",
                url: "/auth",
                credentials: {}, // To bypass auth strategy
            };

            _server.inject( options, ( response )=> {
                code.expect( response.statusCode ).to.equal( 200 );
                done();
            } );
        } );
})