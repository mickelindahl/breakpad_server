/**
 * Created by Mikael Lindahl (mikael) on 3/17/17.
 */

'use strict';

global.$ = global.jQuery = require( 'jquery' );
global.Tether = require( 'tether' );
var $ = global.$;

var Promise = require( 'bluebird' );

function Model(options) {

    this.id=options.id;
    this.data=options.data;
    this.url=options.url;

}

Model.prototype.delete = function () {

    var self=this;

    return new Promise( function ( resolve, reject ) {

        $.ajax( {
            url: self.url.delete + '/' + self.id,
            method: 'DELETE',
            success: function ( res ) {

                resolve( res )

            },
            error: function ( xhr, status, error ) {

                reject( {
                    xhr: xhr,
                    status: status,
                    error: error
                } )

            }
        } )
    } )
}


module.exports=function(opt){
    return new Model(opt);
}
