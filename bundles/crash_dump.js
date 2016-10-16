/**
 * Created by Mikael Lindahl (mikael) on 10/10/16.
 */

'use strict';

let $_ = require( 'jquery' );
//let dt = require( 'datatables.net' )( window, $_ );
let dt_bs = require( 'datatables.net-bs' )( window, $_ );



let data_table;

// Create and dend invite
function get_crash_dumps() {

    var done = function ( dumps ) {

        data_table.clear();


        dumps.forEach( function ( v ) {

            data_table.row.add( [v.id, v.product, v.version, new Date(v.createdAt), v.report_html ? v.report_html : ''] )

        } );

        data_table.draw();

    };

    $_.ajax( {
        type: 'GET',
        url: "/crash_dumps",
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

    $_( '#crash_dump_table' )
        .addClass( 'table table-striped table-bordered table-hover' );

    data_table = $_( '#crash_dump_table' ).DataTable( {
        //ordering: true,
        pageLength: 50,
        columnDefs: [
            {
                targets: [4],
                visible: false
            }],
        rowCallback(td, data, index){
            td.setAttribute('data-toggle',"modal")
            td.setAttribute('data-target',"#modal_crash_dumps");

        }
    } );
    $_( '#crash_dump_table tbody' ).on( 'click', 'tr', function () {
        var data = data_table.row( this ).data();

            id=data[0] //set global

            $_('#modal_crash_dumps_label').html('Crash dump for <i>'+data[1]+ ' '+data[2]+'</i>');
            $_('#modal_crash_dumps .modal-body p').html(data[4]);
        //})




    } );

    $_( '#crash_dump_table' ).css( { display: 'table' } )
    get_crash_dumps();


} );