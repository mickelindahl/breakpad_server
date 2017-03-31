/**
 * Created by Mikael Lindahl (mikael) on 2/3/17.
 */

'use strict';

global.$ = global.jQuery = require( 'jquery' );
global.Tether = require( 'tether' );
var $ = global.$;

require('bootstrap')

let dt = require( 'datatables.net' )( window, $ );
let dt_bs = require( 'datatables.net-bs4' )( window, $ );

function createTable(options){

    return $( '#'+options.table_id ).DataTable( {
        //ordering: true,
        dom: 'frtip',
        autoWidth:false,
        paging: 50,
        columnDefs:[{
            targets: [0, 1, 2, 3],
            orderSequence: ['desc', 'asc']

        }]
    } );
}

module.exports={
    createTable:createTable
}