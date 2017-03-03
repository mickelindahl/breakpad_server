/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */


global.$ = global.jQuery = require('jquery');
global.Tether = require( 'tether' );

var Auth  =requirel('./lib/auth')
// Login


$( document ).ready( function () {

    $('#login').click(function (){
        login();
    });


    $( 'form' ).keydown( function ( event ) {

        if ( event.keyCode == 13 ) {
            $( 'form input' ).click();
            return false;
        }
    } );
} );