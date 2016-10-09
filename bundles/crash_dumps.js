/**
 * Created by Mikael Lindahl (mikael) on 10/10/16.
 */

'use strict';

let $_ = require('jquery');
let dt = require( 'datatables.net' )(window, $_);

let data_table;

// Create and dend invite
function get_crash_dumps() {

    var done=function(dumps){

        data_table.clear();

        dumps.forEach(function(v){

            data_table.row.add([v.product, v.version, v.ip, v.user_agent])

        });

        data_table.draw();

    };

    $_.ajax({
        type: 'GET',
        url: "/crash_dumps",
        success: function (response) {

            done(response)

        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            console.log(err);
            alert("Failed!\n\n" + error);
            done(err)
        }
    });
}

$(document).ready(function() {

    data_table=$_('#crash_dump_table').DataTable({
        pageLength:50
    });

    get_crash_dumps()

});