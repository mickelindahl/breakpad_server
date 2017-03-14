/**
 * Created by Mikael Lindahl (mikael) on 10/10/16.
 */

'use strict';

global.$ = global.jQuery = require( 'jquery' );
global.Tether = require( 'tether' );
var $ = global.$;

require('bootstrap')

var handlebars=require('handlebars')
var Rx = require( 'rxjs' );

var util=require('./../lib/util');

var data_table;
var _self;

function Symbols(options) {

    this.options = options;
    _self = this;

    data_table = util.createTable( {
        table_id: 'crash-dump-table',
        modal_id: 'crash-dump-modal'
    } );

    this.event={
        show:Rx.Observable.fromEvent( $( 'tbody' ), 'click' )
    };

    this.event.show.subscribe(this.viewDetails);
}

//// Create and dend invite
//function viewDetails() {
//
//    var done = function ( dumps ) {
//
//        data_table.clear();
//
//
//        dumps.forEach( function ( v ) {
//
//            data_table.row.add( [v.id, v.version, v.debug_file, new Date(v.updated_at)] )
//
//        } );
//
//        data_table.draw();
//
//    };
//
//    $_.ajax( {
//        type: 'GET',
//        url: "/symbols/{id}",
//        success: function ( response ) {
//
//            done( response )
//
//        },
//        error: function ( xhr, status, error ) {
//            var err = eval( "(" + xhr.responseText + ")" );
//            console.log( err );
//            alert( "Failed!\n\n" + error );
//            done( err )
//        }
//    } );
//}
//
//// Create and dend invite
//function get_symbols() {
//
//    var done = function ( dumps ) {
//
//        data_table.clear();
//
//
//        dumps.forEach( function ( v ) {
//
//            data_table.row.add( [v.id, v.version, v.debug_file, new Date(v.updated_at)] )
//
//        } );
//
//        data_table.draw();
//
//    };
//
//    $_.ajax( {
//        type: 'GET',
//        url: "/symbols",
//        success: function ( response ) {
//
//            done( response )
//
//        },
//        error: function ( xhr, status, error ) {
//            var err = eval( "(" + xhr.responseText + ")" );
//            console.log( err );
//            alert( "Failed!\n\n" + error );
//            done( err )
//        }
//    } );
//}
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


//$_( document ).ready( ()=> {
//
//    $_( '#symbol_table' )
//        .addClass( 'table table-striped table-bordered table-hover' );
//
//    data_table = util.createTable({
//        table_id:'symbol-table',
//        modal_id:'symbol-modal'
//    });
//    $_( '#symbol-table tbody' ).on( 'click', 'tr', function () {
//        var data = data_table.row( this ).data();
//
//        $_('#symbol-modal-label').html('Symbol file <i>'+data[2]+ ' '+data[1]+ '</i>');
//
//        get_symbol_file(data[0], response=>{
//
//            console.log(response)
//
//            //let file=response[0].file
//            // file=file ? file.toString() : '';
//            //
//            // file= file.replace(/(?:\r\n|\r|\n)/g, '<br />');
//
//            $_('#symbol-modal .modal-body p').html(response)
//
//        })
//
//    } );
//
//    $_( '#symbol-table' ).css( { display: 'table' } )
//    get_symbols()
//
//
//} );

module.exports = function ( opt ) {
    return new Symbols( opt )
};
