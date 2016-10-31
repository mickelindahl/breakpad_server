/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */

'use strict';

module.exports = {

    identity: 'symbol',
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
        cpu:'string',
        ip: 'string',
        os: 'string',
        version: 'string',
        code_file: 'string',
        debug_file: 'string',
        debug_identifier: 'string',
        user_agent:'string',
        file: 'binary',
        created_at: {
            //columnName: 'cre_dt',
            type: 'datetime',
            defaultsTo: function() {return new Date();}
        },
        updated_at: {
            //columnName: 'cre_dt',
            type: 'datetime',
            defaultsTo: function() {return new Date();}
        },
        //created_at:'datetime',
        //updated_at:'datetime',
    },
    beforeUpdate:(values, cb)=>{
        values.updated_at=new Date();

        console.log(values)

        cb()
    }
};