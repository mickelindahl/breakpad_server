'use strict';

const debug = require( 'debug' )( 'stake:routes:pages.js' )
const fs = require( 'fs' );
const path = require( 'path' );
const handlebars = require( 'handlebars' );
const Promise = require( 'bluebird' );
const moment = require( 'moment' );

/**
 *
 * - `name` name of body html file
 * - `options` options object with the following keys
 *   - `callbacks` List with callback functions used to set values in options.
 *   Each callback should take the params `(request, options, done)` where
 *   `done`should be called once the option parameter has been set
 *
 *
 * @returns {Promise}
 */
function getHandler( name, options ) {

    /**
     *
     * - `request` hapijs server request object
     *
     * @returns {Promise}
     */
    let evokeCallbacks = ( request ) => {

        let promise = Promise.resolve();

        if ( !(options && options.callbacks) ) {

            return promise

        }

        options.callbacks.forEach( call => {

            promise = promise.then( () => {

                return new Promise( resolve => {
                    console.log( options.callbacks, call );
                    call( request, options, resolve )
                } );

            } )

        } );

        return promise

    };

    return ( request, reply ) => {

        evokeCallbacks( request ).then( () => {

            options = options || {};

            let views = ['head', 'nav', name, 'scripts'];
            let view_options = {};
            let page;

            views.forEach( ( s ) => {

                page = fs.readFileSync( path.join( path.resolve(), 'views/' + s + '.html' ) ).toString();

                if ( s == name ) {
                    s = 'body';
                };

                view_options[s] = handlebars.compile( page )( options );


            } );

            debug(view_options);

            reply.view( 'director', view_options )

        } )
    }
}

module.exports = [

    {

        method: 'GET',
        config: {
            tags: ['api', 'crash_dump'],
            auth: 'jwt'
        },
        path: '/crash-dump',
        handler: getHandler( 'crash_dump', {
            scripts: ["/bundles/crash_dump.js", "/js/crash_dump.js"],
            callbacks: [
                ( request, options, done ) => {

                    request.server.getModel( 'crash_dump' ).find( {
                        select: ['id', 'product', 'version', 'createdAt']
                    } ).then( models => {

                        models.forEach( m => {

                            m.createdAt = moment( m.createdAt ).format( 'YYYY-MM-DD HH:mm' )

                        } );

                        options.crash_dumps = models;

                        debug( models )

                        done()

                    } )

                }]
        } )

    },
];
