/**
 * Created by Mikael Lindahl (mikael) on 10/10/16.
 */

'use strict';

let $_ = require( 'jquery' );
let dt = require( 'datatables.net' )( window, $_ );
let dt_bs = require( 'datatables.net-bs' )( window, $_ );
let Util=require('util');
//
//window.$ = $_;
//window.jQuery = $_;
//let chosen = require('chosen-npm')
//let chosen = require('chosen-npm')

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

    $_.ajax( {
        type: 'POST',
        url: "/stack_walk",
        data:{
            crash_id:id
        },
        success: function ( response ) {

            $_('#modal_crash_dumps .modal-body p').html(response.report_html);

            var data = data_table.row( id-1 ).data();
            data[4]=response.report_html
            data_table.row( id-1 ).data(data).draw()

        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );

        }
    } );

}


//
//function symbols( done ) {
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
//
//            done( error )
//        }
//    } );
//
//}


$_( document ).ready( ()=> {

    let id;

    $_('#walk').click(()=>{
        stack_walk(id)
    });

    $_( '#crash_dump_table' )
        .addClass( 'table table-striped table-bordered table-hover' );

    data_table = $_( '#crash_dump_table' ).DataTable( {
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


        //symbols((response)=>{


            //let select=$_("#select_crash_dump")
            //response.forEach((r)=>{
            //
            //    select.append(Util.format('<option value=%s>%s</option>',
            //        r.id+'-'+r.version+'-'+r.debug_file,
            //        r.id+'-'+r.version+'-'+r.debug_file))
            //
            //});
            //
            //
            //$_(".chosen-select").trigger("chosen:updated");
            //select.trigger('chosen:updated')

            id=data[0] //set global

            $_('#modal_crash_dumps_label').html('Crash dump for product '+data[1]+ '  version '+data[2]);
            $_('#modal_crash_dumps .modal-body p').html(data[4]);
        //})




    } );

    $_( '#crash_dump_table' ).css( { display: 'table' } )
    get_crash_dumps();


} );