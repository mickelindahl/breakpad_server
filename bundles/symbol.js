/**
 * Created by Mikael Lindahl (mikael) on 10/10/16.
 */

'use strict';

let $_ = require( 'jquery' );
let util=require('./lib/util')

let data_table;

// Create and dend invite
function get_crash_dumps() {

    var done = function ( dumps ) {

        data_table.clear();


        dumps.forEach( function ( v ) {

            data_table.row.add( [v.id, v.version, v.debug_file, new Date(v.updated_at)] )

        } );

        data_table.draw();

    };

    $_.ajax( {
        type: 'GET',
        url: "/symbols",
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

// Create and dend invite
function get_symbols() {

    var done = function ( dumps ) {

        data_table.clear();


        dumps.forEach( function ( v ) {

            data_table.row.add( [v.id, v.version, v.debug_file, new Date(v.updated_at)] )

        } );

        data_table.draw();

    };

    $_.ajax( {
        type: 'GET',
        url: "/symbols",
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

function get_symbol_file(id,done) {


    $_.ajax( {
        type: 'GET',
        url: "/symbols/"+id,
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


$_( document ).ready( ()=> {

    $_( '#symbol_table' )
        .addClass( 'table table-striped table-bordered table-hover' );

    data_table = util.createTable({
        table_id:'symbol-table',
        modal_id:'symbol-modal'
    });
    $_( '#symbol-table tbody' ).on( 'click', 'tr', function () {
        var data = data_table.row( this ).data();

        $_('#symbol-modal-label').html('Symbol file <i>'+data[2]+ ' '+data[1]+ '</i>');

        get_symbol_file(data[0], response=>{

            console.log(response)

            //let file=response[0].file
            // file=file ? file.toString() : '';
            //
            // file= file.replace(/(?:\r\n|\r|\n)/g, '<br />');

            $_('#symbol-modal .modal-body p').html(response)

        })

    } );

    $_( '#symbol-table' ).css( { display: 'table' } )
    get_symbols()


} );