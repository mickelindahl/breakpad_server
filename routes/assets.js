'use strict';

const fs = require( 'fs' );
const path = require( 'path' );

module.exports = [
    // This route is required for serving assets referenced from our html files
    {
        method: 'GET',
        path: '/',
        config: { auth: 'jwt' },
        handler: function ( request, reply ) {

            reply.view( 'index', {
                test: 'bokeh/bar.html'
            } );

        }
    },

    {
        method: 'GET',
        path: '/bokeh/{files*}',
        config: { auth: 'jwt' },
        handler: {
            directory: {
                path: 'python/html'
            }
        }
    },

    // This route is required for serving assets referenced from our html files
    {
        method: 'GET',
        path: '/{files*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    },

];

