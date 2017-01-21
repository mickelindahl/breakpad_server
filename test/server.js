/**
 * Created by Mikael Lindahl (mikael) on 10/11/16.
 */

'use strict';

/**
 * Created by mikael on 9/23/16.
 */
const mock = require('mock-require');

mock('sails-postgresql', {});

require('dotenv').config({ path: './testenv'})

mock('dotenv', {config:(smile)=>{}});


const debug = require( 'debug' )( 'breakpad:test:server' );

const serverPromise = require( "../index.js" )
const Lab = require( "lab" );
const lab = exports.lab = Lab.script();

const code = require( "code" );
const Path = require( 'path' );


let _server;

lab.experiment( "Server", function () {

    //lab.afterEach( done=> {
    //
    //    _server.app.adapter.teardown( ()=> {
    //        _server.stop( done )
    //    } )
    //
    //} );

    lab.before((done)=>{

        delete process.env.NODE_ENV; // need to delete it here. Thinks lab sets it to test

        done()
    })


    lab.test( 'Testing server start',

        ( done ) => {


            serverPromise.then(server=>{

                debug(process.env.NODE_ENV)
                _server=server;
                done();

            });

        } );


    lab.test( 'Testing server start heroku web url',

        ( done ) => {


            delete require.cache[Path.dirname( __dirname ) + '/index.js'];

            process.env.HEROKU_WEB_URL= '0.0.0.0:3000';

            let serverPromise = require('../index.js');

            debug(process.env.NODE_ENV)

            serverPromise.then(server=>{

                _server=server;

                code.expect(server.info.uri.split('/')[2]).to.equal(process.env.HEROKU_WEB_URL);

                done();

            });

        } );

    //lab.test( 'Testing server throw error',
    //
    //    ( done ) => {
    //
    //
    //        for (let key in require.cache){
    //            delete require.cache[key]
    //        }
    //
    //
    //        //delete require.cache[Path.dirname( __dirname ) + '/index.js'];
    //        require( 'dotenv' ).config( { path:Path.dirname( __dirname )+ '/testenv' } );
    //        process.env.NODE_ENV='error';
    //
    //
    //        let p = new Promise( ( resolve, reject )=> {
    //            try {
    //
    //                let server = require( "../index.js" );
    //                var iv = setInterval( function () {
    //                    if ( server.app.readyForTest == true ) {
    //                        clearInterval( iv );
    //                        resolve( server )
    //                    }
    //                }, 50 );
    //            }catch(err){
    //                resolve(err)
    //            }
    //
    //        } ).then( ( server )=> {
    //
    //
    //            delete process.env.DATABASE_URL
    //
    //            debug( 'stop' )
    //            //server.stop();
    //            done()
    //
    //        } )
    //    } );
    //
    //
    //
    //lab.test( 'Testing server uncaughtException',
    //
    //    ( done ) => {
    //
    //
    //        for (let key in require.cache){
    //            delete require.cache[key]
    //        }
    //
    //
    //        //delete require.cache[Path.dirname( __dirname ) + '/index.js'];
    //        require( 'dotenv' ).config( { path:Path.dirname( __dirname )+ '/testenv' } );
    //        process.env.POSTGRES_REQUIRE_SSL=true;
    //        process.env.NODE_ENV='test';
    //
    //
    //        let server = require( "../index.js" );
    //        let p = new Promise( ( resolve, reject )=> {
    //
    //            var iv = setInterval( function () {
    //                if ( server.app.readyForTest == true ) {
    //                    clearInterval( iv );
    //                    resolve( server )
    //                }
    //            }, 50 );
    //        } ).then( ( server )=> {
    //
    //
    //            process.emit('uncaughtException', 'I am an erro')
    //            debug( 'stop' );
    //            server.stop();
    //            done()
    //
    //        } )
    //    } );
} );


