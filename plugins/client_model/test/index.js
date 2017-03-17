/**
 * Created by Mikael Lindahl (mikael) on 3/17/17.
 */

'use strict';

var MockBrowser = require( 'mock-browser' ).mocks.MockBrowser;
var mock = new MockBrowser();

global.window = mock.getWindow();
//global.window.document = mock.createDocument();
global.$ = global.jQuery = require( 'jquery' );
global.Tether = require( 'tether' );

//let cheerio = require('cheerio')
//global.$ = global.jQuery = cheerio.load('<h2 class="title">Hello world</h2>')

var $ = global.$;

console.log( $ )

var mockjax = require( 'jquery-mockjax' )( $, window );

// Note that we expect `window` to be defined once this file is browserified and
// used in a browser. If it isn't Mockjax will have a problem!

mockjax( {
    url: /^\/test\/([\d]+)$/i,
    responseText: 'content',
    type:'DELETE'

} );

const debug = require( 'debug' )( 'breakpad:plugin:client_model:test:index' );

const Lab = require( "lab" );
const lab = exports.lab = Lab.script();

const code = require( "code" );

const Model = require( '../index' )

lab.experiment( "Server", function () {

    lab.test( 'Testing server start', done => {

        Model(
            {
                id: 1,
                url: {
                    delete: '/test'
                }
            } )
            .delete()
            .then( res => {

                debug( res )

                done()
            } )
            .catch( err=>{

                debug(err)

                done()

            })

    } )
} )