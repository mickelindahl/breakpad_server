/**
 * Created by Mikael Lindahl on 9/17/16.
 */

'use strict';

const debug=require('debug')('hapi-redirect');

module.exports=(server)=>{

    let options = {
        status_code: "401", // if the statusCode is 401 redirect to /login page/endpoint
        redirect: '/auth'
    };

    return server.register( {
        register: require( 'hapi-redirect' ),
        options: options,
    } )


}