/**
 * Created by Mikael Lindahl (mikael) on 10/15/16.
 */

'use strict';

const Lab = require( "lab" );
const lab = exports.lab = Lab.script();
const server = require( "../index.js" );
const code = require( "code" );
const debug = require( 'debug' )( 'breakpad:test:crash_dumps' );


lab.experiment( "Login", function () {

    lab.before( { timeout: 3000 }, function ( done ) {

        process.env.NODE_ENV = 'test';

        var iv = setInterval( function () {
            if ( server.app.readyForTest == true ) {
                clearInterval( iv );
                done();
            }
        }, 50 );
    } );

    lab.test( 'Testing for POST login',

        ( done )=> {

            var options = {
                method: "POST",
                url: "/login",
                payload: {
                    user: 'user',
                    password: 'password'
                }
            };

            debug( options )

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 201 );
                done();
            } );
        } );

    lab.test( 'Testing for POST login wrong user',

        ( done )=> {

            var options = {
                method: "POST",
                url: "/login",
                payload: {
                    user: 'wrong',
                    password: 'password'
                }
            };

            debug( options )

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 404 );
                done();
            } );
        } );

    lab.test( 'Testing for POST login wrong password',

        ( done )=> {

            var options = {
                method: "POST",
                url: "/login",
                payload: {
                    user: 'user',
                    password: 'wrong'
                }
            };

            debug( options )

            server.inject( options, function ( response ) {
                code.expect( response.statusCode ).to.equal( 403 );
                done();
            } );
        } );

    lab.test( "Testing for GET login page",
        ( done ) => {
            var options = {
                method: "GET",
                url: "/login",
                credentials: {}, // To bypass auth strategy
            };

            server.inject( options, ( response )=> {
                code.expect( response.statusCode ).to.equal( 200 );
                done();
            } );
        } );
})