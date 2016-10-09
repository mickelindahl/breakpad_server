/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */

'use strict';

const $_=require('jquery');

// Login
function login() {
    $_.ajax( {
        type: 'POST',
        url: '/login',
        data: {
            user: $_( "#user" ).val(),
            password: $_( "#password" ).val(),
        },
        success: function ( response ) {

            var redirect = document.URL.split( '=' );
            var url = redirect.length > 1 ? redirect[1] : location.origin + "/";

            setCookie( 'loredge_jwt', response.id_token, 0.5 );

            window.open( url, '_self' );
        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );
        }
    } );
}

function setCookie( cname, cvalue, exdays ) {
    var d = new Date();
    d.setTime( d.getTime() + (exdays*24*60*60*1000) );
    var expires = "expires=" + d.toUTCString();

    console.log( cname + "=" + cvalue + "; " + expires )

    document.cookie = cname + "=" + cvalue + "; " + expires;
}

$_( document ).ready( function () {
    $_('#login').click(()=>{
        login();
    });


    $_( 'form' ).keydown( function ( event ) {

        if ( event.keyCode == 13 ) {
            $_( 'form input' ).click();
            return false;
        }
    } );
} );