/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */


var $_=require('jquery');

// Login
function login() {
    var  geturl=$_.ajax( {
        type: 'POST',
        url: '/login',
        data: {
            user: $_( "#user" ).val(),
            password: $_( "#password" ).val(),
        },
        success: function ( response ) {

            alert("done!"+ geturl.getAllResponseHeaders());

            var redirect = document.URL.split( '=' );
            var url = redirect.length > 1 ? redirect[1] : location.origin + "/";

            var domain=document.location.hostname+':'+document.location.host;

            //setCookie( 'loredge_jwt', response.id_token, 0.5, domain,'/' );
            //setCookie( 'loredge_jwt', response.id_token, 0.5, document.domain,'/login' );
            //setCookie( 'username', 'hej', 0.5 );
            window.open( url, '_self' );
        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );
        }
    } );
}

function setCookie(cname, cvalue, exdays, domain, path) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();

    console.log(cname + "=" + cvalue + "; " + expires)

    document.cookie = cname + "=" + cvalue + "; " + expires//+';domain=.'+domain+'; path='+path

}

$_( document ).ready( function () {
    $_('#login').click(function (){
        login();
    });


    $_( 'form' ).keydown( function ( event ) {

        if ( event.keyCode == 13 ) {
            $_( 'form input' ).click();
            return false;
        }
    } );
} );