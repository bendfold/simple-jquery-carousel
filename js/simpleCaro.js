;(function($){
	'use strict';
	function JqCaro(el,opts){
		if(!el.length){
			return false;
		}
		opts = (opts === undefined) ? {} : opts;
		// Default setup
		var defaults = {
			"scrollSpeed" : 600,
			"vendorPrefixes" : this.setVendorPrefix(),
			"panelSelector" : ".panel",
			"caroSliderSelector" : ".profile-list"
		},
		// Merge default settings with user specified options
		config = $.extend({}, defaults, opts),
		// Intialise global helper objects
		numbers = {},
		elems = {},
		// Cache elements
		$el = el;
		// Build up the elems object & add to this
		elems = {
			$el : $el,
			$panels : $el.find( config.panelSelector ),
			$caroSlider : $el.find( config.caroSliderSelector )
		};
		// Build up numbers object
		numbers = {
			scrollSpeed : config.scrollSpeed,
			caroWrapWidth : elems.$el.outerWidth(),
			panelsLength : elems.$panels.length,
			currentIndex : 0
		};
		// Make helper objects available to rest of the methods
		this.config = config;
		this.numbers = numbers;
		this.elems = elems;
		// Lets get this shit started
		this.init();
		return this;
	}
	// Build up methods object
	var methods = {
		// START - CARO SET UP
		init : function(){
			// Set up markup
			this.intialiseMarkup();
			// Bind events
			this.bindEvents();
		},
		// START - CARO SET UP
		intialiseMarkup : function () {
			// Set panel width
			this.setPanelWidth();
			// Set caro inner width to be total sum of panels widths
			this.setSliderWidth();
			// Wrap the slider elem in a restricted viewport 
			this.wrapInViewport();
		},
		calcSliderWidth : function () {
			return ( this.numbers.panelsLength * this.numbers.caroWrapWidth )
		},
		setPanelWidth : function(){
			for ( var i = 0; i < this.numbers.panelsLength; i += 1 ) {
				this.elems.$panels[i].style.width = ( this.numbers.caroWrapWidth + 'px' );
			}
			return true;
		},
		setSliderWidth : function () {
			this.elems.$caroSlider[0].style.width = ( this.calcSliderWidth() + 'px' );
		},
		wrapInViewport : function () {
			var $caroSlider = this.elems.$caroSlider,
				viewport = document.createElement( 'div' );
			
			viewport.style.width = ( this.numbers.caroWrapWidth + 'px' );
			// TODO - lift class name out to config, selector stripper
			viewport.classList.add('viewport');
			$caroSlider.wrap( viewport );
		},
		// END - CARO SET UP
		//
		// START - HELPERS
		bindEvents : function () {
			// var elems = this.elems;
			// // Prev button event binding
			// elems.$prevBtn.on( 'click', this._setupEventHandler( this.showPrevItem ) );
			// // Next button event binding
			// elems.$nextBtn.on( 'click', this._setupEventHandler( this.showNextItem ) );
			// // Attach clicks to thumbnails
			// for ( var i = 0; i < elems.$thumbnailCollection.length; i += 1 ) {
			// 	$(elems.$thumbnailCollection[ i ]).on( 'click', this._setupEventHandler( this.onThumbClick ) );
			// }
		},
		_setupEventHandler : function(method){
			var that = this;
			return function( evt ){
				evt.preventDefault();
				if ( that.config.autoScroll === true ) {
					that.autoScrollStop();
				}
				return method.call(that, evt);
			};
		},
		setVendorPrefix : function ( ) {
			var vendorPrefixes = {
					"transitionAttributePrefix" : ["transition", "msTransition", "MozTransition", "webkitTransition", "OTransition"],
					"transformAttributePrefix" : ["transform", "msTransform", "MozTransform", "webkitTransform", "OTransform"],
					"transformPrefix" : ["transform", "-ms-transform", "-moz-transform", "-webkit-transform", "-o-transform"]
				};
			for ( var item in vendorPrefixes ) {
				if( vendorPrefixes.hasOwnProperty( item ) ){
					var prefix = this.getVendorPrefix( vendorPrefixes[item] );
					vendorPrefixes[item] = prefix;
				}
			}
			return vendorPrefixes;
		},
		getVendorPrefix : function ( prefixCollection ) {
			// Adapted from http://www.developerdrive.com/2012/03/coding-vendor-prefixes-with-javascript/
			var tmp = document.createElement( "div" ),
				result = "";
			for ( var i = 0; i < prefixCollection.length; i+=1 ) {
				if ( typeof tmp.style[ prefixCollection[i] ] !== 'undefined' ) {
					result = prefixCollection[i];
				}
			}
			return result;
		}
		// END - HELPERS
	};

	// Helper function to stack methods onto prototype chain
	function addToProtype( className, objectCollection ) {
		for( var key in objectCollection ){
			if ( objectCollection.hasOwnProperty(key) ) {
				className.prototype[key] = objectCollection[key];
			}
		}
	}

	// Add methods onto the OuiCaro class
	addToProtype( JqCaro, methods );
	// Create an instance of ouiCaro as a jQuery plugin
	$.fn.jqCaro = function(opts){
		return this.each(function(){
			var config = opts ? opts : $(this).data('jqCaro');
			this.jqCaro = new JqCaro($(this),config);
		});
	};
})(jQuery);

;(function($){
	$(document).ready(function(){
		$('#JqCaro').jqCaro();
	});
})(jQuery);








