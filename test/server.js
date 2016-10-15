/**
 * Created by Mikael Lindahl (mikael) on 10/11/16.
 */

'use strict';

/**
 * Created by mikael on 9/23/16.
 */


const Lab = require( "lab" );
const lab = exports.lab = Lab.script();

const code = require( "code" );
const Path = require( 'path' );
const debug = require( 'debug' )( 'breakpad:test:server' );
const Promise = require( 'bluebird' );

lab.experiment( "Crash dump", function () {

    //lab.before( { timeout: 3000 }, function ( done ) {
    //
    //} );

    lab.after((done)=>{
        delete require.cache[Path.dirname( __dirname ) + '/index.js']
        process.env.NODE_ENV = 'test';
        done()
    })

    lab.test( 'Testing server start',

        ( done ) => {


            delete require.cache[Path.dirname( __dirname ) + '/index.js']
            process.env.NODE_ENV = undefined;
            delete process.env.DATABASE_URL;

            let server = require( "../index.js" );
            let p = new Promise( ( resolve, reject )=> {

                var iv = setInterval( function () {
                    if ( server.app.readyForTest == true ) {
                        clearInterval( iv );
                        resolve( server )
                    }
                }, 50 );
            } ).then( ( server )=> {

                debug( 'stop' )
                server.stop();
                done()

            } )
        } );

    lab.test( 'Testing server start production',

        ( done ) => {


            for (let key in require.cache){
                delete require.cache[key]
            }


            //delete require.cache[Path.dirname( __dirname ) + '/index.js'];
            require( 'dotenv' ).config( { path:Path.dirname( __dirname )+ '/testenv' } );
            process.env.NODE_ENV = 'production';


            let server = require( "../index.js" );
            let p = new Promise( ( resolve, reject )=> {

                var iv = setInterval( function () {
                    if ( server.app.readyForTest == true ) {
                        clearInterval( iv );
                        resolve( server )
                    }
                }, 50 );
            } ).then( ( server )=> {

                debug( 'stop' )
                server.stop()
                done()

            } )
        } );

    lab.test( 'Testing server start heroku web url',

        ( done ) => {


            for (let key in require.cache){
                delete require.cache[key]
            }


            //delete require.cache[Path.dirname( __dirname ) + '/index.js'];
            require( 'dotenv' ).config( { path:Path.dirname( __dirname )+ '/testenv' } );
            process.env.HEROKU_WEB_URL= '0.0.0.0:3000';


            let server = require( "../index.js" );
            let p = new Promise( ( resolve, reject )=> {

                var iv = setInterval( function () {
                    if ( server.app.readyForTest == true ) {
                        clearInterval( iv );
                        resolve( server )
                    }
                }, 50 );
            } ).then( ( server )=> {

                debug( 'stop' )
                server.stop()
                done()

            } )
        } );

    lab.test( 'Testing server thrwo error',

        ( done ) => {


            for (let key in require.cache){
                delete require.cache[key]
            }


            //delete require.cache[Path.dirname( __dirname ) + '/index.js'];
            require( 'dotenv' ).config( { path:Path.dirname( __dirname )+ '/testenv' } );
            process.env.NODE_ENV='error'


            let server = require( "../index.js" );
            let p = new Promise( ( resolve, reject )=> {

                var iv = setInterval( function () {
                    if ( server.app.readyForTest == true ) {
                        clearInterval( iv );
                        resolve( server )
                    }
                }, 50 );
            } ).then( ( server )=> {

                debug( 'stop' )
                //server.stop();
                done()

            } )
        } );


    lab.test( 'Testing server POSTGRES_REQUIRE_SSL true',

        ( done ) => {


            for (let key in require.cache){
                delete require.cache[key]
            }


            //delete require.cache[Path.dirname( __dirname ) + '/index.js'];
            require( 'dotenv' ).config( { path:Path.dirname( __dirname )+ '/testenv' } );
            process.env.POSTGRES_REQUIRE_SSL=true;
            process.env.NODE_ENV='test'


            let server = require( "../index.js" );
            let p = new Promise( ( resolve, reject )=> {

                var iv = setInterval( function () {
                    if ( server.app.readyForTest == true ) {
                        clearInterval( iv );
                        resolve( server )
                    }
                }, 50 );
            } ).then( ( server )=> {

                debug( 'stop' )
                server.stop();
                done()

            } )
        } );

    lab.test( 'Testing server uncaughtException',

        ( done ) => {


            for (let key in require.cache){
                delete require.cache[key]
            }


            //delete require.cache[Path.dirname( __dirname ) + '/index.js'];
            require( 'dotenv' ).config( { path:Path.dirname( __dirname )+ '/testenv' } );
            process.env.POSTGRES_REQUIRE_SSL=true;
            process.env.NODE_ENV='test'


            let server = require( "../index.js" );
            let p = new Promise( ( resolve, reject )=> {

                var iv = setInterval( function () {
                    if ( server.app.readyForTest == true ) {
                        clearInterval( iv );
                        resolve( server )
                    }
                }, 50 );
            } ).then( ( server )=> {


                process.emit('uncaughtException', 'I am an erro')
                debug( 'stop' )
                server.stop();
                done()

            } )
        } );

} );


