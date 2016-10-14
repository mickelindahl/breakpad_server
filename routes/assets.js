'use strict';

const Path = require( 'path' );
const Browserify = require( 'browserify' );
const Fs = require('fs');
const Handlebars =require('handlebars');
const debug = require('debug')('breakpad:crash_dump.js')

module.exports = [
    // This route is required for serving assets referenced from our html files
    {
        method: 'GET',
        path: '/',
        config: { auth: 'jwt' },
        handler: function ( request, reply ) {

            let head = Fs.readFileSync(Path.join(Path.resolve(),'views/head.html')).toString();
            let nav = Fs.readFileSync(Path.join(Path.resolve(),'views/nav.html')).toString();

            head= Handlebars.compile(head)({title:'Crash dumps'});
            nav = Handlebars.compile(nav)({crash_dump:'bajs'});

            reply.view( 'crash_dump', {
                head:head,
                nav:nav
            } );

        }
    },
    {
        method: 'GET',
        path: '/symbols/view',
        config: { auth: 'jwt' },
        handler: function ( request, reply ) {

            let head = Fs.readFileSync(Path.join(Path.resolve(),'views/head.html')).toString();
            let nav = Fs.readFileSync(Path.join(Path.resolve(),'views/nav.html')).toString();

            head= Handlebars.compile(head)({title:'Login'});
            nav= Handlebars.compile(nav);

            reply.view( 'symbol', {
                head:head,
                nav:nav
            } );

        }
    },

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
        handler: (request, reply)=>{

            let bundle_file=request.params.bundle;
            let b = Browserify();

            console.log(Path.join(Path.resolve(),'bundles',bundle_file))

            b.add(Path.join(Path.resolve(),'bundles',bundle_file));
            b.bundle((err, js)=> {

                if (err){
                    return reply(Boom.badImplementation(err));
                }

                reply(js.toString())

            })

            }

    }
];

