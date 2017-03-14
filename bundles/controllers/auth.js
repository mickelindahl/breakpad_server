/**
 * Created by Mikael Lindahl (mikael) on 3/3/17.
 */

'use strict';

global.$ = global.jQuery = require( 'jquery' );
global.Tether = require( 'tether' );
var $ = global.$;

require('bootstrap')

var Rx = require( 'rxjs' );

function Auth( options ) {


    this.events=Rx.Observable.merge(
        Rx.Observable.fromEvent( $( '#auth-login' ), 'click' ),
        Rx.Observable.fromEvent( $( 'form' ), 'keydown' )
      );

    this.events.subscribe(this.login);
    this.events.subscribe(this.pressButtonOnEnterKeyPress);

}

Auth.prototype.login = function ( x ) {

    if(x.target.id!='auth-login'){
        return
    }

    login()

};

Auth.prototype.pressButtonOnEnterKeyPress=function(x){

    console.log(x)

    if ( x.originalEvent.keyCode == 13 ) {
        $( 'form input' ).click();
        return false;
    }

};

function login() {
    $.ajax( {
        type: 'POST',
        url: '/auth/login',
        data: {
            user: $( "#user" ).val(),
            password: $( "#password" ).val(),
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

module.exports = function ( opt ) {
    return new Auth( opt )
};
