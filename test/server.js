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

const serverPromise = require( "../index.js" ).promise
const Lab = require( "lab" );
const lab = exports.lab = Lab.script();

const code = require( "code" );
const Path = require( 'path' );


let _server;

lab.experiment( "Server", function () {

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

} );


