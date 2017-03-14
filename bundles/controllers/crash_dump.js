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
var crash_dumps;
var _self;

function CrashDump(options){

    this.options=options;
    _self=this;

    data_table = util.createTable({
            table_id:'crash-dump-table',
            modal_id:'crash-dump-modal'
        });


    $('body').on('click', '#walk', function(){

        $('body').trigger('walk')

    })


    this.event={
        show:Rx.Observable.fromEvent( $( 'tbody' ), 'click' ),
        walk:Rx.Observable.fromEvent( $( 'body' ), 'walk' )
    };

    this.event.show.subscribe(this.viewDetails);
    this.event.walk.subscribe(stackWalk);
}


CrashDump.prototype.viewDetails=function (x) {

    var id= $(x.target).closest('tr').attr('row-id')

    getDetails(id, function(data){

        if (data==null){

            alert('Data missing...');
            return
        }


        var html=$(_self.options.selector.details_content).html()
        html=handlebars.compile(html)(data);

        $(_self.options.selector.details_view).html(html)




        //$('#crash-dump-modal-label').html('Crash dump for <i>'+data.product+ ' '+data.version+'</i>');
        //$('#crash-dump-modal .modal-body p').html(data.report_html);


    })




}

function getDetails(id, done) {

    $.ajax( {
        type: 'GET',
        url: "/crash_dumps/details/"+id,
        success: function ( response ) {

            //crash_dumps=response
            done(response)

        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );
            done(null)

        }
    } );
}


function destroy(id) {

    $.ajax( {
        type: 'DELETE',
        url: "/crash_dumps/"+id,
        success: function ( response ) {

            //crash_dumps=response
            done(response)

        },
        error: function ( xhr, status, error ) {
            var err = eval( "(" + xhr.responseText + ")" );
            console.log( err );
            alert( "Failed!\n\n" + error );
            done(null)

        }
    } );
}


function stackWalk(x){

    var id = $('#walk').attr('crash-dump-id')

    let symbol_id=$('#select_crash_dump').val()
        ? $('#select_crash_dump').val()
        : [];

    $.ajax( {
        type: 'POST',
        url: "/stack_walk",
        data:{
            crash_id:id,
            symbol_ids:JSON.stringify([symbol_id].map((e)=>{return Number(e)}))
        },
        success: function ( response ) {

            $('#crash-dump-view .modal-body p').html(response.report_html);

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

module.exports = function ( opt ) {
    return new CrashDump( opt )
};


//$_( document ).ready( ()=> {
//
//    let id;
//
//    $_('#walk').click(()=>{
//        stack_walk(id)
//    });
//
//    $_( '#crash-dump-table' )
//        .addClass( 'table table-striped table-bordered table-hover' );
//
//    data_table = util.createTable({
//        table_id:'crash-dump-table',
//        modal_id:'crash-dump-modal'
//    });
//
//
//
//    get_crash_dumps();
//
//
//} );