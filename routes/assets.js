'use strict';


const controllers=require('../controllers/assets');

module.exports = [

    // This route is required for serving assets referenced from our html files
    {
        method: 'GET',
        path: '/{files*}',
        handler: controllers.getPublic
    },

    // Convert bootstrap sass to csc
    {
        method: 'GET',
        path: '/styles/app.css',
        handler: controllers.getAppCSS
    },

    //// Bootstrap js
    //{
    //    method: 'GET',
    //    path: '/bootstrap/js/{files*}',
    //    handler: controllers.getBootstrapJS
    //},
    //
    //// Jquery js
    //{
    //    method: 'GET',
    //    path: '/jquery/js/{files*}',
    //    handler:controllers.getJqueryJS
    //},
    //
    //// Tether js - A client-side library to make absolutely positioned
    //// elements attach to elements in the page efficiently.
    //{
    //    method: 'GET',
    //    path: '/tether/{files*}',
    //    handler: controllers.getTether
    //},
    //// Datatables
    //{
    //    method: 'GET',
    //    path: '/datatables.net-bs4/{files*}',
    //    handler: controllers.getDataTables
    //},
    //
    //// Fullcalendar
    //{
    //    method: 'GET',
    //    path: '/fullcalendar/css/fullcalendar.css',
    //    handler: controllers.getFullCalendarCSS
    //},

    // Browserify bundles
    {
        method: 'GET',
        path: '/bundle/{file}',
        handler: controllers.getBundle
    },
];

