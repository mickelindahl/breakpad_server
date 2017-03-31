/**
 * Created by Mikael Lindahl (mikael) on 10/10/16.
 */

'use strict';

global.$ = global.jQuery = require( 'jquery' );
global.Tether = require( 'tether' );
var $ = global.$;

require('bootstrap');

var handlebars=require('handlebars');
var Rx = require( 'rxjs' );

var Model = require( 'model-ui-component' );
var util=require('../lib/util');

var data_table;
var _self;

function Symbols(options) {

    this.options = options;
    _self = this;

    data_table = util.createTable( {
        table_id: 'symbol-table',
        modal_id: 'symbol-modal'
    } );

    this.event={
        show:Rx.Observable.fromEvent( $( 'tbody' ), 'click' )
    };

    this.event.show.subscribe(this.viewDetails);
}


Symbols.prototype.delete = function ( x ) {

    var tr = $( x.target ).closest('tr');

    Model( {
        id: tr.attr( 'row-id' ),
        url: {
            delete: 'symbols'
        }
    } ).delete()
}


Symbols.prototype.viewDetails=function (x) {

    var id= $(x.target).closest('tr').attr('row-id')

    getDetails(id, function(data){

        if (data==null){

            alert('Data missing...');
            return
        }


        var html=$(_self.options.selector.details_content).html()
        html=handlebars.compile(html)(data);

        $(_self.options.selector.details_view).html(html)

    })

}

function getDetails(id, done) {

    $.ajax( {
        type: 'GET',
        url: "/symbol/details/"+id,
        success: function ( response ) {


            done( response )

        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );
            done( err )
        }
    } );
}

module.exports = function ( opt ) {
    return new Symbols( opt )
};
