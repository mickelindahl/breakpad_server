/**
 * Created by Mikael Lindahl (mikael) on 10/12/16.
 */

'use strict';


let $_ = require( 'jquery' );

$_(function() {
    $_("ul .navbar-nav li").click(function() {
        // remove classes from all
        $_("ul .navbar-nav li").removeClass("active");
        // add class to the one we clicked
        $_(this).addClass("active");
    });
});