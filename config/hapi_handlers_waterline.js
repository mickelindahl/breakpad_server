/**
 * Created by Mikael Lindahl on 2016-09-16.
 */

'use strict';

module.exports = ( server )=> {

    let options = {

        log: server.app.log.error,

    }

    // console.log()

    return server.register( {
        register: require( 'hapi-handlers-waterline' ),
        options: options })
}

