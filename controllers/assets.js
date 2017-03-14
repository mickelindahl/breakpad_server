/**
 * Created by Mikael Lindahl on 2017-02-13.
 */

'use strict';

const debug = require('debug')('breakpad:controllers:assets');
const Boom = require( 'boom' );
const Browserify = require('browserify');
const fs = require('fs');
const handlebars=require('handlebars');
const path = require('path');
const Sass = require( 'node-sass' );

module.exports={

    getPublic:{
        directory: {
            path: 'public'
        }
    },

    getAppCSS:( request, reply )=> {

        Sass.render( {
            //file: './node_modules/bootstrap/scss/bootstrap.scss',
            file: './styles/app.scss',
        }, ( err, result )=> {

            if ( err ) {
                return reply( Boom.badImplementation( err ) );
            }

            reply( result.css.toString() ).header("Content-type","text/css");

        } );

    },
    //getBootstrapJS:{
    //    directory: {
    //        path: 'node_modules/bootstrap/dist/js'
    //    }
    //},
    //
    //getJqueryJS: {
    //    directory: {
    //        path: 'node_modules/jquery/dist'
    //    }
    //},
    //
    //getTether:{
    //    directory: {
    //        path: 'node_modules/tether/dist'
    //    }
    //},
    //
    //getDataTables:{
    //    directory: {
    //        path: 'node_modules/datatables.net-bs4'
    //    }
    //},

    //getFullCalendarCSS:(request, reply)=>{
    //
    //    let css=fs.readFileSync(path.join( path.resolve(),
    //        'node_modules','fullcalendar' ,'dist', 'fullcalendar.css'), 'binary' ).toString();
    //
    //    reply( css ).header("Content-type","text/css");
    //},

    getBundle:( request, reply )=> {

        debug('request.params', request.params)

        var file = request.params.file;

        let b = Browserify();

        b.add( path.join( path.resolve(), 'bundles/'+file ) );
        b.bundle( ( err, js )=> {

            if ( err ) {
                return reply( Boom.badImplementation( err ) );
            }

            reply( js.toString() )

        } )

    }

}