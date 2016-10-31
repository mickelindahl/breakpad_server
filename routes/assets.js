'use strict';

const Path = require( 'path' );
const Browserify = require( 'browserify' );
const Boom = require( 'boom' );
const debug = require( 'debug' )( 'breakpad:crash_dump.js' )
const Sass = require( 'node-sass' );

module.exports = [

    // This route is required for serving assets referenced from our html files
    {
        method: 'GET',
        path: '/test',
        config: { auth: 'jwt' },
        handler: function ( request, reply ) {

            reply.view( 'bootstrap_datatables_test.html' );

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

    // This route is required for serving assets referenced from our html files
    {
        method: 'GET',
        path: '/',
        config: {
            tags: ['api', 'crash_dump'],
            auth: 'jwt'
        },
        handler: function ( request, reply ) {

            reply.redirect( '/crash_dumps/view' );

        }
    },

    // This route is required for serving assets referenced from our html files
    {
        method: 'GET',
        path: '/chosen/{files*}',
        handler: {
            directory: {
                path: 'node_modules/chosen-npm/public/'
            }
        }
    },

    // Browserify bundles
    {
        method: 'GET',
        path: '/bundles/{bundle*}',
        handler: ( request, reply )=> {

            let bundle_file = request.params.bundle;
            let b = Browserify();

            b.add( Path.join( Path.resolve(), 'bundles', bundle_file ) );
            b.bundle( ( err, js )=> {

                if ( err ) {
                    return reply( Boom.badImplementation( err ) );
                }

                reply( js.toString() )

            } )

        }
    },

    // Browserify bundles
    {
        method: 'GET',
        path: '/bootstrap/css/bootstrap.css',
        handler: ( request, reply )=> {

            Sass.render( {
                //file: './node_modules/bootstrap/scss/bootstrap.scss',
                file: './styles/app.scss',
            }, ( err, result )=> {

                if ( err ) {
                    return reply( Boom.badImplementation( err ) );
                }

                reply( result.css.toString() ).header("Content-type","text/css");

            } );

        }
    }
];

