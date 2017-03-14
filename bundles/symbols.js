/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */


global.$ = global.jQuery = require('jquery');
global.Tether = require( 'tether' );

var Symbols  =require('./controllers/symbols')


$( document ).ready( function () {

    Symbols({
        selector:{
            details_content:'#symbol-details-template',
            details_view:'#symbol-details-view',

        }
    })

} );