/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */


global.$ = global.jQuery = require('jquery');
global.Tether = require( 'tether' );

var CrashDump  =require('./controllers/crash_dump')


$( document ).ready( function () {

    CrashDump({
        selector:{
            details_content:'#crash-dump-details-template',
            details_view:'#crash-dump-view',

        }
    })

} );