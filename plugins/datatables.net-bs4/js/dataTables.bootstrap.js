/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/*!
 DataTables Bootstrap 3 integration
 Â©2011-2015 SpryMedia Ltd - datatables.net/license
 */
(function(b){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(a){return b(a,window,document)}):"object"===typeof exports?module.exports=function(a,d){a||(a=window);if(!d||!d.fn.dataTable)d=require("datatables.net")(a,d).$;return b(d,a,a.document)}:b(jQuery,window,document)})(function(b,a,d){var f=b.fn.dataTable;b.extend(!0,f.defaults,{dom:"<'row'<'col-md-6'l><'col-md-6'f>><'row'<'col-md-12'tr>><'row'<'col-md-5'i><'col-md-7'p>>",renderer:"bootstrap"});b.extend(f.ext.classes,
	{sWrapper:"dataTables_wrapper form-inline dt-bootstrap4",sFilterInput:"form-control input-sm",sLengthSelect:"form-control input-sm",sProcessing:"dataTables_processing panel panel-default",sPageButton:"paginate_button page-item"});f.ext.renderer.pageButton.bootstrap=function(a,h,r,m,j,n){var o=new f.Api(a),s=a.oClasses,k=a.oLanguage.oPaginate,t=a.oLanguage.oAria.paginate||{},e,g,p=0,q=function(d,f){var l,h,i,c,m=function(a){a.preventDefault();!b(a.currentTarget).hasClass("disabled")&&o.page()!=a.data.action&&
o.page(a.data.action).draw("page")};l=0;for(h=f.length;l<h;l++)if(c=f[l],b.isArray(c))q(d,c);else{g=e="";switch(c){case "ellipsis":e="&#x2026;";g="disabled";break;case "first":e=k.sFirst;g=c+(0<j?"":" disabled");break;case "previous":e=k.sPrevious;g=c+(0<j?"":" disabled");break;case "next":e=k.sNext;g=c+(j<n-1?"":" disabled");break;case "last":e=k.sLast;g=c+(j<n-1?"":" disabled");break;default:e=c+1,g=j===c?"active":""}e&&(i=b("<li>",{"class":s.sPageButton+" "+g,id:0===r&&"string"===typeof c?a.sTableId+
"_"+c:null}).append(b("<a>",{href:"#","aria-controls":a.sTableId,"aria-label":t[c],"data-dt-idx":p,tabindex:a.iTabIndex,"class":"page-link"}).html(e)).appendTo(d),a.oApi._fnBindAction(i,{action:c},m),p++)}},i;try{i=b(h).find(d.activeElement).data("dt-idx")}catch(u){}q(b(h).empty().html('<ul class="pagination"/>').children("ul"),m);i&&b(h).find("[data-dt-idx="+i+"]").focus()};return f});
/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
// */
//(function( factory ){
//	if ( typeof define === 'function' && define.amd ) {
//		// AMD
//		define( ['jquery', 'datatables.net'], function ( $ ) {
//			return factory( $, window, document );
//		} );
//	}
//	else if ( typeof exports === 'object' ) {
//		// CommonJS
//		module.exports = function (root, $) {
//			if ( ! root ) {
//				root = window;
//			}
//
//			if ( ! $ || ! $.fn.dataTable ) {
//				// Require DataTables, which attaches to jQuery, including
//				// jQuery if needed and have a $ property so we can access the
//				// jQuery object that is used
//				$ = require('datatables.net')(root, $).$;
//			}
//
//			return factory( $, root, root.document );
//		};
//	}
//	else {
//		// Browser
//		factory( jQuery, window, document );
//	}
//}(function( $, window, document, undefined ) {
//'use strict';
//var DataTable = $.fn.dataTable;
//
//
///* Set the defaults for DataTables initialisation */
//$.extend( true, DataTable.defaults, {
//	dom:
//		"<'row'<'col-sm-6'l><'col-sm-6'f>>" +
//		"<'row'<'col-sm-12'tr>>" +
//		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
//	renderer: 'bootstrap'
//} );
//
//
///* Default class modification */
//$.extend( DataTable.ext.classes, {
//	sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
//	sFilterInput:  "form-control input-sm",
//	sLengthSelect: "form-control input-sm",
//	sProcessing:   "dataTables_processing panel panel-default"
//} );
//
//
///* Bootstrap paging button renderer */
//DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
//	var api     = new DataTable.Api( settings );
//	var classes = settings.oClasses;
//	var lang    = settings.oLanguage.oPaginate;
//	var aria = settings.oLanguage.oAria.paginate || {};
//	var btnDisplay, btnClass, counter=0;
//
//	var attach = function( container, buttons ) {
//		var i, ien, node, button;
//		var clickHandler = function ( e ) {
//			e.preventDefault();
//			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
//				api.page( e.data.action ).draw( 'page' );
//			}
//		};
//
//		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
//			button = buttons[i];
//
//			if ( $.isArray( button ) ) {
//				attach( container, button );
//			}
//			else {
//				btnDisplay = '';
//				btnClass = '';
//
//				switch ( button ) {
//					case 'ellipsis':
//						btnDisplay = '&#x2026;';
//						btnClass = 'disabled';
//						break;
//
//					case 'first':
//						btnDisplay = lang.sFirst;
//						btnClass = button + (page > 0 ?
//							'' : ' disabled');
//						break;
//
//					case 'previous':
//						btnDisplay = lang.sPrevious;
//						btnClass = button + (page > 0 ?
//							'' : ' disabled');
//						break;
//
//					case 'next':
//						btnDisplay = lang.sNext;
//						btnClass = button + (page < pages-1 ?
//							'' : ' disabled');
//						break;
//
//					case 'last':
//						btnDisplay = lang.sLast;
//						btnClass = button + (page < pages-1 ?
//							'' : ' disabled');
//						break;
//
//					default:
//						btnDisplay = button + 1;
//						btnClass = page === button ?
//							'active' : '';
//						break;
//				}
//
//				if ( btnDisplay ) {
//					node = $('<li>', {
//							'class': classes.sPageButton+' '+btnClass,
//							'id': idx === 0 && typeof button === 'string' ?
//								settings.sTableId +'_'+ button :
//								null
//						} )
//						.append( $('<a>', {
//								'href': '#',
//								'aria-controls': settings.sTableId,
//								'aria-label': aria[ button ],
//								'data-dt-idx': counter,
//								'tabindex': settings.iTabIndex
//							} )
//							.html( btnDisplay )
//						)
//						.appendTo( container );
//
//					settings.oApi._fnBindAction(
//						node, {action: button}, clickHandler
//					);
//
//					counter++;
//				}
//			}
//		}
//	};
//
//	// IE9 throws an 'unknown error' if document.activeElement is used
//	// inside an iframe or frame.
//	var activeEl;
//
//	try {
//		// Because this approach is destroying and recreating the paging
//		// elements, focus is lost on the select button which is bad for
//		// accessibility. So we want to restore focus once the draw has
//		// completed
//		activeEl = $(host).find(document.activeElement).data('dt-idx');
//	}
//	catch (e) {}
//
//	attach(
//		$(host).empty().html('<ul class="pagination"/>').children('ul'),
//		buttons
//	);
//
//	if ( activeEl ) {
//		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
//	}
//};
//
//
//return DataTable;
//}));