/**
 * Created by Mikael Lindahl (mikael) on 10/10/16.
 */

'use strict';

let $_ = require( 'jquery' );
let dt = require( 'datatables.net' )( window, $_ );
let dt_bs = require( 'datatables.net-bs' )( window, $_ );

let data_table;

// Create and dend invite
function get_crash_dumps() {

    var done = function ( dumps ) {

        data_table.clear();


        dumps.forEach( function ( v ) {

            data_table.row.add( [v.id, v.version, v.ip, v.cpu, v.debug_file, new Date(v.updatedAt), v.file_as_string] )

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

$_( document ).ready( ()=> {

    $_( '#symbol_table' )
        .addClass( 'table table-striped table-bordered table-hover' );

    data_table = $_( '#symbol_table' ).DataTable( {
        pageLength: 50,
        columnDefs: [
            {
                targets: [6],
                visible: false
            }],
        rowCallback(td, data, index){
            td.setAttribute('data-toggle',"modal");
            td.setAttribute('data-target',"#modal_symbol");

        }
    } );
    $_( '#symbol_table tbody' ).on( 'click', 'tr', function () {
        var data = data_table.row( this ).data();

        $_('#modal_symbol_label').html('Symbol file '+data[4]+ ' version '+data[1]);
        $_('#modal_symbol .modal-body p').html(data[6])

    } );

    $_( '#symbol_table' ).css( { display: 'table' } )
    get_crash_dumps()


} );