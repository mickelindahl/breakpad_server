/**
 * Created by Mikael Lindahl (mikael) on 2/3/17.
 */

'use strict';

let $_ = require( 'jquery' );
let dt = require( 'datatables.net' )( window, $_ );
let dt_bs = require( 'datatables.net-bs4' )( window, $_ );

function createTable(options){

    return $_( '#'+options.table_id ).DataTable( {
        //ordering: true,
        pageLength: 50,
        rowCallback(td, data, index){
            td.setAttribute('data-toggle',"modal")
            td.setAttribute('data-target','#'+options.modal_id );

        },
        initComplete:(settings, json)=>{

            //TODO: move to css
            $_('.dataTables_wrapper .row').addClass('p-2')
            $_('.dataTables_wrapper').addClass('flex-column')

            $_('.dataTables_wrapper .row .col-md-5').removeClass('col-md-5');
            $_('.dataTables_wrapper .row .col-md-7').removeClass('col-md-7');


            $_( '#'+options.table_id).css('display','inline-block');
            $_('.dataTables_wrapper').css('display','flex');


        },
    } );


}




module.exports={
    createTable:createTable
}