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
			"viewportSelector" : ".viewport",
			"panelSelector" : ".panel",
			"caroSliderSelector" : ".panel-list",
			"nextPrevCtrlsSelector" : ".next-prev-ctrls",
			"nextTriggerSelector" : ".item-next",
			"prevTriggerSelector" : ".item-prev",
			"listItemSelector" : ".item",
			"triggerSelector" : ".trigger",
			"thumbnailNavSelector" : ".thumbnail-nav",
			"thumbLinkSelector" : ".thumb-link",
			"activeStateSelector" : ".active",
			"inactiveStateSelector" : ".inactive",
			// CONSTANTS
			"SELECTOR_STRIP_REGEX" : /^[\.|#]?/,
			"SELECTOR_IN_STRING_REGEX" : /[A-Za-z_-]+Selector/,
			"SELECTOR_STRING_REGEX" : /Selector/,
			// CONTENT
			"nextPrevContent" : [{"selector":"prev", "marker" : "&lt;"}, {"selector":"next", "marker" : "&gt;"}]
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
			panelsLength : elems.$panels.length,
			panelWidth : elems.$panels[0].offsetWidth,
			panelHeight : elems.$panels[0].offsetHeight,
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
			// Lift out the selectors from the config and make them classes that we can apply to markup
			this.createClassNameObject();
			// Set up markup
			this.intialiseMarkup();
			// Bind our events to the triggers
			this.bindEvents();
			// Handle active stae
			this.handleActiveState();
		},
		createClassNameObject : function() {
			var classNames = {};
			for ( var item in this.config ) {
				if ( this.config.hasOwnProperty( item ) ) {
					var newKey = '',
						newValue = '',
						currentKey = item,
						currentValue = this.config[item];
					// Test the key to see if it has the suffix selector
					if ( this.config.SELECTOR_IN_STRING_REGEX.test( currentKey ) ) {
						// Replace the word Selector with Class in the key
						newKey = currentKey.replace( this.config.SELECTOR_STRING_REGEX, '' );
						// Strip out the selector type from the class name
						newValue = currentValue.replace( this.config.SELECTOR_STRIP_REGEX, '' );
						// Assign new values to our class name object
						classNames[newKey] = newValue;
					}
				}
			}
			this.classNames = classNames;
		},
		intialiseMarkup : function () {
			// Set caro inner width to be total sum of panels widths
			this.setSliderWidth();
			// Wrap the slider elem in a restricted viewport 
			this.wrapInViewport();
			// Set up thumbnails & next/prev controls
			this.generateControls();
			// Add the controls to the DOM 
			this.addCtrlsToDom();
			// Cache our triggers for the event binding to pickup on
			this.cacheTriggers();
			return;
		},
		calcSliderWidth : function () {
			return ( this.numbers.panelsLength * this.numbers.panelWidth )
		},
		setSliderWidth : function () {
			this.elems.$caroSlider[0].style.width = ( this.calcSliderWidth() + 'px' );
		},
		wrapInViewport : function () {
			var $caroSlider = this.elems.$caroSlider,
				viewport = document.createElement( 'div' );
			
			viewport.style.width = ( this.numbers.panelWidth + 'px' );
			viewport.style.height = ( this.numbers.panelHeight + 'px' );
			$(viewport).addClass( this.classNames.viewport );
			$caroSlider.wrap( viewport );
		},
		generateControls : function () {
			var elems = this.elems,
				config = this.config;
			// Generate the controls
			elems.$nextPrevCtrls = this.buildNextPrevCtrl();
			elems.$thumbnailNav = this.buildThumbnailNav();
		},
		buildNextPrevCtrl : function () {
			var classNames = this.classNames,
				nextPrevCtrls = '<ul class="' + classNames.nextPrevCtrls + '">',
				nextPrevContent = this.config.nextPrevContent;
			// Make our pagination ctrls and add them to the list.
			for ( var i = 0; i < nextPrevContent.length; i += 1 ) {
				var thisItem = nextPrevContent[i];
				var li = '<li class="' + classNames.listItem + ' ' + classNames.listItem + '-' + thisItem.selector + '"><a href="#" class="' + classNames.trigger + ' ' + classNames.trigger + '-' + thisItem.selector + '">' + thisItem.marker + '</a></li>';
				nextPrevCtrls += li;
			}
			return $(nextPrevCtrls += '</ul>');
		},
		buildThumbnailNav : function () {
			var classNames = this.classNames,
			thumbNav = '<ul class="' + classNames.thumbnailNav + '">';
			for ( var i = 0; i < this.numbers.panelsLength; i += 1 ) {
				thumbNav += '<li class="' + classNames.listItem + '"><a class="' + classNames.trigger + '" href="#" data-index="' + i + '"></a></li>'
			}
			thumbNav += '</ul>';
			return $(thumbNav);
		},
		addCtrlsToDom : function () {
			var $ctrls = this.elems.$thumbnailNav.add( this.elems.$nextPrevCtrls );
			this.elems.$el.append( $ctrls );
		},
		cacheTriggers : function () {
			var elems = this.elems;
			elems.$prevTrigger = elems.$nextPrevCtrls.find( this.config.prevTriggerSelector );
			elems.$nextTrigger = elems.$nextPrevCtrls.find( this.config.nextTriggerSelector );
			elems.$thumbnailCollection = elems.$thumbnailNav.find( this.config.triggerSelector );
		},
		// END - CARO SET UP
		//
		// START - CARO MOVEMENT
		showPrevItem : function () {
			var currentIndex = parseInt( this.numbers.currentIndex );
			this.getDestination( currentIndex -= 1 );
			this.moveCaro();
		},
		showNextItem : function () {
			var currentIndex = parseInt( this.numbers.currentIndex );
			this.getDestination( currentIndex += 1 );
			this.moveCaro();
		},
		onThumbClick : function ( evnt ) {
			var targetIndex = $(evnt.currentTarget).data( 'index' );
			this.getDestination( targetIndex );
			this.moveCaro();
		},
		getDestination : function ( locCalc ) {
			var itemsInCaro = ( this.numbers.panelsLength - 1 );
			var	destination = ( locCalc <= itemsInCaro ) && ( locCalc > -1 ) ? locCalc : this.numbers.currentIndex;
			return this.numbers.destination = destination;
		},
		moveCaro : function () {
			var sliderElem = this.elems.$caroSlider,
				itemWidth = this.numbers.panelWidth,
				scrollSpeed = this.config.scrollSpeed,
				newXpos;

			this.numbers.prevIndex = this.numbers.currentIndex;
			this.numbers.currentIndex = this.numbers.destination;

			newXpos = (!this.config.vertical) ? (itemWidth * this.numbers.currentIndex) : 0;
			
			sliderElem.animate({
				left : -newXpos
			}, scrollSpeed, this.handleActiveState.call( this ) );
		},
		handleActiveState : function () {
			this.handlePaginationState();
			this.handleThumbNavState();
		},
		handlePaginationState : function () {
			if ( this.numbers.prevIndex === this.numbers.currentIndex ) {
				return false;
			}
			var atTheStart = ( this.numbers.currentIndex === 0 ),
				atTheEnd = ( this.numbers.currentIndex === ( this.numbers.panelsLength - 1 ) ),
				prevIndexWasStart = ( this.numbers.prevIndex === 0 ),
				prevIndexWasEnd = ( this.numbers.prevIndex === ( this.numbers.panelsLength - 1 ) );
			
			if ( atTheStart ) {
				if ( this.elems.$nextTrigger.hasClass( this.classNames.inactiveState ) ) {
					this.elems.$nextTrigger.removeClass( this.classNames.inactiveState );
				}
				this.elems.$prevTrigger.addClass( this.classNames.inactiveState );
			} else if ( atTheEnd ) {
				if ( this.elems.$prevTrigger.hasClass( this.classNames.inactiveState ) ) {
					this.elems.$prevTrigger.removeClass( this.classNames.inactiveState );
				}
				this.elems.$nextTrigger.addClass( this.classNames.inactiveState );
			} else {
				if ( this.elems.$prevTrigger.hasClass( this.classNames.inactiveState ) ) {
					this.elems.$prevTrigger.removeClass( this.classNames.inactiveState );
				}
				if ( this.elems.$nextTrigger.hasClass( this.classNames.inactiveState ) ) {
					this.elems.$nextTrigger.removeClass( this.classNames.inactiveState );
				}
			}
		},
		handleThumbNavState : function () {
			this.elems.$thumbnailCollection.removeClass( this.classNames.activeState );
			$( this.elems.$thumbnailCollection[ this.numbers.currentIndex ] ).addClass( this.classNames.activeState );
		},
		// END - CARO MOVEMENT
		//
		// START - HELPERS
		bindEvents : function () {
			var elems = this.elems;
			// Prev button event binding
			elems.$prevTrigger.on( 'click', this._setupEventHandler( this.showPrevItem ) );
			// Next button event binding
			elems.$nextTrigger.on( 'click', this._setupEventHandler( this.showNextItem ) );
			// Attach clicks to thumbnails
			for ( var i = 0; i < elems.$thumbnailCollection.length; i += 1 ) {
				$(elems.$thumbnailCollection[ i ]).on( 'click', this._setupEventHandler( this.onThumbClick ) );
			}
		},
		_setupEventHandler : function(method){
			var that = this;
			return function( evt ){
				evt.preventDefault();
				return method.call(that, evt);
			};
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








