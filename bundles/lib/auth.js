/**
 * Created by Mikael Lindahl (mikael) on 3/3/17.
 */

'use strict';

global.$ = global.jQuery = require('jquery');
global.Tether = require( 'tether' );

var Rx=require('rx');

function Auth( options ) {

    var self=this;

    Rx.observable.fromEvent($('#auth-login'), 'click')
        .subscribe( function( x ){

            self.login()

        });

}

Auth.prototype.login = function () {
    $.ajax( {
        type: 'POST',
        url: '/login',
        data: {
            user: $_( "#user" ).val(),
            password: $_( "#password" ).val(),
        },
        success: function ( response ) {

            var redirect = document.URL.split( '=' );
            var url = redirect.length > 1 ? redirect[1] : location.origin + "/";

            window.open( url, '_self' );
        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );
        }
    } );
}

module.exports=Auth;
