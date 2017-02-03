/**
 * Created by Mikael Lindahl (mikael) on 10/14/16.
 */

'use strict';

function symbols( done ) {

    $.ajax( {
        type: 'GET',
        url: "/symbols",
        success: function ( response ) {

            done( response )

        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );

            done( error )
        }
    } );

}


$( document ).ready( ()=> {

    $( '#crash_dump_table tbody' ).on( 'click', 'tr', function () {

        symbols( ( response )=> {

            let select = $( "#select_crash_dump" )
            response.forEach( ( r )=> {

                let s=r.id + '-' + r.version + '-' + r.debug_file;
                select.append('<option value='+r.id+'>'+s+'</option>');

            } );

            select.trigger( "chosen:updated" );
        } );

        //$( '#select_crash_dump' ).chosen();
    } );

    $('#clear_select').click(()=>{
        $( '#select_crash_dump' ).val(null)
        $( '#select_crash_dump' ).trigger( "chosen:updated" );
    })


    $( '#select_crash_dump' ).chosen();
    $( '.chosen-container' ).css( { width: '60%' } )
} );