/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */


global.$ = global.jQuery = require('jquery');
global.Tether = require( 'tether' );
var $=global.$;

var Auth  =require('./controllers/auth');

$( document ).ready( function () {

    Auth();

} );