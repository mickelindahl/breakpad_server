/**
 * Created by Mikael Lindahl (mikael) on 10/10/16.
 */

'use strict';
let $_ = require( 'jquery' );

let util=require('./lib/util');

let data_table;
let crash_dumps;

function get_crash_dumps() {

    $_.ajax( {
        type: 'GET',
        url: "/crash_dumps",
        success: function ( response ) {

            crash_dumps=response

        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );

        }
    } );
}

function stack_walk(id){


    let symbol_ids=$('#select_crash_dump').val()
        ? $('#select_crash_dump').val()
        : [];

    $_.ajax( {
        type: 'POST',
        url: "/stack_walk",
        data:{
            crash_id:id,
            symbol_ids:JSON.stringify(symbol_ids.map((e)=>{return Number(e)}))
        },
        success: function ( response ) {

            $_('#modal_crash_dumps .modal-body p').html(response.report_html);

            var data = data_table.row( id-1 ).data();
            data[4]=response.report_html;
            data_table.row( id-1 ).data(data).draw()

        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );

        }
    } );

}

$_( document ).ready( ()=> {

    let id;

    $_('#walk').click(()=>{
        stack_walk(id)
    });

    $_( '#crash-dump-table' )
        .addClass( 'table table-striped table-bordered table-hover' );

    data_table = util.createTable({
        table_id:'crash-dump-table',
        modal_id:'crash-dump-modal'
    });

    $_( '#crash-dump-table tbody' ).on( 'click', 'tr', function () {

        let data=crash_dumps[this.getAttribute('row-id')]

        $_('#crash-dump-modal-label').html('Crash dump for <i>'+data.product+ ' '+data.version+'</i>');
        $_('#crash-dump-modal .modal-body p').html(data.report_html);

    } );

    get_crash_dumps();


} );