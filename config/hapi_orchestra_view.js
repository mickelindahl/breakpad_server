/**
 * Created by Mikael Lindahl on 2016-09-16.
 */

'use strict';

module.exports = ( server )=> {

    let options = {
        templates: [
            { id: 'head', param:'head', path:'./common/head.html', compile:true},
            { id: 'nav', param:'nav', path:'./common/head.html', compile:true},
            { id: 'icons', param:'icons', path:'./common/icons.html', compile:true},
            { id: 'footer', param:'footer', path:'./common/footer.html', compile:true},
            { id: 'scripts', param:'scripts', path:'./common/scripts.html', compile:true},
            { id: 'auth', param:'body', path:'./auth.html', compile:true},
            { id: 'crash_dumps', param:'body', path:'./crash_dumps.html', compile:true},
            { id: 'symbols', param:'body', path:'./symbols.html', compile:true}
        ],
            directors: [{id:'director', path:'./director'}],
            views: './views'
    }


    // console.log()

    return server.register( {
        register: require( 'hapi-orchestra-view' ),
        options: options
    } )
};
