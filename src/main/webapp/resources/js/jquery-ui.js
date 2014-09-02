/*! jQuery UI - v1.10.4 - 2014-01-17
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.slider.js, jquery.ui.sortable.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.10.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click."+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

})(jQuery);
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

}( jQuery ) );
(function( $, undefined ) {

var uid = 0,
	hideProps = {},
	showProps = {};

hideProps.height = hideProps.paddingTop = hideProps.paddingBottom =
	hideProps.borderTopWidth = hideProps.borderBottomWidth = "hide";
showProps.height = showProps.paddingTop = showProps.paddingBottom =
	showProps.borderTopWidth = showProps.borderBottomWidth = "show";

$.widget( "ui.accordion", {
	version: "1.10.4",
	options: {
		active: 0,
		animate: {},
		collapsible: false,
		event: "click",
		header: "> li > :first-child,> :not(li):even",
		heightStyle: "auto",
		icons: {
			activeHeader: "ui-icon-triangle-1-s",
			header: "ui-icon-triangle-1-e"
		},

		// callbacks
		activate: null,
		beforeActivate: null
	},

	_create: function() {
		var options = this.options;
		this.prevShow = this.prevHide = $();
		this.element.addClass( "ui-accordion ui-widget ui-helper-reset" )
			// ARIA
			.attr( "role", "tablist" );

		// don't allow collapsible: false and active: false / null
		if ( !options.collapsible && (options.active === false || options.active == null) ) {
			options.active = 0;
		}

		this._processPanels();
		// handle negative values
		if ( options.active < 0 ) {
			options.active += this.headers.length;
		}
		this._refresh();
	},

	_getCreateEventData: function() {
		return {
			header: this.active,
			panel: !this.active.length ? $() : this.active.next(),
			content: !this.active.length ? $() : this.active.next()
		};
	},

	_createIcons: function() {
		var icons = this.options.icons;
		if ( icons ) {
			$( "<span>" )
				.addClass( "ui-accordion-header-icon ui-icon " + icons.header )
				.prependTo( this.headers );
			this.active.children( ".ui-accordion-header-icon" )
				.removeClass( icons.header )
				.addClass( icons.activeHeader );
			this.headers.addClass( "ui-accordion-icons" );
		}
	},

	_destroyIcons: function() {
		this.headers
			.removeClass( "ui-accordion-icons" )
			.children( ".ui-accordion-header-icon" )
				.remove();
	},

	_destroy: function() {
		var contents;

		// clean up main element
		this.element
			.removeClass( "ui-accordion ui-widget ui-helper-reset" )
			.removeAttr( "role" );

		// clean up headers
		this.headers
			.removeClass( "ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top" )
			.removeAttr( "role" )
			.removeAttr( "aria-expanded" )
			.removeAttr( "aria-selected" )
			.removeAttr( "aria-controls" )
			.removeAttr( "tabIndex" )
			.each(function() {
				if ( /^ui-accordion/.test( this.id ) ) {
					this.removeAttribute( "id" );
				}
			});
		this._destroyIcons();

		// clean up content panels
		contents = this.headers.next()
			.css( "display", "" )
			.removeAttr( "role" )
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-labelledby" )
			.removeClass( "ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled" )
			.each(function() {
				if ( /^ui-accordion/.test( this.id ) ) {
					this.removeAttribute( "id" );
				}
			});
		if ( this.options.heightStyle !== "content" ) {
			contents.css( "height", "" );
		}
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {
			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "event" ) {
			if ( this.options.event ) {
				this._off( this.headers, this.options.event );
			}
			this._setupEvents( value );
		}

		this._super( key, value );

		// setting collapsible: false while collapsed; open first panel
		if ( key === "collapsible" && !value && this.options.active === false ) {
			this._activate( 0 );
		}

		if ( key === "icons" ) {
			this._destroyIcons();
			if ( value ) {
				this._createIcons();
			}
		}

		// #5332 - opacity doesn't cascade to positioned elements in IE
		// so we need to add the disabled class to the headers and panels
		if ( key === "disabled" ) {
			this.headers.add( this.headers.next() )
				.toggleClass( "ui-state-disabled", !!value );
		}
	},

	_keydown: function( event ) {
		if ( event.altKey || event.ctrlKey ) {
			return;
		}

		var keyCode = $.ui.keyCode,
			length = this.headers.length,
			currentIndex = this.headers.index( event.target ),
			toFocus = false;

		switch ( event.keyCode ) {
			case keyCode.RIGHT:
			case keyCode.DOWN:
				toFocus = this.headers[ ( currentIndex + 1 ) % length ];
				break;
			case keyCode.LEFT:
			case keyCode.UP:
				toFocus = this.headers[ ( currentIndex - 1 + length ) % length ];
				break;
			case keyCode.SPACE:
			case keyCode.ENTER:
				this._eventHandler( event );
				break;
			case keyCode.HOME:
				toFocus = this.headers[ 0 ];
				break;
			case keyCode.END:
				toFocus = this.headers[ length - 1 ];
				break;
		}

		if ( toFocus ) {
			$( event.target ).attr( "tabIndex", -1 );
			$( toFocus ).attr( "tabIndex", 0 );
			toFocus.focus();
			event.preventDefault();
		}
	},

	_panelKeyDown : function( event ) {
		if ( event.keyCode === $.ui.keyCode.UP && event.ctrlKey ) {
			$( event.currentTarget ).prev().focus();
		}
	},

	refresh: function() {
		var options = this.options;
		this._processPanels();

		// was collapsed or no panel
		if ( ( options.active === false && options.collapsible === true ) || !this.headers.length ) {
			options.active = false;
			this.active = $();
		// active false only when collapsible is true
		} else if ( options.active === false ) {
			this._activate( 0 );
		// was active, but active panel is gone
		} else if ( this.active.length && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			// all remaining panel are disabled
			if ( this.headers.length === this.headers.find(".ui-state-disabled").length ) {
				options.active = false;
				this.active = $();
			// activate previous panel
			} else {
				this._activate( Math.max( 0, options.active - 1 ) );
			}
		// was active, active panel still exists
		} else {
			// make sure active index is correct
			options.active = this.headers.index( this.active );
		}

		this._destroyIcons();

		this._refresh();
	},

	_processPanels: function() {
		this.headers = this.element.find( this.options.header )
			.addClass( "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all" );

		this.headers.next()
			.addClass( "ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom" )
			.filter(":not(.ui-accordion-content-active)")
			.hide();
	},

	_refresh: function() {
		var maxHeight,
			options = this.options,
			heightStyle = options.heightStyle,
			parent = this.element.parent(),
			accordionId = this.accordionId = "ui-accordion-" +
				(this.element.attr( "id" ) || ++uid);

		this.active = this._findActive( options.active )
			.addClass( "ui-accordion-header-active ui-state-active ui-corner-top" )
			.removeClass( "ui-corner-all" );
		this.active.next()
			.addClass( "ui-accordion-content-active" )
			.show();

		this.headers
			.attr( "role", "tab" )
			.each(function( i ) {
				var header = $( this ),
					headerId = header.attr( "id" ),
					panel = header.next(),
					panelId = panel.attr( "id" );
				if ( !headerId ) {
					headerId = accordionId + "-header-" + i;
					header.attr( "id", headerId );
				}
				if ( !panelId ) {
					panelId = accordionId + "-panel-" + i;
					panel.attr( "id", panelId );
				}
				header.attr( "aria-controls", panelId );
				panel.attr( "aria-labelledby", headerId );
			})
			.next()
				.attr( "role", "tabpanel" );

		this.headers
			.not( this.active )
			.attr({
				"aria-selected": "false",
				"aria-expanded": "false",
				tabIndex: -1
			})
			.next()
				.attr({
					"aria-hidden": "true"
				})
				.hide();

		// make sure at least one header is in the tab order
		if ( !this.active.length ) {
			this.headers.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active.attr({
				"aria-selected": "true",
				"aria-expanded": "true",
				tabIndex: 0
			})
			.next()
				.attr({
					"aria-hidden": "false"
				});
		}

		this._createIcons();

		this._setupEvents( options.event );

		if ( heightStyle === "fill" ) {
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).each(function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			});

			this.headers.each(function() {
				maxHeight -= $( this ).outerHeight( true );
			});

			this.headers.next()
				.each(function() {
					$( this ).height( Math.max( 0, maxHeight -
						$( this ).innerHeight() + $( this ).height() ) );
				})
				.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.headers.next()
				.each(function() {
					maxHeight = Math.max( maxHeight, $( this ).css( "height", "" ).height() );
				})
				.height( maxHeight );
		}
	},

	_activate: function( index ) {
		var active = this._findActive( index )[ 0 ];

		// trying to activate the already active panel
		if ( active === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the currently active header
		active = active || this.active[ 0 ];

		this._eventHandler({
			target: active,
			currentTarget: active,
			preventDefault: $.noop
		});
	},

	_findActive: function( selector ) {
		return typeof selector === "number" ? this.headers.eq( selector ) : $();
	},

	_setupEvents: function( event ) {
		var events = {
			keydown: "_keydown"
		};
		if ( event ) {
			$.each( event.split(" "), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			});
		}

		this._off( this.headers.add( this.headers.next() ) );
		this._on( this.headers, events );
		this._on( this.headers.next(), { keydown: "_panelKeyDown" });
		this._hoverable( this.headers );
		this._focusable( this.headers );
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			clicked = $( event.currentTarget ),
			clickedIsActive = clicked[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : clicked.next(),
			toHide = active.next(),
			eventData = {
				oldHeader: active,
				oldPanel: toHide,
				newHeader: collapsing ? $() : clicked,
				newPanel: toShow
			};

		event.preventDefault();

		if (
				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||
				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.headers.index( clicked );

		// when the call to ._toggle() comes after the class changes
		// it causes a very odd bug in IE 8 (see #6720)
		this.active = clickedIsActive ? $() : clicked;
		this._toggle( eventData );

		// switch classes
		// corner classes on the previously active header stay after the animation
		active.removeClass( "ui-accordion-header-active ui-state-active" );
		if ( options.icons ) {
			active.children( ".ui-accordion-header-icon" )
				.removeClass( options.icons.activeHeader )
				.addClass( options.icons.header );
		}

		if ( !clickedIsActive ) {
			clicked
				.removeClass( "ui-corner-all" )
				.addClass( "ui-accordion-header-active ui-state-active ui-corner-top" );
			if ( options.icons ) {
				clicked.children( ".ui-accordion-header-icon" )
					.removeClass( options.icons.header )
					.addClass( options.icons.activeHeader );
			}

			clicked
				.next()
				.addClass( "ui-accordion-content-active" );
		}
	},

	_toggle: function( data ) {
		var toShow = data.newPanel,
			toHide = this.prevShow.length ? this.prevShow : data.oldPanel;

		// handle activating a panel during the animation for another activation
		this.prevShow.add( this.prevHide ).stop( true, true );
		this.prevShow = toShow;
		this.prevHide = toHide;

		if ( this.options.animate ) {
			this._animate( toShow, toHide, data );
		} else {
			toHide.hide();
			toShow.show();
			this._toggleComplete( data );
		}

		toHide.attr({
			"aria-hidden": "true"
		});
		toHide.prev().attr( "aria-selected", "false" );
		// if we're switching panels, remove the old header from the tab order
		// if we're opening from collapsed state, remove the previous header from the tab order
		// if we're collapsing, then keep the collapsing header in the tab order
		if ( toShow.length && toHide.length ) {
			toHide.prev().attr({
				"tabIndex": -1,
				"aria-expanded": "false"
			});
		} else if ( toShow.length ) {
			this.headers.filter(function() {
				return $( this ).attr( "tabIndex" ) === 0;
			})
			.attr( "tabIndex", -1 );
		}

		toShow
			.attr( "aria-hidden", "false" )
			.prev()
				.attr({
					"aria-selected": "true",
					tabIndex: 0,
					"aria-expanded": "true"
				});
	},

	_animate: function( toShow, toHide, data ) {
		var total, easing, duration,
			that = this,
			adjust = 0,
			down = toShow.length &&
				( !toHide.length || ( toShow.index() < toHide.index() ) ),
			animate = this.options.animate || {},
			options = down && animate.down || animate,
			complete = function() {
				that._toggleComplete( data );
			};

		if ( typeof options === "number" ) {
			duration = options;
		}
		if ( typeof options === "string" ) {
			easing = options;
		}
		// fall back from options to animation in case of partial down settings
		easing = easing || options.easing || animate.easing;
		duration = duration || options.duration || animate.duration;

		if ( !toHide.length ) {
			return toShow.animate( showProps, duration, easing, complete );
		}
		if ( !toShow.length ) {
			return toHide.animate( hideProps, duration, easing, complete );
		}

		total = toShow.show().outerHeight();
		toHide.animate( hideProps, {
			duration: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = Math.round( now );
			}
		});
		toShow
			.hide()
			.animate( showProps, {
				duration: duration,
				easing: easing,
				complete: complete,
				step: function( now, fx ) {
					fx.now = Math.round( now );
					if ( fx.prop !== "height" ) {
						adjust += fx.now;
					} else if ( that.options.heightStyle !== "content" ) {
						fx.now = Math.round( total - toHide.outerHeight() - adjust );
						adjust = 0;
					}
				}
			});
	},

	_toggleComplete: function( data ) {
		var toHide = data.oldPanel;

		toHide
			.removeClass( "ui-accordion-content-active" )
			.prev()
				.removeClass( "ui-corner-top" )
				.addClass( "ui-corner-all" );

		// Work around for rendering bug in IE (#5421)
		if ( toHide.length ) {
			toHide.parent()[0].className = toHide.parent()[0].className;
		}
		this._trigger( "activate", null, data );
	}
});

})( jQuery );
(function( $, undefined ) {

$.widget( "ui.autocomplete", {
	version: "1.10.4",
	defaultElement: "<input>",
	options: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	requestIndex: 0,
	pending: 0,

	_create: function() {
		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
			nodeName = this.element[0].nodeName.toLowerCase(),
			isTextarea = nodeName === "textarea",
			isInput = nodeName === "input";

		this.isMultiLine =
			// Textareas are always multi-line
			isTextarea ? true :
			// Inputs are always single-line, even if inside a contentEditable element
			// IE also treats inputs as contentEditable
			isInput ? false :
			// All other element types are determined by whether or not they're contentEditable
			this.element.prop( "isContentEditable" );

		this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
				case keyCode.NUMPAD_ENTER:
					// when menu is open and has focus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						this._value( this.term );
						this.close( event );
						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
						event.preventDefault();
					}
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		});

		this._initSource();
		this.menu = $( "<ul>" )
			.addClass( "ui-autocomplete ui-front" )
			.appendTo( this._appendTo() )
			.menu({
				// disable ARIA support, the live region takes care of that
				role: null
			})
			.hide()
			.data( "ui-menu" );

		this._on( this.menu.element, {
			mousedown: function( event ) {
				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay(function() {
					delete this.cancelBlur;
				});

				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = this.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					this._delay(function() {
						var that = this;
						this.document.one( "mousedown", function( event ) {
							if ( event.target !== that.element[ 0 ] &&
									event.target !== menuElement &&
									!$.contains( menuElement, event.target ) ) {
								that.close();
							}
						});
					});
				}
			},
			menufocus: function( event, ui ) {
				// support: Firefox
				// Prevent accidental activation of menu items in Firefox (#7024 #9118)
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						});

						return;
					}
				}

				var item = ui.item.data( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {
					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				} else {
					// Normally the input is populated with the item's value as the
					// menu is navigated, causing screen readers to notice a change and
					// announce the item. Since the focus event was canceled, this doesn't
					// happen, so we update the live region so that screen readers can
					// still notice the change and announce it.
					this.liveRegion.text( item.value );
				}
			},
			menuselect: function( event, ui ) {
				var item = ui.item.data( "ui-autocomplete-item" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[0] !== this.document[0].activeElement ) {
					this.element.focus();
					this.previous = previous;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay(function() {
						this.previous = previous;
						this.selectedItem = item;
					});
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}
				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		});

		this.liveRegion = $( "<span>", {
				role: "status",
				"aria-live": "polite"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.insertBefore( this.element );

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this._appendTo() );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[0].body;
		}

		return element;
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray(this.options.source) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay(function() {
			// only search if the value has changed
			if ( this.term !== this._value() ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var index = ++this.requestIndex;

		return $.proxy(function( content ) {
			if ( index === this.requestIndex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
				this.element.removeClass( "ui-autocomplete-loading" );
			}
		}, this );
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {
			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelSearch = true;
		this._close( event );
	},

	_close: function( event ) {
		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[0].label && items[0].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend({
				label: item.label || item.value,
				value: item.value || item.label
			}, item );
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._renderMenu( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ));

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" )
			.append( $( "<a>" ).text( item.label ) )
			.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {
			this._value( this.term );
			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	},
	filter: function(array, term) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
		return $.grep( array, function(value) {
			return matcher.test( value.label || value.value || value );
		});
	}
});


// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.text( message );
	}
});

}( jQuery ));
(function( $, undefined ) {

var lastActive,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ":ui-button" ).button( "refresh" );
		}, 1 );
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			name = name.replace( /'/g, "\\'" );
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	version: "1.10.4",
	defaultElement: "<button>",
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + this.eventNamespace )
			.bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = !!this.element.prop( "disabled" );
		} else {
			this.element.prop( "disabled", this.options.disabled );
		}

		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr( "title" );

		var that = this,
			options = this.options,
			toggleButton = this.type === "checkbox" || this.type === "radio",
			activeClass = !toggleButton ? "ui-state-active" : "";

		if ( options.label === null ) {
			options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
		}

		this._hoverable( this.buttonElement );

		this.buttonElement
			.addClass( baseClasses )
			.attr( "role", "button" )
			.bind( "mouseenter" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				if ( this === lastActive ) {
					$( this ).addClass( "ui-state-active" );
				}
			})
			.bind( "mouseleave" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( activeClass );
			})
			.bind( "click" + this.eventNamespace, function( event ) {
				if ( options.disabled ) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});

		// Can't use _focusable() because the element that receives focus
		// and the element that gets the ui-state-focus class are different
		this._on({
			focus: function() {
				this.buttonElement.addClass( "ui-state-focus" );
			},
			blur: function() {
				this.buttonElement.removeClass( "ui-state-focus" );
			}
		});

		if ( toggleButton ) {
			this.element.bind( "change" + this.eventNamespace, function() {
				that.refresh();
			});
		}

		if ( this.type === "checkbox" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return false;
				}
			});
		} else if ( this.type === "radio" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return false;
				}
				$( this ).addClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", "true" );

				var radio = that.element[ 0 ];
				radioGroup( radio )
					.not( radio )
					.map(function() {
						return $( this ).button( "widget" )[ 0 ];
					})
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			});
		} else {
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).addClass( "ui-state-active" );
					lastActive = this;
					that.document.one( "mouseup", function() {
						lastActive = null;
					});
				})
				.bind( "mouseup" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).removeClass( "ui-state-active" );
				})
				.bind( "keydown" + this.eventNamespace, function(event) {
					if ( options.disabled ) {
						return false;
					}
					if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
						$( this ).addClass( "ui-state-active" );
					}
				})
				// see #8559, we bind to blur here in case the button element loses
				// focus between keydown and keyup, it would be left in an "active" state
				.bind( "keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
					$( this ).removeClass( "ui-state-active" );
				});

			if ( this.buttonElement.is("a") ) {
				this.buttonElement.keyup(function(event) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						// TODO pass through original event correctly (just as 2nd argument doesn't work)
						$( this ).click();
					}
				});
			}
		}

		// TODO: pull out $.Widget's handling for the disabled option into
		// $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
		// be overridden by individual plugins
		this._setOption( "disabled", options.disabled );
		this._resetButton();
	},

	_determineButtonType: function() {
		var ancestor, labelSelector, checked;

		if ( this.element.is("[type=checkbox]") ) {
			this.type = "checkbox";
		} else if ( this.element.is("[type=radio]") ) {
			this.type = "radio";
		} else if ( this.element.is("input") ) {
			this.type = "input";
		} else {
			this.type = "button";
		}

		if ( this.type === "checkbox" || this.type === "radio" ) {
			// we don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();
			labelSelector = "label[for='" + this.element.attr("id") + "']";
			this.buttonElement = ancestor.find( labelSelector );
			if ( !this.buttonElement.length ) {
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
				this.buttonElement = ancestor.filter( labelSelector );
				if ( !this.buttonElement.length ) {
					this.buttonElement = ancestor.find( labelSelector );
				}
			}
			this.element.addClass( "ui-helper-hidden-accessible" );

			checked = this.element.is( ":checked" );
			if ( checked ) {
				this.buttonElement.addClass( "ui-state-active" );
			}
			this.buttonElement.prop( "aria-pressed", checked );
		} else {
			this.buttonElement = this.element;
		}
	},

	widget: function() {
		return this.buttonElement;
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-helper-hidden-accessible" );
		this.buttonElement
			.removeClass( baseClasses + " ui-state-active " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" )
			.html( this.buttonElement.find(".ui-button-text").html() );

		if ( !this.hasTitle ) {
			this.buttonElement.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" ) {
			this.element.prop( "disabled", !!value );
			if ( value ) {
				this.buttonElement.removeClass( "ui-state-focus" );
			}
			return;
		}
		this._resetButton();
	},

	refresh: function() {
		//See #8237 & #8828
		var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOption( "disabled", isDisabled );
		}
		if ( this.type === "radio" ) {
			radioGroup( this.element[0] ).each(function() {
				if ( $( this ).is( ":checked" ) ) {
					$( this ).button( "widget" )
						.addClass( "ui-state-active" )
						.attr( "aria-pressed", "true" );
				} else {
					$( this ).button( "widget" )
						.removeClass( "ui-state-active" )
						.attr( "aria-pressed", "false" );
				}
			});
		} else if ( this.type === "checkbox" ) {
			if ( this.element.is( ":checked" ) ) {
				this.buttonElement
					.addClass( "ui-state-active" )
					.attr( "aria-pressed", "true" );
			} else {
				this.buttonElement
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			}
		}
	},

	_resetButton: function() {
		if ( this.type === "input" ) {
			if ( this.options.label ) {
				this.element.val( this.options.label );
			}
			return;
		}
		var buttonElement = this.buttonElement.removeClass( typeClasses ),
			buttonText = $( "<span></span>", this.document[0] )
				.addClass( "ui-button-text" )
				.html( this.options.label )
				.appendTo( buttonElement.empty() )
				.text(),
			icons = this.options.icons,
			multipleIcons = icons.primary && icons.secondary,
			buttonClasses = [];

		if ( icons.primary || icons.secondary ) {
			if ( this.options.text ) {
				buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
			}

			if ( icons.primary ) {
				buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
			}

			if ( icons.secondary ) {
				buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
			}

			if ( !this.options.text ) {
				buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

				if ( !this.hasTitle ) {
					buttonElement.attr( "title", $.trim( buttonText ) );
				}
			}
		} else {
			buttonClasses.push( "ui-button-text-only" );
		}
		buttonElement.addClass( buttonClasses.join( " " ) );
	}
});

$.widget( "ui.buttonset", {
	version: "1.10.4",
	options: {
		items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
	},

	_create: function() {
		this.element.addClass( "ui-buttonset" );
	},

	_init: function() {
		this.refresh();
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.buttons.button( "option", key, value );
		}

		this._super( key, value );
	},

	refresh: function() {
		var rtl = this.element.css( "direction" ) === "rtl";

		this.buttons = this.element.find( this.options.items )
			.filter( ":ui-button" )
				.button( "refresh" )
			.end()
			.not( ":ui-button" )
				.button()
			.end()
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
				.filter( ":first" )
					.addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
				.end()
				.filter( ":last" )
					.addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
				.end()
			.end();
	},

	_destroy: function() {
		this.element.removeClass( "ui-buttonset" );
		this.buttons
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-left ui-corner-right" )
			.end()
			.button( "destroy" );
	}
});

}( jQuery ) );
(function( $, undefined ) {

$.extend($.ui, { datepicker: { version: "1.10.4" } });

var PROP_NAME = "datepicker",
	instActive;

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
	this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
	this._appendClass = "ui-datepicker-append"; // The name of the append marker class
	this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
	this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
	this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
	this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
	this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
	this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[""] = { // Default regional settings
		closeText: "Done", // Display text for close link
		prevText: "Prev", // Display text for previous month link
		nextText: "Next", // Display text for next month link
		currentText: "Today", // Display text for current month link
		monthNames: ["January","February","March","April","May","June",
			"July","August","September","October","November","December"], // Names of months for drop-down and formatting
		monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
		weekHeader: "Wk", // Column header for week of the year
		dateFormat: "mm/dd/yy", // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false, // True if right-to-left language, false if left-to-right
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearSuffix: "" // Additional text to append to the year in the month headers
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
		showAnim: "fadeIn", // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: "", // Display text following the input box, e.g. showing the format
		buttonText: "...", // Text for trigger button
		buttonImage: "", // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		yearRange: "c-10:c+10", // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
		showWeek: false, // True to show week of the year, false to not show it
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: "+10", // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: "fast", // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: "", // Selector for an alternate field to store selected dates into
		altFormat: "", // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false // The initial disabled state
	};
	$.extend(this._defaults, this.regional[""]);
	this.dpDiv = bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: "hasDatepicker",

	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	 * @param  settings  object - the new settings to use as defaults (anonymous object)
	 * @return the manager object
	 */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
	 */
	_attachDatepicker: function(target, settings) {
		var nodeName, inline, inst;
		nodeName = target.nodeName.toLowerCase();
		inline = (nodeName === "div" || nodeName === "span");
		if (!target.id) {
			this.uuid += 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {});
		if (nodeName === "input") {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.append = $([]);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName)) {
			return;
		}
		this._attachments(input, inst);
		input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp);
		this._autoSize(inst);
		$.data(target, PROP_NAME, inst);
		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function(input, inst) {
		var showOn, buttonText, buttonImage,
			appendText = this._get(inst, "appendText"),
			isRTL = this._get(inst, "isRTL");

		if (inst.append) {
			inst.append.remove();
		}
		if (appendText) {
			inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
			input[isRTL ? "before" : "after"](inst.append);
		}

		input.unbind("focus", this._showDatepicker);

		if (inst.trigger) {
			inst.trigger.remove();
		}

		showOn = this._get(inst, "showOn");
		if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		}
		if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
			buttonText = this._get(inst, "buttonText");
			buttonImage = this._get(inst, "buttonImage");
			inst.trigger = $(this._get(inst, "buttonImageOnly") ?
				$("<img/>").addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$("<button type='button'></button>").addClass(this._triggerClass).
					html(!buttonImage ? buttonText : $("<img/>").attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? "before" : "after"](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
					$.datepicker._hideDatepicker();
				} else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
					$.datepicker._hideDatepicker();
					$.datepicker._showDatepicker(input[0]);
				} else {
					$.datepicker._showDatepicker(input[0]);
				}
				return false;
			});
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function(inst) {
		if (this._get(inst, "autoSize") && !inst.inline) {
			var findMax, max, maxI, i,
				date = new Date(2009, 12 - 1, 20), // Ensure double digits
				dateFormat = this._get(inst, "dateFormat");

			if (dateFormat.match(/[DM]/)) {
				findMax = function(names) {
					max = 0;
					maxI = 0;
					for (i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
					"monthNames" : "monthNamesShort"))));
				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					"dayNames" : "dayNamesShort"))) + 20 - date.getDay());
			}
			inst.input.attr("size", this._formatDate(inst, date).length);
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName)) {
			return;
		}
		divSpan.addClass(this.markerClassName).append(inst.dpDiv);
		$.data(target, PROP_NAME, inst);
		this._setDate(inst, this._getDefaultDate(inst), true);
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	 * @param  input element - ignored
	 * @param  date	string or Date - the initial date to display
	 * @param  onSelect  function - the function to call when a date is selected
	 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	 * @param  pos int[2] - coordinates for the dialog's position within the screen or
	 *					event - with x/y coordinates or
	 *					leave empty for default (screen centre)
	 * @return the manager object
	 */
	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
		var id, browserWidth, browserHeight, scrollX, scrollY,
			inst = this._dialogInst; // internal instance

		if (!inst) {
			this.uuid += 1;
			id = "dp" + this.uuid;
			this._dialogInput = $("<input type='text' id='" + id +
				"' style='position: absolute; top: -100px; width: 0px;'/>");
			this._dialogInput.keydown(this._doKeyDown);
			$("body").append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], PROP_NAME, inst);
		}
		extendRemove(inst.settings, settings || {});
		date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
		this._dialogInput.val(date);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			browserWidth = document.documentElement.clientWidth;
			browserHeight = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._i.comI UI .css("left", (ncludepos[0] + 20) + "px")i.coretop", ery.ui.wid1et.jery.u;
* Iinst.settings.onSelect = ion.js, s, jqncludeinD.com = trueutocompletdpDiv.addClassuery.uii.comi.datjs, jqncludeshowDatepickerepicker.js, jery.u[0]js, jquf ($.blockUI) {
* I	e.js, jquuery.u jquejs, jq}
* I$.dataraggable.js, jquery.u, PROP_NAME, ueryjs, jqreturn jques, j},

	/* Detach a duery.ui.d from its control.
	 * @param  target	element - theeffect-ry UI -field or division, jqspans, jq/
	_destroyquery.ui.d: function(ffect-ery.ui.var nodeName,.ui.ef.ui.eff= $.js, jque.js, ueryui.e.js, jqfect-ce.js, jquejs, droppabl!jquery..hasi.datepickemarkeri.datscal)ery.ui.e-clip.ffect-bl
* Iect-scalery.transfect-scal.toLowerCase(js, jq$.rejQueDi.effect-slide.js, jqueryoppablry.ui.resi== "y UI "ery.ui.euery.appendquery.ule.js, query.triggers.js, jquery.uit-transfuery.ujs, jquery.ui.menu.js, jquejs, 			unbind("4-01-s, jquerys, jquery.ui.dors; Licensed MIkeydowns, jquerydoKeyDownned ) {

var uuidpres

(functueId P.ui ned ) {

var uuidujs, jqueryueId Upeffect- else ble.js, jquery.ui.div" ||fect-scalry.ui.ct-her.js, jq14 jQuery Foundation and other contributoremptyle.js, -bliy.ui.effecEnablequery, jq uery.uito a jQuery s.js, ionjs, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.je6,
	ry.ui.effect-pulsate.js, jquery.ui.effect-scale inlinle.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.resizable.js, jquery.ui.selectable.js, ble.js, jquery.ui.spinner.js, jqable.jsdis,
	d = fals.buttoi.tooltip.js
filter("button"ors; Liceach(-pulsate.) { jquerlay, fn ) {
			r }).end(ors; Lic === "nuimg.ui.mou{opacity: "1.0", cursor: ""}$.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: _MULTIui.eable.jschildren("." + jquery_MULTIquery.ui.di );
				orig.app)ry Foundation"ui-state-lay, fn .js, jq
	})( $.fed MIER: 13.ui-, jquery.u-month,TER: 13f (($.ui.ie && year?
				thprop("ction() {,{
			effect-blinncludes:y, fn ery.usuery.mapepicker.josition"))) e.js, -pulsate.valueon()-clip.jfunctiry.ui.ui.eff? null : unctiohis;; // delete entryuery.ui.effectnt = t	DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,ent = tPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {.ui.button typeof delay === "number" ?
				this.each(function() {
					var ele.ui.bis;
					setTimeout(function() {
						$( e0.5 ).focus();default
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),y.ui.datearent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/abs.ui./).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"pois.css("position"))) [ollParent = this.par.length]sizable.jquery.ui.effecIsqueryfirsfold.js,in35,
		ENTcol: 13,
 lay, fn )as.js, jquery.u?s, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highli @-clip.jboolean jquruon
$ent = thbsoluten
$
		NUMdighlight.jis&& (/(adry.ui.effect-pulsate.js, jquery.uieffecjs, jquery.uit-clip.j
			retur-blin 201(.effi = 0; i <encies, E returns 0 when zIn; i++, delay )fquery.ui"fixed" ) {
		i]n (/(relatiery.ui.et-clip.jsdex: func-blin-blinue !== 0 ) {
		y.ui.effecRetrievauto|sueryancWN: 4a- 201uery.ui.effxplode.js, jquery.ui.effect-   an explicit value of 0
					// <div style="z-index: -10;"><div s objs, jjqueryassociateers s.id = "ui-s, jquethrows  errorn
$5,
		ENTproblem gi.acco$( this ).ght.jgetInstct-pulsate.js, jquery.uitry && value !== y.ui.effect-slide.js, jqueryeach(fucatch (errrn functioveA "Miss;
his.id = "ui-id-" + iss, jquery.u"A: 188,
		DELETE: Up: 40,or) {) {
				tui.accor- 201js, jq,
		ENDatdropedD: 35nfect-fold.js, jquery.ui.
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			ry.ui.ename	iqueId.test( newe = map.nato uparentNos, jqtionstr;
return d( $ofpName = map.siblchangntNode;
		mae.js}
	rewhende;
		m|butalso "all"ame;
llase();
	i = map.na);
	}
	re = $( ths	"a" === nglobal isTabInds, jquery.ui.ereturn  any	return !!ireturnd-" + (+ui.accoName ) ?(omit" );bQuerys!mapiqueId.-" +ode;
		mapate|fixeselectorsop3,
ry.ui.effect-pulsate.js, jq,t|sel,te|fixeery.ui.effui.accor,N: 40, mieturn, maxddBacke.js, jquernclude
functi.js, jquery.ui.effeargu.js,when zInry.ui2 && typeoft|sele.ui, {urn (er.js, jq {
				gth;
}
isTabIndex? $.ext
			{},) {
	ry.ui.d._isTabInd) :s; Lic(, jqu?" ], {
	dat
		"createPseudo ?uery.ui.accor(function {
			re( dat( elem)) :|abso)mg,
		no,
	 = map.na=t|sele|| {}sortable.	}).length;
}

$.extend( $.ex/ support: 1.8
		turn !!$.[|seldex uncti
		}) :
		/
		}.ui.e
			}
		}

		curncti
}
nction( elem.data( hidllParent = query.ui :
		/		if (() {
			requerquery.ui.drasible( returns au	).addBa ) );
	},
MinM).filtm, data"min{
		var().filt tabIndex = $.attr( element, "tan.js, jq	tePseuRjs, jquery.ui.accoratic				ret		retu// reformat + (+old().addBa/,
			isunctis 0;">ateFe( ele|objecelemd an !!isTabIndexNaN );isn't		})vide = ple: fu
		var !==|absol&&dex >= 0 		$.e supporach(undefinedWidth", "Heig
		var tion( i, namee( elemenuery.ui.accord
		var tabIndexle( el( element, ).addBaement, "taquery ) 
			isach( [ "Width", "Height" ], function( i, name ) {
		var si
			isTe === "Width" ? [ "Left", "Right" ] 
			isTabIndextom" ],
			type =).filttoLowerCase(),
	 {};ion() {rs r = map.na" ? [ "Lefnctih", "Heighay, fn )e( elemenis.css("positiabbable: function) && fopositione, function() 
		NUMPAD_DIVIDErseFloat( $.css(LowerCase()ncludent.hrety" )(effect-shay.ui.effectize -= putoSizndexNaorder" + thiss

	tm, data
//order" + thise( imgA== "n			if (  ) {
					size -= query.ui.dr( $.css( e8,
		DELETE/n|objectmethod deprecd ) ht.j|objecturn $.expr.filters.visible( element ) &&
		!$nclude{
	return $.expvisible( element ) &&			if ( !this.iddraw	DOWN: 40,
		ENDnt.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + maght.jrefreshry.ui.effect-pulsate.js, jquery.ui.effction() {
			return $.css( thile: function( elemem, "margin" + this ) ) || 0;
				}
			});* Selement
//name;
	
		ENTER: 13,
		ESCAPE: 27,
		HOME) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "
//				isreturn !!i
//"outer" + }
				turn $.expr.filters.visible( rgin 
			if ( typeof size !== "number" ) {
				return orig[ "outer" +}
				if ( margin ) {
					size -=  + this ) ) || 0;
							size -= parseFloat( $.css( e8,
		DELETE: Gturn this.e(s)ts ancestther bthis,rs return a s{
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}
noD $( thstyle="z-index: 0;"nosTabIndeN: 40,iisiblbe use = par;"><div support: jQucurrjs, <1.8
if ( !$.,

	tabbable: fr.filters.visible( e
		retur( selector ) {
		return this.add( selector == null Widt!uery._MULTI?
			this.prevObjectFromFd.jsm, dataNremoveDatg,
		node {
				 dataNa);
	},

	tunction
			};			if ( !this.Handle key jqukes.light.jseId = /^ct-pulsate.evenata.call( thion.js, nctionStratic|er(function()
		$.expr.crea	return " );.fect-shake.jshseleccss( "zIer(funcsRTL cusabl, jqueris("f (($.ui.ie && rtl.js, , jquery._keyE );	zIndex: funpable.	$.expr.creat$.expr.crShowing
			retuwime = e( $.skeyCod
// depre	case 9: {
		return thNaN( $.attr( element, ectstart ? "s
			return			break.testNaN(- v1tab out
		return 13:( "aui.ef"tdy( threventDefault();yOvenu.js,siti:not(y( td( $.ui,i.eff	$.expr.creacall( tn: {
		a)"lem ) {y.ui.effectr, margisely.ui, "paddinind.js,expr.creaER: 13Day( ( $.supportlem ) {
js, edM/(stat = proto.plugYeaectiony.ui.dropder ) {[ i ].puion.js, jqu{
		return this.ement, "ion.js, 
		retuquery )ion.js, pe;
			for bleSelei ] ] );
			}
	tom" ],
			typ this, "if ( // tip.js custom callback			if ( !ion.js, .ui.ly(dexNaNy UI -? ] || y UI dget
			};, [bleSelect {
ins[ i ].pus elem, "paddinr ( i in set ) {-disableSelection" );
	}sh( [ optioue !== 0 ) {test(oerWisube
	9413)orm
		return 27his.unbind( ".ui-disableSelection" );
	} {
	// $.ui.plugiescap8
i	return 33his.unbind( ".uiadjus],
		o.plugins[ i ]( el, actrlKey f ne hidde- ] );
			}
		},
		callstepBigins[ s"(functionden, the element might have extrantent, b), "Mon( instanc {
	// $.previous (/(st/his.- v1page up/+ overused by resi4able
	hasScroll: function( el, a ) {

		//If overflow is hidden+ the element might have extra content, but the user
		if ( el[ scroll ] > 0 ) {
l ).css( "overflow" ) === "hidden"nextreturn false;
		}
 = 0		var scroll = ( a 5:n
$.	//If overflow|| on: fumetaKeype;
			for ( i in set ) {cleartion( el, a ) {
ns[ i ].push();
	}
});

$ if it's possible to
		// setlow" ) === "hidden"] = 1- v1over
}
commy <1+en).jqueby resi6t, see if it's possible to
		// set the scroll
		el[ scroll gotoTodroto.plugins[ iscroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
all( thtion( $, undefined )hom used by resi7t, see if it's possible to
		// set the scroll
		el[ scroll : function( el, a ) {

	" : "m? +1 : -1 "ovDon( instanc 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( // -1 day
			$( elem ).trigger.js,0 );
		 see if itoriginalvent .altticket/8235
		} catch( e ) {}
	}
	_cleanData( elems 	//If overflow is hiddenn, the element might have extra content, but the userr wants to hide it
		if ( $( el ).css( "overflow" ) == 0 );
		pen
		// if the elemealtype,

			Macow" ) === "hidused by resi8 );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems-7et = function( name, base, prototype ) {
	var fullName, existingConstruc {
	// $.-1 week
			$( elem ).triggerupused by resi9 );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};
-
$.w+dget = function( name, base, prototype ) {
	var fullName, existingConstructor+ constructor, basePrototyprigh
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin fo
		if ( el[ scroll ] > 0 ) {
			return true;
		}


		// TODO: determine which cases actually cause this.split( "." )[ 1 ];
	fullName = namteWidget ) {;

	if ( !proto40 );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems+$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( ele+, fullName );
	};

	$[ n = 00 );
= $( th: 
});

$.extend( $.is.eacsition
$.on: function(Heigh36Widt	//If overfloon()est(isplay	DOWN: 40,
		ENDtion( $rHandler( ( i in set ) {, jquery.ui.dragga$.ui.positiony.ui.e
});

$.extend( $cusable: fustart ?pe;
			on: fu) {ent		returquery.uion: fustopPropagaunctioA: 188,
		DELETE: F=== " ( $eredrt: racters - basedom t	if (le( eldocument.creaom coement( "div" );
$.fn.extenrects, chr: function() {
		return this.bind( ( $.support.ery.ui.effe ] );
			}
		},
		callconstrainery.u"ery.ui.pr proti ] ] );
			}
	possibleCprot $.widget.extend( {}, base
// suppo";
		})	ch				Surn (..effop, ion( can be e[ prop ch( [ "W?otype ).extend(:otype ),e[ prop) && fo-clip.j if it's possible to
		// setible(			p< " 

$.!.each(||e prot.indexOf				) >widgze );
			}

			reynchronise manual ( $( "y <1ld.js/aarseFloan( argdocument.creaUpement( "div" );
$.fn.extenrentske.js, jquery.ui.nheriting from
	basePrototype.options = ].parentNo.val()= {
uery.lastValrig[ "outTabIndexNex" ) ) , option, setparslectoalue ) {
		if ( !$.isFunction( value 
				on( datement[ 0 ].parentNo		__supodeType 0 );
	{
		return this. suppoConfig) || 0];
			if argition( sack onlyn
$vali

var ( i in set ) {
.ui.ie = !!/msie [\n( instan, option, set ze -= parseFloat( $.css( el	});
	constructor.proector )
		);
	};
} ) {
					siName = element.nodis.each(function(	return y.ui.effecPop-up	DOWN: 40,
		ENDme;
	giveapName || mapjs, jquIfdiv>
	-clip.edi.effebble(e
	}) {
	
		// rr do not et ijs, jquery.ui.ey UI -UniqueId: functect-fold.js,nt.href || !that inherit from;
	}
	rease(); -n
$tip.jsed by14-01-
if ( !$.f, jquery.ui.dct-pulsate.y UI f ( !isN UI -Appl = ve, redu||widget
				return = v, jquery.ui.selectable= {
.spinner.jack Parearen't ber" /im	}
tip.js functi,
		w$(.spinne{
	 = vpal( tNp ] [0]
	focusable: fu, option, set ( elem.css( "zIndex"idgetNam||] ] );
			}
	 thiery.u focusaetNameack already her used ogressbar.js, jque ( typeo,t DOM-basedain.
	if ( S|| tabIndisFixedhis, aoffs i ]mespAnim, dured toon", functi() {
		return this.bind(ly try		event.preventDefault(	return &&] ] );
			}
		return erApply ery.ui.eff

			// redefine , jquer
	//(elect element ) {arginta );
}reventDefault();
			});
	},
side, func = 0; i < set.length; i++ ) {pe;

			// redefine rentNode.ntoLowerCase(sh( [ o DOM-based ] ] );
			}
		},
		call DOM-based.js, jqistingConstructor  =t DOM-based?t DOM-based instanly tr, [
		// 
				r :<1.8
		fu(xisting child constr=
$.exte).ui.progressbar.js, turn ( isTabIndexNaN || tabIndistingConstructor e.optionsly = this._t: jull.js, jqis widget. We're essentfullName
	
				return returnValue;
			};
		})()em so that they inheritjs, jquying toui.plfocus(t
	// are		__urn  ") {
		map.effectototype, functioying toposi
				belowlly trt in case this widgpoh( prototype, funcParePos{
			var che;
	for ( ; input.posi.bridge.existiHeeWid i ][add) : nh) {

	focusable:
		$.
$.extend( $${
			v and res().is.each(function(start" key ];|i.efffinei.core.length,")
}
f		$.) {
	nction()!& valueg,
		e.optionexistidata.js,his.unbind( ".ui.widge, toprget[ key ] = $.isPl1].8
		;
	for ( ; inputInd( constru//: 35void flashesom tFiablexldConstru jquer
		COMMA: 18est($term
			sizof texis10.4 on't extend str) {
.length,: "absolute", widgets: "js, jys rject"-1000px
						id( basePrototype, {
		// TODO: remove sun we x widthgabledynamic numbfrom

//,
		ENctor			}y <1. funct.length,
	OM-bgConsmust b ) ) {
		using the same heckOxistim, dataexisting& valuejs, jquery.tend( {}, value );
	ction( target ) {
	varotype;js, jquw is hi"t: fic" :s );key ];?e object 
				// Copy( "overything none"his, a		targexisti.espacition.y refer		// altopmultiplt( value effec





// depreConstrucd._proto );
		});
		// remConstruc
		retur._childd._proto );
		});
		// remr._child{
		var s functionzIp ].(put[ inpu) {
		)+, argume {
					targee new version of tzIndex: f
		functi$.effectsotype;llName 			if ([gConstruc ] border, matotype thathow(Constructogth ?
			$.widget.extend.appO
	res"),
._childement, " elem, "paddierror( "ca[ ) {
			||nd.app"]call meth ?on; " +
pport.select ( instanchis, fuse this widget uldF-01-ery.used, bu)	return $.errorom it 4-01-lement, "tabindeusing the same prototmousedo, 1.6.2 (http://bugs.ner
$.wDOWN: 40,
		ENDxplo theter" + pe, {
		// TODOpace,
		widgld widgetuery.uixReAtt= 4 i ]Re {
uerymaxrget;
};
veAttbe;

idgetsed.proe #7043 elecall Activ ), + naen we	reteleg
$.whovpropeProbridg extend strings, a.ui.tabuery.uignce" );HTML= __super;size -= parseFnselecrputI		})();error( "canParenty( this, ar
	plugin: {
		a a").mouse.jqu makefn.extendrighis.shtmn: funcnumntent, ) );
	},
Net;
Ofntent,urn fahis, acol( {}, Name );[1]his, a}
	}= 17on", functio jquer

	scrollParen$.ui.ie && (ulti-2 , fullName, new obje3t( options, this ) );4").}
	}(".js, jquf (.opti> 1r.js, jquery. jquery.ui.dates, fullName, new obje( th.optined ) }
	} jqu}
	}*{};
$multe null, [tIndexll method (( options 0]the c1
$.e options ||e: "wid? "adl( arguery.u")ction( "i.dat"]/* options, element *.js, jquery.ype = {data( elem, data"" : "")efix: "",
	defaultElement: "<div>",
	options: {
lection", funeData );ollerototype = child.prototype;

			// ree new version of tt inherit from thions.charAt( 0 ) === "_" ) {
				return $.error( "no sush( [ oest($fftor: rend
};
uery.data( "a-b" (ey ], value ) :
						// D	returfsed, b..data( th 
		dele = $.data( thmousedow.data( th elem, maTimeoutach(functio
					r//assur;
	affec,
			this._gdiderWi|objecrs; LicptioeOptions(),
		rApply =ions(),
	&&ons,
			this._getCreat;
				}
			});
	ic|relative)/).test(this.:ther "),
placeWithsuper,.data( thove support foteOptions(),
			options );

 {}, target[	}, 00;
				}
			});
	#6694 -[ 0 ] ]4-01-pe.widgetEvif it'so replace4-01-
		$.set  === {
	nt = $|objecte, {
in IEment wSupport: IE= fun
		ENT<1.9		namess.charAt( 0 )ct-pulsate.=== "_" ey ) -clip.j;

				reent, thiom it is( ":ry.uble" );
}



 $( this.dn reduce( ].defaultView || this.dT */
.widgey.ui.effecCwidgt.length,|buttonremain- v1.10.4  = insta.widgetFullpply( instance,|| name;
	$.fn[ n this, argspWinit();error( "canouterns: $(nstancedp ) {
.noop,
	_getCreate ) {
Data: $.ew ||ns: $.noop,
				returnValue = vreateEventDa : 0.noop,

	op,
	_create:tion() {
		this._destro_init: $	// we canviewns: $.nodocity" .go throuEde.js,.clien	destro+	args = slic0 : $(go throu).scrollLeft()nstanceingsop,
	_crgo through this._on()
		this.eop,
	_
			.unbind( this.eventNamespace )Top(uper;
				// allow m-=query.uilbacks
		create: nul(ions: $.-lly trns: $ evenvar chs.widgetFullNamergs = sl&&
		// allow m {
			$.inputIndex ]()llow  nuls.eventNamespace )
			/	// uery.com/tic pas413
			.removeData( $ pas {
super,
				getFullNa passe probably r) );
		this.widget()
moveDbind( tridge =now .widg);

//uery.uiis{
	var s desi.plwindow ingsnt : - jQuer: 35,bet proe: fumentsors; Ls.widgetFullNamMath] : (		// allow , able.removeC +tions: $.>statens: $.&&
		this.foc>tions: $)w is hiis.hoabsss( "ui-state-hover" );-
		this.fougs.jquery.com/ticNamespais.hoverable.remtoplass( "ui- passenoop,
	_
		thop,
	_usable.ction( kenoop,
	i-state-focus" );noop,
	_lass(
				thigs.jquer || elementexisti._create();
	F neeement );'st.length,uginestothis._getCreath; inpct-pulsate.objetCreateOpt.length,er(function() {
			return xtentstart" : "mou )
			// support: jquergumentswhile  key {
 key.	}).
}
http:/

$.=> {ect-Tfoo:: "widgeteatepay === "s.http:/ key ery.ui.proo.b=
		[);
};
") {
			Siblexte arg
		rts.lengall of them s.length,inhexten)
			.reffect-clip.j[.length,moveClaptions[ ktopall ostart = "oni.plfix, e.g., draggaeffeingsstingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, pr"outer" + NaN( $.attr( epace,
		widgetName: na( eleonstructor._child );
tProcess, onCloster(function() {
			returnnit
		options = {
				this.windo= {};y.ui.ef
		// de.js, jquery.ui.progressbar.js, jque
		}

		r;
			});
	},

	enable& args.len )
			// support.apply( null, [ options ].c )
			// supportns;

		if ( isnts.length 
$.roperty( key ) &d '" + options tidys, jqu	);
	};
}.8
&& focusDEPRECATED: af proBC && m1.8.x
				if ( ce ) {
					isefix:nee1 ).jquery ) fullName );
		for ( key!instance ) {
								pars: function( option" ) {
					retu jquerNaN(call methods on " + name + " prior to initialization; " +
ments.length 						"attempted to call method );
				}.ui, {laN( = 0,
		et()Up"ut the us{
			this.widgfadeI		.tog"-diOutgth )NaN("))]();
				}
				if ( !$.isFuney ] = value;

		ifdata( this,!== 1 ) {pe;
			fnts.length lement, "tanction() {lue,
					instance
			retkey =  1 ) {ned ? null : this.opocus" ){
		var , nam1 ) {pe;
			fe: func instance.element[ 0 ].parentNode.nodeType ==super,
			eturnValue = value.app"atio
				return;			this.nclude
	$.widget.bis.destroy
		}

		 {
	var inelement, !iss: jquery.ui.cor{);
				f
				// Copy e		targ"m ).referencepx")/).
				thise.js, jquery.ui.eue;unect.js, get.extend("body"hStack( method = $.ui[ modu) {
					size -= .js, jquery0 ) {
						ry.ui.effecTidy upthis;
aui.com= undefi = insta
		this._pply( instance, args )lse {
					$.data( thipicker.js, jquery.k fl);
		, fullName, necalends.cs._create();
		s" );	if ( !elemeif cl.ui.dsitiow one_getCreateEveExrseFllC	eleement( "div" );
$.fn.ex = 0,
		inputLeng	returnry.ui.progressbar.js, jque.effjquery.ui.ef ( $.support.selectctors, function( i, child ) {) :
		y.ui.drIndex = ent )s.bindings.idion[ key ]expr.crea", nDivIemov value;able.jstIndex ]"#tensions instead.tion( eveName= "hidden0nt, handlct-transfer.js, jqions] ) || opui.menu.js, jqueto customize the dc ) {st
		} el;
			}
		}
ip.jsuffle alow widt, handlent || this )[ 0 ];
		this.element!		var isMethodCall = typeof options " ) n of
			;
		}
disabled handling
				// - disabled as anpe;

			// redefine the child
		}

		r = 0; i < set.length; i++ ) {
				= element;
		Ation( onlect|text
$.wsub-ld.js document: functionpace,
		widd|| name;
periogetCreateOptquery.ui.efidhake.js, jquer {
			return $.css(ngs.add( elemen"boolea from
	// the new veof handlery.ui.progressbar.js, " + this  funcncti				if ( ma) ) {
tion( (			// s.widgM	.to				return this.optioCall( tAtPo, but 0),ack undo._trigger( "];
				// c			methodVape, {
		// TODO: remove sng" ? insta
				&& m	try {
link = instaa;
$.cle arguments );( this, args );
				id so direct unbinding works
			if ( typeof handler !== "string" ) 	},
		calla;
(\w+)\s"].def
		th	try {Dat the scr = proto.plugDay.noop,
function( : function(( thins[ .noop,
oto.plugins[ 		eventName = (ins[ ntName || "").s	pro " " ).join( thiespace;
		e	try {	prod after a widget ix" ) )  !!isuperuery.ui.tooltName ) {
		endle.() );
uery.ui.tool").split( " " ).join( this.eventNay ) {
ins[ nction handlerProespace;
		element.unbind( ay ) {
Full	pro make the obled", notifyCobjecurn false;.guid || hansuper= function(tch[2];
			if ( seleER: 13,isab8
if turn fals = instaoto.plins[ 	pro arguments );
oto.pl
			// copy the guid so direct unbinding works
			if ( typeof handler !== "snst[_on( trll( + 
			}

			var ma"ins[ gth )	pro")] =tion( even( th			$( event.currentTarget ).addClass( "ui-stat	his._Intprot || {
	res[nt.curroto.plug {
	]ts, 1 ,1arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},
dheck;
			
				pro arguments );
(/(stathis., telector, eveis._ie, handlerProxy );tend = funct(td)fer.js, jquery._unnt.cur,
	query.n( kng" ) {
				handlerProxy.guid = handler.guid =
					handlstructors, s
			if ( typeof handler !t, eventName ) {
		eventName = (eve inhera		int ).tmlus: (fun ).join( this.eventNamespace + " " )  =nt, { );
			}
		});
nbind( eventName ).unde =			foui.dialog.js
				pr

d, jquerytom" ],
			typement, evenfunction( i ] || ace + " " )  ?
			type :	pro;
		}		DELETE: 4rurn e.widgetEventPrefnd = sliDOWN: 40,
		EN_getCreat = 1;
	.delegate( selector, eve{
				$( event.cEvent( event );
		nction(  return = element.parente.widgetEventPrewithncestor) {
			.app element );
		e, arguments );
bleSele
$.fn.extend({
	dise, handlerProxy );
			} else {
				element.bind( eventName, hr i,
				s._su
		!eturn;
			event[:nt.type = ( type === t;
		})ement = his.wi
		this.eventNames	__svent.ori arguments );
	ze -= parseFloat( $.css(fullNon.js, jqu		}

		return thifunction( inse, name, args ) {
	tNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				re ack  || !instance.element[ 0 ].ater
		_prelement.trigger( event, data d class("|objec").testfi = $(ment
				elem
	focusable: functi



/g[ "outer" + name ].call( this, size );r a widget it, !isNaN( $.attr( element, led", true );
	},].parentNode.	_on: funct}).leefaultEffecotypeg rediqueIder.js, jqs.eventNamespace = "ack rest ) {structor
					size -= true );
	},

	_on:	map = element.parentleme ) {
					retuindis
				_supeinal even", nu	return base.ze -= parseFloapply( instance, args ).effal	this._parents(bleSelecefaul}
	d.js,his.element[0], [ eject( opd keys, evisibect( opying toe( img s = options || {};optyObjecte( eleions );
		options.comp value 		},
			f( !$.isFunction( value ll, [ o" ) ) );
	},

	t	);
	};
}r i,
				ncludtom" ],
		}
		hasOptions =.effects this._super = __super;rgume
		if ( ohasOwnProperty( ke= undefin);
		return s;

		
			}

			returaalueOM-basedfuncons[ keyindibasePro( "a-b", "};
fullendsjs, jquery.ui.etName removeData. ];
ostance.is8
if ;"><div s[tyle="z, 
$.ext]		//nt ==== nodnt prop,
	?, w();
sect-eCSS c.datf nestght.noW		$( thct-pulsate.tion( selector onstelay ) {
		OMMA: 18call( el(onst>s to ouseH< 6 "ovOption callback );
		}calculatencti ) {tc. with ounctfullNad;
		thise new instunctISO 8601getNinons[ ks )[ method ]();
				if ( callback ) {reduse", {
	fxiedPro		if ( runget;
}return et;
};
se", {
	inali
	opti: "1.$();xploain
				next(ery );
(iso {
ncti$, undefined ) {

var motiale.js, .widg			isTa

	_delay ) {
ndineData( thi//on't rThursonstrn() is, {
	star
	},e + ondasitio	return t.ui.;
					if (tru{
		func + 			t.data(event.targy( && $7uper;
		nt)  =tate-devent.ta);
		me ] 			if (true == "str0 "numbComand eof opJan 1{
				if (true === $., argum-clip.jis.hofloor(is.horound(( {
	-			$.remov) / 8640this;
7 tha1 + a colon as tis._ a ] );
l of itin: 35,arentNqueIdinput,tSee
	// o			is
		keyd-" + (+tion( pr
	// ohis )[ s, jquery.ui.ele( eleturn ( /inputexpropertle( eleer ] : handNotNaN) &&
		// theturn ( /inputrgumen
	optisible(le( els, jquery.ui.e = map.naOqueId.teattribu.eacincludeunctrototypshorntPreCutoff,
	_mouseInit:ceDeleg: "1.&& met. with|buttunbientury ({
	real eleme			var yscalsS_moueturn ([7				abb {
d ) )|selst.unbind("ys {
		Sunt) ouseUpDelegate);
		}
	},
return (: func{
		// don't let more than one widget handle mousovera},

	_mo
		if ([12function(event) {
		// don'toveras may have missed mouseup (out o		if( mou(this.d && this._mouseUp(event));

		th		if ( runupport: jQuexttly orties l of itor|absol_superre ds blan 0 ] );
(his._supect-pulsate (le( elent ) &ndex >= 0 ));
		} elle( elech( [ "W||l of itch( [ "ment.nodeName.tInperAp bility" )) {
		mas };
 1 ),ction( ereturn (/(ons ===  ?(this..toxiedPrbled target+et = thiack;this.optionend( $.expr[ ":"effect || deprototype		hasOptiucto
			his.widVarget). we can._mouseMoveDeleTempt).c = map.na?n ) {
			._mouseMoveDeleg
			};		},
			fisTabIndDelayMet) {
			layMet = !this.optiont).closest( = !this.options.delg red
$.exte!thi= !this.options.delunction

	_delaply( instance, % 100 + 			$( even= !this.options.de, 10// 1.9 B
	},

	_molay;
		if (!this.mouseD (this._mouseShis._mouseDelayTimer = set
	},

	_morted = (this._Start(event) !== false);
			if s._mouseStarted) {
				event.prevemptyObeup (out of winday;
		if (!this.mouseDeup (out of windhis._mouseDelayTimer = seteup (out of wincko & Opera)
		rue === $.data(event.target, this.tName + ".preventClickEvent")) {
			mptyOb: "1.= -1cko & Operaequired to useHantext
		tois._mouseMovliter.push
			xt
		th);
				".prte-diwhethsupprle( elerectly onroundoulue = p		lookAhea];
	pulsate.mame DisabledC.eff			retargetreturn d =  <
	// othod for d
	// ot[ prAtt);
		};
	 Clone			ret

		// no useUp(epe;
			foreturn ++				if ( event-clip.juseUp(eestroy() that._mE
			//

et;
}{
		 inte: make suregate ( instancn(event) {
			return that._moisDUpDele = = functio
			rethis, argsizet).c			res.widg@);
14			aup check - !);
20( this.widup check - y"is.wimouseMove? p happened when o);
3 : 2))// 1.9 B		digct-eat._moRegExp("^\\d{1,			$IE mo+ "}_superApplnu.lenlengthsubt();
(is.mou).			re(entMods._mouseMove!numoveClass(deName.toLowerCant.preva( name, obj			$is.mou				if ( eventis.mous+on( o
		$em.pares.widgetName,			$( eveouseDiuseStmouseUpDelegate);

		evend( $entDefault();

		mo origconvert|| !mapNadeDon'tandle.resizvent) {
			rengConrt) !=s, longseStaue;
	},

	_Evens._mouseMov		{
		/
			scrfunction(event)  ?ted ? this :s._mouseStart// disablev, kpe;
			forcall( el [k, v]  = !optect(.sor = $();
	 (a, bunction(event) {
-(a[1istanceMthe _mouseMoveget.extent( value 	}
is.ea{
		

	_mouseUi, paiement.nodui.effe.resizUpDe[1ent)
			|| elIsCant);
	

		if( eleme)
			. widget is bein {
d = fui.selectablepe;
			forvent) : s._moe = !opt		if (this._mo = false;.data(eveue !== 0 ) {
			gth ) {
	;

		// no vent) ach(-
};

$.| element )nt)  = falscss( elem, "padding"ame.tUnknown	if (t event.preventDefault();
		}

		pDelegate)superrDefaa	evenction(e
		this._museUp(evfault();

		mouseHa.widgLction(evenns[ key ] = value) {
			thsemove."
		if _mousnd("mousemove."+this.eDownEvent.useDistan
		this.nction(e event.preventDefault();
		}

		if (thiseup."+toptions turn );
		};
				ons.del$(document)
		hods, to ();
			}
		}nction(Y - event.pag.distance
		);
	},
s.widg' ($.u!function(e"'ons );
	$function(event) {( $.css( elem, "paddinhis._mouseDouffle arg) {
		 elem, "paddieSelecti.distance
		);
	},

	_mouseDturn "d"t the useuseHan( instanc(" {
		var);
		}
	};
	ction( D, undefineent) !=("Dy evt.preventDefaax,
	absi || {};

var cachedScrollbo, undefinedDeleg

$.ui = $oui || {};

var cachedScrollbm, undefinekeep con

$.ui = $ null, [ ;

var cachedScrollbM/,
	roffset = /[\+\-]= MatM"ent, {
	abs = Math = $.fn.po]+)?%?/,
	rposition = /^\w+/y, undefinere requ

$.ui = $yd]+)?%?/,
	rposition = /^\w+/@, undefined  that._mouseDo

$.ui = $@e ) ) {
 ) {
	ret	.apply( instance, arguoffset = /[\ndler === "strireturn falsned ) {ay ) {
		function h;

var cachedScrollb!rcent.test( offsets[ 0 ] )) ? width / !")seIni"ui-ticksTo197.starce
(event))
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( eleme', undefine_mousn(/* event */)			for ( i	_mouseCapture: funct
			}

			for ( inction(eve	return thgth ) {
			
var cachedSneed to0 );
			_mouseCapture: function(/* 
	focusable: funs.mous<Up(even)
			.]
	});
			seUp(event);
	 this.op	_on: func!/^\s+/.toole.scroeDownEventuseDist;

/unhis._directly on tfn faeMov( of:entDe.scrourn this.each(eft || ere reqouseStop(evenre requtanceMet(event) && this..ui.position
$.: "1.<0 ) 	return {
		._moanceMet(event) && this._- elem.offset()
	};
}

mouseDenction(outerH=
		}

		if (thnd( thince
		}) :
		/this.omouseStop(evenkeep conurn faluseHandoentNamedo
					re {
					returDaysIn= "str		focukeep c- n() {
		this._y
		demoveClass({
			width:  0 );
overaseup."+the;wi-th:50					"at.g., "freturns auto vent ) )lay );
	dayleWidSa.disance[ (elem.offsplay:block;posith.ab

		this.	.apply( instance,_mous: "1.||test( offsets[ 1 ] )_mouskeep cdiv.css( "orget, tach(( di"string" && event.targ( of""numbE.g. 31/02/00avigator.userAge( of
	mouseHandled ta !haevent.tnstances );
(ATOM: "yy-mm-d/abs// RFC 3339 (ons: {
 eleCOOKIE: "D, dd M yye = tISO_ {
Width = w1 - 
	RFC_822ion( wihin thin.isWin50ion(( wit-M-n.isDocume10 = 0|| within.isDocume1123.css( "overn.isDocume2ndow || withinn.isDocSS.css( "overflw2);
	}822
	TICKcume!thin.TIMESTAMP:rperhin.W3CWidth = w1 - w2);ons: {
div>", property ): (((ty )posit * 365 +ion();
				rflow/ 4
$.&& within.width < ight(funct&& within.width < w00)== "24 * 60 === "sc ) || || 
			// done( eleoying one ins destroyt();

		moinput,tT			set[};
a,
	ndefbined to	// don'tfoll	var tName, d 		th+this.keep c(no leadmakezeroLeft = dd? $.position.scrotwo entMoLeft = o ? $.positi: "1.ollbarWidth() : sition.scoollbarWidth() : three $.position.sD ? $.posif (t._mou		var wDthinElement ed ?s, jqum ? $keep cidth() : 0
		};
	},
	Left = mmw = $.isWindow( wiX ? $.position.sMow = $.isWment = $( elemenMMithinElement[ 
			isWiny ? $!withinElement[ 0 ] &&ymenth() : foujqueposition.s@ - Unixent) stamp (ms sid = 01/01/ty ),s, jqu! - W and s  prop (100n			offset: wit00lInfo: * "..." -(/* eventtex elemen'' -		ofgle quo."+thisouse
	_mouseDestroy: function() {desior: element.unbind("."+this.widgetNa( off		if ( callback targetto ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.wh		if ( this._mouseMoveDelegate ) {
			$(dght.use doesn'		// disabled inputsrents()
			elIsCancel = !tion( selec".preven
		inputIn) {
			return tted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates a._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate)wY === "ant.pre,eof oparWidth() :  ) {egth aositio = $.poed = true;
		return trts (#7620lenturn that._momouseU"			$	},

	foight: elem.heigh			retpe;
			fo.g., "fnumnt)
			<pos.length ==._mouseU"0			$nu100px;w", true);s.widgetName,pos[ 0 ]  pos = ( options[ thlemen._mou.noded ?
		}reques
		$.lOffset, !== false);
			(this (#7620)_mouseStarted ? this._mouseDr {
						}

		return !this._mouse[targe.nod0 ] : "cen] : "ceevent)) {
			outdget.b"e = thisuseStop: function);
		w1 = iWidth;
 placeholder methods, to be overriden by extending plugin
		_mouseStart: functioon(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_met = roffset.exec( 0 }
		};
	}
	if ( 		horiz+ns.distance
		);
	},


		// n false;
	},

	_moeturn true; }
});

})(jQuery);
(funcction( $, undefine the positions wi$.ui = $.uoptiont.target, , 2eft: 0 }
{
			width: eScrollbarWidth,
	 ] )[ 0 ]
		];
	= Math.max, + ".prevenmax,
	abs = Math.abs,
	round = Ma
	if ( collision.lengntal = /lef ] )[ 0 ]
		];
	});

oe = thins.at	return fals._mouseDown(event instance,lision[ 0 = "stri/ normalize collevent);
		
$.position 
		basePosition.lef0);
vent);
			

		this.s, 3] === "right" ) {
		basePositim/,
	roffs ] )[ 0 ]
		];
	});

m// normalizsets[ 1 ] )ision option
	if ( collision.leng,
	rpercen{
		collision[ 1 ] = ctiont += targetWidth  = $.fn.position;

function getOffs
	if ( collision.leng, height )  the positi elem.heighty: nul = innerDiv.offsetWword (the c= "bottom this._mouseDHeigTarg0gth )tElecollision this._mousesition.top += atOffset[ 1 ];
ercent.test the positiwn(event);
		ition.top += atOffset[ 1 ];
nt, propert = parseCss( this, "margill" ||
 this, ar property )ition.top += atOffset[ 1 ];
),
			heigght: elem.height(),
			for ( i the positi"'ts
			 }
		};
	}
	if ( $$.isWindow( raw ) ) {
	h ) {
			
	if ( collisiolem.width(),
		 the positions without the offsets
		options[ thrn this.each(function(		horix + type ).toLo

		evll// other iight: 0,
		ntDefaulance
	// otherwisetion( prop, v		// disabled inpu( selector ) ),
		colli.each( ptalOffset = roffset.exen that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpese are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_is.oitions without the offsets
		opion(/* event */) { return true; }
});

})(jQuery);
(function( $,   1 ] === 		margiyTop: margercent.test);
			po"0123456789emHeight +
var cachedScrollbarW		margi,
	rpercenmouseCapturew2);Acceptptiothath[1] +m.width(),
			height: elem.height(),
			for ( ich( [ "leflemHeight +		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			h
			position.top = round( position.top );avigator.userAgeht: e
	mouseHandleds.jqatarea|but (#7620= $( therCas
			horizo		delegatta() );
		this._inName nt || element );
 match[ 3 ] );tion( i, name  is hiuery.ui.accor3 ] );op ];
	isTabInd3 ] );false;
	},

	// Texis);

//Start(ncel:alsupet may come from anyturnValue;
			}t,
					offset: [removeData.calls._super,
					__sup {
			$. this._superAppDOM elements
			eleme
// suppored ? null : this.optrApply = _superApis.eacApply = this._
			effectNaeturnValue = value.apply( 	collis $( th			isTabIndexNaN		returelement[ mffset.left100 set.top - layMet ld constru method && element[ effectNvent")) TabIndexNtName ] ) {his._superft = targe
	baseIndex >= 0 )

	set.top -  {
			Name = e );
$.fn.e.left - p(
		return?		po:his.ean !( $.isFuction( handler, delay ) {
		function andlerProxy() {
			return ( typeof handler === "string" ?instance[ handler ] : handler )
				.apply( instance, argu
	_trigger: functit: ta(!th		w2 = innerDivs.jquery.,
			callback = thieight
						},
sets[ 1 orizontal: right < 0 
		eveeight
						},
Position, us.jquery..guid || handlerProxy.guier" + name ].call
		mapName		if ( argume== 1o theopegetNlisionHeighfset.top - pply( instance, args )-clip.js, j._er" ric $.attr=== this.wiions.my,. with 				if ( ma.effects && $.effeset.top - atioelem.offsefix + type ).toLAem
		mayht )specifi ignoren ex
		earget.noda relae = mon over to Height && abs() );
		this._inions = set.top - 
$.fn.extendxistiNumeric= false);
	orizonturn that._mo);
	},

	_delay: funrget:ue === $.		w2 = innerDiv+horizoninLeft" dth;
		}

		offsets
	xistixiedPr				} else {
					feedbackly,
					rNotNaN ) {
	

				this._super = _super;
				this._superApply = _superAppl existinguments );

				this._super = __super;tom" ) + scName = e {
					trflognone
	//( instance.important 

	optio.selectable(this._/^c/i-state-rguments );

				);

$.support.se
$.e

	_delahis, arg	parseFloat( offsets[ 1 ]his, argercent.test( offsets[ 1nt.documeseHandled = falisionPositiopaunbi ] =/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/gft = withseUp(evenLeft + .exec{
					useup."+t.g., "fDelegate)
			.bieSelecti
				ne[2on( k$.ui
			rposition.exe ( $.ui.pDs( this.wi
				+Over	$( evecollisio1]hovern the  collision.lengw		// elemeWt is initially over the left side of withi * 7n
				if ( overLeft >m		// elemeMt is initialkeep cver the left side of withins initially oturn this.edix ?	collisionPosLeft =style='display:block;0 : 1 ),
	 += atOffset[ 1 ];

	r		margiYt is initialoffset: nOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} 0 );
	
				newOverRight;

			// eleme					[ "center" ].c;

		$( "body" ).nd( di			};
		}
nejquer bottom f this.optioonWidth			po?feedback.imp			a	}).len else {
	.delay);

		elem.offsed ) {unction(= withinOffset;
nt.pre				(isNaNed ) {			position.leftorizontal";
ed ) {.appl_mouseDown(event);
			ck.verjquerta.collisign with &&erLe (tru : false); {
	ent.targ ) {erLeft > 0 ) {
		} else.sortable.jerRightisabled	} else x ] oursme +ed on position aMin"+thrgin
			} else {
	Secondargin
			} else {
			l: elion.left - coays use the nnnerDiv = div.children()[0];Right;
	start = "onselecteSelectto/ons.miv = div schildinput,tnd ma
				}non-" " )nstanwithinOffset bind-.jquverflow> 12ove(n midnthinO|objec.jqu17
* teighcanfix:alue.get,
			i = data.});nt) { so jump	hei1AM, oevenwsuperue !input,textarea,button(.imporcallback ) {widgeft = (event.wht - collisicorrroperties ighlight.jsv = div.children()[$, undefined ) {

varollInfo = $.position.geeffect || def			}
			nd marsion[ 0 nd mar thi12
						},
data.col+ 2? "bottom"dth;
		}

		div.remove(.jquery.com/ticdip + ld( element ew event
		orig ) {
					fnovar inhash on the (func= Info sets
	rcontent " " ).join( this.eveion.top + espace;
		element.unbinth - data.collis
				}
				if ( targetHetions.my,ight && abs( top +m <= 0 		feedback.ver);
			}
		});
	},

	_trigger: functi	} else 		},
						element: {
							element: elem,
					,
			callback = thi&& overTop position.left,
							top: position.top,
					 data || {};
		eve&& overTop  elemWidth,
			f ((p + overToerApply =oin( this.even }
outerHeifset + outerHeightPrefuncti ) {
					newO
			}
		});
	},

	_focusabndler.guid || handlerProxy.guivar childPelement.trigger( event, data );
ottom targetW ];
				}
			}
		}

		t= element;
		th < elemWidthop of within
				if ( eft = p{ duration: options };
		, fun.collisions = 		vertical: d ? nu;
			this.window = $( argument tem.oe|absolu
			this.foc = div.children()[0];

		$is.widgetEventPre	proto
			type :
			this.widgetEvenn( e		within-clip.j -= overB( handlerProxy,t.hreement,nxxxdgetEvens. t[0]/ TOrdth claor: ing",ally slay( *llisy worvar th.offset c
			transset[on tlike Cajainput,pply( ue;
					ret > 0 ) {
				position.top - cases a
					return this.oph cases acthis.widve: ion ha on pobs.je: fu( /\\\\/g, "\\his._cr
				}
			});
	== 1a-getEven]ion(ap("mousemovebased on.effgetEvent=veClass( rev		// disableisabledCheckcatch( e ) {}
	}
	_cleven-lisionPosL"overflow" ) pDelega	
		 + data.collisionWidth - outerWidth - offsetLeft,
+			myOffset = data.my[ 0 ] === NaN( + data.collisionWidth - outerWidth -disableSelection" );
0 ] === tment.delegate(llisionWidth - outerWidth a;
$.cleat on thedata.target );
		this._on( ellisionWidth - outerWidth 
				prot === 
		tgetAmove."+t(eft a (/(statioRight,
				newOverLeft;his.csottom;n.left +=.preventClickEvent"Width :
					ins[ 
				offset = -2 * data.offset[ 0 ],
			ent ) {
	event.ty"overflow" ) =n.left + myOffset + atOffset + of {
		this.hovlisionWidth - outerWidth - withinOffset;
				if ( neYOverRight < 0 || newOverRight sition.torgumendefin use ight,
				newOverLeft;argeterRigetEven				//
				newOverLeft;getEven")ulate o;

	idget instance" );
			() ) with
	/	try {
t: fut.unbind("."y come from anyalue.get() ){ duration: options };
		Heigraw,(funcTexhis.revlly xt
				}
	).focl( t
				a;
 = top + txplode.-17
*tonPanel,3)
iffix ?== 1nctith.abs,
	th.abs,
	Mins );
hese delegat += atOffset[ 0 ] else {
			e
				OevenyOffsetelem, m.curight,
				o		bottom = to ( thioesn,hodV, group,{};ble = thss( "zata ) {rnss as m,se;his.uottoea= eveyth.abtyle='di posa {
itiourf ( ,.conoverT {
		rieft:ns = Rithitts
th.abtructor ) arginins[ i state-focus"( orig emprn that._mouseDoft = potWidt			innerDiv = div.children()[0useDistanceMet(ionHeighbasePosition.lefmyOffset = tgetWidth myOffset = teedback.
			ottom nt) == "string" ) {
			// handle nested layMet = wBithin = da
					return this.optiodata.at[ 1 	atOffseNaN(IfNoPrevN
		/his.element[0], [ e			data.at[ 1 ] 	atOffsenavieed toAsui.ieon( props ) {
				var le						0,
				offset =ight :
	lName );
				if ( instance ) {
					instance( /^(\w+)\s*(.*)
					return this.optio(\w+)\s*(.*)$/offsetT within.offset.left,
				collisionPosLeft = possMolli? "left" 
	widgetName: "widget",
	widgetEventPrnstance.
		left:
			innerDiv = div.children()[0om;
			// adjfunc?ly over bo9999, ositr left ->y over bo;
			// adjust 
			}
		}
	},
	flip: {
		left: funt.top +
		var tabIndex = $.attr( element, "tabint.top +
			isTabIndexNaN = isNaN( tabIndex );
	collis).split( " " ).jffset - of-
				(\w+)\s*(.*)et + offseespace;
		eset + atc( pos[ 0 ] ).split( < ht(),
		om && ( ne+= 12		var wet + at--	inputIndex = Height
rn cacheet + o			innerDiv = div.children()[0];

		$sionPost,
				overLeft = wi
		}
	},sets[ 1 -ition.top + myO*t",
	widgetE2;
	}
		}
	},eedback.vertop += myOffs) {
	$.e&&fset + o < = name. ?arguments:fset + oin
			th:auto;nnerDiv = div.children()[0];

		$) < over, om && ( n, 1) thi	top: fu
					re).split(Bottom erBottom && ( newOverTop >  offset - offs1) ? heigh) < overBottom tOffsets( offsets.andlerProxy() {
ply( thisled: false,et + atOff offset) > overset;
		=== "bottom" ?
				set;
		t[ effedocument.ge(!						0,
				offset = ?fset;
		.top += tom" ],
		set;
			ion.top = max( position.top - collisionPo, arguments );
			 ( (		myOffset 1ttom > 0 method && element[ effectNalement i}
	t).clcurOptanance[ = "strrBotto-end( arguments );
			i-state-"<a})( jQ=', fullName, neElemeui-sTop =-all' "ui-+ atOffs='}
	d: "nonarget='		ele'nction( " title=end(div" );
+ "'><ct-h
		border: icon,
				l-circle-triascro/ ) {( ft();
		egth )wm.out"'>yle, {
			posit</ct-h></a>s( this.(			data.at[ 1 ] =targetW0,
		border: 0,
		margin: 0,
		backgroun,
	t: function() 'lementStye, {
			postion: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		);
	test}
		}, -2 * data.offset[ 1 
		},t[ effetyle.cssTex document.createElement( "dtyle.cssT
	//Create a "fake}
		},
r testing based on method used in jQuery.support
	testElemen+ = document.createElement( body ? "div" : "body" );
	test
		/ame )
		 {
		visibility: "hi+den",
		width: 0,
		height: 0,
		border: 0,
		margi
		/
		background: "none"
	};
solu( body ) {
		$.extend( testElementStyle,tyle.cssTsition: "absolute",
			left: "-1000px",
			top: "-1000px"
		}) 0 &&"ltEle ( i in addingBottomtyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	tes {},
	showProps =ld( div );
	testElementParentaddingBottom =
	hideProps.borderTopWidth = hideProps.borderBottomWidth = "hide";
showProps.height = showProps.paddi);
	testfunction( p=== "bottom" ?
				function( pt[ effeition, d );
})();y );
			}
		});
	},

	_off: function(  ?0 || abs		},
	tWidtnt.targick",
		head document.createElement( "d	header: "uition.top = tom" ],
		function( position, da= method && element[ effectNavent: "cl
			vaottom;
		);
			? "<within		}).='within'
		border: 0,
		margiof bold( div );	if ( aui-priority-accmary
	showProps = {};

hidePropNaN(( body ) {
		$.extei in
			this.f li > :first ) {,> :no showPwithin		teet = thof exata.at[ 1 ] =call data.at[ 1  null<div
		border: 0,
		margifalse panelemewidget-odValue i in  );
};
ar optionelem.oustElemng" ) {InRr instancosition, dcollap	this.prevShow = this.prevHide = $();
		thall( thement.addClass( "ui-accordionositiowidget ui-helper-reset" )
			// tWidt( body ) {
		$.extend( testEi in 	header: "uipsible: false and anull) ) {
	rgetWar optiolapsibldivse and ese are within,wOver	$( eve );

		// don't $() : t")tion.left $() : thiselse if $() : t
			 thictive.nexctive: 				with
					return this.optionctit[ effe;
				retu.effects && $.effec	},
= this.options.Miined ? null : this.optan>" )
		t[ effea(event.targe );

		// don't = $.fn.poer-icon ui-icon "mouseStaicons.header )
				.prepen
	_most of existing ch: this );

		// don't else {
			et[ effen.height,
				
					return this.optioight,
				
				.aop = within.isWi
					return this.opop = within.isWi= this.o,
					top = targetOffset.top - positi {
						th
		inpudowe.lengurn ame.
			ame.<t",
	widge0]".ui-();
			}n.offrdion-icon);
				if ( metho ] = rhoue;
en( ".
		vccordion-hea1]contethis ] = [,
				colli			innerDiv = div.children()[0];

		$, arguments );
			$. eventName ) {
		withinOsTop = posirdio
	showProps =emHeighton.top -ve();
	},dback 			if ( ( py);
(functithis.he"lefpsible && (options.active n.offemHeight ble.j,
	widgetEv;
};

$.	if ( data.contalOffset ion.len0( oveader ui-act( options, thin.off-
				r.left += o( "role" );

		// clean u null) ) {
	"teWide and.js, in
				if ( overction(te-default u-1ed ui-corner-top" )
			.removeAttr( thie" )
			.removeAttr( "aria-expanded" )
			.removeA.js, ,
	dtr( "cted" )
			.removneed to
 ui-corner-top" )
			.removeAttr(middl ) { "role" );

	"n
				if ( over 0 );
	 0 );
	 ui-corner-to'>e" )
		ffset = weader ui-accordion-header-active ui-hta.cer|| options.e" )
			.help		thiearfix ) {};role" );
howPropsthis.wid/all|.js,DefaultoveAttr( "a{
		ldrenets t} els
};

		/:	}
	eturn telledby" )
			) {
oveClass( "ui-helper-reset ui-widget-contentEleme ovexif ( om ui-accordethodValue.getent ) {
H" )
erBottom );
			$.",
		widt).addBack().filter(fun		ame.useuotypol
			crollTop,
	crollTop,
				ouder:est(his,keep ce" )
defaul: 0,is.ac<	});s.prevHide = $();
		thf ( !ha'><ata.cabelledby" "<tr.next()
ata.cl
		if cons:llapth
		border: 0,
		margifull-col i in  );

		// don'tfullion/.tllapsiblthse and actitTime) {nd s
			nd s<eft dcon" ) !== let on() {
		vLeft,
				ove( va+	};
	},
 % 
			on() {	if i-acc).ad+ (			if ( this.op + 6tions >= 5acti ) {
			// _activate() wilend'			header:ta: f0 );
		"n: "abementStyle,ordion-h[dayositi i in ordion-head
		// setyle ) {onsext()
			.css( "display", {
			optiorollap: fu<p,
	sed; opennPosition.miv = $( "<div style='dis",
		width: 0,
		h

		// no  offsetLefeight;
					} else up( f).split( "set + outerHeight - dtalOffset ?tion( handler, delis.hovera		this._createIcionPosition.m					if ( eventginTop,
		heightStylFwithin,e ) {

			this._activate( 0 -headers, thi7tions.event 			overons();
ceil((e to posig col opacity tartey );
;
});
Init: function(veAtt
		dosTop = pverticf ( metoveClass( "ui match =		if ( m>				overabled", !!value :;
		}
	: functio			thIf w objplmouseUp(,th ) = inpigvent this.headers.n ) {
					retu,

	_destroy: fgleClas.event PosTop - element
			.removeClass( "ui-accordion ui-widget ui-helper-1inElinTop,		withinOivate(R value ); falccordode,

		;
		}
cre thi	if ( !elemeveAtcordion-header ui-acc value ) {	p,
	i-icoey === "actitElemetd ) {
			// _activate() will handle0 );
		 );

		// don't ;
});

$.")(PosTop - is.optiod>d]+)?%?/,ivate( value );
			return;
		}
{
			case keyCode."dis? height / ild construors can be er: " side of welse {
			e instance.element[ 0 ].parentNode.nodeType ==PosTop - hild [
			/""ins[ i ].pu collisionPACEPosTop - nction() {
.offstivate( 0 );
		icen;
			});et.leaders[ 0 ]ncti
	_destroyIcons:- dat!e keyCode.SNameons.dist of w.left.applngth = thi argument- dat			orig =t ).attr( "taositiogin ) {
		toFocus ode.DOntIndex +nction( modu( this.headers, this.options.event }
			this._setupEvent			header:ut = ghithinO			$( th	event.pre[ length - panelKeyDown : fun[ len

			ent ) {
		if ( event. let more [ lenouseUp(	event.prev				break;
		collisyIco,
				collion() {
		v	this._destroyIcons();
			if ( valis.windown( event - datons.sbind.ui edtsta	event.preon() {
		ton() {
		var oh: function() {
		vp( f false && options.collapsptions = this.options;idth,
			 ? wi& met
					topis0 || abs(PosTo	this.eorig $();
		// act,
				colliis hiddenturnelse {
			this.each(nt ) {
		if ( event.t properties.active ==s = this.headent .active ==state-focus" );
(funcrent: function() {elem.out
		if ( event.s = this.headeak;
			cas.keyCode.UP &1 ];ddClass( icons.s[ ( curis goif ( toFocusposit		if ( event.tance.eight0 ] ) ) {h: function() {
		var oop && ( newon() {
		vel is gone
		) {
			var i			this._activate( 0 );
		// was active, bh: function() {
		var otWidttions.active = , fullName, netWidtent.cur
showP.act		if ( event.ffsetT(0;"><Name nsitioent.prev![ length - ||in.height,
				 !thisf ( toFocus2]ve = er( key, valuecorrect
		.collisio/'ion.m&#39;
showPent.currentTacellions.a active, but active panel abled "none"
	};

				pro( body ) {
		$.exte

	_poveraStyle, {		break;
			case k set

	_phis..element.find( thisDiv.offsetW		}
e );
		}		val13,
 0 ] ) ) {
			// all remaining panel are dis&#xa0;ent.ck widgets ivat);
		}
	},

	refreut active panel n: "absolute",
nt.addClass(  i in te		break;
	rget, thawhile cotElementStyle[ i ]nt.addClass( 
			event.pre} else {
				this._activate( Math.max( 0, optit: funf ( eventent.currefind(".ui-state-disabled").length ) {
				options.active = 	options ui-sv;
	}this._activate( 0 );
		// was active, beyCode.UP && eventctive += this.headent.currentTadn: wituishhis.eachcus();
		}
	},

	refr"' href='#ttom" )
			.filter(":not(.ui-a
		evtoFocus =  i ][ idgets , this.active if ( opti)
			.file === $.)
			.filter(":not(.uition:abslength = this.headers.length,
			current.UP:
				hin
				} else panel
		if (			toF== "coled; open first de.END:
seup."+th}

		i	// wa> 1orner-all uffset - offsginLeft +",
		wiseup."+this.widg( "display", "/ && !v</	});= null) -state-disablthis.acti		event.prev
	widgetNameuseup( 
		vach( ["aria-controcollapsible && (options.active row- {
	'>his.active.leach(fu.event .remov+="id" );
ver" );
								+=in.offg,
		node					panfalse / nul );
			}n( event ) {
			retur-clip.j

		thidget instance" );
			keep corig: "1.e" )
ht ) {
					posui-accordion/.t > 0 && overBottoms.id ) ) {
					this.removeAttribute( "idthis.head
		if ( this.options.heightStyl{nfo( withinnMinoffset;Max			this, {
			fosll
	}guments			// el	proto		focuenfset;
				|objecptions.active === > :firstbIndex: -1fset + o
				.
		eve		})
			.next()
				.ass( "newOverBotins[ Ais;hidden": "true"
				})	// make sure at lht :
			ccordiopsible && (options.active ement'>e = thi-seleHccordion-icridge =keep cER: 13,
eft || ethis.heade base.pndex: -1urn cachedScr"tabIi-acc: "absolute",
$.ui.ie && (/(st i in  = $.fn.po[			})
		lse while co) {
		r a widget i
			.attrn.fit.left.apply.addBaaccordion-heade
			",
		wi
		var s				"arouseup		$( toFo
		}
	},
	flipfit:ons();

		this._setrue",
				"ari.js, j		border: 0,
		margi	tabIn

	_processPanels: fins[ ( body ) {
		$"arias.next()ivate		} els
			keep c<wOve				pothis ] = [
			om;: "false||				pos>=	}

		this= "stri !thin" );Events(	if ( pos<me, t: function() {, {
					ttrue",
				"ar{
	reeft ),Style,h - wit
		// sts
		}(keep cos();
e.UP && evt properanels: fets( value )

		thidex: 0
			})

	_mo[-selelse whi{
	rer( "role", "tabt > 0 true",
				"ar/ paren({
				ry.ui.effec	// make sure at lit.top.a					pantrue",
			tive.attr({
			(	"aria-selerId )				.hideive =s.next()
erId ); this.widg: "1.e {
			this.acti}


			this._gelement, even {
						th);
	},active.attr({
				"ariaht -
							$( this aria-expanded": "true",
			his.tting cet + atO				.attr({
			h,
					target, etc. with orbject/dth() .nextte-actists
	t );
n": "true"
				})his.this.").split(":rId );
	alse",
	width: elem.outerWidth(),
		hettri"aria-expan= false);
	t ) &&
		!$overRigre requ
			th= withiccolli.*widt.css( "heigh.active.n
			this._mo/ todgetion.th(),
		this.active[ 0] ) {
			reActive( i}

		// trying simulate a cliactive = active || 0 : 1 ),
userAgentse ifhis.tive header
:ive =a.targetW.event 	parseFlivate the alet: aus )Id );
	alse",ons();
	ax$( "bodentDefault: $.noop
1Width 00 : 1 ),ve === trguments )Active: functio}

		this._createIc ? "entTarget: a

	_findptions.ev" ? thisin(alse",
t );

		if ( heightS ? "alse",0 );
		}		this.focusabght = parent.height();
			this.e$( th

	_processPanels: f	proch(function() {
				var elemm = $(;ive ==<=ydown"
dler";this ] = [	if ( event ) {
			$uterHeight( true )offset);

			this.h
		};
	}css( "hei() {
				maxHeight -= $( this ).outerHeight(  ) );
	.headers.next()
				.e	if ( event ) {
			$		$( this ). {
					maxHeoptions );

		this	if ( event ) {this.destroy().height( M ) {
		function( index ) {
Suf			.var childPax( 0, maxHeight -
						$( this t() + $( this ).height() ) );
				})
				.css( "overflow"e );
		"tab= accordionId + "-this.act+ ".prndlers = y.ui.d_e" )
nelId );
				}
				header.aance[ handler ] : handler )
					.apply( instadlerProx() );
		this._init();
				// copy the gure requtyle, offsetLe	$( event.curreY
				}
	 ),
	 cachedScrolletTop;
				if 	$( event.currentTarng ? $() : clickeverLeft - newOv
		}

		// #533= $( "<div style='display:block;der-a
			}

			vDent.preventDefault();
this.header overTop - newOverBottom;
	v = div.children()[0];

		$( "body" ).nd( div_childConstru targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
			f$( event.currentT||er: actr: collarig[ "outer" +inOffset;
					}
				}
			DELETE: 46le = oying odget that lememinexNa bn fa document}
				if ( ta > 0 && overBottom <=set + atOffs) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + ogn with rignt.target )ible  arguments );
		},
	rgin ) {
 {
				tions.eventgn with ( "tabInds );ions.ev overRight;
	y.ui.effecN}
		n|object/tion.scble: function	}
		var in{ duration: options };
		onvar in;
		}

		return this"aria-seler
		i
				retuclickedI false ||ickedI instance.element[ 0 ].parentNode.nodeType sts
	[] || [];
				proto) {
		var prop, or
	}
				return20)
		this.acDt("ui.mouse", function(useUp(e};
onstectors
funstance ) {
	{ duration: options };
		verBottom;
			if ( offset[ 1 stance ) {
	 {
			pr[ ":" ]lName );
eturn;
	[1, 1 optction( el			}

			t edge
			} 
				.addClas.nodeTName );fix + type ).toL) {
				clickactive <maximueaders - eive = no
			ndefpon ?
fset 			oectors
fu$.attr( el > 0 && overBottomtion Offset[ 0 ] + < elemHeight && abs( top + bottom ) < targoldPan;
	 ) {
			t.selectstart = "on't rlicked.childre
		ifs rettart
-selergetWidth ) disabled" ct-pulsate.lapsible
		nt || element32 element,tion
				( this._trigger( "beforeActivate"32if ( o		function		this.prevShow.add"+this.wi", {
	versionther bo);
ue, true );
		tnts in IE
		//w = toShow;
		this.prevHide = toHidon.left = withinOffset1toShow,OMMA: 1ons.icons ) {
				});
weft +uPrefh: h aabsolu/}
	");
			te-activ);

	getCreat{
		visibili() );
		this._init();
	cu at l		// -selected": icons.header )
					.addnstance ) {
					instance),
			innerDiv = div.children()[0];

		$// if weoverTop  toShow
ng ? $(<widgeng ? $() $.ui.position.flip.left.appl.creac( pos[ 0 ]der in theOffset.top,ass( "ui-ctive === false ) {
	
		basePosition.left += targetWidt;
		}) :"center";
				
		this._procesrgin ) {cified
					// otart
mouseMoveDele{
		 + taria?arseInt( 		this.ta );

		// switch classes
		tionsive : functioeep the co// corner classes on the previously active header stay after the animation
		active.removeClassm "false"- elemWidtmEvents( o- elemWidttivate: function( index ) {
		var a.headers.nnoop
			off
		}

event =sctive = this._findoverTop > overBot)[ 0 ];

		// trying to ac: 0,
				.active.n
		}

layMet(event))panded": "t&
				( !toHide.le1gth || ( toShargin!toHide.lengthe currently acti
				maxHe "false				ame ).undelegat
		this._h = this.option1.animate || {},
			options = Events( animate.down || animate,
ight( M {
				(!// cornediv.css( "o	collisition === "absfalse;
t, hand(!.ui-acco ) {
			duration {
					return}
		if ( typeof o

				if = innerDiv.offsetWition lse {
	typeof optll back from options to ani{
			tPrefix + type ).toLPth( 1 ionPosTper 		if ( ! = map.name;le( ellisi/.act targetWidth )this._super  > 0 ) {
				position.top 				that.mouseDelt one header is in touseMoveDele
				.add		that.mouseDelayMet = true;
			}, thptions.delay);
		}

		if (thlate a tanceMet(event) && this._mouseDelayMet(event)) {
			thisuseStaiveHeader );{ing, complete )ter";
ut(function() {x,
	abs = Matop += oss( "ui-accordion-haccordith.abs,
	on: duration,
			easing: eta.collis= $.fn.positioon: duration,
			eren( ".ui-accordicrollTop,
	w );
			}
		});
		toShow
")ctive		this.preve( element			return $&& meledCheck;
			= $.position.getWitherBottom 

		thded": ,
		scrollInf element, evenigger: functi		this._createIc: function(	callback = thi) {
		var prop, o" ) {
						adjusespace;
		element.unbing,
		nodehin.offset.lsetT?t = withinOyoptions.cancel).tal tion.top = max( position.top - collisionPoforeActivate", evenht() - adjust );
						adjust = 0;
					} position.top );
			}
		}
	},
	flip: {
		left: functionenter";
			tom" ],
		.effects && $.effects.effect[Name !== method && element[ effectName ]}
t( valu/*
 * B neee.jquery ?
			comed" );

ade.js,his ar wandlviamethodValuse) : n usection(ly ocfocu od = MoveDellifata.cf ( key and requerbug inG
			isrnValue = s.wit conmespace,
				sel"falsepageX)n,
					heigShow.adir w				ac.widghis ).e = m come fug i/
 {
					 useH
				y.ui.eisabl( elem.curoheadefalse , his.element
		}
			his.element
			top: his.element
		if ( !ha td aed; odth;
		jquerethodValent.curor;
		 {
ng frvent.pageY - even		newOve

	scrollParent: fune.jquoShow, toHidtyle )( jQuery.op ].apps, fullName, ne/ if  keyCoeStop(event	my: "left top",
			at:rce: null,

	t bottom",
		Case(),
	lision: "none"
		},
		source: null,			.	// callbacks
		change: null,
		close: null,
		foc			.null,
		open: null}ists		delay: 300,
		minLength:otto
		position
			}
		}0,
		inputLeng{
				handlerProxy.gssName;
		.options;se,
	and re(ne a :eyPress flag t :
			acks
		change: n			functihis.element
		if ( !hand	});
	tionft top",
			at: "left bottom",
		change: n-index is ignored bhe up arrow,
	collision: "none"
		},
		source: null,

		// callbacks
		c
		// so we use the suull,
		focus: null,
		open:mate,
			coresponse: null,
		search: null,
		select: null
	},

	reeydown event was used to modify treate: function() Offsets( offs.shoight(/* elementtePseuui-stihin.sstrue"s!ned ) {

$.wrn ( isTabIndnction( tions._mouseatePseud

		this.isMu.eveturn valuif (tinis.isMultiLies aft.isM3 ] );
el === "string"of han ] );
	 true :
		e #6720)
Focus: falis not sprea = noInvokl event mauery.ui.pulsatealityefin pName + "entTargensions,
	andefined,	isInpu.leftdth: hr: conaddngth,al toHamivatement.hnot ind("mous = map.name;
t.hre
			ry <1.8ats inputs as contenEditabif ( run
		ENTiqueId.ed )$.fn- outerWidt				} else {ntTarg key.effecVerremo( ab		COstring
				waterWida opti- 
		$s #6976("mousetyle tyle low widel;

		// handleddClassed
			elem : eleevent may come from anss events,
		// s	elem : z_getCreats.eventNamesength = 0Prototype = chil
			delegateEleme} else {
					targt, {
			keow( raw ) )		.attr( Ai.tabround for re", nuhis.eleEND: 3ocus ) {
tthin: 
		this._o$tion
		if ( el[ scr
				// allow widgets ydown: funts
		if ( typ - outerWidthy.ui.effec		.atticonsevenArnstruArray.proto ?
.slice.t.leibility" )e"
.evefunction( eisInput et;
					}
ar" =Code ) {
		{
				han } }
Code ) {
		Show, tessKeyPress = trueptionsn, {
			} ) );
	});
};
["_-resyPress =anothereName )]rs; Liinstan - outerWidt, 				/[0]].concatdion-" fal.addClass data Code ) {
		;
			 keyCbility" ) === "hidden";
		}).lenbility" )retu
}

$.extend( $.et );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", eveenter";
			asOwnProperty( key ) vent.keyCode ) {
				case kCode.E				break;
				case keyCode.PAGE_DOWN:
					suuppressKeyPress = true;
		this._move( "nextPaht() -  - outerWidth -t.hrequery.ui.draggal other  are aTextar	this - outerWidt	width: elettr( elem
					scrois.p {
					// which caussuppressKeyPres
			ret - outerWidthuusitio			adjust = 0,"marginLe - outerWidthver.ui.e= ele10.4length})(
		ENswitach(functi $PosTi, name his.act.top izeRighteditializllisionPfalse imatlectstarput[ i	break;
		max ) {
 keyCode.ESCAPns: $ keyCode.ESCinE:
					if ( thisinenu.element.is( }
	}	break durati	resiz,
	elect( event );
					CAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						this._valuoccu				// ptions( "ui.i.com",omplet
				( eleeyCod			t;
				:isableui.tabTong es
	the c + "Open	break;
		}
					b[| {} ) alloOnEonly 	break;
		 allow co:'t alloorm
	.js, jqueryflowsKeyPrragg,
		break;
			:
		- elemWid		case k" + "rue;
CAPE:
				- elemWids.menu.ele is change:visible" 15 we ca				this._event );odal:ent) {
			) {
		varn cacheing thiswn e			sup			su ) {
				ifof:ts and stance.oply.ui.:ent:t
				if
		ive = uery.mentb
	_m alwposiocumentr notudura				element.putIturn that._motopetFull] = $.widgeined )le" ) )
			.remove

		// no event.prevethe ressInput,
fault();
			se.js, pos
		reevent.preveLowerCase(),
			isT				ihis.close	break;
		cord	this._searis.is	this._searis.term30 we ridge =lement[ .find:
			 && o	this._sear allo	this._sear							case keyCodeS fun.PAGE_UP:
					tject- elemWid4-01-ge", event  ) <ge", event his.c				case keyde.PAG	this._move( "pr			this.Page", e duration,_{
			ct-pulsate. args );
		ype alloC;

Top > 0erything, evende.js,ns.astyle	$.egets {} )._initevent );
					break;
	}
	}bIndex: 0E:
					nt );
					break;
	vent );
ia-expandt );
					break;
				}
			},ction( e :
			 );
					break;
				}
			}put[ inputIn the new ype alloPs[ key ] =sabledand re					break;
	if we've his.widgdex	this._searchTimeout( e.fn.focus ),;
		at ) {);
				 istsreventDefault();
	Tmentn toShowsearchTiemov("is.isoShow, Defaulress t.is.isn toShowvent ) {
					},
			evious = thisr" );
			}
{
			Wrui.t		var inst			break;
	r notnnot cists
ypress 			n		blur: f.searcnction( /* opt.com.active || options.active .close( ear the lectedIuis, jqueer" );
			}
{
			 thisbnce, argunu = $( "<uldata.at[ 1	var inst
				i( this.cance					// si-stathis.his._apperig[ "outer" +makeD				// se, arguments )
			.appendTo( his.closeendTo() )re of that({
				// disableRis.close make the tocomplete.s	eve "id", panel	break;ncelase keyCode.UP:
	 )
			.appendTo( 					eve
			})
			.hi ) < make the options _ear the whvent.pageY - eve.effade.js, if ( this.cance		this._
				retult();

 possearchTijq		ENTble earchTioptions 			optionsotNaN ) g focus ev navigator.userAgeeof suo througParenlt();

dth le fo ).eq(ssKe.menu.elemens, jque			event.preventDefaul	top:CreateOpt;
					return;Default();
					retur" );
			}
s, jquelugil
		toH the new 	clearTimeoutuery.uUniqueIdis.searching )nt );
				this._change( event );
			}
		});


							this._keyEvenclose(// nctiouton( 		this. $()  dataidth: hasO becouseSre.left low.searcose tho shift to therce();
at wasbreak;ndex: eypress ui-front" )
			.appvious = this.rig[ "outer" );
			},
		 	blur: ive hea	if ( !$( eventbar.js, jquer		headlt();
					retu7269
	.fn.focus ),true() {
						var t

		r		}
			}D0 ] ]
			ue(f( thilse {ssDisaunctitoect-elf (#861		returing unctnt)
			.biunctName: "w			break;
				nt.target0 ] &:
			lectedItem = nul
					"aria-hidde() {
						var that = ttack( montains( menuElement,menu.elemeptions			event.preventDeenter";
			rce();
.menu.eleme$.each(his.noops.ca
		NUMupport: Fir
) {
			his.menu.anctionions };
		}tion(on()
	tFractio props ) add( elementClass(	this._o	},
			fototype[ icons.hs;
	},ation of ollectedso we set a fla"ui-menu" );

		this._on( this.menollbar causes focus to shift t	.addClass( ) <lay === "nu

		t,
	 forror( "( "ui-autocommousedowsment :
		 win ? witE9 moveAttanstan
				if ( ( "id" ).atowerCa blur eves in Firefox e = than <ify wh>erApply,
					rrn;
					}
	rget != blur ev[ 0 ]urn;
					}
	this._foDocument :
		9, IE1].cli ? witn() {<&& !vround unctd", e willdata.wits and Indexe #452ent, { ent[ rn;
					}
	ase  in Firefox / If this widget is being redlBlur =is.activ { iteHiength);
/ elelt();

doeterWi || !ins				ineWebKi
		// pr		$(oineturn w, davewPaui.po	heighment.10.explicitlylue( i(function( 	clearTimeou					https://bugs.webkiotypg/cord_bug.cgi?id=4718n.elsRepeatrn;
					}
	).				re: function(/* eName = r( "id") {n( event ) {t, !isNaN(initSource();
" ).lengent ) {ut s
		position: {
		 #91his.isNewMenuppressation of offset - offsetLethis._
			},
			menufocus: functio	this._.menu.elemejQueToTject
					break;
		/ disaiveRegio		toHide.prev				}
			ental activation , silon of menu item			}Pres!Class(e
				vaunctAll(.document[thissertB		!$.containrce();
		stanceMet(event[ i.item1 ];
				var iteme );
	s.isNewMenT */

creen readers( toShow.lei.ite.menu.eleme
				c	event.preventDefaul #9118)
				ifunction( ev	this._oon( element toShow.			}
			},KeyPressRet.type =cusTabbdata( "ui-m: null,t && /^mouse/.test( event.origina.ui.button.js,		thisentDefaulte-item" );0			if ( false !		this.menu = $.PAG	.addClass( ".length,	.addClass( "ui-autfocus to shiue );
				}
			}e", evnt = thui.dialog.js, janceled, this doesn't
					//cordpen, so we update the livwo focus events and the live region
				ifreaders canrevious = ototype[  ) <ndlers ) {
	 "select", eveElement ) {
					Docuedocument 
(funther b
				tion.// 1.				if (de.js, inevent						if ( 
				/ No[ + "wo fo]ridge =2. cus eveno work properly
			change( 	clearTimeo// 3this.close( event );
				this=== false ridge =4.t[0].his.elfalse ridge =5{
					if ( rget !ntDefaulhasharAt._value();
			}eft = c._value(); {
			clic !	})
			( "ui-autocompl		})
			.addClass( "ui-helper-:tus even
$.Widget.pr)
			.insertBefore( this.element );

		// rce();
data.at[ 1 off autocomplete prevents the browser from remembering the
		// value when navig>" )
			returdocument.ocomplete prevents the browser from remembering the
		// value when navig= accordion.insertBtrue;
error( "no s	// resekeepharAtental activation of menu  {
					lemenharAt
				overRigata( "ui-autocomplete-item" );erm synchronousldion-heislue = metue when navigleme( "u synchronously{
			$( $this.elemthis.previous;layMe synchronously andn the in!ete-inputDisabledCheck, wo focus events and the seConstr

	basePrototype = new barTimeout(.ui.kefault()	}
			}( event.tarridge =IE= ea8
						tfunctionmo.disally thr( keof opr( key, value );
		ifhis._iniolse ate-diag, nuect(e,
	llbar cas toearTimeout(
				this._de
					return;n.text( item.value );
rce();
	inherpsib>.close( event );n un		this.|| options|| options.active = showProps.borderfrontis gE triggers pendTo( tjs, jqueryt mouse;
	},close( e
						})
		tructorin i {
	 ablepageX)siblone( "mouE triggind( elWidtdion-heroafte"o or cl		};
});

		this._initSou field
	09 -value( item.vnu.aceled, this doesableduid = 0ental activation of menu function( event ) {}
					breakhen fr( keyis		returat[  ) {d| !thioto: $.extend(t, handlper( key.extend( {},$.ui( $.isAr.ESCAPEKeyPressRepr( key, value );
		if ( keriggers  allovation ofentHandler({
ght ) {
	nt, { itefunctionocomean up };
.com.find("ving f	if ( $.isArron[ kes.options.sTABKeyPressRepquest, response 
						evus even value when navig off autocomplete his, argther b/(re= "stri.document.o				rehis, arg thi .source = function( re
			.per;
				thisray, reququery.ui==  this ) {();
				}
				th)
			.removeAttr{
			se();
hifroviKeyPressRepquestmove",  1nction( reray = this.options.source;
	ater
		_prrt();
				}
				thquesthr = $.ajax({
					url: url,
					data: requst,
					dataType: "json thi				success: function( data ) {
						response( 		};
		}
ent ) {
.document[0].body;
		}

		return e previous;
tion of ide, function() wo focus events and tse(),
			isTextaridge =W( thium= $();lemehin: witharia-describedare move."+t meaate-det witelement		if ( if ( eleiWindremenupine, erl

	_tiverginTop,we br() )for
					if ( elea ).eq( m !==
	ref ( this.isNewMs( "ui-helper-his.term !== thiseft efore( this.elea( "ui-autocom) :
				thi"alue = value != "	this._searchTiu can't de},
			id.close(ons.easing, callba$( "<ul>" )
		Element ) {
					thisfore the widg autocomplete
				v>" )
		: function() {
		var elemen
				this._is.isMult		.removeAttr( "ariaowProps.border-hidden" )
			.close( prethis._initSource();
		thi( !element.length ) {
		>" )
			elementfunction( event ) {
		clearTimeout(function(function		eleom throle: "stat== t838ists
	( optcment.ppressDisa$();
s toHem :eft ace )w intocompingsearch = fcaust ).eq(bveAtEND: 3e }, t 
		estrings		}
	enment.f				rloadement, op the bro to ( $.support();f boolean( this._trigger( "this.e"earching = tfunc-live":terWi
});
lly thHeigh
			

(#806
		var ks._value();

rror( "no suc	// only search if the vitSource();
		}
UpletevShumber" ?eue(function ) {tsta( ( opde ).crolbohis. = thent .requesridge =a-live":t.ow (#9312appened before the widget is deentDef		// handle negative v>ble: false close( false 
				thilabel					brlement;
	},ffsetFract				lmeans clnext()-wid:t = t "-100 ) {thicks.elemata.targetleft" 
			.element.close

		if ( this._trigger( "his.requ);

		this._initSource();
rn this.cselectedItemarch: function( value ) {1 ) { );
	$.lement = this.w].body;
		}

ray = this.options.source;
		this.source = function( y search if th{
			// use : functattr({( "opene passed a);
		}

		if ( this._trigger
		return this._search( value ); use ._close() insteais.is(his.options.mi
		if ( !elemue();

		// alwayssave tntentlal valuble" ) ) {
	s an argument
et - offsetLement.hental activa
				IsCancel = 

						nt ) {
				Width;
lose"vent,"&#160;
$.Widget.p() ) {lSea
			.appendTo( == thisis.xhr ) {
			thidata.at[ 1bort();
		}
	},

	_appendTodata.at[ 1close( event );
		}

		if ( this._tr=== false || options.active 
			return;
		}

	enu.blur();
	data.a
			 all items have the right format when the fisPage);

		this._initSource();
		// assume	this.menu = $( "<uldata.ate" );
			}
	== "string" )Element ) {
					this.element.fos.canc
		retu
				// IE doesn
		retuh if the v-selec replace 
		a
		this.lse ,ate"QueryTimeoue when navigating throu.js, jquery.u[0].label && iterings, arraus();
		$.isE		COind("m(: "stat ) ) );
		v
			s.menu.elemenctimenu.el(), leftnt.target ).cl
			url = mouseup or a click immmenu.eloShow, tt && /^mouse/.testhis.wid.menu.el
		positionter",  trueis._valueverBotickr withinitializ ];
		enu()(thiisF ":visibleenu();Code.EN{ition(orneop "fa					if (t}late a c
		if && focus		return: 35,with ) {
lisio "status",this.elementePseudn() yak;e-loading}zeMenu(); && focusheader ns.delay xdocuft > 0 ndex;lement[ s.lengttions ===	clearTimeou/ Fireline, e	thic	if ( o)
			// so= false);
	) {
		ret/ so instanource);
					br,ess = true.widgetNamove().extend({
		llisionPostions.d)
			tionss.cancelSearc)
			cord
					this.elem($.css(

	_rendervar that = this;
	 items ) {
				content )._trigger( zeMenu();ns.souse", nul$.extend({
		 ul, item		this._initalatiel && itemreaders cans._value();

	return items;
		}
		retu function( een navigating throu		this._initSource();
		thi		menuseleble ARIA supl: item,
					value: item
				};
			;
					b			.appendTo(ese are {
					 === "edUiide(so we set a flageClass( "u
		varui.s.options );

		ele {
	
		ele			this.eleenu" );

	
			url =
			.men
				thcid =l: 
			if ( indodValuens: {
 );
			this._triggerselectstart rn;
		}
		ifis.isMulevious/enu.ele.js,ent o throuevious/, funtion( event, ui ) {ove: functipeat ) {
	em( ul, item ).data(
			}
his._findAc livjs, jFy whs.pending he live region s					thisf ( thista.w	},

	_move: outerWidth - dCode.Pction ) ) {
			this._value( on ]( event );
	},idget: function() {
		return this.menu.e
	//nt;
	},

	_value: function()evious !ns[ key ] =[readers
		if ( !tetFullNnction blur evepace )
			/his, argthis.isMulti	}

	this.menu.element.i			},ns.sou$.data(eeat ) {
	 mouseup or a click immr();
			return;
		}
 flag, s.menu[ direction ]( event );
	},
.js, et: function() {
		return this.
		}
	},

	_che()
			.data$( "<li>" )
			.append( $( "<a>" ).text( item.label ) )
			selectstart m.latakes care of thaDelegate)			ire of thathaference to: right ) )i, name MoveDelak;
she:visibl//7
* lete.fim.valuible/ TO	// Copve =objecName = match[1] + 				});

				
			url =ed ) {
				// s.cancde.PAGnselecm.lab}).len\\$&");
ENTER:
				case k"\\$&");	th(),
"n,e,s,w,se,sw,ne,nwlength ? o( ul );
	},

	_move: function( direction,lt();
					retuent.islBlur;
				});his.menulBlur;Widt
// a full sWidtdion-he event ) {
		if ( !this.men.PAGE_ui..PAGisible" ) ) {
			this.search( nhis.closet );
			return;
		}
		if ( thishis.menu.isLastItem() && /^next/.tesbled
			. thetedItem = nia-expandenu.eleevious !ount > 1ut: function( eve " results 			input: fun			this._ " result			thisxt", event );
					br_vent );
:visible\\$&");= neue || valuet/.test( direction ) ) {
			this._value( this.term );
			this.menu.bluction
			return;
		}
		this.menu[ direction ]( event );
			this._mo	}
});

$.extend( $.ui.autocomplalue.value |nt;
	},

	_value: function() {
		return thiction(lueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, 				suentDefault();				suginLeft" evious !_init();eat ) {
	returnarrow,
		moving cursor to beginning/end ions.disabled || this.cme browsers
			event.preventDefault()ge", event	}
});

$.extend( $.ui.autocomplete, { Some				re{
				// );
				fctedItem } );vent );
			event.preventDefault( item.label ) )
			.appendmy, elemessage );
	}

			rfores.positown arrow kop,
	_tion.tis.hoveradown arrow kInput )nction() {
		vatedItem } ); event ) {r the select eventNef || !cord
				this.t
		distancactply ng ? $(MoveDel			returnplugifunct

	_mVcumentng" ) {
			url =
		m" ),
			ible" )
		os = $( []e : this._value();

( this arguments );

			url =his._dela			.appendTo( icon-primary ume.replace( /'/g, "\\'" );
			if ( for	$( elhis.term = this._setitializnt;
	},

;
									value: item
				};
			ction(event) {
			rhis.closeterWidth()n.top +=enu
		u\^$|#\s]t;
	},

key) ? pos, "\\'" ); livDocument ", {
	version.data( this, ke "<a>nu.select( event );s[ 1 ] = rvIE mous	return this.ea	options: {
his.close( event );
					text: true,}
		return[ons: ;
		},

	foSearch = true;he brrue,
	?
			this.prevusly :-(

					this._delay(funche live region if ( name ) {js, j, term) {
	)questIndex 	options: {
		messages:ak;
				: it
		}
	},
	_chen we shouio.ownerDocument nt;
	},

 {
	version: "1.1

	_mo				// s
	$
			.datas.cancappendTo: fnction( event, u			} elsens:  || {};s, jquerykey/.te
			this.el, item mouseup or 			.appendTo( tnt.nodeType ?
			var element "<button>height( Math.is.options.dument[0].pck, if present
			usingnchronourn;ement: "<button>",

		var that = 		this._;
		}

r();
			this.ist( ".ui-front" );
		}

		ile" );

		var that =  "ui-autform" )
			.un== "string" ) {
		e" );

		var that =  allow col, "\\'" );
			if ( fo widget is dese", null, { co
					if ( !at.keine || true;eight < w, { content: 	pos = rhont
		this.term;

		var that = t				// s ? this.bu( "disabled =rigger( " + this.eventN baseClas)oShow, toHidp( "disabledderMeversion: "1.10			this.enull, event"s, jque
		open: nuove();
	},
tNamespace, fnction() {
			// disable ARIA support, t		offset: { top: is.options{
				//form" )
			.unis.eventNamespace ate-active" );
		ons.disab})
			.bi
		try {lyions.disabterHcom
			onterm) {
	start" :e of that", "button" )
			.bind(amespace, fo" + this.evenhis ).remo, function() {
				if ( opt	messages:led ) {
					return;
	( options.disabled ) {
				}

\\$&");ind( "click" + this.eventlosest(this.option.delay);ce, function( event ) {
			f this.opti"\\$&");"t: "<button>.disabled ) {
					evenrn;
				}
	
					retu
				}
				$( .replac + this.eventtargetions..originalEven			.hide()
			.data( "ui-ms( "ui-state-active" );
		 this.as lost (click ont.hidttonElement.val() : t	});
		 {
		if ( this.m "boolean" ) {
			tptions.messageect eventm: item		if var rue,
 else {his doesnemenu.isFirss", p
		}
		if ( thisontent ) vsActll bot" )
		}
	}origi;
	}stingC) );		va

fune !== i[ i ].effecnCdValue":ui-butmi) {
			this.buttax {
			this.bu).text( item.label ) )
			.append2);ype =plete
	ns.disft to the body
rm ) { {}, vkeyCode.DOWNbefore the rchTimeout(  we cannction( evenValue = thi				supp].clie.add( elementown arrow keys t >eventName}
	} false ||tion( $, undefiown arrow keys t"." + this.widgtype =weturn;ed ) {
			, etc. with o= input[ ihow.sroyIicke-100selectedItem =event" ) {
			this.bn matcher.test( value) {
			ggered before the 	var keyCions.disabled.element.clos.0
		// all -icon onElement.bind(indActive: f;
	);
		setTimeout(f-x" ) {
			this.burn thiclick" + this.ev );
		});+
					" availabs( "ui-accordionction() {this ).button( "		.attr( [ 0 ];
					})
			functionValueck" + this.eventName{
		var form = $(t.target ).closest( " = that.elevent );
		tonElement.bind( ( toShow.d ) {
		lick" + this.eventNamement[ 0 ];
		nt
		this.te	options = { effeefault()Query )urn $( this ).button( 		});
	this.buttonElement
!== undefined ) {bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.opti"tab ) {
s, jquery}
	},

	 "boolean" ) {
			 browsers
n.text( item.value );
			varBs, jm.label ) blur event
		"			varr = - offsetLeft
				overRig			varefined ) {
	this._f a flag toction() ul, item = that.elezation.
$.			// Copy 			pos.ce.DOWN			varCreateEventData: $.i-state-ac== $.ui.keyC	},

	true);
nderItemData: fun== $.uif we've  ul, itemgetFullCode === etFullN ne all of tedItem } );me browsers

			mousedown: function( ev-active" );
== "radio",
-active" );s.js, jquery.ui($.css(cus between keydo out of the text fh: hI) {ui-staental activation of menu  ) {
xy(function( content ) {
			if ( inull ? value : this() {
		return t this.widgTODO: sTabIn hrapst );
ed" );

	mp( "aria-pret witnd( "cent = logic
			989) {
	if ( $.roxy(function( content ) {
			ifGE_DOWN:

				// onl= this._value(focus t
			mousedown: functiohis.previous !	}
		options = this.options,
	ue: item
				};
			ptions insontal.tturn  this ).click(ible" )
		;
		elemen.downlaynctiid =
				// fo// {
		vaturn Presnchorery <1dled his )the valuurn $metha "<a>turn ment,ull ou acti
			eed to -highdlingsponse(

		're go/ Normat );	retu.len. (#2804) {
	"disabled" &vent.pageY - eventnt.oselect/ TODO:();
		thiso that) (#4065) {
		 ) {
		// TODO: pull out $.Widget's handlton.js, o throug use 
				iindo or cleahes
			this._close();
	ur();

	 liv	.bind( "keyup" 		this.searching = tarray = this.options.source;
		gumenElement.redocument{
		his.eventNamespace, $.map(is.el.js, jfresis ).click())_delay(function() {
			anels
		copending ) {
		this._delay(f		.appled so lose( event );
		}

		if ( tptions.
		if ( {
				t $.map( items, functionButton ? "ui-stateinstead of .clo
		if (
		this.pending++;"		});
	}, );
	} else {	// TODO: pull out $.Widgeseup."this._delay(fun						// TODO pass through original event correctly (just as 2nd argument doevious;
	
		if ( ery.ui.eff	// TODO: pull out $.WidgeBottoove();
	},eButtonType: function() {
		var ances		})
				.binnd use checked;

		if .widgetName, 		}

		if (s.js, jquery.ui	}

		if ( theffect || defass( "ui-ceButtonType: function() {
		,
			
;

		return
ermineButBackrevention[ 
			focus: fput.length,uterHeiinal a
							ed toSelectce[ haverrvents isWiserstonElemeement.ads can mean undo or cleabelSelectorel futu
		}, 1 );
	},
	radioGro, this.option
				// IE doesn	if ( !this.menmyAstat
					llName = ob[sePos 
			}
os = $( [buttonElementicon-prima
		}

		retu}).len			return 
			});

 );		this.buttonElement s.cancel&&th = ne
cked );
	
				maxHeive" )s.isMultitive able
	},

	_de("  head[roy: functerWi.element1ument)
			 triggyA &&
				ment1";
		} elseidde;
		hidde		$.data(evsh( [ optienu
		u[ this.i,return ]( this.elemeid || $.g				retur"[type=checkbox]+ent
 i: furoll
			.remo {
					tar	}
			.removttr( "aria.left += otr( "aria-=asses )
			.reput";
		} else {
			 false;
					}llisionPosn( eveent
		 header inemovthe tab ordealread"+	case	}
	},er-ac element.jis.buttonEleAttr( "ti1le" );
		}
	}	.nex	_setOption: oHidsts
		} ( siddenjoin {
	

		//  response ) {
	ns[ key ] = ion() {
	 ?
		// TODO: var keyCod.addClass( "ui-st-icon-primary uht() );
				})ue );
			if 			this.buttonElement.removeClass( "ives focus
		//  ( this.on( radio ) {
		var name = radio.name,
			form = radio.form,
			rop( "aria] );
		if ( name ) {
			name = namme.replace( /'/g, "\\'" ));
			if ( form ) {
				lings();
		( form ).find( "[na-state-focus" );nt.hasClass( "ui-button-disabled" );
ame + "']",llisionPosTextarea =}(	this.va falsethis.menu.active ) {
						this can mea undobaseClassement.iengthear
						// Double press ("inpuvent Prefixent .valuss in IE means cle.ui.datnimatlectstarear the whoand reorm
		xir he		positioconnectToSor	});", "true" );
	sLastItem( "true" );ocus();efore the 					.A"widget" )
	griopti		positio.test( d	.attr( "arhidde: "ing mani event			varF"wid	.attr( "a						$( 	.attr( "aname] =				retud", "true" );++thdirecement.is( ":cheD._child: 5de = 		scor ul = $( thiment
	ce )them to repetate-Senventv		$( 2ement
				.apeed-pressed",na
	},		positiose {Mo
		"		th( "ui-snapTolerid =-pressed",tament 		positio) {
	e" )
				$.ui.keyCode;
				sCode.PAGE_UP:
t( dire}
	},

	nt );
					bre;
				case keyCode.UP:					});
			ction() {idde
	widg		}
			suppre/^(?:r|a|f)/)efault
					if ( optio {
				//  keydown 			break;
				}
			}			return m"right ) 		inputIndex = 		// IE doesn'"ui-state	if ( typeof);
			},

		if ( thbaseClassort, the live r);
		this.hasTy, fn onText = $( "<span></span>", this.documentnction() {
		vaenu" );

		ength"auton( itemthis._delay(function() {
					de		return falsneButtonType(this.documentoptio )
				.a			}

abel )
				.appendTo(lose() insteaengthD, jque},
			menuselecuseCapturions.messageargetOffse-button-t function() {
				if ( oam;
	);
	s = ++thistotyraion(e( ri
		}
	+ atOff			.addClass(ptions. }
	$.each( s			pteElement = $(tent ) {
			i "s" : ( icons.pull ? valu>.prev().atue !== 0 ) {
						ridge Qu
		viverridepeaons ?t.targcons.prima "-priselect toShow.aniabled ons.texcus();
	Class(</spanoptions = thisan class='ui-butto$(obetweenFix	url: ex: ?eydown" + : ss='ui-butt.hasOwnProperty( key ) &unctiont.height(); )
				.='ui-butt'mplete='ery n.ofnd: #fff;r.attr( " so we havesabledCde.DOWN:
		ption:ns: $+tiple 				suppressIndex ] ) {
i-buttonalization.
$.			// Copy e.length ) {001", attr( "ace
.element.clos.cor		newOve	}
				$.map( items, funts
		Object( value se the name + .secondary ) {
	this._his.options.text ) {
				buttonClasses.push( "ui-buC
			cy <1.ppress") )ocument ptionsurn this.ptions.lse;
			
			Htionsif ( iconsersion: "1.10.4s.options.label )
				.a();
			retu	}
});hrefive" );ions.$.ui.auttyle = {ch{
		it we or thison( items
		ifddmana!insisth ) 			comropp"stri}
		tng: e
			isT				// sis.opti		this	},

	find( labelSel	},

				adjusment.focus()i-buttonhinEithi- 				retur() )
				t-
	_setOTthin s, jt() )
		his.mr.ui.poled ) {
	right

	.stylonPosToisabldClass( "	// $.hod =pe=reset], inputmarglemeon() { ) {
		ssibly a rou, input[typMkey, va(ui-buttonS ?
	nput[type='s csference tourn this.css
				});

				[type=bs ui-button-texlose() inste, "truPoHide.ons = this.elems )
			.fi});
	},

sses )		.filter( ":ui-buttresh" )
			button( "refresh" )
			C		this.buttons = tresh" )
			ement.find( this.optiridge [0]. work ptyle.grep( arence to the int		}
min		rekey, vton( "refresh"  {
					event )Ab	.addClass( "ui-het.extend( {}-corner-left un;
		}
	}p(function(his._movery.ui.y, v;
	}= this;

corner-rightLine || tcorner-lefte,
		//n.top +=Value !=on() {t[typton( "refresh" ton" )ass( "ui-state-ne =
			/(function(el future searc	}
W onequestIndex;het( "// uright ) )is allotem's value a		targr( key,ageX:last" )ble.removeCl.targetWpns
			.map(Yunction() {
		tomespace = thi}
				this._atio)
			etFullNvalue.valght ) Class( "ui-elective-left ui n( ";
}able( "ui-button ];
			})
				.r"ui-come = radio.
		return
			caseey, vh ) {ate: funcright ) )ner-righe
			
	versilick" + t//ance" );
			
	},

	" ) === "rtl";
a full solution t ui-corner-righ>" );
			}ce" );				retuif ( icons.s;

/* Date pap(full ] = 0map(flass, $.datepicker, toYinteract withY).button(ance[ ha-cont disab-left( "ui-buttonset"[type=cifrst-c-stat"
		//uppli 0 ] =(o			a-stat;
		guid || hanetFulle = 
		iteerent sett		})
			.b);
						suprk profstart
		nDisabvious  the new eve_suprInst = a(ui-buttonT|| !ins ( mul+eyCode;
				sifactive"ototype[ , fun	}
});( event.orins.label === nu )
lastActiElement.append( "<span cValut[typnt.css( "dicheckbox], input[type=radio], a, :data(ui-buttonPreentClctedIion() { mainta was a .emp: function()ventNo.lse Beha
		,

	_init: function() n thar.buttont argubledInpustate-acti ( icons.primaryragons.te	// orig //Execp( a, falseIconcort: jacti

	_respo[type=cepea indivtonset",ect ) {
});
ct-expop + 
	instActibutton)"ctedI	},

	_create: function() {
		inset[ text (

	_ be oy,
			buvar , funned ) {
500t.element[ og = false; // 

	_init: function() 					thismainDivId = "ui-datepic use the name + a colon  // The IDElement.addClass 0 ) we need toect eventtype =leme			horizot" : "dch( nultiern;
		}500ement.lement = antton()
			.end()
			.mone objectprevent moving right"toHide. toShow.anicorner-left uibeen disabledreveer divis.4" } on" ) === "rtl";
			return matcheleton instance of this class, $.daner-right" )
				._this._m				retubuttuments, 1 [type=resetght(orm,ery <1yCode;
	.widg| event.resollisio
		returns.even si the  ) { that Index = 0he dialog marker cla < this= "ui-datuiHastring" ? i key event
	thiss.valueMethod.uiuts = []; // List oicons.primarUp({
			this.preventClickEvent;
			this.			return m
		if ( !tstate-active" ndary )IE doesn'xiototy: "Prev", // Displg red	varn;
		}
		.4" } 	break;
	.camelui-corner-righDispli-butrt, the livext: "Prev", // Display text for previous monthxlink
		nextText: "Next", // Dr( "a text for next toph link
		currentTonset" );
	},

	_init: function() ionmarker class
	this._dialogClass this.menu.elemen
		but
	},

	_kens.text ) {
	
		if		thrt.pr;

append"; // The name of the apab._re, false t doesn't work)
						$(", "F ];
			if ( inDialog = false; // True		.appendTo( thshowing within a "d", "Dec"],,"September","Octwasrker class
	this._dial// );
idayndefsponse: up event(a bindseentwas a key ev", "Decay", "Wednesday", Wed", "Thu",ment = ance", "Dec"], // For fo For formatt );
	},

	refreshns ) { ];
bjece currDOM[ 0 ] ]		thEND: 3).buinuen;
		}826; // The name of  this.options.label ) {
				this.menu.element.rem;
					
			ownerDo throuive hea, // See forn this.buttElement.append( "<span cif(Class( "ui-but ":chery.ui.spperAp		this "Thu", "lemenn = 0, Mon = 1, ...
		iTL: false,// True if rght-to-left language, faon-sent.empty
		}, thight-to-left languagnderMght-to-left languag.ui.keturn amount +t-to-righ keydown 		newOext: "N).animnt-activea full solution fs.active.next()0, Mon = 1, ..his.butt simu
		position: {
		gs, in: item } ) ) funcabledInputr.find( lvar ancestor liv picker inputs.type = "butto	"aria-hidden key event
	this._es
		showOn: "focus", // "focf date picker inputn( event ) {], // Names of months for drotype[ prop ].apply( this,Valuem.van(evennselect;
				pare		if ( !this.options.t".hasOwnProperty( key ) &
							 redefileIcons origdefined afte(ui-button)"pendClass = "ui-datepicker-append"; // The name of the append marker class
	 "Dec"triggerClass = "u-datepicker-trigger"; // The name of the triggay", "Saturday"], // For footNaN ) {is ).is(uttonElementions: {en year
	ivId = "ui-dy.ui.ef		returnype === "input" ) {l text to ap+
			".uitype=submit], inputink
		nextTeult regional sett		options = { effec picker inpus._dialogClass 
				if (atepicke	}

			Element.addClass( butfocus: functioader for select", "faunction(event) {
					if ( ddClass( "ui-helper // True if date form)

				//ht() - a= "ui-datepickeons: {
		itElement.addClass( buttonClasses.join( " " ) )tonEleme10.4",ent
		}, thiot to app);
	lse if o instan			break;
				, [(funce ke: rev/nextype === "n	posi
					if ( opd di ),

	s;
			gumet().left work pength ) {(!/next
			functits
		iitems );is.elemnext
		c
		}(oeClass = );
			( "ariectly, false ifmove +/-number-iconher rela;
		}) :
		/if(xt: "Next.target !== menuElemethis.e(objec| ];
			l( this.ohis.element			}
			return;
		nn:-n)
		showOtherMons.crker class
applicable, fals	// ei-only" );
		}e same page. */

fun $.widget.extend( {},h( event.keypart}

$.extend( $.ex parts.shtion() {
	rt, the live rmpty();
	 );
 false for un			targ+.shiainObject, faleturn 0e" ) ) {tion othis.id nultend( {},corner-right"13)
	isplay selestate-hst" )
					.addCalculateWeek: tttr( "ao8601Week, // How to calculate the week text to apo], a, :dat{
				-k of ) {
year,
			// takes a Date and returte-aco8601Week, // How to calculate ty","Fe=> { passei-corner-left" )alculateWeek: tbottom this are in the previous century,
			/utoff: "+10", // Short ction() {seleent yeg value starting with "+" fodisable thecorner-left lone, false if it apOP_Nlement,esh" )
			. = "uiis._ct-e" ) === "rtl this..map(function() {
		et.extend( te-activtroy" );
				vent} els	this	if ( this.mod"text maintai
			case  inst, fun {
this				// the useemoveClaelect handl[0].or );
			day
	ce objec 0 ];
			

	.styl/ The namelse;
});
d.10.4",
	optiunctision: "1.10ar (-n

				thie = radio.name,
toHide." );	origect|texta)
			ar (-n,/ Dur of custom settinis.__rectedIions on pwhich) {
	ppendridge =  r the date p;
}.widgei.autocom	elem :

$.extend(lue );
aintaiName = toHidegs fornsabl 	}
oWeekendsupnstara
			pears on
		this.butto|| th	// Copynth, falsms )
			.fibsolute : null, i-statenu.elemeack function when th" ).lengesh" )
			the keydown po the yerliest ms )
			.fiement.is( ":v ];
			tring owCurrentAtPos: 0, // The 			},
		,"Tu","We"akes 		vats.lengt radioly[ 0 				codayOnse: fu
		tf notmap(f/ton( "is sele
				n The nement.ad	//Ugly ( cfiDon't , Sun = 0f months to shs.eachbelSelectodytions.disa,

	_destths to sh.ta? thinth, false/ Selector for an alte
			if (event.targ"his.callb imagiuery.ui.pr		bef{instan0lement,0 e" ) ) {
			on( direction-downmultipe  (ders
	};
	thition() {
				re"borderToons: $.activt
		sabled"		targime
		she input is constrained by the current da
		format
		showButlass( rtl ?disable the()
			.buttonlone, false if it appears onClose: null, // DonElement ) {
				thi._value();
			}his._delay(funcconstrainInputt: truehis._mo input is constnn:-n)
		shth" 
		showButg value at which to show the curturn $(el: faler( ":lagional[""]);
	this.dpDiv =-selecHover($("<div id='" + this._mainDivId
			/isible" ) ) r a widget ion( diree for the alternate field
		= this._v) {
		var n.text( item.value );
 key, vas( rtl ?		targ input is consts.label );
	ner-le
		t
		showButtonPan-downmarkerClassName: "hasDatepicker",TbindHover($("<;
			}
				markerClassName: "hasDatepicker",R {
		
		showButtonPanent ye// TODO rename to "widget" when switBnt yeaautoSize: false, // elements to ie=radio], a, :datn.text( item.value );
: "+10", // Shorte picker.de.DOWN:
					.not(eateEventData: $.				suppressIobject - the.keyCode.ENT
	/* Overridese
	this._keylone, false if it apton-theighc, ction.top.label ) )
			.appendss areoosed
		ously nk
		nextTe).button( "dler: functio;
			this.buttonElemen_defaults, set"previoand s
	this._unsel
		return thi		if ( $is("and sdget()
			.unbnction() {
		r-right"er( ":last" )ectableClass 			return $( target input fiel#6109 vision or span
	 * @pa" : "ui-cors  object - th" )
				e target input field or di+r" +rget inpu
var lae picker: "+10", // Short year valst" )
					.addCw settings to use for this date1000
		var nodeNQuery )) === big links
	/ +/-number customElement
ine, inst;
		nodeName = ction() {i-corner-left" )s" );lement.
	/* Attach the date picker to a jQuery se && /^nex
	 * @param  target	element - the we candeName ==$(tepicker ieName, inline, inst;
		nodeName = target.nodeName.toLowerCase();
div" {
			this.me === "span");
		if (!target.id) {
			this.uuid += 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newInst($(target), inline);
		inst.se  tastru	versi=e;
			ttings || {});
		return thi_defaults, seis._newInst($(target), inline);
		inst.settingsar (-nn:show week  target	elemenextText: "Ne
			 +/-numbermonths, fals
			$picker to a jQuent.targ
				ear: , // Range !ciginalEvent && /^mouse/.test.jque= cement.fts: flion.
g redr: ___ utton, input target	element - th() < toHidecker inli not show it
		 , simement. thi1000on div
			bindHovp detng

	/='" + this._inlturn $tion div
			bindHover($("te format='" + this._inlineClass + " ui-datepicker ui- #70='" + this._inlitent ui-.jque" ? this.he c{
			theys to fun-only" : "ut
	, inst) {
		var i-eClass + " ui-datepicent dachingll'></div>")))};
	},		inst.append = $([]);ker ui-ching = $([]);
		if (ine, inst;
		nodeName = target.nodeName.toLowerCas.uuid;
		}
		

	*/
	_connectDatepicker: function(":ui-but inst) {Element
	eypress(this._doKey		inst.append = $([]);
		inrn thiigger = $([]);
		if (input.hasClass(this.markerClarn this)) {
			return;
		}
		this._attachment + this.uuid;
		}
		ins ? $st" )
					.ent ye, //lementght-tr-right"of t	suppre= c	/* Override  the current day$, undefinedui-sty/.test( nge 
	},
return"February","Marc argument doesn'm
		/ 		// itefine a ca? 
$.widoffsetT)
				.
		onClose: null, // Define a callb!nt: falunction when irstD datepicker is closed
		nut = this._get(inst, "apNumber of months to irstDay: ctly, fn: "fast", //()
			ms )
			.fi[type=reset], inputshowOnns.secondary )-right" )
		
	this._unselectableshowOn, b{the :pend = inDivId + "' ement"</span>");
			
			/te field
		constrainInput: tru=== "to
				}	+n( module	if ( !setan in.grep( as are " ) === "rtl/ How to calcuce (anonymous*ments this._show// O) {picker: { version: "1.10ect-s);
ght ) ) aintai = th work prtoield and
			/{
			inst.triggerachDatepic		}

-showDatepicker);rained by th'valu-leftr-hi._reent da(eve| $.gui}
		ift.prop(				to leave as is
		disa class? - id='" + this._mainDivId + "'
		}
	"'>" + appendymousn.leents

$.ttonPanel: faunbind("focstate-this._showDatepicker);

		if (inst.trigger) {
			inst.trigger.remove()sRTL 	}

		showOn = this._get(inst, "showOn");
		if (showOn === "focus" || showOn === "both") { // pop-up date picker when in thgeOnly") ?	ield
			input.focus(this._showDatepicker);
		}
		if (showOn === "button" || showOn === "both") { // pop-up date picker when button click			.unbinuttonText = this._gsRTL nst, "buttonTexalse, // True to sizeon instance ofElement.addClass( buttonClass).button( "set.	inst[isRTLn(settings) {
		exten		var showOn, buttonText, buttonImage,
			appendText = this._get(inst, "appendText"),
			isRTL = this._get(inst, "isRTL");

		if (inst.append) {
			inst.append.remove();
		}
		if (appendT
				.reto interact with epicker._hettings for (groups of) 		inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
			input[isRTL ? "before" : "after"](inst.append)

	_setOption: funcPrototypen ( /
	_setOCrototype	form = radio.: 35,mix a c
			set./([^A-Za-z);
		}

		th ( tsShort:epeay,
			buystrowe w0 ] ]ate-dis( "unt instanc 0 ];
				if ( !$
			.removeAttr(evious;
	efaults, settings ||ouble digitsettings.disabled )
			offscings) {
settings.disabled  ":first" )
	menu.isLastIte{
		if ( !? this.dpDiv : //) {
	 {};werCase();
			max = 0;
					ma1I = 0;
picker: fu			max = 0;
					ma2I = 0;
					for (i = 0; i < names.leng3h; i++) {
readerslement.fons.souent */) {},
	ectedMonth: 0, sel
		return {id: ideClass( baifteElememap(function() {
		late the we<t(inst, "autotype;
			for._hideD	"monthNames" g value .match(/MM/) ?
	|| animate,
			et(inst, (d "widget" )[ 0 ]ntury,
					"monthNamespply"monthNamesSetti"dayNamesShortte.setDate(findMax(thn;
				}t, (dateFormat.matchateFormat.match(/MM/) ?
		>getDay());
	2t"))) + 20 - dahort"))));
				2ate.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					"dayNames" 

	/* Attach 3t"))) + 20 - date.getDay());
	3	}
			inst.input.attr("size", this._fturn;
			(o.
			 options.diouseMox(

			endering 	this.o 0eue(functionueryde con0r( "id"eClaerCaset.target.nodeN);
		de ).( coill  proet.ele5 falsethe mhars
						}st.appencker.
   Set" && wirn falsatch(/DD/) ?
cker.
   Se) {r(inst);n.ler(inst);
uttonTexcker.
   Se
			len date.getDay());
h.ro(mous)
	 */
	_attrget);
		i.getDay());
			}
		ings.disabled ) {
			this._f (divSpan.hasCla?targe( ovtings.disabled ) {
			this._disableDatepickece of in-atepicker befopasseisable the			buwith class='ui-cker(inst)0
		this._updateAlterXate(inst);
		//If function()epicker, to e, disable funcdatepickelreadst.dpDiv.css( "dise ticket #5hort"))));
			t.setram  settings  obje
		}
	},
rt"))));
				dat||isRTL date).length);
		}
	},

	/* Attach an i?isRTL ?  @param  input element - ignored
	 * @param  dat* @param 
		// htlreadstate-h", "block"			bis._get(ini-buttoappend);
		}

		input.unbind("tch(/Dthis._showDatepiicker);

		if (inst.trigger) {
			inst.triggert.attr("ston type='buet lat-loadiepicke(( "ui-buttonset" );
				var keyCodtrigger.remove();
	ition within thes._get(inst, "showOn");
		if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the ma_get(inst, "bput.focus(this._showDatepicker);
		}
		if (showOn === "button" || shOn === "both") { // pop-up date picker when button clicked
			buttonText = this._get(intonText");
			buttonImaget
		inonymous object)
	 * @param  pos int[2] - coordinates for the dialog'sput.adtion within the screen or
	 *					event - with x/y coordinates or
	 *					leavolute; top: -100px; w").addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$(tings, pos) {
		var id, browserWidth, browserHeight, scrollX, scrollY,
			inst = this._dialogInst; // internal instance

		if (!inst) {, alt:buttonText, title:buttonText			input[isRTL ? "before" pickfor all instances of the datecursor to beginnintype=submit], input[tynged
		onnn), absolute (nnnn:nnnn), or a co
				d	retu
		itd ani._superAppl);

		this._pos{
				radios = $ selected( construpos) {
			browserWidth on( this.menu.eleme( opeffei-st$.wiulme, uffw = ai) {
		defaul	_chaip.jsct-pulsate.jypecode
	this.rachmevailaui
					thigional settin imagverClalse, // TruellLeft True this	});
	n( "wi ];
			})
				.rvar  indivthe month or his;
verClaspos.pagefoo: { baet" )tings || {});-day"; // The name of the current day("absolute");
		} - vreturn $.Widget.prototype._trigger.call(this, p://, event, uiUI - },

	plugins: {js, jqu_uiHash: function() {.10.4 - 201 jque	helper:  Inc.n.js, ,sitioposiuse.jquery..js, jquordionoriginalPjs, jquery.ui.s, jquery.ui.butlete.jsffsetery.ui.autocompAbs - v1ore.j, jq}UI -
$.ui.ery.ui.add("draggable", "connectToSorte.js, j jqustart.ui.mouse.jquery.ui.cjque - vvar inst = $* Inc).data("ui-ppable.js,), o =t-bou.opuse.sordionuiffect.jsnce..extend({}.ui., { item:uery.uelement ggabl		ery.usfect.jss = []de.js$(o.uery.ui.effect.js).each(i.mouse.js, jqueffectery.ui.ey.ui.ery.u Inclui.efery.ui.e UI - v	if (ct-pulsat&& !ery.ui.eui.effec.dise.jsduery.ui.s, jquery.ui.ef.push(ide.js,s, jqance:ect-pulsaordion		shouldRevei.efake.js, jquery.uirrogres, jqufade.js		ake.js, jrefreshy.ui.buts();	// Call thesbar.js, 's table.js, jquery at ppab y.ui. toortable.js, jcontainerCac, jqincejs, jquery.uibs.js, jqu cry.uiis used ini.spinand needss, jbe ups, jdate uery. will ensure it's initialiundaas welled )being keptatiostep with any changes that might have happened onjs, jpage).jquery.ui.selecqueryui.("activats, jquery.ui..effect-h jquer1.10.ggable..js, 	stopeffect-blind.js, jquery.ui.ef//If we are st*/
overjs, jquery.ui,eyCofakltip.jstop.ui.po ofPACE: 8,
		COMbut als jqumoui m.js, i.effect-bounce.js, jquery.ui.effect-clip.js-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.old.jighlig, jquery.ui.ef,ui.mouse.js, jque	ifuery..s, jquer.isOverery.ui.ef		06,
		NUMPAD_SUBTRA = 0: 111,s, jquecquerlH.js, R		ENal = true; //Don't
		ENTEs, jR: 13,atios, jppable.jst-bouquer09,
		PAGE_DOWN: 34IOD: 190,
		RIGHT: 39fals		SPA	RIGHnctiP: 38
	s
* Copy// plugiry.udelay, fn ery.ui. like .resiz {
		Bwork)P: 33,
//T( delay, fn mber" ?is supported,d othwi mi	TABo set a temporary dropped vari;

st from}
});

t(fu this;		var e: "valid/inll( e" 33,
	 106,
ry.ui.progreslide.js,		PAGE_DOWN: 34query.ui.resiz 39,			}, delay );
 jqueryi.dra(functieryui.,
		DELET
		DOWN: 40,
09,
		PAGE_DOWN: 34_mouseStopnd.js,E: 111,
				orig.apply( this, ,
		UPts );
rig.apply( this, _R: 13,static|re
	keB: 9,
		UPh
var e 38
	s, jquers, jq, restore propertien( $on() {
		var scrolifPAD_EN(this.css("posit== "s, jquer"				}) :
				orig.applycurrentItem.css({ ( $.u"auto", lefn.cass(th-fade.jsocus ),
} elselide.js,fn.extend({
	focus: (function( orig ) {
		return fB: 9,
		UP: 38
	elay, fn ) {
			 scrollParent;
		if pendenciedes, e.g., $.ui.position
$.ui = $.ui |||| {};

$.extenppabeffect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js,+$/;ts );: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIy.ui.effeinnermostIntersectuuidig ) {js, jqu );s, jquery.ut(this.css(	//CopyBACKSPsomelem ).focontriallow om
uuids, jquery.ui.sonative _iollParensWith),
on"))) || (/ab.dialog.js,jquery.u.dialog.js,css(thon"))) || (/abR: 13,Prohis;queryquery.u			while ( elem.l, position, value;
js, jq.clickjquery.uinore z-inde) {
		i: 106,
		NUMPAD_ );
		}

		i106,
		NUMPAD_s.js, jquery.u)slide.js, jt) : scrollParent;
	},
		),


		NUMPAD_ENTER: 108,
		NUMPAD _MULTIPLY this.length ) {
			var elem = $( this[ 0 ] ), posisition, value;
			while ( elem.length && elem[ 0 ] !== documentnt ) {
				// Ignore z-index if position is set tofer.jsfsed MIT!=Index s, jquery&&			// IllParent;
		if is ignored by the browser
				// This makess not speci$			// Thsuery.ffect.js)) || (/ab.effect[0]xed/"))) || (/ablicit valu)			// Ieturns autr of this function consis ) {
			// I1.10.	0.4 - 201 of this function concss(this"overflow")+ a value of this function coneturns au
	keuncti
		}
OMMA:use a littfn )
		PAem ).focu othunctit once, so our urn -
	ruuff gets firexistly();
rn (/(rel!06,
		NUMPAD_SUBTRACT: 109,
			PAGE_DOWN: 34,
		PAGE1</div>
//NowMMA: 188,
		DEr.jsof						uuidfoSPACE: 8,
		C ) {
			js, jque//by clonthis.csslist groups.parenight duuidijs, j});
	},

	 othusn() {
an( $PERIauto|scrolqueId: fuWe ca() {n},
-id-" + (++E: 46,
		DOWN: 40,
queId 
		}pasundabrowser.ui.posi oth
		}own9,
		UPeturit does: 32crecensa new one="z-indeition")) && (/(auto|scrolnce.js,at).ion(e().
		ENTAttr("id").unctioTo106,
		NUMPAD_.effectquery.ui.efery.ui.e-, jq",stent.css(thi
				orig.apply( this, .test(tition"))) || (/absolute/)test(th //S).fil || mapi.effe fn laternts().filizable.jelative)/).test(this.css("positii.mouse.js,  4 - 201ui !== "m[0]; ery.			// Iquery.targeents );
")) && (/(auto|scrolg );"img[usemap=#" + mapN (($.uCapturend.js, je;
		if ( !element.href || (($.ui.artled :
		"a"
		"a" ===queId: fuBeca
		s, jocusable( elelem way ofition", imunctioed his;letOMMA:modify a coupocusfndefined ) {
reflecti.tabsi-id-\osition === "relative" || positio.ELET if position is setilteest( nodeName ) ?
		!le( element ),"ovrs.visible( element ),"ov
		!$( element ).parents().apato|sk().fi- if position i" ) === "hidd of 0
					// 	}).length;
}

turn $.css( this, "visibility" ) ===ELETden";
		}).length;
}tePseextend( $.expr[ ":" ], {
	da &&
	nsfer.js, jreturn (/(ateffect.js, j&& (/(staeturn !!$.			$( ellect|textarea|bu.effectap" }
});

argumener contha "img[us//hack		}receive/upicensom
backs	this (: scly="z-inde) ) {
				$( thrs.visib
		funct"img[usemap=#" + mapNfromOutsidate.) ) 				returus ),

	sProvicestwe did
			 from revious	runivalue;ttr( );
			}.spin;
	}
});

// seleconttr(					
});

isTa, w"id"					return vqueId  {
				return (/(relition")) && (/(auto|scroleturns auto if the eleme (($.uDrag && (/(sta(this,"overflow-y")+$.== 0 ) {
					var map		return 
		return ( isTabment, 					return n foeforniqueId://MA: 188,
		.spinneunction() {
		var		END:m188,(functi( "<a>" ),
		TAB: 9,
		UPbyest( thIOD: 190,
		RIGHT:IndexNaN || tabIndex >=this.each(function() {
			if ( !this.id _UP:,"position")) && (/(OD: 190,
		RIGHT: 39,
		
			isTabIP.resn						fnuuidst fris}
	ced) {
	}) :
				orig.apply( this, arguments/div></dturn !!$. ion(ou});
	}er contributueryui.ndatide ancentlyble( element, !isTabInpendencieout $.ui.posiement, !isTabInjquery || tabIndex >) :
			isTalParent;
		if (($.ui.ie && (/ame;
		if ( !element.href || !mapNams("position"))) || (/absolute/).test(this.css("	this.id =
		ENTE
		}
				$( th thi	return this.;
	i againment, from laceholderment, animcens] : [ "Top",ata(t) {'sent = thissiz: functsition")) && (/(auto|scroll
		ENT(		if ( !eaN || tabIndex >=ze;
		}
x: -10;"><d" + name ].call( this );	return orig[ "inus ),

n !!$.data( elem $.adataName );
			};
		}) :
		// support ) {
		r( elem, i, match ) {
			return !s,"overflw")+$.css(this,raggable.js, jquery.ui.droppable.js, jquursor, jquery.ui.effect-blins, jquefectunce.j"body.js, jqu.js, jquery.ui.effect-clip.je|absolude.js, retl)/).outer" +s behavioo._uter" ort:uce( this, sizI - v1.10."px" );
			}), o{
	sorcore.js, nd( $.ui, {
	veze );
			}his.each(function() {
				$( this).css( type, re margin )MULTIPLY			return;
}

// suppor.add( seI - v1.10ze !== "number" ) {
				return orig[ "oopacity, jquery.ui.effect-blind.js, jquery.u
			}

		sible( imn this.each(function() {
				$( this).css( type, educe( t
// suppze, true, ma
// sup + "px" ); ).data( 
		};
	});
}

// supporo.
// supery <1.8
if ( !$.fn.addB.2 (http://bugs.jque)
if ( $( "<a>" ).data( "a-b", "a" ).removeData) {
	$.fnelector ==/ticket/94eData ) {
		retur) );
			is.prevObject.filter( selector )
		);
	};
}
scroll+ name ].call( this, size );
			}iis.each(function() {
				$( thmoveDatai.
// dP ) ==[0]s 0 wdocufect-&& () );

$.suppor.tagNames 0 w"HTMLs(this,"pi.ACKSflowOs, jqemen) );

$.sup[ ":" ] orig[ evObj"overflow-y")+$.cssttr( elery.ui.effect-nce.js, jquery.ui.effect-clip.js, jqueui.effect 
// d	$.fn[ "outze, boase() );

$.support.selectstart = "onselectstart" in document.createElement( a value!o.axis || ion() {.creaxs(this,"poif((iv" );
$.fn.extme ) +"onselectstart" in ition He
//) -ttr( e. comY < o) );
Sens, jv
			} else "divselectstart" in 
// dTters.ui-disableSensions instead.
	plugin: {+deprecatedpeed);

//ow-y")ifgumentugin is-" ) bleSelection" );
 deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) -
			var i,
				proto{
			if ( tfunction() {
		return thisyunbind( ".ui-disableSelection" ().fi	}
});

$.extend( $.ui,Width/ $.ui.plugin X set ) {
				proto.plugins[ i ] = proto.plugins[ i ] ||L).filt		add: function( module, option, seode.n{
			var i,
				proto = $.ui[ module ].pXototype;
			for ( i().filement[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

	set[ i ] ] );
			}
		},
		call: t: jQuery <1.8unction() {
		return this.unbind( ".ui-module ].proto$(ectstart)
	plugin: ()set[ i ][ 0 ] ] ) {
					set[ iui-disableShave extra content, buhave extra content, but set[ i ] ] );
.css(this = $.ui[ $(window).h{
	/n fal element might have extra content, butt the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return f{
			var i,
	.css(this,"
		call: function( instance, name, args ) {
			va++ ) {
				ifhave extra contentode.ut the user wants to hide it
		if ( $( el ).css( "overflow" ) 
		// it's possible to
		// salse;
		}

		var scroll = ( a && a === "w !se) ? "scrollLeft"e if it's possible to
		//  set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		ases actually cause this to happen
	if ( tif(ui-disabl 0 w ) { = "js, jddmanalPart-sho	// sBehaelemselector =$( elem ).tri.pre" ) fn.exts(i);
			};
			if ( };
	})( $.fn.removeData );
}




nap+ name ].call( this, size );ie [\w.]+/.exec( navigator.userAgent.toLlete.jswn" ) +
			ion", fu.
$.wEeffectffect-folold.js, 
$.w			/structor{
		Struuid? (deprtoty, jq {
	":ery.u.effect-clip)" ) :totype highlight.js, jquery.ui.effe$unce.js, jqjs, jqu$his.eelection: functnner" + {
		i <div style=lide.js, asePrototype,ect-transfer.js jque Incl			innection:proxiuter( !se(), left" lName = na {
	/( (#8876)	( $.u$o {
is,"over$oons[ dex" ), 10 );
		$.css(this,"overflow-y")+$.css(this,"overflow-x")); valbs, ls, r ful, r, t, b, i,tabIst)[ 1 ]PE: 27,
		HOME: 36,
		LEFT: 37,
		NUMP jquery.ui.effect-dropportotype TolerveUniqueIdx1 =isibition i,"ov, x2 = x1ce.ph && elem[ 0 ] !== donction)[ 1 ]y|| {};
	existprotoytrucyor = $[ namespace ][ name ]left" / proxi
		(ects, jque)[ 0 ];

	length - 1; i >,
	 i--)ction: f: 39instantiation wit[i]			return $) + lr = $[ ndget ) {
			retction, positcreateWidget ) {
			ret &&
		!$bort:ctor( options, element )ement ) {
		e, renstr< l - d{
	x1 > r +eywordy"new/ one abov(thebcode abo!se of nesteeateWidget ) {
			 i ]to re.ownerDctstart,.length ) {
			this._create ) $.sup (/(relativedget ) {
			retntiapalue !== 0 )	lative|absolutype trelea {
		static properties
	$.extcom
*return focus$.ui.posii.effect- !!$.d				if )e.jsntiacroluery.uidget ) {
			ret	// e})
				v>
					va existing constructor to carr"></div></div>s.jsinnt acros	call: funcotype Modnt.crea of ts(this,"poe,
	Math.abs(/ ony2) <= 				protelem it from tbis w1dget in case lhis widget is" kexidget in case rhis widget isrheri/ redefined afata(sy over any, jqjs, jquilters.visib_conogrey.ui.butTo("relzInde, jqest($./ on= function( options, element is,"over0 })me ) { $[ nmar.ui.without ine we needf(bPrototype = new base();
	// we need to make the options hash a propertyb/ otherwise we'll modify the options hash on the prolPrototype = new base();().filter(fued to make the options hash a property0is,"over" ke $[ namespace ][ name ];
	cse w

$.eodify the optta: $.expr.on the prorype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedProtor;
		}
		proxiedPrototype[ prop ] = (fun	call: f= fun = (t {
	b {
	l {
	rs :
			isotype ),
		// trac = nagets that inherit from this w/ redefined afthis widget is
		/idget in case ter a widget inheri/ redefined af_childConstructors:idget in case basePrototype = new base();
	// we need to make the options hash a property / otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.directly on the new instance
	// otherwise we'll modify the options hash on the protype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototy
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, pe[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (fun	call: functd to
		// redefine the widget&&) {
					return base.{
	= funs behavior static propertiesntiaend( constructor, exisototypructor, {
		version: prototype.version,
		// copy the object used to create the prototype in cass to hd to
		// redefine the widget l namespace,
		widgetName: name/ proxiatch( e ) {}
	}
	_cleanData( elems );
};

tack+ name ].call( this, size );
			}mipicker.jort: jQuction() {
				$( this).css()[ 1 ] this..ui."WidArray(edPro in ))uery.ght.js, jqa,b.split( "4 - 201(parseIn);
arn remozIndex"),10){
	0 ? "shild.prototbpe;

			// redefine theine allget. We', re! thishout "n!!img && v; 	if ( tmin = hild.protot thisyle=e;

			// red efine thfold.js thishighlight.js, jq://bugs.	.js, jqu;

			// r,ingCce.p
			}hat waof 0me, constructo(r, chially used, bucore.jraggable.js, jquery.ui.droppable.js, jqonstructot: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b"			// ree, true, ma			//  + "px" );			// re
		};
	});
}
onstructoo.			// ion( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key )( name,} else {
				return remodget.bridgents, 1 )is.prevObject.filte})(jQuer;
		ght.js, jq $, undefi exiery.ui.t always 	}
		Axis( xentsfere;
			izetend witype = c xthe key in i gnor) {
< (		value = i+put[ inp.len	if ($);
getui.e	// sut.js, jquerversjquer"1.10.4")[ 1inputIEidthPrefix: "			$ !== i.effec:positiaccepn.ca* !== 	s, e.eClass:},

	zIndaddlue )es:IndexNObjegreedy ) {
					thpe;lue ) ) {
					tscope		//efaultinObjet$[ names:ack llParen !==",

 );
		},Object( vate: null.isPluto|scrollarrays, etc.r $.urays, etcoutidget.extendv, jqrays
$.exten_, mapNtion( name, base, prototter( elem.l fullName n.js, .effect-drop ( $.ispace ( $.i/ proxiof 0
sACKSP></div></diveturn tau.testWidth: $.fof 0				}
		$.isF{
			var( $.i) ? 				}
.ui.mouse.j-slide.js4 - 201d.isllName =I - v1nction( name} else {
	;
		return  /* valueToWrite */tend witht useargstartthout "nee !== 0 ) { ) {
	i, namhasOwnP's	} else {
	n case( options ) {string",[ 0 test( nlow-y")+$.css(// Retrie, "mr derndexuments, 1 ),
			returnValue = th4 - 201( options ) ?			inne( options ) :y( null, [ options =: -10;"><d
	fullNof 0licit vale h
			if ( !se)[ 1 ];	 "-" + nf ( isMethodCall ) {
		 {
	/	$( this= $.ui || {}/ proxi// Adurn si	value = i othw base()ontri) ||m ).tri11,
	 http://bugs.ts, 1 ),s[epreope]ct )  "cannot call methods on " + name||ct-fold.j" prior to initialization; " +
	ect-trs, jq/ proxi(oui.det[ keyput[f ( isMethodif ( !$.iui.effehasOwnPr
					siget.js, destroject.ie = !!/msie [\w.]+/.e0$[ namerters.pted to call method '" + o[ key ] = va" + nam) {
		// al keyw<nts, hout "n; i++ options === "etho[i]d)/).ight:.split( "		metspliceket/1 = $.ui || {}ction( nameinstance
		ENTtions] ) || options ) || options-.effect-tor );get.js, setO.effe
					retukey,hodCalery.ui.efif
		d)/).tlName s(this,"p name, object ) {
	var ful		retur?hodCalrototype.widgetFullNaame || name;		retuashes tI - v1.10.4-01-17
* http://jqethodValuNamelyuery.uistring",hodValue && mwith objec	if ( argument//bugs.jqueisTabIndex '" + options + "
				$moveData(me + " widgect( value )lue.get() ) :instance[options]data( this, fullName, newI - v1.10.if(
		// so e.get() ) :ependencies, e.g., $.ui.posidata(uiValue;
	}; function() {=== "_ce ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, thdValue !== u				}
			});
		}

		return returnValue;
	};
};

$.Widget = fuuto|scroll)/).test($, element */ ) {};
$.Widget._childC;
						instance.option(n( options || {} )._init();
				} else {
		, fullNBail iuid);
iqueId.teined ) {
de: {ment.effect// originisTabIndex|| Value;
	}element ) {
||ons || {} nt.parentportply( inspace = name.split( nherit ms[i]) != nulsed MIe, objecom
* Incplicit valuehis.uuid;
		this.options = $.widget.extend(._childCoaN || ta 0;
				key ] ) ?ets that i options, this ) );
				}
			});lement !== ine all of t
$.Widget = fu;
	on( options, element ) {
		element = = $( elemen( {}this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( tions: {
		disabled: falllName, this );
			this._on( true, thipadding" + this )remove: function( event ) {
					$.wid	if ( argumentscustocusabln( options || {} )._oop,
ons init();
				} else {)[ 1 ]childrenrollParentoew velection", f
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getC</div></div== instance && methofind(unmodified
hasOwnP)").not("..effect-clipffect-ing"highlight.js, jquery.ui.effe-bounce.s, jquery.ui.eff| options.ctype = {}we need to " widgeainObjs not speructorquery.ui.effect-s not spestatic propert+ na,
		= $.widgettFullName ) );e( this.widgeptions );
return focusalue  = $();
		this.hoverable = $();
		this.focund( this.pted alue ) :Value;
	}rototype.versio projs, jquereturn focuslection:  })s, elem " widgeet[ key ]="z-in!!im	this._destroy();
		//,
		S1.9 BC for #7fromroto );
if(	this._destroy();
	
			// 1.9 BC for #7810
			// aN || taptions );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( eullName, new object "<div>",
	options: {
		disabled: false,

		// callbll of th$.data( this, f
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		th/ Clon( options, element ) {
		elemen	$.widge
			$.data(reateOptions1.9 BC for #781dValue && uiateEventDatcs, jquery.ui.positioisTabInde: (c
		this.options cnt.parent)[ 1 ]n.js, jqc.ui.accordion.js, jquerc.autocomplete.jss, jqueift();
		js, jquery.ui.draggable.js, j.outerWidt
		return bled " +
		.removeD, et[ key ]
		/ery.ui.ehis.widhasOwnP
	exiss, jquery.ui.p/div></divent )ptions || {} ode.opti= uuid+Top.isPl || {his.uuid;

			var elens = $.widgetw base();! jQuery
		}
.isPlctor {};
					curOption = curOption[ parts[ i ] ];
				}
proti ] ]tructor == $.widgetamespace ][ name ];
	constr][ name ]  ] === undefined ? null : cuce
	//remo: 39 parts.length - 
				key =dgete {
				if ( argurn curOnstructo parts.len} else {
	(unction
			}itializions[ key ] === undefinedement ) {
	switch (] );
				for ( i 		cexte"fit"].conctype = clget x1put[ "ne= iggertturny

		ve a= b		// h	this.alue ) :
Options( options ctor =his.uuid;
p ] = value;
			return;/ 2nput[n in
// Halfn casex2? "s ( key in options ) {
			this._setOpti<n this// ode.nions[ key  setme ] 
		}

		return this;
	},
left" etOption( keBot.nooions[ key y );
		}

		return this;
	},
	if ( key ==< b )ap"  n: {ions[ ke	this.poalue  ) {
	[ i ] ] = curarts{};
					curOption = curOption[ parts[ i ] ];
				}
				his.options[ k-indefn.extens = $.widgetition is set
		}
		// httion[ parts[ttr( "aria-disabled", value );
			this.hoverable.removeCla);
	}-state-hover" );
			this.focusable.removeClass( "top}

		if ( ty++ ) {
		fotion[ parts[ lue.ions[ key ];
				}
				optioinput[urn this._setOption(  curOplled", true );
	},

	_oneturn;ns: functiontouch ) {
		var key		widgees aiali	_se1Option ||er, mLETEdg( fnuching
		// no2suppressDitOptionheck flabled" shuffle arguments
		1 alwa	_setO> b)e.callurro < id 				os beize -=nput[ 		widge (thtruc
		rsableressDisabode.nshuffle arguments
	xif ( ppresseturn essDisaby, optse;
		}

		// no e			ht argume> rlement;
			elemehoriz.js,ppressDisreateend( {}Options( optifor #7810
			/this, /*
	T
		m ).trigtr	},
parts.		//etOption( s+;
		this.eves
*/e.js, jlem ).trig			opt
				$idget.extelements
	: {xtend( {},: [] ) {
jquery.com/ticateEventDatrsion: pery.ui.effect-, j)[ 1 ]oLowe + options + "' for " + naet()
			.unbi						")[ 1 ]p:// =ttr( el?.ui.plulow widget.e "-dthisa			el}
		#2317this._turn
	//
		this.options urn focus)dual storage
			.removeData(addBack orig					$.wnts
	Lo $.ui/ allow 
		 < mthodValue = CT: 109,
this .camelCas otheon-lName edle = $()m	reteData( $.camelCas+ thandle!== trptions );
== tris.bindings n array instead of booleancusable = oto: $.extend( {}, prot// Fil}
	in ) totype,n() {

				$etOptindat this ).artsj=0; j !haisrgumdValuejabledCh{
		// ist[j},
		disabled" ) ) )y over any== tr;
	},

	_on: funct,
				inneto: $.exelements
	dualiedPrototype, {
		co== trvisilsate.disabled" ) ;
		/displargs .creanone"type = {}sClassdler.guturn ( typeof handler === "stringA, e.g.,isMethodCall &.uuioundadirectly  $.aselectors, le = $();ow wicrea(($.udowns(this,"po== trnce ) {
state-disa);
			};
		}d =
					s._crparts.id ||s._cr	// clean up evein casdlerPro === undefin{ 
	fullNdlerProxy );
Call ) {
			this.+ "-" + nandlerProxy );
			}
		}) {
	/IDE: 111,vent ) {
		$.wid.extend( {}, this.op.each( handlers, f

		$.fn[ "outprobablC mapNamec zIndition"lements
	r ] 	this) || 0;
ui-id-\dduided 
		elem (#9116="z-i
		NUMP(, handler ) {
			functionthis.widget()
			.unbi						").s			if)llParent.length ? $(dion() {
 ] = va			});
		} elsption,
			i;  "string" ? in$.camelCase(ypeof dler.gui
			$( ee + "-disabled " +
	 Includ

		if ( ethis.bindiance, args );upport: jQuetCrecom
* Inclu.each( ns =  0 );tend( {}, protot
				.apply( instance, arguments );
		}
	tate-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.elemenwidget.bridge = functaddClass( "urget;
};

$.whis._on(onstructorverable: function(gate( selectoto );
me || naent ) {
his,"overfloref |turn this.bisplit( " " ).joitance, a//Listid" ordeType dgets				at.uui;
						ttom" uisFu
		this.ffrom js, jquace;
		element.unbttr(b
		calcu		}d (see #5003="z-i= $.widget.extendngth;
sUntil( 	retur ).bal s

// dl methods "
		NUMPAD_MULTIPLY: 1 widgetNamey( this, arable.js, jquery.split( "// http://bugs.jquery.com/tick

	_focusable: fu= $.ui || {};
() {
		return this.bsplit( " " ).join( this.e
	keyouTimeoua highly dynamicm com,ack =

// try( inst ] = v. I "Rinderstance ) {
,
			time	data 			scrol(($.uonentrnValue;
	}$( event.currentTarget )." );
		// http://bugs.jquery.com/ticksplit( " " ).joinreateOptions//Rutyperough: funelement.unb othche funheirtance ) {
baundaon specific ] );
			
		eve		sel
		NUMPunction( handler, delay ) {
		function handlerProxy() {rn ( typeof handler === 			.apply( instance, ad of		thainObjCthis		if ments );
		stance[ handler ] : handy.ui.effe" ) ==IemoveUni e ) ), in eve)[ 1 ];abIndex );nt, haninstance = this;
		return setTimeout( handlerProx)[ 1 ];c = !abIndex );his._on(	},
		? ".brid" : (turn !( $.isFu() {
	( callback )s.elthe dis		// http:!o.bar" =is._getCreatethis.hoverablsetTimeout( hainObj = slice.calual 		this.event ).addqueId espace ) )jquery. ) ); setTimeout( hfunctover" )" ) ==ion( metentTarget ).addstorage
			.removeData(f? insght.js, j returns aut4 - 2014-support: jquery <1.6.3
		etFullName ) );
		aultEffect )
			// os === " ) === "d, but y( null,n event ) ) {		// suppo		effealue uery <1.6.3
			// ht
			effectName =
		if ( orig = (cmatch[0], [ eause this to happen
	led e just= ( tdati{
	 icket/9	thisions === 		effectName = && ber" ?
					detions,
rue || typeof o	},
			mouseleave: f "number" ) {
			i-state-hover" )rue || typeof o		ifis bei		effectName =ent.delegate( selectornt;[cme +te-hover" ;
		ier" ?
		 &&nt[0], [ evenck ) &&me +/div></div>lay ) {
			ele [ ev? "ent |ption		if"] {
				$( event.curr				options.effect || 	}
ofultEffect;
		options = options || {};
		if ( typeouValue.get(ion: options };
		}
		s = { duration: options };
				PAGEhasOptions = !$.isEmptyObjecvi.com
*ns );
		options.complete = cal$.css(this,"overfloi.ie
		});
	},

	_focusable: functionevent.currentTarget ).addClass( "ui-stateun-focus" );
			},
			forigger://der.jjquery.com/ticmg,$.eaalent.ty.tooltIE( "<a nottabInd4 - 201
// dnctions isNaNpe;
			 wafocuoundab		isTaent ) {
				$( vent ) {
				$( event.currentTarget ).removeClas( "ui-state-focus" );
			}
		});
	},

	_trigger:evObject,
		value;
	for ( ; inputIdex < inputLery.ui.ventNataSpa = !oi.efeff}
-	}
ut[ nction(Elementnctionwidg= this.wid!
 * ue;
	 Color A[ "in) {
v2.1.2		.bihttps://github.com/jq;
				retu-cedow		.b		.bi( zIr
// 2013ind("mouF		elhis.went, ith014 ontributors		.biR	$.extdx < iarent:MIT 			inthis. functi:/			retu.org/ $.dataeDown(eveDing eWed Jan 16 08:47:09})
		-0600even/r ( ; inputInue;
	ex < inputLength; i.effectepHook = t" = f thindsedownborderabled"pImmediateProde.pImmediatePry, oppImmediatePrTopsedown_moustartumnRulesedownoutlin
	},
textDecorhis.wDO: make sEmphasissedow
						// delsequals testt ) {+= 100seud1ta(e	rt mess with= /^([\-+])=\s*(\d+\.?\d*)/ (ev// a.pareof RE'\d+$/;ttr(ma = vsvided
		// gener3 ] )O: makvisisonename);Pild._chil[		this._: /rgba?\(unctio{1,3})\s*,mousemove."+this.widgetName, th(?:s.widge?(?:\.\d+)?+thi)?\		thisfectNs
					instan execResul function ) {
		i[
	returnmouseUpDe[ 1 		// al_mouseDown: fu2ction(event) {
		// d3ction(event) {
		// d4 ]ver" )hashes t nexto the 
				.unbind("mousem+	.unbind("mo%this.widgeay have missed mouseup (out of window)
	egate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: funct * 2.55ion(event) {
		// don'which === 1),
			// event.3arget.nodeName works around at
		if( mouseHandled ) { retu//( instregex ignores A-F bdexNotNion( com		efd);
		st an already lower	thi.outided return; }#([a-f0-9]{2})st(this.options.cancel).le"+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mhild.prot._mouseUpDefuncti)) {prototypeent)) {
			return truon't		}

		this.mouseDelayMet = !thiswidg		}
 inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.oons.cancelouseDistanc;
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true; +			return true;
		}

		this.mouseDelayMet = !this.op !== false);
	.options.delay;
		if (!this.mouseDelayMet !== false);
	Met) {
			this._mouseDelayTimer = s			.uhsl
		// we may have missemouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mosuseI: " ===inObje.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don' /ces eName works around a bugate = function(event) {
t
		if( mouseHandled 		//his.elue;
	.sedow(
			touseMo=gate = functi {
		var isMouseM,tEffen, blexNoalpharemoveCl4 - 201, imate = functi.fnngthseevent);
		};
		$(document)ry <1.8
iuseI
			optinbin
				ifl, [ 
				if.bind._mouseUp	idxroxi			inneryt.extbyte						}) {
_chileenegate);

		ev1nt.preventDefault();

		mouseHan	$(degate);

		ev2nt.preventDefault();

		museHandled ) ] ) { ===getName, this._mouseUphn(event) {
		// ent.preventDefaudedleds;

		mouseHansatudestro= true;
		return true;
	},
percent;

		mouseHanl
//ne ) )ent) {
		// IE mouseup check this._mouseUp(hodValue !== 	mouseter(Typeup."+thisult();		if (thfloo jqu= $.isPl	ma// I55d when m				this._m		if (thuseDi1nceMet(evene || docis._mouseod: 36ent.pre

		if (tht);
			retur) {
			=vent);.s._mouseDodget.js,//e[ handlt ) { {
			
	/		semouseStotot
			retu( "<p>" )Call seUpDelegouseMouseove."+this.winam			se));
	seUpDeleglocal aliaisFuofme || "")focuisabloftenis;ach	}

		reumenhis.wi/ determine nbin_mouseStaimmediatepreshis._mouseD.styoverssTexseDo		event.sto._mous:nbin(1, thi.5)	}
mouseSt..widg=_mouseState)
			.u	event.stopImme.n() xOf( "nbinthat> -) {ousemovnput4 jQuerthis		$.fnment)ter(functiousem ) {.widg oth === mouseu
ghlig.data(e
		NUMPAD_.data(umen,.data(removeCmouse. jQuer= "_"y ];e + ".prn( tt", tr this. this.			opti
		ev3ts.len {
			this._m, etc. flayMeton,s
			// options,clamp(hodCal,._mouocumlowEmptyremoveCr[ ":ow widn event.p[wnEvemize t					{this, ft usern fal==		// )
			.bind("mo(
				Math.a	if X - edefretu_mous:eX - edefrOption[ p// ~~lem an sh
			ent an do			}
		t.tarthis._ve numbeion(	abs(thimouse.tion(/? ~~rn falsetNameFloath.abs(th			}
	//fine */
ctior ] eath.aame);
		s.abs(th ) { thisthis.elwhichs, to h{
	
			thi			Math.isNaNe placeho)
			.bind("moions.distance
		)t usep://jmoLength;	optionsadd vis, "Heig vison() to "Width" ? sablenegzIndeng plug		sel//0;
Nameogreestoer(fuly: -10 -> 35 of ns( optiorn fal+nction(/*) %nction(/*tance
		);
 ) {now: funter(funynction", hi	}
mousimeour, c othmaxtIndex ] )0 >.abs(th? 0 :nction(anputrizontalleft|cent:r|righ ( input options, ) {
			$((m/,
	rabs(this._m-bounceouseM!protote);


		ife);

	// prox= /[\+\=m/,
	r.toLame Casn origdocument = /[\+			$(dohis.widgetNaieventable//bugs.jqueth, hdis._mous = v versioon().ouset = /[\+\-nt.preue; }id |rseFl&&at( offstName, fsets[percent			this._loat( offsentCliin utarte			// origirue; }removeClaeturn  /^\w+/[
			this._ ]t( offsetse ] ) {
		 = thlemen

	_.widgth, h;
		assignfect-

// $.ght  twid: func// oh) {
...onents / 100 : 1 s00 : 1 )
	];rue);
me +eturn 

function getDimensions( e

		in = /^\w+/,
	rperceturn ,
	rpe ] ) {
		exit 
function getOffset ) heres.cancel be vrseFdisable
			delegateElement : optionsng" ing
am/,
	roffsearena/ $.ndlCas( "imtest(Type
			args = slnt */) Css( elec
	]Nameserty ) event.ta,: $.fn "trans		effe" isNaN this.is ined ent)hroprev(d = Maybewidgets)mouseHancrollTop(), leaselem.(0,		wideHandle: elem.wjoidBacatch[		widththations,
			.unbffect-elem.,t));
	.rollTop(), ,textarea,blue = pars, "tace
		);
thisdt));
	tIndex ] )));
	[ = /[\+\aw.nf ( !wnEvenfew vageY, left: rawwnEven* http://o the widgetName, this.r
				};
		$(document)
			.b
			heeigh==x < inputLength;: functio
	rpercee disabdth;
		}
		varraw.nodeTf ( typeofeturn return= unde.		retu baseed.nodeent.op: raw.pndefig(event) ndefName, 	if ( rigger: idden;ed ) {
			reateOptionsfect-bounce"." )[ 1 ]ouseDowate = fousepx;overnt.preType ==chedScrollbarWtance" )// m argumt"))ame );
	 on the ed -retuume= unde		if ( cachedScrollbardth !== uidden; 0 w ) {
			return capx;hei[ {
		if ( cachedScrollbaaw.nodeouseDow"a, fu	}

Options(),mouseDocreaent.tatop: raw.piv = $( "<dwidth / /,
	roffset ;over{};
}
		}_end( {},textarea,iv.remove();

		rh;
		op: raw.pnt.target, tte);(eventhis.widgetNa
				(funlegate);
	gbageX - eidx elem		returr
	vflow-x" ),hin.elemat was
					div = $( "<div styleiv.remove();

		robj :
 options === "ction( plugiofmouseMotions ===nt.target, this.widgetName + ".preventClickEvens };
		flowY t", true);
]lowX === " 0;
}

funsions( elem within.element[0]
			retu</div>
					va, 10 );
ow-y")+$.css(scroll" ||
				( overflowX === "auto" && within.wifectue);
				hasOverfl				innent.target, ument ? "" :
				within.element.ollWidthht: elem(event.t	var mapexie-di			setTk,
	howtionjQuery)ollWidth th <ructo[ {
			][ 0 ition.to $.supportasOverflowX ? $rn falment disabbbabE: 32er c
	},py$( "img[usverflowX ? $hStament,mouse,
			isWindow = $.isWind eidgetow( withifo: fhStack( mement"osition[[ 0 ]},
._mouseDownEv: withandler ] : hv>
					val 0;
}
ions( elem {
		vas.lengtcrollb|
				( is ).css( tncel = (ti
			ex" lyd( eveweight{},		retrayst: $. ALL._mouseDownonents 	// Don't			ovequeId =lwaysA				Math.ollWidth ),
	( elemeerflow-x" ),
			overflowY returth.max( (th
			offset options };se);
		trgum			if (d	END: 3phaly( null
	_mouction( element )ate = fins, funndow ),t() : withinE
			retoxie3ction< 0element: wit//;
		
		etion( wofayMet(rollTop(),
			widtlickd ) {
				.heighition.NamesscrollWidthn !!$.de);

	his, argught() : withinEl			offset: wi			( overflowY === "a.isDocument ? "" :
					mousei );
		}

"string"ight ) {
	ri( of/,
	ridth, targ ),
		Float( (this._mo</div></dive ] ) {nt.target, this.widgetNa_auto" && within.fect,

ery.urop ] = sery.ui= iction ge	if ( raw.nodefo: 
		scrtions ===options.wight / 100 : 1 ement[0].||) {
		vart ) {
		vaisDocument,
						"attem ? $.position.scrollbarWidth() _hin.element.css(
	_mousery.uerflow-x" ),!{
			element: wit dimens[0].preventDefault ) {
		options.wierflow-x" ),			offset:ouseHands._mous
	options = $.extend( {}, optionsions.wi).removeClass(nsions.wy everame + "					return $.error(ounda).ap,
		target = $( opthin.height < within.element[0].scrollHeight );
		rheight() : in.element[0].scrollWid;
	ect-tr0 : 1 )
	]igger: function( th = dimehorizo butn( type, rollT, jquer, targetWiidget,				ame = //bugs.jqueenrigitOffsetidgetN1 ),
		parseFloat(end.s.offs!prototyentCli a copyction getDimen[ this ef |n that._tate-fthin
			of0 ?, "at" ]crollTop(), leat i"." )[ 1 ] + (++posintalOffsoptions.collision || "flip"- w2ntalOffsment,
	en()[0]eUpDelhorizonroll" ||
	er
	"my",enithin.element[0]ter
	basePositiument ? "" :
				within.element.cssfect-btors.pflow-x" ocumentMcat(Vthis.mot( po[s[ 0 ] tion(eveends[ 0 ] )				[ 0 ] : "centerouseDownEvent.pageX - event.pageX),
				verflowX disab		isWi
		}r ele + (++odCal;

	// f";
		pos[ {
			element: wandler ] : handler/ calculat -;
		enoptions = izontaxec( pos[ 0 ] );
		verticrn tru 0 ] : s[ 1 ]s[ 0 ashes to be passed o: function(/* event *= roffset.exec( p-ts[ this ] =>nction(/* / 2force left to[ this ] =+mouseDecachedS scroll = ( asets[ this ] =-et.exec( puce to just the positions without the-offsets
		options[n case we neeffset ? horizontal		retur ] : 0
		];

		// red) *to center+ts[ this ] sWindow || withions
	// if a val;
		0 : 1 )
	];
				rvesing or inblendwill be convepaqengthent */) ikeyCode: get.nodeeft += -mouseHanoursens[ keemove(hedScrolleturn _== 1cachedScrollbarWidthpx;width:auto;'>rgitialhedScroll
			returue;
	Y = gbs miss" ) {
		bay", "at" ],ft += t
			width: eouterHeight(hat.widg.maerflgbhis.widgetNav, icachedScrollbarW( 1h;
gth =
		balerPr + a * vight;
sing or invoRgbaovidedet;
	// clone to reusp{
		Widt {
	entClicType === "center" )t[ 1 ] ===
		basePosition.top += taions.at[vn {
			eproti > 2 ? 1 rwisat ietOffss
			// origielem.ition.left += targetWDocummissing e, tbasePositio(	}

		div.rvent */) baseP+height: 0,
	+ "ouseUffsets.aHsltargetWidth, targetHeight );
	basePosi ===.left +=			$.fset[ 0 ];
	basePoarginurn ( typeofOffset[ 1 ];
test( n {
			element: wivollIction() {
	);

// suppor// Don = v1idth(2 elemWidth i = "o <on =  + parseCss(it frt.stoh + * instht(),%	}

	;

	// nreturnollisionPosition, us ===ition.left += target ===			elemWidth = elem.ouhslWidth(),
	elemHeight = elemasePorHeight(),
			marginLefexargetWidth, targe includeAment)
			.b option

		$( "body" "bottom" ) {

		}
),
			elemWiter" ) {ptions.my[ 0 ] === " ),
		ntal ~~(elem.sc*ista		if ( (),
			elemHeig"#

= "center" ) {on.top += atOfr withinEle
			ion( wto 0 isNaN	scrolllbar	}
		o allvne th funcovided(		}
n.isDocument vhout "neleft +? "0

var collis})terWid"thodValue 	 1 ] ===.ui.mouse.js, jquery.ui.p
		basePosition.leftet;crollTop(), le) {
		.at, targetWssing ounctionoffset()width = {
	scroeDownEvenfr ] ousem			$.jQueryey )s adas.di(),
:f ( !$ction(ecode.googoverom/p/maashaack/source/ocusab/packages/graphics/trunk/srcround( posnfo: f/HUE2RGB.as?r=5021center|bottomhue2terW p, q, gs = sliFloa( h +t += % ) {
			pos * 6 <t += targevent */)s._sq - pth =
		$terWidt		};

		"new1s, jquery.ui.pq dir ) {
			if (3 <the positift", "top" ], functio((2/3		rehth =, dir ) {vent */)t: elem.ithin.iasePotctor options, properemHeign, using,
0urn {
			ebaseng,
nt) 		elemWidth: elemelegis._mouseDownEvent.pagWidth;
		}
		var wing,
			econca ) { optih;
		},
			/ista.isPlaisionWidtnt) ollisionWiitiaemHeight: ollisionWi
		baseion = " ) {centarginTomax(owerg,ame atOffsnew v ] + mi() {et[ 0 ], atOfdiff offsx -ingConstr
	_	my: o+ingConstr: 39
	_* 0.sionWih,  option] = [fset  diraxlemHeighFloainRig[ this ] = [ed)/).m
				});
			( 60i ]  g -ame  / 
				ht()36}
		});

		if g options.using ) {
			// add		};flowck as secon12}
		});

ing ) {
			// add? (b+\-]ck as secon24}
		}Up(event)
		a (
			
			 0 means2 = yscalectfunc,funct	if datepi Mode < 9 )			}%f ( $.idgetwisrevet.top - poithe target );
	his.ns | = left + targ;
	
		}

 (add);
 optio					etWidemHeigh( of}
		});

		if ns );0. elet: target					/
			{
				var left ,
							t(  );
	_t fracti				collisginTop + pahginTrted e.toLoa this.each( {
div[0]on,selh: targetWidNames
					target			$.t: targetHesition
					elemWidthsitionWidth,
					elsitionht: elemHeight,
					collisionPosition: collisition = $on,
					colFloa
							to/arted =
( of.top,
		
			} elselemWidth,
					osition = " ) {qstrucgetOffs? l/ addor =em.htoty: "m-"bott					t}
2 *otypelisith,
						idthginTop + pareft: marginLeft,+tom" /on = fut -= el" ) {abs( left + right ) < targetW			feedback.horizontal = "center";
				}
-dth ) {
					feedback.hoa
 mouson,selvent.target, this.widgetName + ".preventClickEven				} el( of) :
					[ 

		t
			width: hasOve targetsDocument: ght )lem,
	 copy, we 
	if ( $."Widrn {
	) {
				$((event) {.fnoptions.at[ 0 {
		var isM: functi			height:( this._ma,
			w
		})em =useIni( !$( "<a>" )		} else emove(" ).s
			want to modue.get() ) ow,
			isDos.cot[ 1 ] ===urn {
		widMath.abs(thisDiv.offsetWidth;

		

	if ( op=== "scroll" ||
			
	if ( optieprop ] 
			innerDiv = div.cplaceho" ) {
rlisi overflowX = withind ofment.css( "overflowturn falsestring"," ) {,

	.at[ 1n( position, data ) er
	baseP				[ "center", "center" ];
		}
		posHT: 39arr[lLeft : within.offs?ent.wptions.x" ),.getScrollginLef{
			element: wHT: 39,

Y = within.iption,
			isLeft + data.collision optivalsWindow || wionPosition, usarguments );r, han 1 ] == we do,

	lemWidthder ow,
			isDo,

n.isDocument re= "striow-y")+$.cssons.at[ 1 ] ==if ( da;

	var portant = "horized()2 = in()		$(dal";erticalhight tom = top ()k = {
			 else= position.left - data.collisionPosition.eleem.scrolptions.datio);
		w1 =
(f, pro;

$.ui {
					freturn
			this._getCreateOpt{
	ft - newOverRirtant = "vertical";
		on.margia.within,
				withinOffset = wit	()
	t[ 0 ].nodeType ==prott[ 1 ]			$.?".prevetiontarted =: and verticaevent);ithin.width,fn ]!prototypcunstruLeft + data.collnt.prevset: 		// must usee if ( crea < inputLflow-y" ),ly over tuthis
			event.isDefrRight ) {
					retition.left  this.moodCalis beireturn  wit|
				(e if ( overRight > 0 && over ] : handler )
.abs(this._mous 0 ] - eiden bion.left = withi 2;
	}
ar left -> al();

		return (cachedScrparseFloamouse
	_mos[ 0 ] placeholdefset[ 0 ]100 : 1);
		returhis.mo wit+// These are set: Width, i ] left -= Width,= "+.lef {
-1 withinOfag(event);- outerWidth - withinl = /topScrollbarWidth right ft side of wit			maf ( inction.eledd css");idth(.fx.runiq options,lLefument		heighook..left 			}
$.data( suery( eve= /[\+\of._mouseDownEvinitia) {right side ofWindof ( max( a) {"righ {

			t( " 		}
	}
functin.ofs( offsets, widcrollTop : pageY, l
			}
s[
				c rig
				} jqueame, this._ls )  within
				}{
	return [) {ototnt.preve	event.stopImmed= "percent.

$.ui.posit.crearollTop(), leut[ in,
				withinOffsetosTop eturn (c+ th	offset:positionoffset : functionxtend with ght > 0 ) 1 ] ==offset:||h right edge
	nfo: fupDelegate);
&&
						sePosition. 0 w += target of wiuseDragWindowst b	event.stopImme.lef.marngth;
N		//:& ovesition.apwhileedCheck;idgeionPosTop,
				ost bt,
	ion.top + overTop + drollTop(), lgnore the cae top of 
		itop of
			.om = posents );
	}a ||ts );
	}sionPosTop,
				ovnPosTop = (nOffset -		if ( overTop > 0 			offset:
					pos ) {top +Bottom <= nt,
			isWInfo.wi( && within.wiisWindow: i withinElemelse {
						
		ba(collisionHeight -&&collisionHeight -sTop + data.collisly( nullment is initially ].concat		"nction( overBottom s ).css( telse {
						oesn't support fra		// eleme;
				// el over
			.ion.top - don.left = mop = witinOffset;
			rt: rcss(w = $n( eiv.oIEelemenome wht: err
		onon(  );
	( offset= "nu'ss(t'ptio'inherit'edPrototype, {h(functi= "cent		top: ion.top - d
		if ( of
				});nfo: fufx.in
	Inielegate);
		top = rhon withinx.prot
				coedge
	base targetHeighmarginion and marion.top -= options.eas;
	})nPosTop = position.top .ion: based on om;
			};
	}, jqulse {
	
		}poem.h[ name ] =ght;


				hin.isWindets[nt");
	nctionnPosTop = posit.iatePr
				ovhis;xpabasePosition.l within
				h( [  + wiOverBr";

		
funct[ "Txtend"y, opeft abled"eft ode."widt offsets, width,elegate);dth = wi[ "uitePr

ithin+ "op > 0 
					}
				
	// if a valdth = wi fractio		if ( !BasicmouseMothis.| { l
			vaUsagible(= /^ce;
		idgetNam collisionrequi.opta functy== "cenptioptions.targlega that.wnEventvg-this..jent.));
		}

		return !this.set.lef// 4.1.verLeft = colkeywordlem.aqua: "#00ffffuseDiblack ] ===ata.ght" ?n(ev		dataright" fuchsi0 ] =ff			0,
		gray:
	80"lef.at[ 0 ed =  ===8a.elemWilim :
			= dauseDimaro ) &&#rgeta.at[ 0nav === t" ?t" ?
	oliv :
	"lefa.at[ 0purp} }right"t" ?
	Delegt = daa.at[ 0sil
			"#c0
		useDitealata.targt" ?
	whing et =  "right" ye				eft < 0 a.at[ 				-dat2.3.p + data.collisth :
					da invalid		effe:lisionPosition: colliouseUp(evnction( eft < 0 ) {tton,selectind("mounction.widght < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset/rRight < abs( overLeft ) ) {
			 CLASS ANIMATIONS  myOffset + atOffset + offset;
				}
			}
			else if ( overRi		position.left += myOffset + atOffset + offset;
	ght.js, jquery.
	},cue )."+this.w			es ) {[ "addeft 
		ENTeft togg
		
				mouseurn S			.
			opticollisturn truiatePropagatt;
				}
			sedowt;
				}
			ode.t;
				}
			y, opt;
				}
			T)[ m
				}
			( !se	withinO the o	withinOp data.ceMet: fun		varfunc			collisode.t + aeft r within = height,
				ofabled"height,
				ofTopheightin.scrollLeft rget );
	if ($dge
			} n.eleif ( overBottom > 0 ) {	// elarginid++;
			ggerH		toet" ==Name:nctionleft +		overTop = colp: raw.pageY, l
			. );
			}
.max(e {
				positerTop = col options.eathin
		ction(event) {
efineffectt + aton.marlTop : with
				lepicker
			.s[ 1op +idget( option.dis( {}ViewoverBotmHeight :
					data.my[ 1 ] =.getComputeet + aon.margi_mouseD].concmHeig
				$t + a				-data. ?
	,
				Math.data.et ) 			.uout "nea.at[ 1 				toottom" ?
om" ?
				Right;
	lle='ht[ 1 ] === "ft = verBott?
	--	overBotthStacargetHei0,
onPosLeft,
LeftofargetHeireturn {= overLeft;
			// tata.ta[ $.ightlpositverTo)	isDocf ( overTopthodValue !== 		-dmouseSt: Opera,else<9
				var left ;
			hSta
	ruta.e 0 ) {
				pm;
			if ( overTop < 0 ) {
				newOverBottom = pover rig+ atOffset + offset + data.				rietOffsetta.tat: elem.nter|bottom/,yleDifey in i( olet + a,ouset + alTop : with
					mdget.		thisginTop,osLeft;
			argetimouseet;
				}
data.collrTop = p[			new+ offs] = [Offset +sionPosirginT within
				} > oute myOffset + atyOffset +h = elemWidth onPosTop = ffset +	if useDrag/ These are placehot is taller t				tOffset +					}
				}
OverBottom < abs( overTop )				t: elem.collisionHeind("mou<1.8
fo: fu$rounethod fcollisionP	}
		}
	 ( overBottose
furflowX ===ollbarWidth i.drion() {
	this.eachrn cachedSn( eO"overrowser d
			$.ui.pelement,ion() {
		ion.sing o ( input[ nction(.n[ "innlue )right side of with,ate(his.w, eat( t, );
		},lTop : withhis.e.s,
	(.apply( this, arguments );
	th < elemWidtt[ 1 queuionPthis, size );
			}n[ "innl ).cs( instaon.top as			$.ui.pnction (.a === " abs(h ==in uentClicthis,lue )Ci-id--= elemWl."+this.widpace	this._d objentParenual sPlai  method for
			ction (pend( div )ap{
	rection () "overontri().filParent = this ) ) {onentument.getElementument.getElemter" ht.js, jquery.ui.effeein.w
	var teft = max( pos& withinl ) {tal.test( po:y[ 1 ] === "top",
 instaeach(functionction p.elehis,| abs(.undeleObjeceft, i,
		body;
		return !!i
	vers
funct abs( newOverLeft ) <.scrollLefti, s, e
		this.f
$.ui.posi[mentSty0].scrollWidt	//Creat "absolutt = lement;
}

 "absolute",iedPrototype, position, d,
		margin: 0,
nPosLeft div" );(),	//Create a "fake;
		 -vention( eousemata.tar;
		ifs[ ked used in jQuery.support
	testElement = document.c
			$ targ= {
		visibility: "hi.el				toor ( i  ) {
					m += myOffset + at );
	
			n setTi
				positiv = $( "<div styh: 0,
		height: nt = this abs(yle )entParent, testElemen,he ta		$.uit.style[ i ] = testElementStyle[ i ];
	}
	 thisnt.tycdisaent;
s._momi {},od used in jQuery.support
	testElement = document.creat += mInfctor ) {nt.prevdfl ).c.Dkey eft >nt.prevoprop ];effect-explo) { retu		 frac ) {
					t {
	mpleng else by referen= posidfd.resolv - w2lement )|
				( overflowY ==bject( option() {
	ild );tEle,
		ody ? "div" : "bs.he
	testEta ) {
t.style[ i );
 testElemen ) < imeou
	showPd].con$.isNa this, ndex.support
	tesutIn) ).d
	ifParent.length ? $(dcolleunctiounctio

	offs ) {
		testElement.style[barWidthument	//Create
		vers
		// ccle(fun),
s			retfunctio		retwightetLeft =none"
	};
			outerWidops = {};

hidePrreateElem
			$. across browseeProps.bordejquery ?
		 ( overRigeltom of
				"overBottom, 10 );
nction parse.offset(guarntdow = $sideeightiback =
		om = colfit.tden",idthD: 35,urn {s de frat );
		nd("metLe0 ) || 0, jq	showP	positi: "-1000pxtestElemenion( tyf ( i				outfnfined ) {a.my ( !$.i: ( ; inputIns, j			$.ui.positio, targetWidue )umen	".u,
	his, arguments );
			$.uth = dimen,
	overBott: function() {
			$.u	position.lehidePro{+ da:lement.addC }lass( "ui-accordion ui-widge].concas, jhowPropsfullName );
		 position, datyOffs	}
	eft;
	positidValue !== prevShow = this.prevHide = $();
		this.element.addClass( "ui-accordion ui-widget ui-helper-rstring",
			args>-= e
			// ARIA
			.attr( "role", "tablist" );

	
		ENT don't allow collapsible: false and active: false / null
		if ( !options.collapsible && (optionsdValue !== === falssitionptions.active == null) ) {
			options.active = 0;
		}

 $.fnlass( "ui-accordion ui-widget ui-h.top + myOffelem.s
				iooleant,
	t()
		}; ) {
			return cat - offsset" far up -> aligs = Mat = thiithimve."lback ) {
		i / null
		if ( !options.collapsib "auto" && withi) {
		if ARIA
			.attr( "role", "tablist" );
	(elem.s? 
		// don't allow c indis.headers.length;
	prototype	ss( "ui-accordion ui-widgiedPrototype, o be passed on ins;
		ielem.sons ) {
			$( n " + icons.header )
				.prependTo( this.headeropetion don't allow colontent: !this.activecal positionse && (options
			panel:=== falsy ] = lue ) ) nction() { ( t,+ dalass( "ui-accordion ui-wis, jquery.ui.pcons.header )
				.prependTo( thi "none"	// dder- ui-helheadern elemdled ) 			.removeClass( icons.header		key,
		valtion.leght < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRiverRigEFFECT	newOverLeft = position.left - d - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				ifif ( newOverLeft > efined ) troy: funcoperty( key ) && value !==ta.colSan trement.unbter(function()a
	_mody" aer: 0saaderonPosition.marversiops.: "nonef] ==fect- argt =  argumdValue = instance[ optisionWOffs 0 w
			element: wentTargeery.u
	_mouseIn+/^ui-acco,on: "1.1Call )data.tarui-accorstElementnt);
			retuta.colRs().fiveAttr( "aria elemely  "ar
(functnctio),
						.removeAttr(ts().fiia-controls" )
			.removeAttr( marginL, ift = "tabI" )
			.each(function() {
				if ( /^ui-accordion/.test( this.iHT: 39d ) ) {
					this.removeAttributeheader )et + atOffset + off1.6ame,scrollI.targetbugsblock;pd( poticket/99- disabelegate = on-conth -ore.eventft: fus function()n
	_nynt[ ey
						tent ui-aveAttr't div y int_mou betwden;""ild( 0heigh			}ons.effe
		divtent ui-aiden by exte, undefion( = "nly			heada;
			common
						 ) || 0
$.ui.poons: function() {
		varlass( "erBotse {
					ndlerProxy.gAttribute( },
ethodValue !== hen mousset
		/ia-controls" ),th.a( positio] = updat outerition.: "none"ons
	 elme; ":hiddeth;
? "show			//hid		}

sets( offsetupdaore.js, jqu"-diollT		}veAt[prot,"ov]t,
a				faultent,/ TOlOffset =con-triary.ui.conten	}
			);
	flexr.guin() {
fuisab

	urn {dow( raw  &
			if (getB this.owill be conve, jqu,32222px;";"role" )
	y, xlue )y ] = vaible: f functi "none"t,
			ip": wOve0; brea					//	this.middlt();!valu.5e && this.options.absWindo== fal1e && this.optffset;
	wOve		if ( key =/32222px;"		options[ent" ) t panel
		if ( knt) == "collapsibl,"ov": t[ 0ue && this.options.ais._ed",}
		}e ) {
			this._activ
			doesn't}

		if ( key === "ict[ 0{
				this.s._destroyI;
		}

sets( offset
hidePx: ntal.tey: nt.sceClass

		// cWrapt() ||.effect-dling
aign wit
		retcopctiothis._on(_mouseDownEv	, mapNs.hes, jq-controls" )
			,
			height: elems.add( thi

et.nodegn withents		retu" + this."ui-helpe		effe()			ret.widnction().next()" xy, delayionPosity ) {
			returiginal event m evention( event ce
				} el
			option
	fullN	// clean= namespace;
	t" );
 "-" + ntarget ),
			if ( !us = false;"fe ar"witch ( evom of keyCoddden",
up mai.next() ement"<div></.heaCode.DOW	e[options]t: function()eyCode = $urrentI)/).thideProfontSizLeft100%entClicment is init:terHeight - wikeyCode.Uoffset;;
			t" );
et.top +ent.preven.scrollTined ) {0.4",
	ol( argumenut[ iind( evection/: funct tar inputLein % - Fixes #524anceM	ut[ irs.index( event.target )ction( false;

		switch ( evleft" ) e.DOWN:
			ct( va
							datct( va ] === ent );
		lisionHeiFirefoth.ring" ?lengtfunction() {expoisFuanony(($.Name,ndex = i-accoron(ebugzilla.moattr( widg	if _bug.cgi?id=561664s.len
				// ct( va.i0px;wid			// too far up -
			case keyCode.retuWidth / 2;
eyCode.HOrr" ).next() t.style[ i dler( e7595 - ototype,los.calcu;
$( dgn withis.widgrlKey ) {				top:=mentSv ] ) ( arguments.ent.ctrlKey ementSvnction(/* e	$(focus();.de ==s.headers.leng	toFocus =		length = this.h //HotasePlLef)
			.ea4, undef== unn visievenanelK) serema{
	ctu
			.keyCo);
				if ( !					regn with entIndex h - 1 ]rollTfe to reset y, vctive: 0,
	lse && optio
			$&& event.ctr
			casthis._onh ==< 0 ) {aticflow-y" ),	optionl)/).te.js, jquerons hash a+$.css(th= false;
		n collapsible is true
		} elsaddClass( ico( "role" )ment ? t[ effecjs, jquer= false;
			this.active t" );
			// e panel is gonez-[ 0 ]Code.DOWNeader )uterHeighte" &,();
		,
		Window ? elemein.scrollLeftwidtonstance[ h.head[are ontalO false;
			tion(edge
			} eset) > overB {
	
			if ( thihildewOverTop > 0 |
			if ( this.hflow")r ( i in testElemente if ( optionsive, but active ons hash a ver" );	proxiin ),
therwihis._ac
			$.css(thi functi
		},flow") testElementS
	},

	_pom out[ nction pKey || lse only whes.heade)}, dwssing or ialse || o, !!value );
		}
	},

	_keydt
(fun
			case keyCode.END:
				toFocus = ctrlKey ) {
			return;
		}

		var keyCode = $n.offset.ly ) {
			returnreze;
 by t
	},

	_e ] ) {
		vent ) {
		if ( event.keyCode === $.ui.keyCode.UP  && event.ctrlKey ) {
			$( event.currentTarget ).prev().focus();
		}
	},,

	refresh: function()alue !== inllisionPositey === "still handlevent , it will be conv
		versie gu, fa {
ginTop,
				ovelse {
					ageX),
	t-child,> ttom" )offsets, wid > 0 ) {
reusemax( peaders.lengUn				x= this.h&& evncti funct>ction( optio"
		})withinns = this.* )
			 += optio1 + offset + da
	// if a valon.left =d construc//tKey || an nction		event.e a "fa}
		});given;
			thiss:nter|bottom_normalizeAtring",(dionId derTo
			".us( "uients );
			$.his.ele		retctio11;
		BA"ui-accat() ||( argsons ) {
			+ myOffisPlain$.ui.ps.active

	_proce-accordi=dionId ter
	)
			-corner-ons.heaterWidth(),
jQuery)l
		ne a "fais;

		breadionId :dionId =
				if (= withiactive = disab...rget: {
ass( "ui-on/.test( thisass( "ui-cent-ac				right headers
			.amove();
ate-active u
	var ful" )
			.
	_proceents );
=" )
			 firstset" on/.tet-acti ) {
				var header = $( this ),
				ndActiv?d = headem;
			 )
			.ea++;
		ret,
	onPosT,
	s[+ "-heades._createeader.next(.attr		panelId = p),
					pani ) {
				var header = $( this ),
				 this._fi	headerId = header.attr( "id" ) = this.rId );
				}
				if ( !panelId ) {anel.att				right );-accorditodionId ", "tab" )
			.== "col( "role" )active = this._rgetWidthouseSId = p

		
		ply( inspply( tHeigh.activot( thisp ];fxtNamtal = alse;
				i

		t-" + i;
			?alse",lectelse",istroder.attr( ?header.attr( "lse",]: "fal	tabIndex: unction( on;

.activ null
	// ants );
ders
			.n null
	th < elemWidte.next()|center|bottom/,andard."+this.wodValu ),
			
			.ne// Vl( e order
	next()s (noight:.att		re,, data lse",d = heade!e.lengtollLeftd + "-heaer-" + i;
					header.attr( "id", haderId );ft: funcent acr				rightI	positby extend- t mapion-"| ++ui"
		} etop: functiotr({
				"ariaeturn (c	elecons.heade "true			"aria-expanded": "true",
				tabIndex:						})			.hide = header.attr( "id" ),
			ction(/* event */",
				tabIndex:odValu = ssh (END:

ype 1;
one head = accordionId + "-heat.css( "overflgerHa		even )
			.rxHeight = parent.height();
	Didthisfsets[on/.headers.eAPI overTop )+ " " ) input[ this.options; )
			.
		var isMethactive = this._findActive( optionof options
(funrgui-c|| ++uid);

		thiull
		if ( !options.collis._moulue );;
s
	y = doc frachis ).ou fracs.acti "trueMethojQuery	this._createIco ).ou);
		ttance" )+ myOffset"ari	if his.headers.n== "collsemovlretu false &&nt = thismders.n(e.g., ke sure)ui-iposer.gu
			optioupdate this. max( position.$( th]: fal.not( thisName / make sur	// _actiow-y")+$.css(ollbarWidth ild,> ps = {};

hidePro=== "str=== "auto" )				// eleion() {
					position.laddingTop = hideProps.dClass( "ui-a		 options,run(,
		bcument.createEtoLower	var testElem,
	showPhis ).ou null
						if ( this ).outerHps.paddi options,ops.btion.top + myOffattr( "id" ) {
					mamaxHeight  null
	},

	ght porteader )
				.

		// trying to ac		.heigmaxHeight 
		||
				(fect :
					optisition"add( thiset.node			s.tabs.ion()derBott
		op.a			$( this"ui-icon-tive het() + $sfocusalapsterction{
		within"oldid || $.d hanent.scr&& event.			return;
		}

ons
			th ===  :ault: $.noo	if ( t( this.id ) 
		} els this.hendex ) === "auto" && withinis.headers.el
		if ( acttyle =e offical positions-accordion-co true )
		try {?this.headersru
			) {
		 fracti true in ufucto		var active inde suprevShow = this.prevHide = $();
		this.ele.length ) {	offsets[ er
		if ( !this.active.length overflow", "auto )
				.addClass( "ui-accordion-he	maxHeight = 0		});

			this.headers.each(function() {
				maxHeiglue ) { ).outerH fal	if (Apply,

			this.he"true"osition.lef;

s
			.removeClass( "ui-ace su=== fals ===event ) {
			$.each( event.split(" "), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			});
		}

		this._off( this.headers.add( this.headers.next() ) );
		this._on( this.headers, events );
		this._on( === "eveners.next(), { keydown: "_panelKeyDown" });
		this._hoverable( t ===.active,
			pevent ) {
			$.each( event.split(" "), function( index, eventName ) {
				events[ eventName ] tive.attr({
				"aria	},

	_= "_eventHandler";
			});
		}

		this._off( this.headers.add( this.headers.next() ) );
		this._on( this.headers, events );
		this._on(is._actg = clickedIsActive && options.collapsible,
			toShow = collapsing ?is._ac=== falsi-ac|| mapunction(edisar maxHe.jquery ?
		e );
			})data.ele		});
		+ myOfercent.teercent = /%"
	};
	[ "p.nam"pucto"%psingthin.scrollLeft : wnctio index, eventNa		.uis._mouse clickeoptions,
			hei over/ These are f ( ( px( clicent = this.element.parent(),child construc-widget ui-helper-reset" )
			.removeAttr( "role" );

		// clean up headers
		this.headers
			.removeClass( "ui-accordion-heASINGi-accordion-header-active ui-helperr-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top" )
			.removeAttr//he target .headerss wight =NamesRob "uiPeof t (.targetwww.rion-hpder-id( pos, arg.eachfectent,E, argargetHeightctive = colQuaht ) Cubic? faQuar ] ) Quis.he "Expohin.scrollLeft : wargetmaxHeieHeader )
s( newOverTde();
	},lement.css.next(it frpowrginLin.len"
		}
				top ( "role" )eHeader )
activeSetting collap				sition = elem.ct / it frco
		 *lickedPIt the 			marginCirc			if ( options.icons ) {
				clickedsqrtght / drenow || wN:
	Elasticon" )
			ions.icons ) {
		p			elem||		}

= elpe: fals-s( "ui-acc2, 8i ] , se1					f.icons myO("ui-accor* 80 - 7ffseten( ".ui-acc15rdion-headeod fns.icons.activeHeader );
			}				ght;3,
		--header-aata )ouy ], 	if ( options.icons  );
owIE mousbength = 4ps.paddata.offsn se-actdPant [ 1 ] .addClas--
		// h] = -ially/ 1 += tsets( offset ) {he animati4ion - r another
	},625
	_toggli-acc during{
	this.Heig );p,-header-ative ui-statfuncte ui-corner-tde();
	}, overB.extIgth ) {

lasscoll		thi

 newOverT, toHit", ate( toShow, toO &&, data );
.icons.activeHeader );
		t / , toHiader )
ader-actimate( toShow, toHie();
			toShow.show();
			this._toggleCon se 0 ? Window ( data			thow;
	e: falsmplete( data			t-2on-heaHeigder-active ui-s-widget uvalue;
	for ( ; inputIndex < inputLength; i optint = supuseDup|			i|nt = sup	thisrent */) mo;
		//te, tivave the pr|lement;
	/{
		var that  keydownbleachw.show();
	oselector ) {
		s.evententIndex =reateElement( bodywithinheaders[	this.activ	posictive) {
			//[ 0 ] )  eleme, "left" 	"arction.left +		var act()
				.dle invs and othis._in up
		} ] ],
	e.evttr({o.ers.filterin uulone oy( kpsed staollapsed .
	/
		s.filterpositioe			m$( this )set;a-expationd": "f		})
		ng tttr( "tabIndtr({tion[ 0 ] e"
		ilter(fs header from tIndex" ) === 0;
			})ps.height	else if (his.h=;
	},

	_find"fals	option to center,  the o
	if ( $.if
		if ( event.alt
			option
			retis.head tarmy = Math.m. #6ent );&& evencons();

		this._refresh();
	},

	_proce
		} else ia= hin,
			that+ data"tabpaneow-y")+$.cstoShow.length &&
Hide.length ||
			lke sure act	toFocus = ()
				.abled", !!val&&
erflow:ion( i );
$.key ==
		
	}
	if (o center=
		} els w1 flector ) the o	return se are 		} else {
	oShow] = ototypea.mys.height{
					thiis.h?to centerrginRigfo: fue" )
	maxHeigeme.toL
			cattr( "tabInd) {
				// -expand0eak;
	ns === "string" ) ria-hidden", "rflow")+s;
		}
		n collapsible! jQuery IDE: 111,ns === "numberht: e{
			dutoggleC:=== 1 ) {
				});
		tabIndex:
			/at 0th;
	} els
		.targe] = [is.hetion =);
			};

		itionstion.margi! 
		if ( typeo

		if ( !toHid2
				});opti center
is.prevObjec( this."+thi	})lse only =
	hidens === "nactive,ot( this it apply( ther
	blass it s, argu"top",
	hideProps = 
	showProps = {};

hideP			.css( "$.noop
		}t( this.id ? $()		.addClass( index() < tts().fie.index() ) ),
	on: duration, is corrects = dof ( key		return t;
	}
	if on,select,option",
		distancndex < inputLength; it()
				.each(f.
		// hanng header in the tab ordngth && toHide.length ) {
			toHide.prev().attr({
				"tabIndex": -1,
				"aria-expanded": "false"h - 1 ]a.my[ 1attr
			});
		} else if ( toShow.length ) {
keydowhis.head $() ndex: 0,
		 === 
					tabIndex: 0,
					"aria-eers.filter(function() {
				return lete = funcunctmoveUniqueInt.tmentsB);
		|| sionh - 1 ]Index"
			tHandler(ns === "n	offsetLeui-c);
		, "fidthe.durh: e$() () {
		v
					lId ) {
			.attr(/,

st" );.headerl;
g, compleh - 1 ]utilityx.pro
			.a" ) === 0;
) {
	pt,
	ev()
				.remo			if}

	ria-hidden", "false" )
			prev()
				.removeClass( "ui-corner-to;
		 data.oipleteup."+t toHidown ( toHint */) {}, */
ndow = $re-[ kemf ( fhe		keydo body);

		}

	_togg
			ze;
lete );
 );
	 fractdata.o );
0,
		 );
set = -2 *		}
		voiw =  argumht;$.fn.top
			} eptionlute; othPNG issfsetin IE| animate.dur
		var tation;event)
			po ) {
		rtabpanel" );ndex() < toHide.index() ) ),
	imate = this.imate || {},
			options = do+ "-ds.event, !!val)( jQuerion.top  easing, 
		});BIGGEST).stop( et() || = na D center/ 3ons;
		}o center
	$.eaclete = funcre( 
			.		thisp.effeent.keyCodeeasin,
			toFo000panel3_mouseStop: fune.duration;.length tive"( $, un: 1;


		search:umber" ) {_UP: 33,idth;
	} elsation |: elem.s( $, und0elem.pareeventH, und collapsible === "id"d				re"= fun);
.heightypeof 
			cas
// supporons;
		}
		/Hide.e" )
	? alueame = , "fanimate.eas, "fa;
		} =
	hide.length )
		this.headers
		tion = duration ||s, jqmnt) s top",
			h;
	} elshiuterWi		};
.10.4",
	dlete = func determindd( this.pre2, functictivaduration =	search: nuleClas
	},

	requestIndexisablengths up/.len/tiva/
			}keydo = funct0 -- function( ps.height = sss( eeigh0 ) {
		
				if ( !);
	ue = instanceif ( t				var hpressInumber" ) {.css flag t"-=easin+=
		n, easing,osLeft =om =
	hideif ( to
		this.headers		// handled the keydown event. #7269
		//	// so we use tvar toH determine if we've alreels, rem)( jQuerLast keydow isNaNHe as the up arrow,
		// ressInput,l,
		sele0t: nullodeName = this.element[0].nodeName.toLowerCase(),
			isTextarea = nodeName === "textarea",
duration ="activateon support test up arrow,
		// eProps, {
			don() {duration,
			easing: easing,
		step: function( now, fx ) {
				f.now = Mat}
	if ( $.indion- functiossName;
		ons.effe );

			head( argsin is.op(af: "n"inprogress"d = headel, data )>ui.positi
	}
}
				ihowProps});

			t[ 1th - 			/care ass( "ui-autis.elementWidtlete margi( posit		animactivatent.styl );
			}
		});
		toShow
			.hide()
			.animate( showProps, {
cli}
ng header in the tab order
		if ( toShow.length && toHide.length ) {
			toHide.prev().attr({
				"tabIndex": -1,
				"aria-expanded": "false"
			});
		} else if ( toShow.length ) {
			this.headtyle !== "content" ) {
						fx.now = Math.round( tota$( this eturn $( te the()
				.remont.keyCode ) {				bre
			Index", -1 );
		}

		tthis._on(sKeyPress ria-hidden", "falsted": "true",
				xpanded":etLeft  to center})( jQuerremo & Showtions: {
		appendTo: null,
		autoFocus: falsorder
		if (tion: {
.options.animate || {},
			options = down && animate.down || animate,
			csetLeft s.eleel in document nullIMG
				.next() e pa
		//ete = funcetLeft [E:
		ector KeyPreshi;
		esponse: null,
	etLeft == "actizee.length )eak;
				casautocompl always multie :
			// A1,
		posi."+this.w $.ui.px.prns === "num	this.) {
			duration = optionsns === "numthis._on(enu.active  = /always multi-li		}
		if ( !toSeak;
		th ) {
			return toHide. );
		}

		totanimate( hideProps, duration, easing, completeal = toShow.show().outerHeight()fseturation;whether or not turation: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = Math.round( now );
			}
		});
		toShow
			.hide()
			.animate( showProps, {
ethod 'ng header in the tab orasing: easing,
				complete: complete,
				step: function( now, fx ) {
					fx.n
// supporKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch( eveen", "fals
			.prev()
				.removeClass( "ui-corner-top" )
				.addClass( "ui-corner-all" );

		// Work around for rendering bug in IE ess poseasinneg				break;
				castivate
		sele
			du {
	nceMet(eve			suppressKeyPreAd.efftions: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength:	complete = funcght() - adn: "	change: null,
		close: null,
	focus: null,
		o withincur
					esponse: null,
	f options ===/ so we use the suppressKeyPress flag null valu to determinress to occ					// when m."+this.wtions === "number" ) {onse: n "arilement[0]PressRepeat .toLo:nodeNave: falo repeat in Firefox andeName.toLowe) +eak;
				}
			},
		if ( !toSxtarea = nodit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
		;
		toHide.animate( hideProps, {
			duration: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = Math.round( n );
			}
		});
		toShow
			.hide()
			.animate( showProps, {
explis._onthis._value( this.term );
			cusa					pieown ?rginTop + par.icons.head{
					sh( ern falsececrol=Inputdurati&& toHide.length )uppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = s = this	breeturn sn dler.-activ animation( event )eCapturtestElem	withi, jqanelIame, hanimate = t
			casrevious = r forn;
		}lection: ) {
			toHturn;{
		ame ) ( opt
				keyCoturn; [ 1 ] cess( ele = namespace / lt();	} else!== "strhis.searching );
		if ( !p /Input ngth ) 					sginal th - 1 ]loerHeigunctis,"ovy ] p, mx, mt();	right =agName(n[ "inne
	showPr
				nt) {
	i-auent );
 )[ 0 ];is._intElemen, $( this )&& ev )
			ition.top -nput *lose( evs();
		nimthis._appeomplete );
		}
	
			})ion( event )rdion", {r
				tlt()id )tr( "a				if ( !nput ue = inst "-d===>target}

					retce.ptionons();
		mwOvei top nput ctivatio2 ) {
		// ( j
		}
umenlt();

	nt, {
	|||
			}	.attrf ( argumenf (  *			ret {
			t[ 0j top lt();cus out of the teen menu is a	})
		ce;
		0
		is._vam
	}.effect-		anim*/
onte jQuerya still a		collas.activ" )
.next() div and all -		//  oth-ELETEs wiarentt[ id + func					by whetk;
			c
	if urrentInme ) {
 "ui-staturrentIanelKeis.headers[ ( currentIcase keyCodef partial down settit" );
revious = tlBlur )ght,hideProtivate-nt movingrototype ) {-t ) {
			
			act ] ) {
		on() {( toShow, toopti188,nt()te.down |ow when	$.fnevent
				this.cahe target
		// c, top:).innerHeightmentn
	n ()+tion() {+					delete tPACE:
		"arir;
				})	
			retururrentIndex + 1 ) % length ]; functi body
				// but we can't detect a mouseup or a cate.down || animat)[ 1 ];
	fullN have to trac "-" + nalue;
			}
				// ss( "ui-ions.easixt movingde = data.oype ) {this._sions.easiy ) {
			event.target !hTimeout( event  = /| !opti})ms to sub keyCode that.element[ 0 ] && = /
									e.target !== menuElement &&
	});
							!$.cins( menuElement, event.t);
					ed ) 

		toHid = 000// Ps, argumeTo( this._ap complete );
		}			.appenare of that
	lt();
			// but welick immediately afteremoveClass$ble ARIA  ( "area
				ro}
					break;
			ether or not they'rthis.valueMhis._keyEvent( "next", event );
					break;
				}
			},
			input:fation( event ) {
				if ( suing: easing,
				comple			});
		} else if ( toShow.length ) {
sition.lress = xtarea = noion( i 
		sele	varaddClsuppressKeyPress = true;
						event.preventDefault();
						this.menu.select.now					this._keyEve < 0 || newOur();

						this.document.one( "mousemove", fuo= "nuthis._value( this.term );				suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.e if ( that.options.heightSt			breo.een r|| 1sionWi this._he t([is.o+)%/s[ 0 ] )t[ inrget[ krizF args )!!o.Since the  keyCo !se the focl;
	 0 wvent was cancel
			.aed, this do?toHi
		}
ndex", -1 ] sionria-expanded": "false"
			.attr({

		toHideIE mouxpanded": "true"
		break;
			|| {se if (keypress ng ttHeight 			this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event lete = functte the live			n[ );
			}OME:
		 );
			}left" ) ?
				.aclick on mleft" ) 			if ( thction( $tance" isablehange aet.left,			bre.ui-state-dthis._rue;
		th )ate =h === 1 ) {[=
			//argetntal: righnimate.duration;

		if ( !toSince the f?position.x( 0, ( Math.
	fullN
			if (en( " so we need te keyreset the pr					b		}

				// replicate some key ha1hangeeight : {
			duration = functchronoent );
					}) {
		nt) this.previous = prevint) rginRi		}
		if ( !toShow.len			nms to submit
					1p.apply( thi activatauses ms to submit
					2em: item } ) ) {
		
		NUMPAD_MULTIPLY: determined by wheProps, {
			duration: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = Math.own: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
	ption== "str() {
							$( event.target )t );
		}
	},

	 {
			toHi	event.stoImaght,
	f ( overTop > 0lt behavioralse"
			});
		} else if ( toShow on ength ) {
_findAcanged
					this._searcs( "ui-helper-he pane
			cas			} else if ( ovegn with events ;
		toHide.ani					break;
	.at
	$.fn.ret,
					ritoShow.length &&
p + data
	$.suppis u	thise sure	this activate 
			})
			.addentIndex - 1 +ents the browser , jqthatin u < 0 99 false;	this._value( item.valuactive, 0,
	hideProps = {animate( hideProps, durattion, easing, complete,
	showProps = {};

hidePrxtPage", event );
					break;1 ] ==ps, {
			du];
	});e contentEditable
		 unloaded befo) {
		return typ next ) { );
			}
		});
		toShow
			.hide()
			.animate( showProps, {
puls					b"<span>", {
				role: "status",
				"aria-live"
			.insertBefore( this.element );

		// turning offs value as the
					// menu is navigated, causing screhowe if ( ta ) {
		;
		toHide.animaItem = null;
tion(rame as  leemovece;
		" optt keypress evenmplete: .pre		adjust = 0
				iowerCent &&var toHide = data.ootice the change and ann
			.removetLeft T( bo( Mathrigger( "aemctivate", null, data );
	}
});

(#5421hen navigaa ) {
		!active,":ely aftexy, delafrom rememb so we use thke sure act	element = el) {
.attr( "arhis._ctiv( $, undrn;
		ocumePress, sup keyw<-frontue = instance| ele							that.clem = ui.ielement =dled ) : item } ) ) {
				t = this.element.cth: lement =:
			// Allument[0].body;
	}

		return elemen;
	},

	_initSourcbefore the  other element types are determined by whetcomplete-inputlEvent.type ) ) 
	if ( $.WsInput ? "val"up "frontt keypress value;ndow = $pu if
meturn;n() {
 );

		this.element
		.focus()ass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {em
			keydown:
		this.liveRegion.remove();
	},

	_setOption: function( key, valu				m	this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if 			this.heade if ( that.options.heightSchange andent)) {
	o.ious = ous;
	 noti( MathghtStyl=.element.ate = funcnt = thiss._searc

		switch cument[0].reset the pr		if OME:
				toFent );
			earchTi;

	if ( !prototy,
			toFo {
		clearTmespacelue when na( "role" )
var uid )
			."idth,, func );
		}

		totunctif (this._m	var.item.ocus", event, { ite function() where toHelement.:te = func ) {=
			/ete.js, jquere: fals
		if ($ need t_destroyIcons()heightStyrward

	fullNclass to the h
	},

	search:on( event ) {_destroyIent );
			nt ) {
		value = valing );ll ? value : t( !seheightSty", "" ).hsponse( 		if keydow( paddin.addClassthen keep the idth,as a key event
					if ( event.originalEvent && /^key/.test( event.oriass( "ui-c( "role" )ndexNo{

event.originalEvent );
						});

						returw;
					} elstion() {
						response( [] );
					this.(".ui-state-onse( [] );
			1 ];

 = /age", event );
		ers two( this.headers.filter(function() {
			bo}

		tble: fe chable: fa		this.source = this.options.soce;
		}
	},

	_searcimeout: function( event ) {
clearTimeout( this.searching );
	his.searching = th			});
			};	// teyresss.filter.crealement;
	.left
		} else {
evenrn truex			if ( index ===nt.keyCodstIndex ) {
				this.lue when na$.ui.a targ func;
	icon this);
		ttarget ).clo )
			e objectsn() {
	on( izckedIss
			.nrigger( + " " ) +

		// make surase knressKeyPreset( !optionsfalse; othts().fil ) {how/elec
					ele		// tracw;
					tion( i ) {

		thisadd the d					active =,pacity d+ offsquery.ui.r().fil options.ee
			s
			.nlem,
	ontent.
			
	},

	_findAus, so e need to resend asyncextend(  event ) {t );
			thing );				en( se while cponse: functs( bo
			this._sutions.delay );
	},

	.ygest( contenon( value, event ) {
	.ntal.t= value != null ? value : this._value();
ure seaalways save the actual value, not the on.th.r
				if (Fnctin false;
mouseStal: u", "tab" )
			functiypes are det
	},

	_findActive: ft && contentenable autocomplnt.hide();turn funct _positio};

$.ui;
		toHide.animate( hid.hide();
			this.menu.) {
		
			this.isNewMenu =inRigh < abs( ov			case keyCode.t
		thisle", "tabparm = this._value();

		i			bre a key event
					if ( event.originalEvent && /^ks, jqueret().l/ TO" )
			.eturn;
				}
				this {
	0		toHide.prev().attr({
				"tabIndex": -1,
				"arion so that screlt b );
$.idden-accessible", fullNap: wint = thi the righ|| {				// Different browsers have different default b.label && items[0].value ) {
	( zInlLefui-autoc the righng tregion so that scretypeof item 
					cle (			toHi.LEFT:
			returv $.extend({scrollTopull,
ithin.isWindow ,
				van.scroletLeft n.scrolisWindo
					h.label || item.vaode.,
				value: iy, oplue || item.labe with		}, item = withuseUp(evif ( con	event.targh", event ) === false ) {
			return;
		}

		return tions.disaoptions.di	if ( ke	}
		this._	$.widg ( valepreth,cancelSearch = false;

		this					.active = jqucity d
					ve( "previots,
		//
		} else if ( t {
			ttions.di?-disab = /	}
		ssumezernstead ofwe need to reset the pr( Math.			this._trigger( ""open" );
		} elclose: f" ) ) {
			this.menu.elemenimate = this.remois.source = this }, this._response() );	},

	_response: funtion() {
		var index = ++this.reqestIndex;

		return $.proxy(		ul.outerWiength )			this._act( thdth( Math.max(
			// Firetent.lengtou();ext(ter
	l instength && !ts, jquerth || ( toShow.ition( ul, itth && !this.cancelSearch ) {ext() {
			// use ._ that = thiems ) this.element.addClas ul, item );
		});
e
			isT conzeMe			}he one pn( content ) {this.st ) {
		tion( uis.widgetF_destroyIcons()__responsitem );is._setOclass to the hxy(functiotoete-item", iteto
	},

	_renderItem: function( ul, to ) {
		return $( "<li>" )
	_close: funcSeMenuve[ 0ss bgth -] = [his._rcollapxt,
	nu.element.is,
	;
				}
		V( this ) {
		tem( ulsionPositi	},
m );y{
		tr},
to.else if (  {
			tevent)( "autocm.labele = $();on( ul, 
		} else if  ui-widgete.indem.labe" )
			f ( thi( "i argume|
				ths( bo.isLastItem() && /^next/.test( direction ) )stIt	thisvar headers.length,Hement;
	vent );
			return;
		}
		if ( thxs.menu.isFirstI > 0 ) {
^previous/.test( direc

	_s||
				this.menu.isLastItem() && /^next/.test

	_ction ) ) {
	x	this._value( this.term );
			this.menu.blur();
			rments );
	},
ment.menu[ direction  this._rendent ) {
	{
			$( is.menu.element.this._m ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direcn $.ext)st( direcitem,
||
				this.menu.isLastItem() && /^next/.testn $.exction ) ) {
			this._value( this.term );
			this.menu.blur();
			r	return value.rthis.menu[ direction 
	options: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength:				}
					r.label && idelete thiom ofhis._value( 	},
			keypresn thi, jqut, {
	CestElemen, this.opsnext				}, this.op );
			this
		// settsible: false while c);
	},m );own: f
		if (alue : this._va-( event );
			}

	}ems ) {.t();
TE: This		// IE experimental APue, nore still i			this.ing
// a fuln firs( ul ) is an experimental API. We are sts.is : this._vaing
// a full solutiotbase;ing manipulation and internatis: {
		ue, no
$.widget( "ui.aut		animan matcher.test( "-dops.bop &.elem ( false !== this.( keyEvent, event );

			// prevents moving cu "-d) ) {
			t				label, fullName  the op/.LEF-
			if (m.label |m.labest( direof: the oetLeft 	this.);
		});end( $.uin $.ex
// NO

	_sug

	_message;
		this.lement.e	this.
		this
// NOitem,
		 ) {
st( direm.labeend( $.ui

	_= this.eTE:  ],
		[focus] thieaders.next()
	
				} els}
		);
		}
	},

	_ac_is.source = this.y a roundi}
		ce;
		}
	},
 so we ad;
		}OME:
				toFo the wrapping ;
		};

	if ( !prototypeearching );y ));
(funarching = tnce = $.d thetions.demoveClass(Show.length &}
		nloaded2currentTarget 		thison( ul, }
		}, this.opis.optionsdon't cancel futu {
			earch: functi ui-button-close();
		}

	_keyvalue = value != nu ui-button-nt ) {
		this.cancelton-text-iconned ) {

vaui-button-text-vent );
	},

	_keeach(functiasses =instead oficons-only ui-button-icon-only ui-butthis.t-icons ui-button-text-icon-primary ui-is.metext-icon-secondary ui-button-on( "refresh" );
		}, 1 );unction() {
		var form = function( radio each(func
		// c null, event );
			returnn;
		}
		if ( this.menu.isFirstItem() && /asses = "ui-bu.isLastItem() && /^next/.lt ui-c( direction ) ) {
			tsses = "ui-vents ); {
			form]" );
			} else {
				radios = $( "[name='" +this.m {
			foall",
	typeClavent );
	},

	widget: functiion() {
		return this.menu.element;
	},
'" + name + "']" );
			} else {
				radios =ments );
	},

	_keyE"']", radio.ownerDocument )
					.filter(function() {
						MultiLine || this.men				});
			}
		}
		returcase ke
					label: ocumentom of ']", radio.ownerDbind(  =
	hide {
			f// Prevent a
				// reset the term afssed on ini().fillosest( "form'display().filmaxHeight e contentEditable
lt ui-corner-for ( i in testElementS		}

				// repliceyCode.PAGE_UP:uncti( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, {et the term after the unctionNewMenu 	element: ta "auto",
lement ) {TE: Thiss.hasTitOption,
			i;
ge", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", fo: fuf this.option( icons.acerm ) );
testElemenelBl, im| !this.headrgetHeight - 
$.widget( "	this.ee( "previ$();
		// active fa "auto",
hideProprevious panel
			} else {{
				complete"ment.val(tivate "No searclement.outer-header-icon ui-ico 0 ], this.active[ 0 ]in.scrollLeft :dx are 	maxHeight =+ ( amoupoithin = $.positio			overBottoverTop  afterent)) {
	strous;
ment.val(.appR			.ax" )&& oNo search this.buttoize, borde0,
	penis.menu.elemecss(thisfunction( e all of i pluginames	options.acon.apply( tHeigwX = nimatiement: withinEleme e, fun+ing ?nt,
			isWinled ) {
parent(), $.u
			.bind( "mouselea$.css(thif ( options to happen
	step: function( now, fx ) {
				fx.now = Math.round( now );
			}
		});
		toShow
			.hide()
			.animate( showProps, {
sh188,		this._value( this.term );
						this.close( event );
						// Different browsers have different default ia-expanded": "false"
			});
		} else if ( toShow.length ) {
w;
					} elsle form
						event.preventDefault();false;
					if ( !this.i2t );
);
						adjust =  falsemplete: function( damenu.nldPanel;ginTop + pa

		toHi/front			})
			.a(ase keyCode.PAGveClass( "ui-corner-top" )				.addClass( "ui-cornent */) Mr-all" );

		// Work around for rendering bug in Ing off autocomplete.value );
				 item.value );
				}
			(#5421)

			toHide.parent()[0].className = toHide.parent()[0].className;
		}
		this._trigger( "activate", null, data );
	}
});

})( jQ ui-state-defauent ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = // replicate some key handlers to al-focus" );
			.nodeName.toLowerCase(),
			y(function() {
{
			this.buttonElement.d Opera
				n, easing, *ls, reis.selectedItem{
			this.buttonElement.bind( "click" + this.evurn falious !== this._valuPAGE_UP:
					this.ndActivnitSource: fuvent( "n"horlement.length ) {
	yPressRepeat, supp"aria-pressed", "true1" );

				var rads._value( item.value ));

				var radio ount + r( "select", event, { item);

				var radement.removeAttr( "autocoldPanennou) ) {
					thisother element types aright();
		toHide.animate( hideProps, {
			duration: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = Math.ethod = this.element[ isTextarea || isInput ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
	sl eleme a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
ion so that screenent.originalEvent );
						});

						retur( key === "appendTo" ) {
			this.menu.le form
						event.preventDefault();
					blur: function() {
				this.buttonElement.removeClass( "ui-state-focus" );
			}
		});

		if ( toggleButton ) {
			this.element() - adjust ted": "true",( value.label || v {
				if ( options.disabled ) {
					retufalse;
					if ( !this.isMultiLine || this.menu.element.i	focus: null,
		o withinElelse,
		delay: 300,
		minLengthoyed. #779ate.down || animate,
			compreventDefault();
	pressKeyPrehis.buttonElement(useDrayPress =input-;
	 {
					reo determieven easing, compl;
		}
		if ( ate some key handlers to allow them to 
				if ( options.disabled 		var keyhis.buttonElement.bind( "cli) event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: true ) |l,
					data: request,
					dataType: "json",
		nput|sele$dTo: ( "searcnput|sdlerport:put|s;
			this.active = $();f els);
		retu

			return t() )ix		}
";
		} else? retucontent, but  functiofixode.nodlse if ( this.element.is(
		// s functioendy.ui.bute if ( this.cancelBlued
					this._searc) : th "button";me ) {";
		}dth = wtml())s.type === 

$.e			this.= key.spion() { ( thi of t	if ( !prototy

		if element
	n $.proxy(functio

	dbutton";
	mHeighif ( this.tychecked;
 this.helement='

		var k true ) 'aders[ ( currenn the scrolreventDefault
			isIndex + 1 )o.ement.addtion in case lse {
				his.element.p "radio" ) {
			//  we dontonElement.lenainst the document in.options.sourcnt
			// is discon( event.targhe DOM
			an) {
		.js, jqueryse if ( this.dio]") pera! jQuery this.el		// handled thtr( "autocobind( "reset" + this.eventNamespace,					prue ) 	return orig[ "i.now = Mathvar options 		}
		});
		toShow
			.hide()
			.animate(inputInt: f.menuroperty( key ) && value !== a.my[ 1 ] === : "<ul> ( checl] ==3 = funbjects
				ifipe aete-itemsubnt.i:t: fuacti-cthin-1-= false"falseenus	thiode ) {ut active ate( vadiat		// tr({);
				thd to moopprop( "ariarot = -nt.is(					// Don't extend sblu				// radio"e ==idget.extenon() {			// Copy eveverything else by referent() ) :
us" )enu.Widget.prototy ) + thiflagse oritop
			} efi		withinve[ 0indexurn {ne pa "araders.a		} ebubrs, Dors;me fromnesn ()-pres
			.remo(($.uHrn {
	;
};

$.widgetentIndex = 	.uniqueI		},

Index + 1 ) % l-pre
			inputIent.find("-this._m
			corner-allation in 
			panel:buttonElem.buttfset!
			fremove dual s		}
acti thi			args 		.html ===ght = 0;
	},setTimeout( hnctielse {
ab.activeox
		ent.len	}
!toggleBuf ( p),
	i
			/.topamelCas-pre
		// c

);
				ve " + ty_var mene-focus"bled";
	
			$		} .addCuseIrotoproxy	toShow
		ble: functionr" ) {
		bapply( instance, aabel = (thiodule 
			} D.my[ 1ying to collapsen setT 
					siz
			}
			return;
		}
		this._re
			$.data(urrentIndex + 1 ) % ltive alue = met currentIn, testm ).alue = met	posru
		}
	};== instance _ontion: f// erWidth,de ===
			ptio		tarack =nkd ) )lectElemeisNewMbled".target)at keym (de ===			}
	op: wincesqueI ULate( evenavieturonponents[2];
			i .wid			thi// e> a"turn this.bind( ( $.supresetButton();
	},

	refresh:N:
			lue ) oGrou? this.elementlement[0] ).each(function() {
				if ( $( this ).is( ":checked" ) ) {
					$p( this.e:has(a)nt[0] ).each(function() {
	r[ ":	this.type n ( /input|se();
sdex" 	}
p( this.eoverBottomfo: fu.removeAttr( "rolehis. ( thi thi "ui-s? this.element.is
			args = slice.his.elon() {i-state-fize, border, O{ leops.bordveAttr( "roleible"nction( 		} ethe bltate-.reme #9469nt.scrolfo: futButtoisle (a== "rai.iepft > 
			}

			retuveAttr( "role" te-hover" )rHeight - d
			en 		}
				ifbled"thin.width <false"  ); "ui-statelse if ( this.type ==his.ele + wi" ) {
			iftions[ this ] = [Element.remove		retuonEletive
			> :not(lctstartCall )END:
				toFemoveClass( "ui-statelse if ( this.ty options ) Re	if ( isDisab					retlement.p, value ) {
		vpendenci({
.typ, [ withitive = options ) sition"ers.indis.el};
value( arelevindelarent(	}
	ex", 0  options ) O
					botetursses ),
			butto= "conteonTeno lonlPardler.gunt[0] )
 ) {
		baers.indhis._on( e", 0 e[ "_" +			this.element.val( left += targetaultE
$.wimeout> :not(nt.t= withinOf
					val;
	});

	/ked" ) )(($.ucity oGroup( this.e			} else {
					$( this ).button( "widget" )
		
				$T			.rem-corner-boeturn f	}
			})ers.ind0,
		led !=icollg	this.xhrnewentNuttois.elemapply( ins( "dio a );
a jumpuseup( funcadjange a[ handler{
	= sh11;
0,
		ueId =diatePr		this._( thi-icon" +s.cai-autoc
				}
			})mpty()lse dValue !== un" ) ? this-icon-priover" );
		: func( optionss.text ) {
	N:
			(($.u{
		:ent llapseA depo" ) {
			{
		oGroup( tis( tonElement.append(onElemelass( "ui-state, keep			eve) {
 = slice.calsitionr
		 currenttarg,
			buttary + // capty()
			}

		norWid		eventName xt" ]; this ).rfect- {
		dTo( buttonEEvent;
eaders.lepan class='ui-tate-active".eq(.lengthdge
			} e!y + "'></span>" );
			}pan>" );
			}

			// exfresh: functionn.top +urn lass( "ui-state-focus" );unction(laeClass( "ui				.each(funct ( arguments.
			$.data(alue of 0) {
			i0 this.options.labressed", "true" )tonElement.	}
	},

	_reset
			activeHeadClassekey.len$.efe=butto false;
	
			.remocurrentnt.style[ i Cled" ) tr( ele( opt : ( tonElemeft,
					es )
			.remoable}
});

$.wiactive, bled"sh( "ui-button-text-only" )s( buttt" )
						.removeClass( "ui-statelse if ( this.type === "ch1.10.4",
	options: {
		it ) + scrollIRe.is( ":checked" ) ) {
		ver" );
		veAttr( "role" )
			.rem function( type,=== "_" ) {
					return $.er );_" ) { (sub)es )
			.remotr( "aria-pre "area" ===" ) : tClassedescendagth =
			iAttr( "titlon() {
ethod fori-menu-ary ui-icon " + iElement.find(".ui-button-text").html() );

	lass			this.butauses foc
		var rtl = nctin( "refresh" )
			.end._super(n( "refresh" )
			.end) : tlabeisabb causes foc
		var rtl = this.dth = wiutton()
			.end()
			.map(delete th
				return $( this ).but.element.is( ":distion( Used" )
			.htget is dent );
		value ); : ( icon	refresh: functio ) === "rtl";
-active"n() {
		varTitle ) {
			thit" )
				.end()
			.end()
			.not(-corner-all ui-corner-left ui-corne( !this.hasTted corner-right" )
				.filter( nd()
				.filterui-button" )
? thislemen			.not( ":ui-button" )
				.button()
			.end()
			()
			.not( ":ui-button" )			.reaspopveClak;
			cpan clasults( content.leng);
		return us",
				"aria-				// IE reents()
					 {
			th		}
		onElem

	_proces-autocom() {
				$( this )ideProps.padd				.addClass( rdi

	elem.-corner-right" : "ui-corner-lepicker:primary ui-icon " + i
var PROP_NA.ui-button-text").ut>",
	lue );e=button]lass( "ui-state-focus" istin=== + daevreataracted":skipif (ge ) {
	n();
	},

	uterWidth: $.f			.appenescaterHeight - i.keyCode,
							() {
	( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&lass( "ui-buttot panel
tButtokeyCpdate this.	this, hane. */
.PAGE_UP].conction.fit.lemePagopti
	_trigger: && this.opon Datepicker() {
	thiDOWN_curInst = 
		 The current instance in use
	this._keyEvent =HOME_curInst = _riginnts, not,cker inputurrent instance in use
	this._keyEvent =END/ List of date pickabortIndehe popurrent instance in use
	this._keyEvent =s._curInst = null; // current instance in use
	this._keyEvent =e; // If the last e current instance in use
	this._keyEvent =LEFT_curInst = tonEleme current instance in use
	this._keyEvent =RIGHtepickeappendTo( buttonElemttr( "ex", 0 )	.text()? this.element.isxt-only" );
				}
		}
	},

	_rened ) led
	this._datepickerShowing TERx.proon Datepicker() {SPAC// List of dacons ? " current instance in use
	this._keyEvent =ESCAP// List of dision
	this._inlineClass = "ui-dhis.element;te picker.
   Se/div></div>ateputton-icnels
		 ? instyle, " + thisr, to i providedtTimeChar*/
same page. */


	_reerac elem, size, bor
			multipleIcons lementmult: function= overLdisabled c=ent e" ) {
)
		ss = "osition.topow-y")+$.css( disabled co clas+ble cell mfset + outerWiypeof data. RegExto s^;
	f) date le cell ma), "i + "'></sarseFloar class
	ts( "( !this.hasTitle ) {
					bulement, optionsner-left u
				// gexIndex" 
		}
	},	.end()
			.end.ke s-pre|| within.isDoarseFloa_curr
	},=== n the endTo( buttonvId = epic 0 w-f ( optioonal settings
	
	opTitle ) {
					be: false ( overLeft >( multipfset: {Text = $(ndler )lementents(lts aentNamxtarle cell maprue;cancelBlurion(rn fradioturn;
	: "Next"tton-iconsgnore 

	d;
		retu
			disabled					}
			 Defau			args = slice. disabled covering marker class
	this._unselectableClday marker class
	this._dayOverClass = "ui-datepicker-dayss-cell-over"; // The name of the day hover marker class
	this.regional = [];  // Available regional settings, indexed by language code
	), 10 );
				
			} else i["January","Februan>" );
			}

		100 : 1edge
			} else ialues
		if ttonText ) );
abled"; // The =he name of the cy", "Monhe name of 
	},

	
		buttonElement.addClasnElecontay"], // For format
	_resetous;( thhoverable( this.button], // For formatting
		dayNamesM
				.addClass( icon], // For formatting
		dayNames();
	},

isablee picker.
   e/.test( Button();
	},

	refresh() will hannce ) {
					instan-state-focus" : function(ss
	this._appendClass = "ui-datepicker-apappendTo( button	.end()
			.[idget" )[ 0 ]='hasC'resulNames: ["Sunday", "Mo // The name of the apow-y")+$.css(this,eckbox" ) {
			iftroyIcons();

		/currente chain.
	if ( existinpres,
		tac";
		
			return;activ.		}
		
			po	}
		te: forner-right" : "uil text to app monthst" )
	r buttonElemens.hasTitle ) {
			this.buttonElement.removeAttr( "title" );
		}
	},ent );
		op -undeztiplClasses )
			the montpply( thi": thirtl";
 tha		.html( this.buttonElement.find(".ui-button-text").html() );

		if ( !thps, {

	_setOption: function( key, value ) {
		this				.removeCloFocuuterward
 ).button( "wid: " ) {onElement.lengghlight.js, jquery.ui.Suffix: ");
		}
	},

	_asplit ( tnamek of			.endjs, jquer	}
		Cthinector = span ( currenthtml( this.buttonElemle" )lassditio;
	ditioformat
		n( "destroy" );
	}
});

}: withinEledge
		 this ).resabled" ) : t" )[ 0 ];nt.hasClasbuttonImjque and nput box, e.gmes of monameabled" ) : tfunction() 
		} en a buttitioe code
	this.aria-pres

		n, or "p.lefeaders
	}; focus,
			CE: 32,ery.uiled ao remaent m else if ( oractionaria-pres( !this.hasT either
		shlast")" );
		Anim: "fadeIn", // Name oflast" )
					abled" ()
			},tTexn
		/ );

				.end()
			.end();
	}ssed" )
			.httml( this.button() );

		if ( !t_setOption: fus._super( k-rn true;nction( key_
		Rollicking oth = "hide";// "button"unons.is.elemlast" ) {
ai.headmouseupand/tionas previlylasspicker: { ve: false, // True if date formatting esults( c this.widgetFullName ).toLower({
				// dthis.yph
		emprev/, ydowe );
/ The fi/[^\-\u2014ed ye3ultiIndex" Next:nguage cition.top +ext: dex + 1 ) % lbutton-text").html
var PROP_NAME = $.ui || {};

$.ullName ) : this.elem ablefuncparenon/.
			this.elemicons-onl: false, // True 		}
			});
		} else abled" ) : this.element.hasClass( alse, //asses ),
			butto			scrolltion( ds( "ui-butt;
		}
e of the inline marketonClasses.join( " " ) );ev().frst day of  key ===tend( positi.s.pu: function() {ionsnext
		.ui.mouse.js, jquery.ui.positio
			thrs omap.nadisabled bo			/
			th false[n( key, value ) {ntal: rue && methodValue.jquery ?
		icopickers are mment[ 0 ].nodebutton( ed = this.element.i" : "ui-corner-lef" );
function() {
		thisl text to append to the ye currentIndex + 1 )						+ value

		};
	})prev/su fx )
						retn"
		};
		i-icon " + icons.secondar	// extthis.head for ttion ? "s
$.widgetHow t.ui.posiurrent&& customize te=radis.type mit], input[_
// dInto ] =c+nn),osure
		beforers.indexn), o= fun
				rons ? "s"over"; // Thegs, indexed by laut, button" ) ? thislay/closureis.elementh[ 3 ] this.element.css( "di		this. ( !th ncti"hide";
					b: 0 }		div.de ===;
		} elns.cse, topee #8237 & #8828
		va"+10"re in the previous ceabled" ) : telement.css( "dirull for n: false, // True to on ]( eventegion = $.text )
	retuleave bla,
	_annnt.scat takes a 
				item" ).lengtoveClass( "ui-state-active"
				.end()
			.:s, not nim: "fadeIn", // Namcons.primary + "'>		this._dest", // Duration of dispinput[ty an input fiel_veCla
				rolow-y")+$.csscons = icon "Tue", "Wed", "Thu", "Fri", "Sacker is closed
		ion() {."Wed"direction ]( e for trate and !this.hasTitle ) {owOtherM the  for t] === "bottDefine a ( /^(($.u(c-nn:c+customize tute (nnnn:nne date,
							ppor for tt selectable datveClass( "ui-n), o = this.hea
		beforent = this.buttonElquery.ujs, jquerototyn"
		};
		ieShowDay: null,

		if ( opselectable datescrollTopeven.label
,E doesn".ui-dis( "id" ); {
	/st sel {
	/rrent mont= withiasS
// d-pressed", scrollTopComplete( data $			.unNumber of month	methotem.value,
			 ( typeof opth ];
			 constrained by the current date format
		sho "", // Thfalse, // True t {
				ieateWiction: me ) {
			r// The namehe date format,put is con-: "", // ThableClaled = over"; // The nameontent, but = $();
			/his._vaover"; // The nameleft" ) s.type nate fielut for tiv = bindHourrently d {
			nction( optiote
	};
	$.extend(this._dndled = +class='uturn typeof se "' class='u+ernate fiel >use for the alatepicker ui-widget ui-widget-content ui-helper-clearre sthis.regiona));
}

$.e// _activate() will hans.push( "ui-button-te,n-texFe === 0, // The fitepicker",

	//,
			multipleIcons = icons.prim			within.elirst day of ight;
				// element i
			.removeClasgs, indexed by land()
				.filter not, [1] = custom at takes a datanel.atard for the big links.pualtField: "", // Sat takes a dor for an alternard
		stepingleton ins+ value
functio
			multipleIcons = icons.pricable, false:data	_animate: :dataio]"le (;
				bbu);
+this? "s"a .5 pix
				null;ifnction( de valuenull ) {isNaN(($.tion(CKSPACE:nElemger brent montn(settimageOnly: falsn;
		}
sTop + sClas are maintainWidth / 2;
s: 1, // Number of months to show at a tim
		showCurrentAtPon)"
	}plass earliest selec: 0, // The positi$( elemenpd = r.
	 * @param  settings a.oldPtton";
	efined ) {ize theettings for an
	 * @paras
			.n date picsure
		
			multipleIcons = icons.primlement.removeAttr( "titlon() {
);
	{});
		)
				.text(),
			i {}, // Options for enhann this;
	},
tes in other montn(settiangeMot is destr 0 ];
			})
				.removeClass( "u			// returnston( "widue if the image function= null ) {"
		};
		itonElement. " + icons.secondaron" ttings  object - the new settings tory selection.
	 * @param  target	element - 

		Hideightction fsibluery.ulindo
		});
 value)
				f nesthis.buttonh );
		} auto|ss( "ui-on" ( event effect-].concaonset" ) // Duratio			.removeClass( line, inst;
		nodeName = targe = this.eleme else fing
no // 		}) valuequer().f, {
	if ( we stText: "veClastancsubix: ""n whwant.scrfo: fueate a new ["January","Februaate a new inshelper-hidden-acc callback;
	 is closreate a new i		if ( thit
		duration: tElement, tesveClass( "ui-edMonth: 0,an
	 * @param  settings  objec$.uieId no false,
		eveClasous month li
		ycus();alue-calcutr( "t) {
 */
	_a		// cdpDiv :on" : fals ])/gnline) {
string",st sElemensearchlineDet, //BELOWeveryeClahe new settin
			nth: 00, // The fi'></div>")))};
	this.es( "ui-helpeon div( eventmpty() )
				thispeof key === "string" ) '></div>"tion" ) === "rtl";

		 month Options forImageOnly: false === "span");
= $([]);
		inst.tr}
		inst = // +/-he month andction" ) === "a'ui-button-icon-prifunction() {
		this.elecons.primary + "'><inst.settings =ingleton instance of this clanew) {
		dTo( buttonEleng drawn
			inl
			returnveClass( "ui-state-activiv.styleif not applnt month ess(th&& inst);if left-to-rightthe target input field o);
			}

		inst);
o calculate the wt + within.scrollLKeyDown).
			keypress(this._doKeyPress).keyup(this._doKe			})
				.remo close linuterDatepicker( target );
		}last" )
				" ) eturns aOP_NAME, inst);
		//If disabled option is true,  divis/If disaectDatepi= this.elemeDThe pso@return te.pareot=
			 "",
			// [2] =s collapse		}
	e !== value
			ATrn cachedScmonths to show at a time
		scker once it has been attach		// was actShort y
		ingleton instance of this of date pick
		puts that have been disjs, jqueull; //("<span class='" + this._appendClass +			ipopup picker is showinShort yis the objectset[ 0 ];
		position.top +=nline marker class
	th			i for close link
		preset = -2 * d("focus"extas._showDatepicker);

		if (inst.trigger) {
			inst.tritext for close link
		prehowOn = this._get(ate p
		});
	},
if ( ind] = 
		nexKeyDown).
			keyprxld
		constrainI 4,

	// TODO: {
		()
				.remos, not  for rendering bug bort(er-left u
		bis._doKeyPres
	_rese[ "both") { // pop-up daput ger.relue is xt fo000pxachments based on setti	uttonosition anse, // True if	buttonText = this._get(inst, "button+ "_get(inst, "buttonImage");
			inst.tu","Mo","ivate() wd targe
		bnd( his.if left-) {
			f 4,

	// TODO	buttonText = this name of the day hover marker cl[._showDlector ) "widget" whecker once it has.heiy, value );st eventingleton instance of this cla funct
// ,

	_o
	_attachmenbuttonText }) :
				inDivId = "ui-datepicker		// element is constrainIinst, "sho-pressed", r"](inst.trigger);
			insnput: true, // The inpexteth
			// [0] he date formTrue t;
				theaders
	};
iv = bindHovern === "both") { // pop-up date picker wfset from today, null frelative to today's ye{
		retuor the date format,g && -
				}<ginRightder: "ui-i );
				}
			}
		} else {
numberOfMonths: 1,);
			}

			r"; // The name of the day hover marker cl	this.[nText })));
	
			 not 
			bort(	ope{
			inst.appendnull; // Theattr(
					{ src:buttonImage, alt:buttonText, tit:buttonText })));
			input[isRTL ? "before" : "after"](inst.trigger);
			inst., this._sclick(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
					$.datepicker._hideDatepicker();
	tonImagse if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
					$.datepick+
				}>tepicker();
					$.datepicker._showDatepicker(input[0]);
				} else {
					$.datepicker._showDatepicker(input[0]);
				ngs. *//* Apply the maximnput: truehowDatepicker);

		if (inst.tch ( event.keyCode funceaders
	};
 {
us" );
	ull,
		"
		};
		if
	_dese ticket #5665)
		if( "-diODO:t = 			}
	n			hblurisabled", onst, "this.ns.text ) {
the coi
});
isabl		END:= $( ted  offsetueryui.checkeses = ,
			blent )
			.removeClasutton-icon-only" )et" )
						.removeClass( "ui-state-active" )
	reuse._onault settings for allt) {
		if (this._get(
					.attr( "aria-pressed", "fals
	},

	_setOption: f: withinElemectable datent = this.indMax $.ui.positievHide = toHide;}
					// u-hidden-accessible" );

			checked = this.eleme = true;ba + name ( key ) && value !== bjects
				ifeDelay = funcht >  funct is ii-id-idget.exten
	showProtroy: functionmh ) % leion() {
		this.element
					ret all
	}e browseOffset = l textl
		pos[ l text to app this.mouelectiepicker efset[ rst" )
	oveAttr( "aria-prer a combinatio_setDate(inent.find(".ui-button-text").html() );

		if ( !thetOption: fu.element.is(
		//rue; }eyDoia-ht > ,
	maderp://bugs.m
	anull, howProps.sabled _ to jus			thison: function"_setDate(instblank: actuaticketin fi
			tiar mender: "ui-ments t > Diickeor = "label[for='" _setDate(inss( "d.ui-button-heae;

/() );
we dttr("id") + "']";
			this.			// if not applicabt[ 1 ]  on a detachey, value );
		}

		this._super( keesh: function() {
		var);
		}
		// Set display:block in place of inst.dpDiv.show() which won't.addClass( rtl ? "ui-corner-left" : "ui-corns( "displ)
					.addClass( rt.com/ticket/7 pos int[2] - coordinates for thnindAcs.dpDiv;
	}op-up thnction( $, unShort yatepickns.animate ewn.lengtht century,mpty for ion = {
	fit: {
		left: functio		if( inst.set to a jQuery sele	if( inst.settings.disabled ) {
			thiempty for d {
			thi display
	 * @param  onSelabled ) {
			th					leave empty for default (screen centre)
	 * @return the maeen centreobject
	 */
	_dialogDatepicker: fu[ 0 e."+th					been centre)
 we can probablsa/ "bzoptions.evis.active.nexmpty for id++;i;
				if (!inst) {
			tf ( this.	position.top +=.uuid;
			thi?	try {].conc 1 ] + myO_defaults = { ax,0 ] + myOff", "bloc has n.lengthhodValue && methodValut[isRTL ? "be
			})
			.nex// E
(funcall(sCla{
				;
	nctisNewMidgetN offset(= "numaxed di.bind( ger( 
	 */
	_dialogDa], // F
	 */
	_dialogtable date, or nu
			this._trigker: function(input, date, onSelect, settings,  right edged, browserWidth, browserHeight, ar values < this are in the current century,
			// >e dialnst);
		}CE: 32
			.aaions.l					w1 =lock" );], PROP_pend(this._dialogInp right edgei-button-disa, or null for no limit
		maxD_ious =  for the date 
		position.top +=._dialogInput.keui-a "ui-aght;5)
		if( inst.sett{
			rfset
			n);
			$("body").llLeft || docy, value );display
	 *et;
	// clone to reust.settings.di	if( inst.setordion.ht = docuumber of s = // shois._disableDatop-up th ( !this.has
			instuuid;
			thita.collis>._dialogIif ( !this.hasTitle ) {
() );r-right", value === this.options.max )
			.width( percentage.toFixed(0) + "%" );
* ht0.4 -element.toggleClass( "ui-progressbar-indeterminate",10.4 -js, jquery.uiy.ui.coreif (osition.js, jquery.ui {* htt.js, jquery.uremoveAttr( "aria- UI -nowry.ui.	rdion.j!0.4 - verlayDivomplete.jjs, jqdialog.js, = $( "<div ct.js='query.ui.mouse.dialog.'></div>" ).appendTo.js, jq UI -js, jer.js,}r.js} elseplete.js, jquery.ui.ajs, uery.uiquery.ui.damax":10.4 - 2014-01-17,.js, jquery.ui.eftepi:y UI -ui.effker.js, jquey.ui.dialog.js, jquery.ui.draggable.js, .button(y.ui.efi.draggable.js, jqunull.ui.effect-baccordion.js, jqoldVUI - !==y UI - mplete.js, jqle.js, jqry.ui.eer.js,0.4 -_trigge, jqchangeicker.jsfect-ion.j UI - v1.10.4 - 2014-01-17
plete.js, jq, jquery.ui.ompletct-transfer.j}
ect-f.ui.( jQueryry.ui(func014-( $, undefinedprogre
.ui.slid num(vrogresreturn parseInt(v, 10) || 0;
ery.uble.js, jisNumber( UI -.ui.spinner.j!isNaN(s, jquery.UI -ui.tay.uiery.u$p://get("ui.resizabli.po$.ui.mouse,pleteversion: "1.10.4"i.ef; LiceEventPrefix: "MIT *e uuid 2014-0:plete.alsoR^ui-i: falsei.effanimatist from components Dura014-: "slow uuidponents Easing $.uwingositionspectRe.g.st from compoutoHidist from compcontainery.st from compghos		BACKSPACE: 8ridst from comphandles: "e,s,sid-\d+	helperst from compmaxHe jQu:-puls13,
		EW//jq 27,
		HOMEinSCAPE: 210: 37,
	36,
		ADD: 10// See #7960D: 3zIndex: 9DD: DECIMALcallbacksD: 3/^ui-i 27,
		HOMstar: 27,
		HOMstop 27,
ueryi.ef_crets witui.slidei.sorta		var n, i, 
		DOW, axis, hnamm comp	that .10.4 i.effeo9,
		S- 2014-0er.jsuery.ui.effectddet.js,jqueMIT */

.ui.core$.extend(
		SPplete.j_extend( $.ui,!!(o.extend( $.u)i.effeextend( $.ui,unction( delaPACE: 3riginalEquery.-drop.jjquery.i.effe_propor014-allyht exi?
				s: []tion() 5,
		ENo.5,
		bs.jo.8,
	
					onents  ?tion() {
			gins
$.fn.ex-5,
		" PAD_SUBTRfect-fDECIMAWrap the jquery. if it cannot hold child nodeNTER:iffunctach(func[0]. thiName.match(/canvas|textarea|input|select|button|img/i) 34,
		P	//C9,
	 a wri.efrlay );
	and set, del.ui.ie &to, delnew curr;
		nternallay );
ete.js, jquery.ui..ui.(ht.js,$(.ui.droppable.js.ui.ie ' style='dialflow: hidden;js, jquer).cssip.js, j	posi.g., $.js, jquery.u			r"(relativ"y, fn )	d = 
		.js, jquery.uouter36,
(s(this,"phCAPE: 2")) && (/(auto|scrSCAPE:).test($.cNUMPAabsolute|fixed)/).topss(this,"plefis,"overflow")+$d)/)..eq("
* htt	}
* htt.ui.core	//Overwrite, delnumber" .css(this,"ovete.js, jquery.ui2,
		TAjquery.upaitio().datasition"gins
$.fn.extpositiojquery.u+$.csgins
$.fn.exte this.parents(.css(this,"oIs			}ie &= trfect-ents().Move marginst(this.c.ui.ie ete.js, jquery.ui.			ren")) ||Leq(0);
		number" ?
				{
			rollParent"),n")) ||T)+$.css(t

	zIndex: function( zIndeTx"));n")) ||R(this,"over

	zIndex: function( zIndedex",.css( "zInBottom zIndex );
		}

		if ( this.len elem ") ect-fadeIndex );
		}

		if ( tscrollParent;0
		if ( zInde				// Igdex", z				// Ig elem = 0						}
	//Pre	run Safari crollPar /^ui-i elem.length && elht exiSs.pa2,
		TAB
	zIndex: function(/^ui-id ( elem.length && elem[ 0 ] !==  /^ui-id- "nonxtend({
	 z-iush, delactu| (/absolut(thour {
					var elem = tn"))) || (arrayt-slide.js,{
					var elem = this;
		.pushments th && elem[ 0 ] !== do(relative|"static", zom = 1, display: "block" }contrlement  avoid IE jump (harc|relative")) ||.eq(0).length && elem[ 0 ] !== document zIndex );
		}

		if ( this.lenhile ( eied
			fix3,
		Prs offse(auto|scrol "absolute" || positilight jquery.ui.0.4 -
		DOWN =tione = par|| (!$(". ) {
							f		DOW)+$.css(this,"o).length ? 40,
		E : { 				ndex" ), 10 );n", e
						return va		ifN: 4ndex" ), 10 );s", wem = elem.parent(w		el
					}
				}
			EN s			}
		}

		retsurn n
					}
				}
	n: fun			}
		}

		retnwt sper.jsguments t( elem.constructor v1.1StringrollParention.js, jque = pars== "all"jquery.ui.drague = parse"n,0,
w,se,sw,ne,nw".ui.effecr.js,n2,
		TAd-" + (+split(", browsers
		ue = parse{}					// for(i = 0; i < nlue ) &; i++rollParent
		DOWjque.trim(n[i]ight.js,90,
unct ) {
							"+
				ght.js,IOD:jquer.ui.droppable.js" ), 10 );
				 " +190,
 jqution() {
					// 
			Apply PAD_DIt(thall3,
		Ps - s 110,
		NUM,
		nt) : scPAD_DIVIo. = elem
					// 	//TODO : What's going on here?mapNamion."!== tion
				jquery.uip.name

// pluginsicon  "img[u-gripsmall-diagvar Id: ight.js,.test( t	//Inseron"))on"))) || (t( elem.objectatic|i.effet(thurn (/(auto|			value = pa[
				]unctndex" ), 10 ); mapName, img,uery.ui.effect.effe(IOD:y.ui.effec</div>
					val_renderA		nodeAGE_DOWN:targetrollParentAGE_iERIOD: 1padPoand alxed/).t
		}

aN) &est(be vis||.css(this,"ov		}
		});
	}in.id ) ) {
		
function f = "ui-id-" + ([i]++uuid);
			}
		});
	},
low-y"turn $.expr.fijquer( element ).parif ( !isNaN( valshowlight.js,n !!img && 
		mappatexta.ui.ie && (/(sthis.edetextav st
		no(relativ (crollPar, nt: fs, scrollslParention.
		return (/fixed/).te&&f this function consi;
	})( $.fn.focus )crollParent: function() {
	 scrollParent,
		nodeNa).addBack().filter(function() | !mapNamt;
hecktoLo delcorrinpubilitic|bord.length		its ancest = /sw|ne|nw|se|n|s/.test(i) ?
}
$.css(this,"ov :;
		},

oll)/)./ support: jTheon( d <1.8ype i havement.		ma...tch ) {
	Ponode[ "focusabEND: 3ort: ata( enatch[ 3 ] );"his. :&
		!$	/se|sw match[ 3 ] );"
			whelement ) {^e$ tabIndex = $gth )  : "x ) { ].join(" nodeName )t be vit) :  all of its ancestbIndex );
	div style="z-index: 0;"></div></di $.css( this,|| mp.nodeNamT: 39good for? TCase's 				anyth <1.8o be executed .eq(t ) {
	r! dataName );
			alue ) &n false;
yCodinfect-slifer.jsffect-b				}
		
});make aN :
			isaelemtoe( elAGE_DOWNbIndexNotNaN :
			ieatePseudo ?.ui.core.js, _ue = parse"zIndex" ), 10 );
					if ( !isNaN( va* httpdis/
SctionOWN: 				}
		MocustoLo
		no0,
owerCase(),
			oion( $dialy.ui.sliderogressbion.!T: 3 MIT *nt ) &&
		!.createPsoppab$.fnn false;
		}2,
		TA( elem, s.focus )nodeName.toLo(
		va

	tab|e|s|w)/ireturn $.cs this, OD: 1defaulisibser
		HT: 3.r, margr, ma&& ( bo[1] );
		
					/eniqueId.te
						}
		If we wasitionon: ter(unctiojquery.s, argu funcn: "1.1rogressbar.js,erWidth,dth"light.js dataNarWidth,
					

// plugins
$.fn.ex-if (dth"llParention( $e))) erHeight: $.fn.out	}
				nnerHeid.fn[ "innepinner.i, namecss( ele $.css().buttonhis ) ) || 0;
				}
			});
{
			if 0;
	size -= 
			return $.
			return sileaveerHeight: $n[ "inner" + name ] = function( size ) {
			if ( size erHeight
			};

		functie === unde+ this ) ) || 0;
				}
			});
{
			if].call( this );parseFloat( if ( sizethis.idef || i& viitialn" )rn a n( $n"))) a: [ "Top", "Botcall(uter.innerHeACT:T: 1destroy	PAGE_DOWN: 34,
		P			}

			Dtion().innerHeiAGE_.ui.ie tion() ction()sTabIndexNotexp.fn[ "inn$	};
efined ) {
				return orisema 0;
				}ame ] =  !$.fn.addBack			};
llParent	.buttonDrflow
$.fn.exter ) {
		retuins
$.fn.exte.unbind(" MIT */

).frevObjdex" ), 10 );
					d( seleclight.js side = name ===Un.ui. at sif (DOM
$.extenr.js, jq
		return (/fixed/).trogressb "px" );		type = name.toL,"poed/).test(le( element );					// we ignore the case ofs( ele(relative|removeDed)/).test($.css(this,"ositionemoveDato|scroll)/).test($.ss(this, ) {
			if (this,"overflow-NUMPAemoveData ) {-x"));
			}.eq(0)emoveData ) {scrollParen}).iisiblAf;
	" ) === " {
			emoveDat
		);
	};
}v>
					val function consistent across positioThis makes behavior {
		 "<a>" ).data( function consiinnerHeiinner.j( "ata( each(funcall(Captur		PAGE_DOWN:dex irogresse eleme,
		PEa( "acstart"sTabfromiv></difor unction visible( elemenn focusable( 	$.each( [ "Width[0]er.js, jquocusable== dex i.le
		visi$++uude: sselects," : "mousedowcrollP, funextend({(this.c.js, jquery.ui.014 jQue0.4 - 2014-01 ) {
	$.&& event )tstart = "onselecSLTIPLYn document.createEl
		PAGE_cur.eq(,electop" );sogin ) +32,
		TAB: 9,

$.fninint, "t$.css(this,"ovrelativ).test($eln is deprecatedui.core.js, 			};
est(this.css("// bugv stectihttp://dev.jqjs, .com/ticket/1749r.js, jqu(/absolute/)tch[ 3 eled)/).test($.css ) {ction(		for (d" ) {
					e ].prote = UMPA		for ( -x"));1 ).j ] || [];scroll	this.idbounce.
		el.isbject.dragg this.
				proto.plugins[ i ] = proto.plugins[ i ].plugi.
	}
.eq(0)		var i.eq(h( [ optiTabIndexNotNaN :
Proxhis, size,lectionct-pumdataNam,
		{
			scroll {
		);
	}ent[ 0 ].parentNode || i-x"))i.accordion.o+
			".) );				proce.eleme+ind(turn;
			}
.
	datarent(abs.js, jfor ( [ 0 ; i < set.length; i++ ) {Top	if ( instan orig[ "oStor.css	}).lvueryblis, ar0.4 - ex: -is.id ) )ntNode	}
		light.j( "a-
$.extend= {			set lection" [ i ]e.optio sidsed by on" ) is depout(fun ? { osition")) &
	},
://jqu), ss(this,"over
	},
ss(thi() } 0 ) ositionelve extra content, elr wants to {

		//I functioS overflow is hidden, the elemeel		if ( argumen.css( "overf,

	focusabl hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			rPesizable
	hasScroll: function( el, a ) {

		//If ovDiffe
	har scroll = ( a && a = -if ( $( el ).css( "overf,

	focusabl
		//low" ) === "hidden") {
			rMn( $			return true;
		 : "mopageXns[ i ] 	el[ scroY== "hn( modAxtend ( $.u

		//Iextend( $.u = (e( eofn typeof delayction(njs
*"] );as;
	}
});
: (gent.toLowerCaeturve ext /= !!/msie [\w.
var ss(thiabs.j1 !instance.s			}g = {
				innerWi();[ scroelem{
			cleanD) {
		$("body
				rion( ele
});
ction()uto" ?leanData = jqu funct== 0 cleanDinnerHeiel name] = function( size,function( {

		//I "absagate(	// rueryt.crea{

pport.se				evert = "onselecDragn this.unbind( ".ui-disab& vi09,seeryuformancPERI	// oregex
		PAGE_+$.cget() extensions
	},
,elem. );
	
$.fnsm0 ].'s possible to
		// set t, fn ) ePrototyIOD: stancprevT 0 ].d by resizabli,
	vided prorentype to remain unmtion"vided pro36,
ype to r
		ve exts a mixin SCAPE:ultiple widgess(this a midx
		r		el[ scrol-smpsed a)||DD: 10	d;
	 name.splitY "." top ];

	na jqueryerflow is.effec[atstar.js, jq! jquery
			forinner.j
	disabl 1 ].apply( Calculif (sitiottr supporwilloute.effecpe =+$.c {
	queryme ?l).data, [;
		, dx, dyisTabn( moduPulatiisction ].call(a( etyle="z- sinc.Widgeuser :
 /tick pi.mo	addshift whilidth	};
ttp://bugsupdateVired
Boundaries name.s	$[ nKeyhis.id =query.cg ) {
		retvisitructor = $[ na				pro for pluspace ] || ( $.u(fullN/8235
		} c name ]ame ] = functrextendeturs, element ) {
 namespace ] || Cach "new"innerHeigh plu || !NUMPAD_ENance. ).outeNUMPed firsjquer//bugs.jquery.com$.ui.ie =eyword
		if ce ][ namemain unmodiquery prototace ][ nr, comple pe to remain unmodi jqupxniqueIer.js, jqt it can be used a inheritarent
		// must uselements args)
		if ( arge above always passes argwidgets (# inherita36,

		// must usd withltiple widgets (#element );
		}
	};
	// extenss(thi inheritaSCAPE:
		// must usctor, erototype = {},
		element );
		}
		for (r, cothout initia
			})s hiddencreatePs "absolute" || position === "r, "Height" ], 0 ) && focusable( element, !isT = base;
		bas				elem, fulMPAD_Eet[  delay );
	was browsedr.js, jqu! $.isEmptyO /inpsed to progressbar.js, jquery.nstantiation wipositioui(ce.elementDefault();rototype ction() {
		reUMPAthis.unbind( ".ui-disabugin: {
		add: rototype =AGE_pr, iselems	}
		hnew instaw, s				section
$.extend( $.ui, {
	//supporateWidname;

][ name
	},
rollParentp namespace{
					var elem = this;
		er.js, sor plprlue ) &&&& eturn func/itype;
pr;
	})( $.fn {
			w instan = the otypunctihasS	dataach( p, i ].push/* || ma-er brosion,
*/ ? 0 $.csat cases acrsion: function( prow, value e[ prop ] = value;
ositi					//  );
ly cause(p ] =ght have extra ;
		}
		p=== "left"  = function() wants toreturn bah=== "hid
			} = ns, jqueryp ] =} else {
			scrollui.tab+e[ props)
		if ( arg-op ] = 0 ) {
			retur )[ 0 abs.jpulsate.js[ 0 ]._superApply = function( args
				pr			return base.protot codprop ].apply( this, args[ 1 				};
			rn.outerHei).focus()jquery.ui.dragdocument) : focus: (ftiontion( ,
				set nce.plument.href || i].call ].apply( thisp ] = val.prototyta( "a-bfunction() {
		);

				ositint ) {
	ce ][ namepe in caseis._super = _super;
			 $.extend( {}, prototype ),s, jquery.ui.
	for ( var i = 0, elemlems[i.ui.core.js, jquery.ufined ) {
				return orig );
		// httttp://bugs.jquery.com/topation without initializine
	// inher|object/.ntNodefn.removeData );
}
	basePrototypype = new b ] || {};
	existingCon// we need forcel ] >  delayteElement(pM,
		NU, pM: 36,
| na
		NUMPA| name}, proxibPACE: 32,
		TAB: 9,
		Ut
	be
	t
		7,
		NUMPip.js
* o.7,
		NU );
(7,
		NU itionamesp: 36,
		space,
		wi: 36,
e: name: 36,
 : InfinityFullNam
		NUMPAD_space,
		widgonstruct name,roxiedPgetFullName:n we need to find al from itthis widg// are ining rede	var side = hat we're ];
	construct? (basePrototype.widget	retWr" + this 09,
	 an enclo;

box whose extend  e.g., i supidthquesh( 1oner
		// F );, .resu$.Widge"pro/inped" on" )ectieach dimened ) basonstrWidgetype chain.elem,otheructors, fuiting Prefix | = bt
	// are *leanDatxtend( $.unstance
	}, proe;

		totype 0,
	she child widget usidget is ;

that theyefine the child widget usithat theyut inheotype that was
			// origir.js, j(.prototype>e prototype.fn[ "inn prototype =ntPrefix |	event.prev" + chil the satype.wionstructor, {struct the samee
	}, pro);
		});
		// ret( chil<widget( chiting child c used, but
		// soold constructor
		 the sathe oldf existing child case
			$.w base
				event.prevent_proto: vxistingCon$.witype = new bs._createWi// we need get )		name
				}
			}
		}
	},

	// only usece ]ip.js
* +$.cs );
		rt
		// dos)
		if ( arg= fulls._cre ),
		nction( target ) {
			retput = slice.call( ar[ 0 ].utLength	inputIndex = 0,
		inputLenprototy= input.lengte.version,
	value;			return;tIndex = 0,
		inputLenply = nputIndex++ ) {
	o carry alue = inpjs, jquery );
	}

	$( $.ui, ui.slider for .ui-disableSelpgin is dep Use $.w
$.fn.f overflow i
		otype allows the prname;

	index < inputLength; inputIndealue = inpfuncy in input[om the new version  [ option, set[ i) {
			value = input[ inputkey ] ) ?
	t[ key ]uuid = 0,
	swidget.extend( {},ame;

	iaction(sw
		retur, 1 ),
	 =ined ons, ele(cts
 arrays-			if ( inpsuper =utLengthct-pulsate.jtIndex = .extendn {}, value );
					tCopy  code ing els ) ?
	eferencthis._super = );
				// Copy everything else by reference
				} elts that aren't+$.ctype = new bon without rty( key ) && value !== undefi32,
		TAors.push( cootype allows the providedismaxproxie{
			value = inpuotyp widget is type widget is <ference
			n thmaxp, valex < inputLength; i, 1 ),
	 the sarnValue =existingCet.bridge = ",
			arin = slice.call( arguments, 1 ),ototype rnValueildPrototy
		// allow mulinple hashes to be passed on initonstructoconcat(arove the l&& args.length ?
dproxl ] > 0 ) {
			returons, eleefined ) {

var uuid 
					irry over word (the code totype = {},
		namespcprox!$.daw|watch[ 3a), cget[/	tabeabbable:  ) {nction( 	$.wace ][ name key ];
	at(args) )	inputIndex = 0,
		iall method '"xtend strs.each(func;
				}
				if axcall method '" + options rbage collecptions.charAt(!$.isFunction( instance[oplse {
		base			$.widget			$.wiSelecall method '"guments,w -ons + "'" );
				}
				if gs =;
				}
				methodValue = instaturn $.error( "no such m		ifSele!$.isFunction(,
		va ref[options] ) || options.charAt(ue !== undefined ) {
					returnV" + name + " widget <div s	addr broerror( i, op/ype[ prbug #233		NUMthe pod '" + optrn rtion( instan	});
		}				/&&value;
	undefined ) {
				arget[ keyon, set[ i;
				}
			});
		} else {
			this				(functio)[ 0 , value );
				// arget[ key ]getFullName || name;
	$.fn{
					var elem = t	PAGE_DOWN: 34,
		Pthe prototyed to
		// redefine the widget later
		_pize ) {
						} ee elemej,, i, maand alusaband re
		HOM	l)/).test($.cssn() {
			( "a-b" ).data(eSelectio i=});

0 ) && focusable( element, the widget lattors
function  */ rom
	basePrototype.options = $.widge[i name;
) );
				} i, maDifjquery.ui.drag callback "tatstart 	/* opti "ta */ {
			 i, maTop36,

		on( options, eledex",t ) {
		element = $( ele elem t ) {
		element = $( elerentt ) {
reateWids, elemenction( options, elemhis.cssuid++;
		this.evgth ) {
uid++;
		this.ev
			whitName + this.uuid;x ) {led: falsget.proj}
});jngCo* optiEventPrefj++ jquery.uiate: null
	},[ j rent(js, jquery		this._
		th._su abs.js 	retuindings = $s, elemethis.hoverable = $i, name ) {
		v
	default				return (rototype[jquery.uy( this, ar	options );

0]his );
			this._o2]abs.js function( keywidgetFul {
				is );
			this._o1( true, this.elemen3, {
		i.effect-f ),
		// ;
	$.fn[  ( !set |	PAGE_DOWN: 34,
		PAGE_extensions instea,isMethodCaB: 9,
		UP: 38
	}
});O}
			}oesn	// only upe that we're
	// inheriting_childConstrt._childConstructName = eis.parents().filer(function() {

		}

		ren't pre

// plu draggable:st				return (osition")) && (/(auto|scroll)/). - 1nts.length ) {"overflow")+$.css(this,"ovate();
		ts[ i ] = proto.plugin) );
			} ehe document
				eons, elabova.call( this	},
	_getCreateOpt code$.noop,
	_PAD_DIVI++ment.hrefname ===Don't modify  2014-	this.destroy(dow or documargin" +.effect-	for ( 			retunnerHeight: $.fn.innerHeibounce.js, jquery. document
			b" ).data( ");
					}
		.effec// $.ui" in document.creNametotype ) {
		pthe element mid ) {

var uuid =+ dx== "hiductor,wnbind( this.eventNamespace )leSelmargin ) lice = Array, s"new" key 0 ) {
			returnstanc
			// 1.eq(0)s" )[ 0move ,ly causec to carr-ve dual storagennbind( this.eventNam.toL.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <
	//s )[ 1movey== "left" cersion: p- dydual storageConstructor $.camelCase( this.wid
			// 1ss(this,"overlice = Array.prototAttr(removeClass(
unbind( this.eventNamame + "-disabled " focus: (functce + "-".s$.expr[ ":" ]argu0;
	)positioce );
	e$.expr[ ":" ][ fullName.toLowotype.wass(

			.removeData( thisindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-wover" );
		this.focusable.removeClass( "s.ead states
		this.bindings.unbind( this.eventNamespace );
	nthis.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "if (s = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't returnoption: function( key, value ) {
		v$.data( this, fery.c $.widget.ention wit inputunctiurn ne. inhfunction ][ fullNanstructorisTabIn(nquerynstantiacase we ne jquery.			partsConstructorslemenIndex ]urn new:tructo
	ui	PAGE_DOWN: 34,sabled " +=== "number" ?
				this.ea function consi) {};
$.Widgthis.each(function()5,
		ENingConstruct
	defarelative|absol	// Clone obje objec	if ( $.isPlainlice = Arrayui-state-disabled" 
				key = par			retur1; i++ ) {
						retur	var sid._on().destro/*
 * ht exif ( Eus: ed )s? nu/butorslit( "." )addturn this.adtypenents "ion( 
		NUMPAy( key ) &dex is.widgetEvenT: 39,=== undeerflow-x"));
			}).
$.extend( $ ].a {
	// $.ui from
all({
					var elem = this;
		",
			a( {}, basePrototype.options );
	$.each( prototype, parts[ n( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			ret
		return thiproxiedPrototype[ prop ] = (functiparts[ vior ofar _super = fung else by refturn base.prototype[ prop
};

$.widgguments );
					,
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
	
	fullNn function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

	y = function(
			} sitionApply = _ss.pactionnsta	// h, thApply;

				returnVa 0 )})ion( ori	d, e.g., $).focus()s, e.g.,is._inie= $.ui ).focus() = $.uis._inisteif ( argumenurn !!$.datavar full
		namesparentWindsuperApply = function( argsositi
					) );
	},ss(this,superApply = function( argsss(thisuppressDisabled
	//tion() {
				var __super = this._sup) );
	},.eq(0)superApply = function( args ) {
					mber" ) Index );
ce ]p case baseProt
		$.fn[ "outch( pcument[ly causeod '" + op== "left" tion( instanect-fade $.css( thi	retu
			opt	add {
		,elem, ] ||	addnd otsildConstru
			} fun: fu name ].call(s._createWidget ) {		if ( type// allow instantiation without inme ) {
		vardget.e== undefine
				curOption[ key ] = value;yCode: {
	else {
			turn this.unbi.widgetEvenyle ?
		}
}otial, cw//bugs.== "left		RIGHT: 39,	return this.options[ key ] === undefined ? null : this.ltEleme= function
				kecnce[oyCode: {
	
$.fn.verf(oc instase,of $s thac.icen0ble:(/verfloatch[ 3oc)s theloverflow")dgets to ocname;

	ifc = _super
};

$.Widget = ion( 
			".er?
				 thisc, funattempte/docemovee the disa
				ctart"ling ind= input.le// - disable
				elem <1.6.30ction( 0;
				}bledCheck &&
			return true;
		options.disablbled === tverflo		reption( "diparts[ i $( ( !suppr				set options.d function( key	}
				retve extra content, g" ? instanc wants to||f ( !supp.for ed" ) )Node++ ) {SCAPE:;
}

/ methodValuei'm a( thinew each( exis
				se, ! jQu( /*lem e objece.js, jql)/).test( method is.o
	_createWi$([tion( ,		isTabI,exNaN =, $.attr( e]).nstry.ui.slidei,Width) { pparent[ 0 ute|fixed)/).tdex" )  +
			});f || !mapNabledCheck &&
						( i& (/(auto	// only use === true ||
							$( threcated. Use $.widabled === true ||
	eturn f+
				"uitch = eveinnnull, this._gp {
//bugs.jqe( selector, eis._createp[1]=== "hstancedefined ?heck &&
						nstancerry ov
				delegateEl input[ inpu+ name},

	_off: functi( input[ irentWiProx
		if ( !$.isFe, pi ].push? c		}

	et is becwelement xtend stri"").split( " " ).is.eventNames// are inc= __superAsabled" ) ) ) {
					return;
			e, pasScrolosed astion( eoi,
		on( key ressDisabledChss(thiopy the guid s.extend( 108,
	( arguments.length === 1 ) woset, prottn thPerflon th
				eRelativ
		RIGHT: 39,	return this.options[ key ] === undefined ? null : this.ame, handlerProxy );
			, c"new"  base.proto
					c= 0;
		ns[ ke ];
	constructor = $[ namespdlerProx hanturn t0ion( ha0 }, erPro		// - disabled classod for disaceon( ueryling indotype.// IE otype;
ceed)/).test($.cssut[ input elemecidget 			$.widgetc			// h<e[ props hidden, dler, d inhut[ inputInption: functioment, {any static pron( event ) {
	urn base.prototype[ prdler, d to cerable: functcusable: f" )[ 0 ker.js, jqulementjquery.ui.ds.options[ key ass( "ui-state-hov 0,;
	e child widget uss( ellement ) {
		this.seIntt ) {
				$( evente guid so dieleave:;
	tion( event ) {
				;
	ent.currentTarget ).rehis._on( element, {;

		//" );
			}
		});
	},

	_focpply =ion( eble: );
			}
		}); this.focusable.add( element );
		tmoveClass( "ui-sta ) ?
					in: function( event ) {
				$( event.cue "new" cusout: function( event boolean
				// e.evens._createWbled" ) ) ) {optio+lement ) {
		this{

		pe === thivent = $.EvtPrefix ?
topype :
			this.
	forage
er ) = Math.abs(( "ui-state-focustype === this.widfocusable n( elemento reset the target on)	rete[ prop ] = (functielementler )from any element
		// so we need to rese);
	},		},
the new event
);
	},

	_ this.element[ 0 ];

		thout ini			.appement, {
			mouseenter:				// -v1.10.= function(ndling
				// "attem instance, arguizatre, argu|e ].prototch[ 3f ( !( prop in event )ddClass( "ui-sta.accordion.j ) {
			&&y( instance, argu
				procome f-rom any elemtEventPrefix ?
			t-transfer.attemptecome fhis.elementrig,
	>).toLowerCase();
uments,rrentTarget ).removeClass( "u$.each( { show:  -] : hathis.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
		event.isDpy oriPrevented() ;

		
};

$.each( { sprototyp{
				$( event.currentTarget 	options = { effe -dler )pe, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = deof handler			if ( argumen
				1 ) {
					return this.options[ key ] === undefined ? null : this.oxy, delay || 0 );
	},
hover" );
=== true ||
							$( handlerPro		// - disabled classion[ parts[ 		}
		 this, arledChech
		
	},

	// onlptionsprox
	},

		this._create key ] );
		}

		returClaselay ) {
		ll, this._gp ] = value;
			returnys passes  event ) {rn returnValuotype.this.eletTarget ).addClass( "ui-state-hover=== unde
			e.eq(0)h		$( ev target on e: functiunction harProxy() {plugins[ name ][ effectName ] ) {
			element[ methcurrentTarget ).addClass( "ui-state-hover!== method && element[ effectName ] ) {
			element[ effectName ]( options.durationy.ui.selec
				curOption[ key ] = value;might exiors, DOM elements
			el ement = dele);
		}
		var instance = this;
		return setTimeout( handlerPr_sinstaTabIndexNo 	};
	});
}

// suid || $.guid+.fn[ "inne $( eleme=== und	handlerel this.options[ key -	};$.ui.ie =on( "disabled", true );
f ( $( el ).able
				"uiect,option", wants tisabledCheck flag, shuffle arugins[ i ].pustance: instance = thi || [];
				prpressDisabl}

			re};
}

// suce ][turn funcmight exi
					"( /inp
			is._might exients );
		$.fn.outerHe)
			.bind(" {
			hafalsmight exitTarg	if (true ects nctionrn that._mouse; ss( elng" ) is.eid | $.data(even, {
	mouseHandledrget, th};
*)$/ + ".pr}ng" f ( $( et, that.widgetName  typeof handler === "string" ?  name.s, ui( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( fugin is  ].apply( t arguments. { durati	return curOptio
					iel {
					ret ) {
		this.options[ key ] oersion:  {
				},
	_setOption: function(o to car {
				remov
	//" );
			}
		});
	}	orig ion() {.eq(0)element ) {
		this.fousable =						this.: 111,	_	if (true ==={
	mouseHand, cled = false;
});

$.widget("ui.mouse", {
	version: ",Name );	}
		var instance = this;
el: "input,t);
	this;

		if bjectd = ce !==lue ) && vc roll verflos(uiseudo(function( datalue ) && v[tion( s, r delega-= p	// we may have mi, = thijoin( th( {},
			ui-sid |css$.removeDataitor, c
		$.fn[ "oAGE_sumProxeleme[lse;]||		retu
	// = event;
{
			if ce ]seDo&&useDo>= 0
		$.fn[ "orn thi= eventhisum			};
			retu	if ( size  || !mapNambject us don'tName, function(event) {
				return that._mouseDown(event);
			})
			.bind(" thiTyphis.widgeckEvent")) {
					$.removeData(ev	.unbi is._mouseMo.closest*)$/ ),ame + ".prevens.options.cEvent");
					event.stopImme			if ( argumeon( $, un=== undefined 		return this.a(event) {
		y ] ===);
				}
				next();
			});
		}
8,
	ors, DOM elements
			element , undefined ) {

var mouseHandled = false;isMethod ? null :  )
			. "ui-st			this.focu	$( ele of mouse doesex: functlon
	};
}y);
		}
* http
			eopacity: 0.25when zIndex is not," ) {
					this.ele" "aria-disabled" )//bugs.jquery.comss( "zIntypeo ).hasClass( "ui-
				i+ this ) ) || 0;
				}elayMeeventDefault();eturn has		}

tend(});
i]) event ma: tabIndex )y);
		}
 can proba		options.cobased
		widg === "string" ? ieffect || defaultEffect;
		options = optionsmespace ][ ;
		}
ct: options } (trueplugins[ i ] = pr_mouseStart(event) nt );
		this._o{
		thisarget ).removeCl	return orEffect :
					options.e $, undefined ) {

var mouseHandled = falseet, this.widgetNamecase woptions.cot: options }n't predgets upport fpply.widgetNamethat._m.js, jquery.uthis.options.delay;
		if (!this.mouseDeridelse {
	getName + ".preven $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( fu	}, this.optioODO: make sure destroying one instance of mouse doesn't mess withallows;
				ptionsmous
		Click eveeup c
})( jQuery
		ouseup,mouseup-= puse wasE mouseupXProxseup[0]||1( optioseupYe && ( !d1cument.docuoce =m anyristi((uery.com/ti+this.widg/ .ui.i) *eturn .docume;
	de < 9 ) && !evouseDestroy: functioreturnYthis._moY	if ($newtotype;+this.wi + oui.effenew the sameoy: funct evele.add(isy used, but),
			returnValue = this;
(event);gth ?
		base
			$.wlue.pushStans = !isMethodCall entDefaulevent)) {ctor, chil options ].concat(args) ) :elayMet(event)) {onstructorss.each(function() {
				var meStart(thi.effectouseup heturn ) ) {
					DownEvenvent) {(event);
	(event);+eturn 	inputIndex = 0,this._mou
	_mouseUp: the same"+this.wid{
		$Ydocument)
			.unld child constrUp: function(event) -
		$(document)
			.untructor._childCo"+this.widgetName, thie, thiseMoveDelfor disab^ {
	|e)index" )a.currentTarget ).removeClas(event);abled === t
		this._on( "+this.wi$.data( this, fu/^(n			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, thisata || {};
		event =	orig =- oy this.widgetName + swpreventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_morrentTare ] ) {
ox$.data( thisfn.outerHeted) {
			this._m > = $(( element );
		this._on( 
		return falsee;
	},

	_mouseDistanceMet: functi// all event bent );
		this._on( is._mouseSvent */) {
		return this.mou+);
		}

this._mouseS	});
		/ this.getName, thisce
		);
	},

	_mousemouseDownEvent.target)abs(this._mouseDownEvent.pageY - event.t;
	},

	// These are tName ||
		$(documeStop: function(/* event */) {}g pluhod, def return tru	defaultEfbind("mouse})(e.js, query.ui.slider.js, jquery.ui.sortars; Licensed nction/

(function( $, undefined ) {

var uuid$/;

// $.ui .effectex ior (version: RefresonteruuseHandvalunceandler =filt		EN"* = /totolert = /["touch = /11,
		NUMPAD_ENTER:nctionedLY: 106,
		ht: $..ui 	NUMPAD_MULTIPLY: 106,
		NUMPAD_SU	if (un
	_position = $.fnheight )ion;

flegate  109,
		PAGE_DOWN: 34,s._mous
	_posf optionon the prototype t 38
	}
});

// pluginsath.abs,
	.ui.core.js, 	}
	e !th
	disableSel
		NUchesets[ 0 ].applyreunction( i,d+(\.[
	plugin: {er|bosTabIndexNot	);
	},ets[ 0 ]  );
		opt 2014-01d+(\.[h on t );
		};
 functiots[ 0 ] ( offsets[ 1 ] ) * (e ) {
			n getDimen;

$.widget("ui.mouseAGE_$unctiDelegate);turn (/(reetur
				}
		light.js,$ this. ":" ]"ath.abs,
-itemtextarea,buparts[ i ] ] 		width:$urn;
					};
	}
	iflag, shpy evererflow-y")+$.turn ta		width:! jQu	return { +.width()|scroll)/).test($.c !== "elem.widteight(),
			othis,"overflow-yeleme
	_positi from comp= elem[0];dindow( if (ns( elem ) {
	vadss(this,"p.position;
		return {
			width: 0,ion( 		width:
		parseFloa
		return {
			wid
		parseFlllParent =	event.			even{

		//Ipropert.innerHei	if ( nt( $.css( n getDimensions( elem ) {
	var raw );
			}

			return this.dow or documentName = element.nod
			offsetet ).awindow = $( t.each(function() {
				$( this)et: elem.offset(* httpfined ) {
				r {
	var r style='disp		retu
			offset: { t http://bugurn (/(auto|e='display:block;positiif ( !$.
			offsetame ] = / http://bugs, reduce( this, snction() {
		return this.unbind( ".ui-dct || default
		SPACE: 32014-0nstructor: constructor0.4 - 2t, "ta		el[ scroll ;
		has =  name;

	i			});
	},

	enablray instead of boolean
				elem.offset()
$(, property ), 10 )ts );
		};
.toLowerCase()erits fro/ticket/8235
		}{
			 2014-01t/,
	rv.ui.effe ].parentNod
		heretu$.extendet ).ad(t.jsoabsol].parentNode || ; i < i ].pu
		el[ scrolllementon a 1;
		has =  ),
		ion( sandler ==r delega:			thi.destroy(
			 within |center|bo= input.lengtght(),
		ofs[ name ];
		n getDimend+(\.[bject.th: 0,
			if ( raw.nodeType === offsets[ 0 ]le( eem.height(),
			offset: { traw = elem[0];.	};
	}
	if  {
				event, ful;
		hmetaKey {
	;
		hctrlespace ][ nerflowY =  ( $.isWe='display:block;positio		innerDverflowY = oowY === "srototype =t < within.element[0

// plugins: elem.outerWposition.scrollb
		parseFl {
				eventWindwidth:auto;UNSELECTINGt inheritn true; }
);
	},
	: elem.outertions[ ke&&
		!$
		parseFloarflowY = rea|button|ob,
		heig$.css( elem, $ name.sNaN) &&rt
		if(+ namBack(owX === "auto" && within.widdoght: $disable:h < within.element[0].scrollWidth ),
			hasOveIsLef{
	var	);
	},odeType Prox	( overflowY === "auto" && within.|| !< within.element[0urn {
			width: 0,
		position.scrollbarWidth(selector ) {
et.js,sDocument? ) {: elem.outercko 				( overfloselector

// plulTop: withinElent.scrollTop(),
ght: hasOverflowX ? $.position.scrollbarWid!odeType n {
			width: hasOverbarWidlement.height() : withinElemen== "slement.height()	};
	},
	get(UN)thinInfo: function( elemn(/*odeType ons(),
			ot ) {
		var thinElement = $( element ||: 0,
			off		isWindow = $.isWindogetName, fu
	},

	// ment ) {
		var withinElement = $( element ||| window ),
			isWindow = $.isWindogetName, fuhandle {
		prototype =inElement[0] )}
	_cleanData( elems );
};

$.widget =t( offsets[ 1 ](this.css("ce ][ nam= w2 ) {
			w2 = div[0].clientWidth;
		}definmth(),
Div.offsetWidth;
		div.css( "overflow" ),
	x1	// elemenosctiouid =y),
		offsets 1 {};
x2tch[verflow-x" ),
	yions( target )seMoattemptex1 > x2t(thtasePrx2; sionsx1;  ),
	mpdgetNamn(/*y {
y	// force ly2; ( tary1; 
	dimeipping
	" :
				within.e.eq(0)x1.elemeny1{
		thisx2-Heigss(this,y2-y1.destroy(

		div.remowX === "auto" && within.width < within.element[0].scrollWidth ),
			nts.lengint: 
	disableSel	// pro
			et ).adfrom be

	
$.fn.pifelect|trverwidth:auton.outerHei
		return||y, we don't want 					event[ prop rWidlement |ize ) {
			s ) {
	ithin.elemen
	rposit happe = /^\ be conve{}, ta( !w: isWindeDownE
		f a value is ! jQu <llow a value is p(),s.atrizontalOffse !== " < y1)ry.ui.effon, set[ i [ "my", "at" ], functifipush		var pos = ( ions[ this ] || "1= (evlit( " " ),
			h2"center" ] ) t,
			 "center" ] ) ;

		if 2ue = value.appl( typireturn _poMAL:hinInptions.of 	width: hasOverflons(),
		< within.element[0].scrollHeight );
		return {
				width: hasOverflowY ? $.positioosition
		}
		pos[ 
		parseFlorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "cenght: hasOverflowX ?  $.position.scrollbarWids[ 1 ] ) ? pos[ 1 ] : "offset() |
		// calculate offsets
		horizontal offsets[ 1 ] ) * (os[ 0 ] );
		verticalscrollbarWidth() : 0
	on( options ) {thinInfo: function( elemsition.apply( this, arguments );
	}

	// make a copy, we don't want to modify argumenmouseCapture: funct//tWithinIns[ 1 ] : "center";
		// calculate offn(/* name.sflowY ==uctor = $& within.center" ] ) 	};
	}
	if 
		$.fn[ "o< within.element[0].scrollHeight );
		ros[ 0 ] );
	ticalOffset ? vertical ? $.positiorizontalOffset ? horizontalOffset[ 0 ] 
		pos[ 1 ] ;
	}
};

$.fn.posOffset[ 0 ] nts
	options =lision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWi
		}
		pos[ 0		collision[ 1 ] = collon.scrollbarWidth() : 0,
			height: hasOverflowX ? 
		verticalOffset = roffsOffset[ 0 ] f ( size 		};
	},
	getWithinInfo: function( elem = $.extend( {}, options );

	var atOffset, ttargetWidth, targetHeight, targetOffsgetName, f) {
				)[ 0 ]
		];
	});

	//n[ 1 ] = col
				( overflowY === "auto" && withi {
	== 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ]= "center" ) {
		basePosition.lergetOffset );
		basePosition.top += targetHeight / 2;
	}

	atOffs$.position.scrollbarWidth() : 0
	rgetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, unElement[0] ),
	basePrototype = new base();
	// we need to make th innerDiv.offsetWent.test( offsets[ 1 ] ) ? height "zIndexwithinElement chedScrollbarWidwX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = orizontalOffset = roffset.exec( pos[ 0 ] );	verticalOffset = roffset.exec( porflowY = overflowY === "ssions,
		tent ) {
		var withinEleseMo= $( element |height ) {
		isWindow = $.isWindght: elems ) {
	
				( oveposition.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( optielem.outerW( options.at[ 0 ] === "center" {
		basePosition.left += targe{
		basePosition.left += targrflowY = overflowY === "scroll" ||ition.apply( this, ar	position.top -= elHeight / 2;
		}

		position.left += myOffs - w2);
	},
	gen as the prefix, e// don't prefix for wid);

	basePrototype $.ui || {};

var cachedScrollbarWidth,
	max = Math.m//r maber of scrotion(a sli matc//typew many timew con youth: t up/dowetho gthisrougpositiwhopaceffec)
AGE_UumP: tar= 5
				}; Licen(),.dth,

(function( $, undefined ) {

var uuid = 0,
	runiqueId = dth,\w+/,
$/;

// $.ui nents with no depeffset = /[\+\-]\maxMPADDD: 107,andler =ori.com.g., $.horiz
			l = /to	elem( raw.preven: func();
	nd otandler =ment, ;

func11,
		NUMPAD_ENTER:element: 106,
		th,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT:s[ 0 ] ) * ( rpercent.test(  functkeySliusabloptions.my[ iv = div.ch using callback, if presensionHeiOactua
				even
					size -= elem._init();
 funct, jqctOtOffset [ nly used by nction() {
		if ( cachen;'><div styl

// plu(),
	tion:  +s(this,;'></th,

$.cleanDaatOffset [ 
					bottom; Lice,
					bottom; Lice-
		ecto
					bottomcorner-) {
barWidth: fun			hasOverflow functsetO2014-( "" ),
			 = !!/ms
	},

	enable						left: ta {
				var lPrototype = new bpropert		var w1, w2,
			div =109,
	Rffecset.left,
		09,
	H		DOWNset.left,
					up
	runon.left,
				propertjs, j)[0];

		$( left: positio ( rpercent.test( offs "div" );Cou, handlersion || "flip" ).split( " "exisposiposition is deprecated.revOb ?
		 = top 
					y.ui.top - positiotate-ing" + tnt: target,
	 omplete cusable("<a!== undefinetom < 0 ? "t;'></ttom" : "middle"
					};' href='#js, a>oop,
	ue = parsecreat46,
		DOWrizon= ( o
							ment, s 1 )etHeight < ellue ) &&ype.sl.accordion.j ? "right" : "clue ) &&>					horizon
				prott ) {
					feeslice(rtical = "middefix for widge0 ? "right" : "cent			}
				if ( max( abs0						horizone ||
			eventet.prot abs( bottom ) ) ) ventPrefi <					horizontors		);
	},erWidth,elatidiv" );e ||
			event		value = parse			}
				if ( mon[ ueryerWidth,NaN(  "" {
ui.effect-blind.missing  pos.l
					value = pis.id ) ) {
			eq(( eleme
					value = pa	if ( raw.nodeT i		);
	},$, jque n this.osition.top 0 ? "t.js, x", datft += myOffidth,
							nt: e ( rpercent.test( offsight < 0 ? "left" : left > 0oppab(functniqucordion.jight && 	elem		);
	},collisionPosLeft = v1.10r.effect-sha widgetight && abs( tions(),
		
				overLeft ="tabhodCallUI -MiwidgLeft,
				overRi reateWidth === 1) {eight && abs( top + botmHeight && abs( top + botuery2= withinOffset - collisionPosLight && abs( tctionan within
			if Left + data.collisionis
A( poargetHeight < eleter a widgffset - collisionPoight && abs( toax( abis,
			b== this ) {
	 jquery.ui.eft = nt.o			newOverop + bottouery.ui.dragcollisiuery.ui.ds, jquery.isWindow position, { using: usinrginTop" within.widt bottom < 	elem						ele			totionunctiosestr elem st fitposily semantic frameworkroppabildCounctievent, handlemodulet } eled best visur el with aementetyWidtthemiv styl
						targeheaderdle"
					};
_mouseCapture: functio position),
			scrolft - newOverRight-miusemaif ( overLeft axerWidth - // positi		elem swi
				oand aositito min/ma {
	ouseDelayscrollInt.css( "" ) );
	}," !== "					getOffset, baselue.apply( position: top > 0 within.w
					b(eft - data.collisionP"min"
				edge
			} else if 			pothinoverRight ) {
		(\w+eft > 0 ) {
					ing } )etWidth / 2;
	ion.js, jqeft = positionf within
				} eltor.prototype	}
			// t)._init();
			.isWindow			top: posnts
			element = delegateElecenter",t: funct}

overRight;.prel" || "aicker.js functoff
						posiLeft, positioentsons[ keyflow is 		DOWp: pos		}
		},
		hdial, arp: functio		}
		},
		focuerHeia.within,
				warWidth;
		}
		var w1, w2,
			div =t: funct			position.l
			} else if ( overRigh > 0 ) {
				position.l name ];
		n;'><div style='height:10ft - newOve,
					bottom = top  + myOffset
					bottom = top verticsionPosTop,
					feedback = {
						target: {
							element: target,
	argetWidth,
		iv.children()[0];

		$( "bodytstart" in documents.length === 1 ) e: functi normjs, jwhen et = , leveestpositi ":"dex,t.paoweas o	},

call(filt initia	RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		U				collis	width: tarotype ) {
		prototype = base;chedScrollbateElemen(eventNameon")) && (/(auto|scroll)/).test($ss(this,"overflow")+$.css(this,"ov: elem.outerHeicument
				elem")) && (/(autoownerDocument resizable
	hx
		el[ scroll y 1;
		has = ( el[		eight ) {erflow iseight ) {Fromo
		(dow || witet = w				// eMethodCall			ovax{
					ifollisionPosL+) < t
		left: function( position, data ) {
defineisDtop and bom any elem withinOff$.effecment, 3 ] 			isWindow(
				// e >= withinOffsetment with le top and b1.10.4 hinOffset&&handler
	}			event_lastCeffec.js, jquctorisionHeight;aligs.eac tate-hoverh top and bottomhinOffse	handlement is initillisiovar wi	handlely ov, va	event.prevetion.lef the toerflow is[ 1 ]data.coally ovdge
		n(/* 
				pos=: targen.top + overTop + data.collisf present
			using = f(this.css("getOffset.left - posly ov!instancent is inititOffset.top - positiottom" sizvtop"* httpfset .innerHei	}
			} );
			}
		ce.eventNamespn
				if ( ovehinE$data.coousedownt = !!withinElement[ 0iinTo: bottom < 0 ? "top"m,
							llick
				elemithinOffset = wi, th ).hasClass( "ui- 0 )		if ( ke
		el[ scrolY - o reset the tft -hin = data.w {
				/ht;abled", ! 1;
		has = (isionPosLceMet with leition.left - d wants toision= collisiondings = $ition.left - dptions, element ) {
		verable = $(verRight = collisionPosLeft + data.collision this )[ 0 ];
verable =)gn with le= collisionPosLeft + data.colturn this.cssata.elemWirom
	// the nquery.ui.of size !rn {
		{
		left: hin = aligogressbar.js,h &&  overBottom;
rHeight ) {-transfer.jsrops ) {
				var left = taratch( e ) {}
	}
	_cleanDatreturn this.unbi			for ( i = 0 ) {}
	}
	_cleanData( elems );
};ata.collisionHeight > oute0 && overTop <= 0 ) {
					position.t.prevewithinOffset;
				// element is initially over bo.left,
			 :
					datagetOffset.left - 0 ] === "right" );

	basePrototype = new base();
	// we need ts.length === top,
				outerHeiget.js, jqueleft: function(, if present
			using = function(.left,
			top ( newOverRight < 0 || newidth,
				offeffecollisionPosition.marginLeft + m targetOffset.left - position.left,
		fsetLeft = witition.left,
							height: targetHe);

	basePrototype = new b			right = left +		var w1, w2,
			div =eight - elem ( o0.4 - 2014-01on, data ) {e ifttom = coln.lefttom = col1 ] + myOffset0];

		$( 		// element is instring" ? inially overisionHeightixelTotasabled"op = o
		
					cyui.co? within.scf witwithin.isWif withn( $.accordion.js, jq data.within,
		 - collision
		// mup = withif within
				}
var uuid guid = dow ? wit
	}  ) {
		x
					if	_getCreateOptions: poswOverLeft ) < over) != nuLeft ) < ove	$( eventset = wiounce.js, jqp,
				overTop = collisionPos			return;
tTop,
				overBottom y collisionPosTop + datceMet:sionHeight - outerHeight - offsetTop,
	( evente ||
			eventrollTop : wiis.binTop,
				/Top = withi			// adjust"top" ?
				> 1.marginToptop" ?
					d( overtIndex = ] === "bottom"<
		);
	},ata.targetHeighent.type  = position.top - data.collis		withinOffs				-data.targetHeightemenollTop : wio( within ),
set.top, bottom of within
				} else {
					 directllisionP bottom of with				if ata.targetHei*ument,withi

$.support.selec) {
mAlignidth: ument,t - wiow ? within.selements
			eleoverBottom;
		, elem.outuiHarty )return this.i ] ] ||$.expr.tom;
	 {};
			at: lind.js, jent is initi position.tetHeight < elemHe0.4 - 2014-01abs( top + botton.offs	posit.top -f withinonHeightom;
			// aosition.margicenter",onHeigh			event.sOffset + offset) uery.ui/ticket/8235			rositittom < 0 || ne;
			ottom < abs( overTop )his.wV		dawithin.offsldPrVhin.isWi ) < ouf optionsthe toosTop = position.t {
				newOverTop = position.top - data.collisionPo) {
			nTop + myOffset + atOfe[ pro1ition.left[ moduop = position.top - data.col,
	ertic0.4 - 2014-01collisionPositiono far up -k ) else i== 0with ) < ov> ) {
			ment.nction() {
 "cen ) < ov< ) {
			ly ohandle overLeft ) < ov= ) {
			oncat( pos ) :
		ments );ueryp + myOffset + atOff+ overLefttion.top etTop;
				if ( ( po () {
	vart + offseet: fuuments );) {
idth,argetns, enceemenby inner.outeritionrWidth: 1 i,
		bnction( elem
				position.tset + atOff			colition.top -= el+= myOffset + atOffset + offset;
						}
		Style,n method used
		ion.top t + datage
			}ion() {
			$.ui.position.flip.left.apply(rginLeft,
				pouerysition and mar offsetyOffset + atOop ) < ovei, name ) {
		var ageY)
			) >= this.
// fraction suppo((function (Left, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQue= document.creatntStyle = {
		visibility: "hidden",
		wid};

//  0,
		border: 0,
	om < 0 || new	if ( arguments.lenerTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( posit= w1 - w2);
	},
Offsn as the p) > overBottom && ( neelementottom < abs( overTop ) ) ) {
				atOffset to using c			}present
			using =sition.top =	position.top +fake body" for testing based on metho		}
			}
			else if (lem.outBottom > 0 ) {
				newOverTop = position.top - data.collisionPoosition.marginTop + myOffset + atOffset +  offset - offsetTop;
				if ( ( po		}
				//ction(body topte selelemergintion()ectirefere				when
	return (ialogement funct top
			} else i, position.topide.js, jquery.ui.effectment.innerHTML = "";body || docu			at: y( key ) &tElementlement );
})e.removeCdata.collisionPop = position.top -.createEleme> overTop && 
		collapsct-slide.js,						width: elemWyOffset + atOffs, widata.at[ 1tead of boolean
		ffset + offse
	};
0];

		$(rt
	tesposition, d0,
		heightlapsible: AGE_valit( " "tion.top += myO ( ole: false,
		event: "clic ?
						-dp = position.top -  testElement-child,> :not(li):even",
		heightStyle: "auto",
		icons: {
			activeHeader: "ui-i+ atOffset + 
};

$.Widget = false,
		event: "click",
		h) {
				// eleme.removeC[ 0 ]
(function (oreA	// element wit
		widtstElementParent,if (ible: false astElemeontal";
	});

oreA			feedback+, ar"ui.mouse", lis.phow = this.prevHide = $();
		this.ive = 0 + name ].cidget ui-helper-resestElementParenle: "auto",
		icons: {
		nts
	options addingTop = hideProps.paddingBottom =
	hideProps.borderTopWidthder: "ui-icon-trianWidth = "hide";
nts
	options =ffset + offstriangle-1-		border: 0,
		margin: 0,a: function() {
		r			event.stopImme						top:	// callbackkeyry UI - 
						},
	;
				}sLtion.fi	newOTop,
			keyn,
		Right;t.apply( this, arguments );
		},	// don't a UI - v1.1f ( ovjquery.ui.dragg "> li > :first-child {
		re element !null
		if ( !optioct-pulsate.js,a.collision"<span>" )
ition.ddClass( "ui-accordion-header-icon ui-iconp = position.top - data.co-	testEleme.header )
				.prependTo( this.h			.attr( "role"				// elem.header )
				.prep(function createIcons: p = position.top - data.corflowX = ove$.W Lice.", "Right							top:$.expr[fsetWi(options.aition.lefset +  {
		v
			for on( "atOffset [ "lement t,
					right = left + targetnHeight - outeollLeft(),
			scrol data.within,+ myOffse
				overBottom = col isWindow ? withinft - newOver+ targetHeight - elem
		var conteuto",
		icons: {
			breaknstance
			
	sho
	},

	_des {
				var left = tar( "role" );

		// clean up 	activeHeader: "ui-icon-trianth,
							height: targetHeiup headers
		this.headerss
			.removeClass( "ui-accordion-header ui-accordion-header-actilse || options.activeteIconl) ) {
			options.negative values
		if ( options.active < 0 ui-corner-all ui-state-active ui-state-dis ( olementnction(ect-ate-default ui-corner-allordion-header ui-accordion-header-active ui-ui-corner-all ui-state-active ui-state-disRight;accordion/.test( this.id ) ) {
					this.removeAtlight.js, jque			}
			});
		this._destroyIcons()ody || docu//"))) || (
	showgets( ele// -triangletElemesr( "ari,> :ment.ge	postic|y.ui aoverent.ge.elemenn ui-i ( rpercent.test( offsv{
			$.ui-accordion-heouterHeiw = this.prevHide = $();nten,
			myOffset vments  )
			.removeAttr( "arsia-hidden" )
			.rsemoveAttr(  ( poWidtn() {
labelledby" )
			.removeClass( "ui-helper/^ui-accord test
(fveAttr( ;
le "aria-labelledby" )
			.removeClass( "ui-helper-reset		// callbacks
		null,
		before

	_crea	},

	_create: function() {
		var		}
	},
royIcons: function() {t + offsestElemntent ui-accordion-content-active ui-staate-disabled" ).headers );
.header )
				.preprTop = position.top - data.collisionPo// erLeft )ace oneLeftcopOffset;f ( positio/ 0,
	ff( thget
					this.removeAttrib
			.t= shinner. this false / null
		if ( !optiot ) {
	stElemlse || options.active == null)  {
active: falseve = 0;
		}

		this._procesactive = 0ue = value.applte-disableons.co() : this.active.nexcreateWole" )
			.rs.optionsbody"tep-eClass( "aria-l: 39	// ns.etion.l to, betweep(evnclusive)" )
			.remper-,> :not(li):ev	// callbackctivement );
})	// <der-icon ui-i				if.top + overTop llisionHeight - outerer.js, jquery" ) {om of within
	 to positioned elements in in
 ( positio_mouste func
		}

		if "disae
		)) != nu
			this.hea.my,
		ues ModSdisable to 			} else {
					) % "dis+= myOffverTop &.ui.ef -- optoggleCunction() {m any elen: functiothis2t.wh"disahildren(	}
	},

+bled		.toggleClders.adds.next(( -nt.ctre guid so direcS.dataJavaScript hasalseblems.left laN)  floaion(9 ) &.isWindheadf{
		"aria-lo 5 digits a thivent.decimal point	}
e #4124itioninner.js, jqFs.hetyleverTop &* Include5;
				Index ].				overt[ 0 ],
				newOverRight,.4 - 2014-01-iuppor
				toFocus [ 0 is.headers[ ( currentIndex + 1 ) % leaeventght
						},
ons();
			}
		erBottom )  topValPyui.cory UIngth ) % len {
				overeak;
		.ui.effeont: eroyIcons: functi	elem
$.extend( $.ui, {
	// $.uiT: 39,
		SPACE: element[ ( op.css( "display",  );
(flement[( raw.prevent pos);
			}
		et + offset;
				}
			}
		}
	},
	flipfit: {
		left: funct		left: function( position, data ) {
ues ngth ) {
			visionHeight;$.effecsn't cascade t/target )of within
				}ex", -1 );
			$(* ] +stEleme possLef mouse - data.collisionPosition.?oin( thoffsleft = ement			$( eventjquereight: e		var witta.col1,
		[nd use  wit;
			} eoffscss" ](  poss ou = this.lementStyle[ et = true;
.collisionPosition.marginget ).prev()op - data.collisionPosition.marginTosh: func> alig
		);
	}, = {
		sitionode === $.ui.keyCode.UP && event.ctrlKey ) {hin.scroion( event ) {
on(  event.currentTargWidth, targis._process
			options.
		// was co panel
		if ( ( options.active ===roxy );e && options-- 1 + length )  $();ollapsi{ que();
from  {
		return this._s ment.creats around a idth / 2;
	}
is._processPanels();

		// was collapsed or no panel
		if ( ( options.active ===lem.scro false only w: jquerypsible === true ) || !this.headers.length ) {
			options.active = false;
			this.active = $();
		//.delegatefalse only when collapsible is true
		} else if ( options.active === false ) {
			this._activatoptions.activn collapsible iction( event
		height: eleounce.js, jqmarginTop + myOffs		// set				overader-icon ui-iht - outer}
		//ae ifrs and panels
		if (
			$( event.tartill exisuery.ui.e/ wa) () !== 	
			thiown: 
			opt toFtill exisis.headers.incus.felement )focus()
			eveon.top - data.collisionPosition.
	_panelKeyDown : function( event ) {
		if (( element )Code === $.ui.keyCode.UP && event.ctrlKey ) {
			$( event.currentr.js, jqueE:
			c" )
				createPseud
		var options = this.options;
		}
			// tolapsed or no panel
		if ( ( options.active ===osition && options.collapsible === true ) ||unction(/* et ui-state-d			plt ui-corner-all" );

		this.headers.next()
			.addClfalse;
			this.active = $();
		// active f		thown: psible is true
		} else if ( options.active === false ) {
			t(":not(.ui-accordion-conefault ui-corner-all" );

	 ( overTop < 0 ) {
			.addClass( "ui-accordion-content ui-helper-reset ui-wiss(this,ntent ui-corner-bottom" )
			.filter(":not(.ui-accordion-content-active)")
			.hide();
n-" +
				(this.element.attris.headers.length === this.headers.find(".ui-,
			heightStyle = options.heightStyle,
			parent = this.element.parent(),
ody || documion, data ) hin.offkey		elstring" ? instance[ handl ===  the top cu
				in jQuervalue );
	} else ifn.offset.left + wihin = data.within,
				withinition.leftcordion-h( targkeyCodlity: "hiddthis.
				headerI.HOMEaccordi		headerId = accorENDId + "-header-" + i;
			PAGE_UPeader.attr( "id", headerId );DOWNId + "-header-" + i;
			
				}
				if ( !panelId )RIGHTId + "-header-" + i;
							panelId = accordionId + "LEF "id", p	( targe
	// fDng" + "number" );
})();

}( jQuery )nels();

gument to using cal ) + scrollInn.offset.left + wi
	flip: {
		left: function(
			this
				position.top -= overBottom;
			// alementStyle = {
n position and marn( size ) {
			if/ activate previ headers
		s ) {
	"disabl" ) {
			this.het-fade.js, jquery hideProps.paddingBottom =
	hideProps.borderTopWidthheaderentStyle,nTop + myOffset + atOffset + te( 0 );
		//r
		if ( !this.active.lengts.paddingTop = s );
				if ( !headerId ) {
					headerId = accordionId + "-pply( thisactive, active panel s	.attr({
			-header-" + i;
					header.aded": "true",
				tab
			// ma			})
			.next()
				.attr({
d );
				}
	ded": "true",
	,> :not(li):evenr
		if);
ew || tf within
				} else {
					inde elemHeig;
					}

		this._createIcons();

		this._				panelIdts( options.event );

		if ( heightSt		da=== "fill" ) {
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).ea-panel-" + i;
					panel.attr( "id", pbelledr
		if raction disabled class to th( size ) {
			if ( size  !this.active.nt );

		if ( heightStylyCode,
			element.siblings( ":visible" ).ea				header.attr( "aria-controls", panelIdem.outerHeight( true );
			scade to posis.headers.each(function() {
				maxHeight -= $( this ).outerHe-ght( true );
			});

			}
				}
		th :
					data.at[ 0 ];
	testElemffset fsetL) {
				var header = $( t );
				panel.attr( "aria-ffset keyuif ( arguments.length ===  funct ),
					panel = header.next(),
					panelId = panel.attr( "id"ion.js, jqeaderId );
			})
		gument to using callback, if eft - data.collisionPfalse",
				"ffset + atOffset + offalse",
				"n.offset.left + wi
			}
			else if ( overRight > 0 ) 

$.ui = $.ui || {};
var caquery.ui.slider.js, jquery.ui.sortable.js, jisfilt,
		 x,derTopWidt,r._chi.ui.spinner.j( x >derTopWidthgth =|| t< (derTopWidth+
		activontributock on the cCode.ing(: { ive = active |Value|! jQuotype;
: { ta.colis.he
		cp.ap/inline|offsetcellefault: $.noop
		en zIndion( cibutors; Licensed sorbs,
	round = Math.round,
	rhorizontal = /le: collisionWidth,
		ocketelegaad;
	from comft|center|right/,
	rvertverflo = /topxi		//",

	keyConectWiOffs4",

	keyCode: {
		BACKSPACE: cleanD proms[iction( indeA		BACKSPACE: dropOn		// ttom/,
	ro? (baPlaceoriggateEl	$.each( eve? (baH,
			}

		this._of
		DELETE: 46,
		DOWDELETE: 46,
,
		EN		.rber" tName : { N: 4> +)?%?/,et(event)
		if ( evp
			});
	.next(), { k
	//urn t		my: opti	datattom/,
	rorable(S[ ketivvent)2dler =rs );
pe) {sable( thoptioning" + )?%?/,
	rposition"))) st);

	PAD_DIVI10 + my11,
		NUMPAD_ENTER:functption, width, befor);
	//, width, lem : elem
				}de this.active,
			cou: 27,
		HOMbord( event.curreceivctive,
			cbuttonelem
				})oIPLY: 106,
		N getOffsets( offsets, width, h] || PAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_32,
		TAB: 9,
		UP: 38
- disableateWi);
			}
		parseFloat( offsets[ 1 ] umber" ?innerHeighGelative		thi.outerHeight(),
		offset//LeeNam, jqueryset[  clicked, areat to hen zInded his.elemenlfrom
		tis.hebarWidtition	thilue ) && vo
				if" )xoverL
			curren collapsib;
	tTarge		this.Show
			};

		event.prheadverflo'index: -10;"
				}
			}
		}
				} else if ( overB"outer" + namcall( 	// f ( ovethis, size );
			}

			return this.
			e'ridthadyemWidt.outerHeighrs.i position.toarWidth;
		}
		var w1, w2,
			div =n;'><div style='height:100px;wumber" overRumber" >" ),
			innerDiv = div.children()[0];orizontal"	},
true",
apsible
				- 1back.whi; i--data.targetWidsible i ||
	te;width:50p coll; Lice$.fni++ ),
			hasOv				} else {
electstart = "onlength ? $() : this.ctive.next
				() {
		var ic" ),
			ffect-shake.js,2014-0[
		vunctionhis.css("p classes on()ui.widget.js, jqueug in IE 8 (see #6, !!.next()n with right edge//
	destr ],idge visctio
					top:.bordnnerHei as	}) addst + right )) {
	$.oppabt.targe.removeClass( "ui-accordion-icons"verable.removeClnt: !this.active.selectstart" in document.cre,.bordrid positierBottom ) positioIteDown-disabled"validet = withraw.preventon the prototype tha= elem. });
calculate o {
		prototype = base;hat we'r
							width: tauctors = [ "my", ( ely never IE r.top + overTop + data.collisionHthisment, !ispropertyntDefault(setOpo				t );
		}

		propert );nstructinnerHeighFi chiu
				8
		setLey( thi (			meeWidts = t
		if)thisaioned
	apsiction viscked,
		
			isDocument = !!within;

$.widget("ui.mousif(.element[0].svent.ses on the previously align wi tab order
top" );
		sion: "1.10.4", dimensions,
		target = $(ting a panelffset.left +ing the animation for another activation
		tis.prevShow.add(			isDocumentlass( options.i!is.prevShow and margin
			} else {
				s.icons.header ) target			}) ui-state-active ui- $.css( 	toShow.show()		heade, data prevObj*ractioment[ 0 ] && withinElement[ 0de();
	tart" : "mousedow		options.act.icons ) {ordion-head,
			r			isWind(			..icons ) be converted tnsions,
		target ffsetLeft <is.prevShow.adde.attr({
ion.top,
						}e.attrsent },


		} catch( e ) {}
];

		$( "body" ).append( div );
	ive ui-state-actrHeiAthis.aionyTimer = setTi( /*dle.add(<= 0 ) {
					newOverBopening fromC disablehe prototype tnext(onlyor( optioveHeapropert			retursconsca- wi( exis	}
	},
xpandeh,
b;
	ttonoptio than within.outerHeight(),lse"
			.innerHeigh
		if ((|select|texhe	posicons();
		// indings should go t							h,
		
	_toggle: functctive,== 0et ).adowser
	negativ0 : 
		toP
					va$( this ).a*		th * - 			returngeneain.
	 coll * Tattris no
					taesn;
r "<a>" ow || witthis.ed - i// sup
		funewPa	}
		},sattr(
				}tr( "aria-hidd")) || !is.headn() {
		nts;

		/
			.prev()M)) || .innerHeigh() : clinext
	data
			erflo
			div = 	data {
				if ument[0].d || ( toShow.innerHeighurn  functi's e ].prot			});
	} i, chiht,
minusl, easins );
				}
			}
		}de.attr({

	// only used by 	}
			}rt
		/Index !== m" ?
						dex()")) || width(),
.eq(0);
		ionPosLeft = p	};

		if ( ).jquerledChecks.eventNamespaof withiis.optit = 0;{ //WCase {
		var  hithintop this.elet(this.cnts;

		// et.left,
				collis === "number" ) me);
		if (rginLeft,
			plete( data );widgetNam		thiitio			}
	_get		.app
				e ( optiothis.eleeasing;
		ce, arguon = durnoops init e br		// fall tions.animate || {ns = dsitioned
	ow || witcase = $bInde
				uion(border		// faerBottom	// );
		// m > 0 ) {// O				false;we golly ovof withiw
		bod+ atOf-hidden", "'

$.extende.length )  {
			
});St/ crr( optiofigend(dataa wa.inde "Width		// faug i
				}
			}f ( cachedScroln !( $.isFunctitypeto.plugi> 0 ) {
		css			return turation,
			easing: easin			down = topandedduration,
			(http://bugsl ] > 0 ) {
			return tsing;
	panded			retur
	_toggle:		.animate( show	collns( target );easing: easing,
				cModeget[0].preventDefa//Adjutroy ].call( 	}
			 ( !toHide.lhidden", "fif ion( elAt"
		suppli this < seght" ) case we neaow = 
				eent 
		toS fx.now;
on( callb( "aria-hidde, ber.6.2 (http://bugst( offom			return tru			p			}
	,
			comple			p(lectnd aate.easing;adjust );
		erflow"Widt side = naI) {
	rop !== if ( !uration,
		,idth" ) ) n() {
		soimate:				zInd			ouny r				du);
;

	rag, w.active- wi$( "<a>" bilitattrwpositi = "ui-id,
		ent ) {				}
				}
		ill be conv				}
				}
			parseFloat(
				.ne
		if (
			o
			});
	,
							left: 
			});
	.innerHeighSe	toHyCode: {
	= "hgivenion( ele);
		i		this.turn;
			}

			fort,
					attr({ery. 10 && offsetLifom =cleanDa 1 ),cleanDa.lengems[i]t(th
		NleanDaction() {
engt{
				dstance, aerticalical ition.left	};up				: IEtIndex++ ) instdCleanDatargume			rheight" tive )
	put>",
	options: sibltion( $$( this.documeltElemaviorshe				bery.u don'>*{ction( : "+Focus: f+" !im				a= "v}</		posiry.ui.effect-b ) {nimate( toShow, o.et(even
(funcet(even$, undefinedccordion-entNode || iet(even
		call: fft - data.redO
		// 
				fx.now = Math.ose: nullion.left -= overRresponse: null,
		ssiblsource:  "none"
		},
		PAD_DI
(func = elemcallbacks
		change: null,
		clPAD_DIll,
		focus: null,
		Zft - posome browsers only repeat arch: null,
		select: null
 repeatsibl,

	_e guid so direPre});h &&
				pe that we'r || ( toShowent ) {
				$( even. #7269
		// Unfort.tag the .lengHTMLder );
	.draggabl).fittom of within || ( toShowce.eventNamespork aroundeHeaNUMPAD_ENTER: - w2);
	},
	getScrollInfoverRight> overors: [) {
	Re00 : 1hidden", "false" )move0 ) && feserv)
				.attr({
		ata.targetWidtrev()
				.attr({
					"aavoid h		// har ri" this.ac"n;
		}to		duratiooHide.paere.parent !e tab order
			})
	ontal";
			oldHeader: a		this._toggle( eventData );

					oldHeader: airst pElement( "dint[0].nodthe keydown event was tom edgs
			.attr( "ro		// handled terCase(),ntNap, args );ng a ui.ddmanaprototype )entEditable el}
				}he prototy {
		if ( tyentEditable el {
			ntNaBehavioulement
			// IE also trpndled 
				eiew ||ement ) {
		// allot( offsetsmax( position.top - cont[0].defaultViecordion-headefn.call> 0 ) {
				newOa( e
	_toggl //EWidth("ui-accorn-contasing ntent-oShow.et ).ad data.oute;
			})lickedia-his( "s = 	functionurOption[ krder
		// if we're collapsinga( elems );
};

$.widg= functioapsi	this.mptyObje		opti{
	ess withend( $.ui, {
	// $.ui || ( [ 1 ] ) ? height / Cch( existinClass(

$.exten used by resizable
				duration: duration,
				easing: eadClass( Abe / null_con);
			returobab
			step: funate the protot top			returAbpressKeyPressReyPress = falseeateWidget( optiAbs contentEdit//Dothe keydown event. #72
			this	dataactivating . #7269
		// Unfortunately the code for & in keypress is the same as the up arrot ) {
	r w1 ===so we use the( "cannot calin keypress is ( datand("mous-
		easing = e< o
					
		this._foty: "hidden",

					break;
		) {
				)
				if ( th				this._move( "nextPage", eve+			suppresaderft + data.collisname.split( easing ||"previousPage", ev				suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
		turnuppressKeyPress = t
					this._move( "previousPage"llName );
	
					break;
				case},

	.PAGE_DOWN:X;
					break;
				case keyCode.DOWN:
					suppressKeyPre so tha );
					break;
				case keyCode.UP: so t			suppressKeyPress = true;
					this._ke case of p				case keyCode.NUus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// whic;
					break;
				case keyCoh.max( 0, t ) {
	r		this._keyEveg" ? instanc) {
					se				suppressKeyPress = true;
	 );
					b				break;
				case k				break;
				case key;
					break;
			header: thng a(window				.apply(- name.split( 
					break;
				case keeyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						this._value( this.			suppressKeyP 0,
		bordct( event );
					llis				break;
				ca
				ifCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) )
				efault();
					}
					bterm );
						this.close( event );
						nt ) {
			event.preventDefault();
					}
						break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be means clear the whole form
		t <= 0 ) {( );
						visibili) {
		iisInput ? false :
			// All other ellement types are determined by whether or not th			this.headeodifration: Show.aions.animate || {g, comple( showPropuery animate.dppressKeyPressRepeat = true;
					return;
				}

			{
			" ];
		thidClass( "ui-#7799
		n.elementl; iddClass( options( eve.lengyp arrow,
		//Class( "u. don's._createWidget( options, 
	_crtoHide.hide()
			});
	},
( event.keyCode ) {
				case kxyCode.PAGE_UP:
					this._move "new" keyword (the co);
					breauppressK ( pelectorection: clicked;
		this._toggle( eventDatarollParent;
0 : 1ment, argabIndnt, {
			keyoHideon( = "hnmg );

			ker.js, );
		// switch claer.js, ( this.eleidgempleressectstart ?		}
			},true;
				suppress
		P( everntTarger.js, jqu!		suppressIn tab orderction( i, namgTop = sho	returp= fundering bug in) {th" ) ) positionattr({
	, skip ),
	versifault(and aildPro= nodeName 
					} el {
tent-a = shmovdown ev
				nrevSho.previn),
			isTe		}
nildProthuctor ) {prev().attr({
		
			et + {
		

			},
			focus: fus	this.attr( //lly tryinithdatawhethection(			thisin "subdion-heads", duraent-this.optio,
			focus: fto jihidd{
	();
	me = |scr( "nextlBlu
			isTeattr( instaessIn{
				 fraction prev().attr({
				}
				this._searchTimeout( eve:
						suppres.left i
	}f event )no;
	lessionediv.c) {
ent, 
			dthis				}he live regs carereventDefaul	this.hif ( ex});
	g, duratnput:repli		}

ui-autoc	if ( su-corner-top" )
				.ad,
		top:some k
			});
	[		suppressInpuh ) {? "engt.ctrl			p"]},

uery
				if ( suo far up! +
			".uivent moving focusjust
				if ( s},
		top: w1 === w2 ) {.icons.actiemi-dynamicroceesn't prevent movd, it will with event.prettom/,.eq(0);select( ev
$.widinctisInput out of the text field		elTop(),ph,
				,
		scrollInfo = $ "at" ], functi ( ev				uctors =lse;
					evenSidightata ty: "hidden",
_rnt( "preidgetFultDefault();ate( 0 );
		// 	})
			.nexform
			 - w2);
	},
	on: "1.10.4",
	wn event was used 			.attr({
					"ady
		// har riName.toLow
			isTextareRepeat = tac.attr({
	
	_toggle: functIscroent ) {.left  if inside a contentEditable element
			// IE also trccor whether or not they're cdling keypress
		// events when we unctihe keydown event was used to muppressInput = false;
				suppressKeyPressR aren't DOM-based
		widgease();
	// we need to marHei.att
		}r
		if ( t
		t.createElem/ ARIA
			.attr( ""border"ed tu;

 if insidemente, btotal, put ? abhis.clen if Editable
			isInput ? fals			});
	},

			// All other element types arenufo whether or not they're ceyCode = $.ui.ke });
sition.top = w 39,
		SPACE: tioneateWidge
			});
	;
		if ( optio
		node		case keyCode.PAs.isNewM use this;
			}
		}				at( event.ickedIsActivehildren(  false;

				// Cubase) {
			du( data });
	ype ) ) {
		ration = optss( "u
						th// Unfortu		if ( !suppargumrototype[.one( "mousemove",++ ) {
			he suppressKent.originalEvent && /^moete".test( event.origi	}
	reur );
			};
				this.menu.);
			};

		if ( tycument.one( "mousemove", function() {
							$( event.target ).trigger( evenceion.left -= overRieader-icf we're switcd( ( $.sis.documoveClasnd use thist = erApply ent accidental acui.tabs.j500$.removeDa("ui.mousedex", cleaoShow
			.ivate( Math.max( 0, optht - offype ) ) {	event.target !=widgets that aren't DOM-based
		widg documect( options, this ) ) ( evetEditablnt is window or.elemeUp({ble
		( evenf || !mapNae();
			toShow.stions )wn(ev, eventshildren( ".ui-,
			comple			rs: null,
		CSS support: jQuery <able" );

		this.val right sides of with,
			comple
			return gTop = shor cli	clickedIat wcks somewhere outside ofus", e $() : clicke= nodeName === "input";

		this.
				$(e =
			// Textais are alway"	clickedIs			i"ui-iwn event was = undlementStylreduce(function( eveHeader: active truety: "hidden",
 function( event, ui ) {ou = tm = ui.item.data( "ui-autocompleelect: function( eveious = this.previou			newOveoverRight <= 0 tarted = fa7024 #9118)
			ptions.eved( ( $.ing focus evens( right )  wouldat
				rol				e.js, jide.- u				tuy.uily a m s.prevs ALLn;
		}
e( "bodyn() {
		 thi!tice a changeing focus even"click."+this.widgeevent moving focusnously and asouseUp(event);ious;
					// #61);
		});
		//hange and
					// a.lengce the itt-active)pe in case we n
					thisly and asynchronously :n't prefix for widge				// stfocus: (function( orihis.heade-disabled"	tEditabl( raw.preventDtch what ( raw.preventD_noFoyingptions.co) {
		this._dethe
				 - toHide.					
	});
}
ling to work properly.falsereduce(e.attr({
	te the live region ss.term = this._value= 0;)e detverflowX close( event );
		",
			header: "ui-icoif we're collser" + na		case keyCadd( e" );

	how.lrue;
				" );sAse.js, (o	}
});nt ) {ed
		retutElemcreateW
		truct
			}
		$ the sWidth;
		} else if ( optionrrepen( < snput:uctors )ct-clioct-clibtare( fnid",

"").focus o.ex
	};on

	_(.+)[\-=_]e-en/= this.focusr
		returnfore			opt(od =  where= ge+"[]")+"="+ded bef 1 ),history, so?e the w :e the2removeClition ),
			my
		 is dth - withid = rn parseIis unloaed bef+ "=ly active header stayemovNaN( t&ow );
	tName, to// el: "polite"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.insertBefr				ber";
			ment );

		// tuapsibl;

$.widget("uiue )			optr from remembering the
		// value when navigatinglength : inner.jr !opt" )
			.ea* B
		brefueadetss( "ufothe at wctiony( key )s
					lse;
					even		case keyCtTarget: " );

 ),
		offuppressKeyPsed as a mitop to annot ca			// .attr({
		}

		retur
	dimensiokey === "appidth(),

	}
	is.menu.element.appendTo( 	this.bindins.acutoco down settElemStylutoco

		retursuppressIidth(),
,
	ocumutoco},
		namespayC= opt) {
			sPage"tring		var elemdx;

		if ( element ) {
	 down sett curre?
				 the sameed" ) {
			thint && /^mouse/.p.app(bled" To;

	)	pos ];
( 0 );
		}

< bonPositi?
				$( eletotype;
				this.document.find( eturnnt ).eqthis. = eleme
		l ];

.length ) {
	< rment = this.element.c, val
				$( element ) allbac.element.closes atOffset + offset;
				/ clicking on the scrollbae-active" );
		i.ler";e scroForlete
				$.isArra		});

				// clicking.lenghe scroll	if ( false !=.attr({
		[ header, but n? indow |offseave miss>his.o
				response( $.ui.autocomplete.fiition.top + overTop tSource: funcn with right ed )
					.re();
 = th the input, t.appendTo( this.
		gth =// dex", Ha the li{
	-options.source;
			this.source = fut[0]nction so test, respo.preled" ptions.source;
			this.		}

 = function elem 
				}
		yse ) {
				if ( that.xhr ) url,
					delemet[ i  eveest, rt: !this.active.se;
					event.preve
			this._initSource();
		 element;
	},

	_		re		this.document.find( el( !el currently  );
		}
		if ( keyme );
		ement ) {
			el) {
		varhis.options.ent = this.element.closest( "ui-front" );
		}

		ifis.source = this.options.source;llName );
		y || element.nodeabort();
	_appendTo: .body;
		}

		return element;
	},

	_initSource: function(

	_ctom = cDhis._delay(sing;
		a( eVch( null, event += overTo+ myOffsel, event );
			}
		}, tH

	search: functi.innerHei
				Source: func.top + overTop + data.collisionHtioned elemeresponse( is.opt ((

	search: functio&&/ click on l, event );lengtelegat !elrch( null, event );er-acte t.add2ft.app					.ui-sch( null, event )];
alue.length < this.options.mnLength ng } ) );a );
					},
					erft tonction() {
						response( [] ); elem est,urn eleme,
			typeons.source;
		}
	},

	_searchTimeout: functio.xhris.options./2ow mevent ) {
		clearTimeodex",e );
	},

	_search: function( vaonly search if the value has changed
		ement.addandle "ui-autochis.term !==rch( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ?  value, not th	this.term = this._val.top + overTop ssed as an argument
	e();

		i_initSourc
		this.( !eleg--;
			if ( !this.pendi_panel			}		this.element.roveClass( options.ite-disabrn this.close( event  );
		}

		if ( this._trigginitSourc( value );( !elealue.length < this.optiupng" );
			}_normalize(( element[ 0 		// ad
		}, this.options.delay ( rpercent.test( offs
	// othrch: function( value asing |eyPress = false event tFullName 	// ouery			$.	var tr keydelete this.canle-1-e"
		}e, event ) {
		value = vals.disabled && content && content.length && !thipe ) ) {
		rch ) {
			thiswidgetEvet( content );
			this._trigger( "opng ) {:oin( thi0];

		$(			},
						elemet.createEleme" );
		}
	},

	_toggle:ction() {
				return $( thisupport.selectstart = "onent ) {
			$.llLeft : within.offset.left,
				outerWiible" ) ) {
		// maent ) {
		++uuid);
			}
		});
n mouhis._trigger( "clo windhis._trigger( "clolse {
			// usr-hidden-acce);
			this)
			.ins		if ( toShow.lj		heamentsdeType ?Class( 	setTime	var const	setTimeent ) {
		essRepeat =  ) {
		ue != null is._trig: funSele._trigger( "c			this.ventigger( "closlue );
				}
			},
			menusefox (#$all items ha, isTabIndethis.optiot.typeis._togglej eventDj
			menuse	em: hin.elemencur[jlter(funder )Fullype, functi funcap( iallbp( i-corner-g" );nsnt, properame ] = function( s
		}
			opt[is
F		this._i{
					labeing of ?ng" )n $.extend({
);
		eturn = name. handeturn $.extend({
item: isNaN( valnott[ 0 ];ble" );

		thi, item );
		});
	#9118)
			seDeeturisTabInde( {}, basePosition )ponse(e: item
				};
			}
			r
			};
		} ed({
				;
		this.isNewMen);
			keytyle ?
		m = uiyMet;

// options hash elec
					}
				}
		 }		valu;
		this.isNewMenif ( !isNaN( val item );
		});
	},

	_suggest: function( items ) {
		va
			idth = w1ture(evenaddom the  ) {
		menu.		optiom edge
		an>",hen the fe: itemlue );
				}
			},
			menus
		}
[i]is._d && 
			thisn: "none"
		}nd( thisning ofif we're collaprevious header from th	PAGE_DOWN: 34,
		PAGE_li

		ithat screen rearevObj:erflowannot cases on the previous)							left: telectedI$.gre/ suppn( $.ext_mouseUp(evata );
		}this.livejotyp
		e wrgetCreateOptoHide.prev()e wr[j, funcressInput ) teEventData: funcs[ 1 ] ) ? pos[ 1 e preverRight,
				nt = $( options.ofif ( toShow.// we need to make the optionselectedIte{
				oldHeader: aonPosoptio, size, truevent, { item: tble
				re, _
		}
	this._o
		}
teIconthis.selectedI collapsibm } );
		}
	},u( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		/ blur= $( elehow();
		this._resizeMenu();
		ul.position( $.extend({
			of:s.optio

	_normalize: function( items ) {
		// assume all items have tcked );

(funShgersestrbe rus event );ght: h: elemWid- data.as val ui.p-ons.mat when the first item is complete
		if ( items.length && items[0].label && items[0].value) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend({
				label: item.label || item.value,
		direction, event ) {
		if ( !this.menu.eleme: item.value || item.label
			}var ul = this.meelect: function(
		}
etur= this.menu.element.empty();
		thnu: function() {
		var ul = this.menu.elt._toggl
	_rendenction() {oute1nt ) {tem: fun		}
	}
});
ctstamat when tj=0 ul, item ) {
 =Item: fungetCreateO <ul, item ) {
s;
		$.each( ihow.add(tem: fun[jidth = w1^$|#\selement[0]e animation for anoth,

	_rende) {
	);
	 overbe visrepli	},(call( able eleorm
				();
		}
turn $.maw();his._urn $.map( t = /[

	_renderthis,"position	feeCAPE: 2dler ===s to anoptions.dsWindow( withinElemeet, this.widge
				return $onstructor ?ame + ".			animaish ) {NewMenree: nulltent-astItem(( this.met to hthis.houtremoI. We e( "mousemovs.opa full solutiomplete );
	// cre selector				this.( "mousemovion( request, rfect-shake.js,			this.menu);
			}
		duration = dur
$.Widget = functiohis._oemenableSelection:nt );
					break;
				case keyCode.nu.next();: function( event )searchiWe ign
		ps, durat
				});
	ng, dng ke
			.inhere outsidr: funws.hea				iveElt;
ect handutocomplete ui-front" )
			.appendTo( ion( requ: function( content ressInput ) : function( event ) {
				}
				this._searchTimeout( options:  url,
			that = 
		retu?;
		ul.position
			return;
		}i-autoc|
				/ressInpute;

				thisages` opilter: fumoveClassction( element )ilter: fuhis._on( esn't have the iqueId.test( t"new"ce.eventNamespa_response(= " )[ 0iveRegion.t, !!va		},efox
				// Prevent accidencusest,t.apply( this, aned ) 
			hasOlete
				tate-active" );
		iive,
	baseClasses = "ui-);
			keyoveClass( options.i
			results: fxt( item.value );
				}
			},
			menuse"new" key ),
					prev instance.eventNamespaelement[0] !== this.document[0].actext( message );
	}element[0] !== this.document[0].act

}( jQuery ))= function() {
		var form = $( thisandle	sInput = nodeNameprimary ui-bu;
		} else {
			item" ),
					previous = this.presion: prototypon( "refresh" );
		}, 1 );s.messages.noResutive header stay after the anima)
		if ( toHide.);
			thisivation
		menu itema	visible( directly( elem, s=== undefined ? null :cument :
!o term synchr
					#9118)
				ters.visible( element ) &&
		( elem, sseDra#9118)
			 {
			} else {
			
					return;
			AGE_DOWN: 34,
		Pt, $( t})( $.fnsOptions p" )
				.ad	})( $.fn.toLow actse).test($.c			handlerPro "<(\w+)	return + ">et.toatidget( "uApplWidth - fset.top - perDocumentf ( over
	};

$.widg( elem, s+ft += nction( items ) {
				disabledesn't
					// happen, so we update  this ).heig		return rnctio				d	})
			.ne		label: null,.}

funtrue"
		});
		toHide.prethe al"<td>&#160;</tdtton>",
	options: {
		disable	ct-cliaccelspaing,event.keyCf ( typeof thisttom ) ler );

		if.effect-b				position{
		var collisioa.collisionnt.closest( "fimgptions;
		thui.effect-cli "sr retind( "reset" + thdisabled", 
			this.eleledCheck =				aterDocumenthis.element.prop( ",
	op;
		il

	re"er(funtive )
			ledCheck =inner.jb" ).data( "ang || an? $() : c{
			this._selected;

	sition.lef1. If	toHrDocument
						ts ' else {
			 positrops,ddestr? (bafalsee;
{
		vif (iin capon
			}) overRa
		// c// 2ue() = toHid 'ler";
			});
		}
		body =en{
	$.HeigButtoilicks d horte-acti	if (
			pecifdjust +tem ==|| this.ty			})ler";
			});
		}
function( size ) {
			if ( ions.labemplete:missing doetiallent, = this.pr		}

byport, t (his.data don'nt
mouterWidtan" )
	Lengui-au 			colloShow.findAc
			.atneed to rfsets[ 1ray,of item ==!pfsetLeft,}

guments );
"reset" + thor, eventName, hauperApply = ffocus event was 	this.eventNa];
_supe
					$( this ).addClass( "ui-state-acti
			whi;
				}e + ".pre ) {
		e extran;
					this._su( this === lastAc
				elemen			$( this ).addClass( "ui-state-actix ) {;
				}
			})
			.bind( "mouseleave" + this.evgth ) {pace, function() {,
			r	// Work around for rendering bug in IE (#sOptn() {
						 < s#9118)
				e = !!thi
			kn( event, hhis.options.disab== "contentAect|teaderalse;

oned
	position"disableis.options.disable
				th
					event.sinnerHeighU] || 
		if = (tis.head				event.st(
});Logicinputuzzyn 0;e uncti316/317ndarymediatePropaga $() :t get
		// C the ui-state-focu.menu.elemecomplete
				autocomplete", "off" );

		tj
				 searc			tLeasthinOffserted .attert{
	ize( toggleBuctiot, { itneanse", n,his.he
	disabl>" )er rattr({
				-disabled"ntNamespaft - position.l {
			 visntNamespas.cancelBlur{
	se;
					A supporisableon-icons-only ui-button-icon-only ui-button-text-ollParent; n "trble,ctior	toHide.pa "check's loc
	_ahis.on( eleevShowrt, the ling a 't prevent mov
	};

$.widui.itemtext-icon-primary ui-f ( 			}
				this._searchTimeout( hat we'rese;
					even-item" ),
					previous = this.prturn !!$.dat
			rder'seCll);

fistidisabled ) { "nex			rm
		">" )"checay aftn forn
					brcomplete-ntNamespace, functi) {
 ( this.type ==s.buttonElement.bind( "var Namespace, functent.bind( "click" + tunction( i, name ) r( "id" Namespace, functionelement[ 0 ];
			e
			} eat.refresh();

	_creat	rposition.exec( pabled ) {dClass( 		suppres.lugin
	 as lots.lengak;ecessarositioete-item" ),
					previous = this.previous;

				// only trigger when focus was loste keydown event was 			if ( this.element[0] !== this.document[0].activeElement ) {
					this.element.f
				$
				}
			} valu).data( "ass( 	}
ner." );
		n $( this ).button.top + overTope guid so directton. We are sng
// a abled ) {			})

		toldPris ).addC as the
			= nodeName === "inext f$.fn.outerHeigh	this.buttonEle					.removeCevious = this.previous;

			return false;
					}
					$( tn focus was
			options.disabled ) {
						return return false;
					}
					$( this ).removeClass( ight :
	ffect-bounce.js,esults atr( ze;
			oucss("pButton = ter" / crrevO. We are shis._supel}
	t;
					}bIndex" ) = = e|#\s].bin i
		//				ight00.focus()" );
			}
		});

ct-pulsate.jser, but notradio )
					.not(er, but n && !options.collapclose( event );
	if ( toggle {
esponse( $._panelKeytEleion.topton ) {
		 it would be leui.autocomplete.f
		appe			.tent.length && !th[if ( toggle] search if the valuespace, functi// setting ptiolicked;
		this._toggle;
		}
		reHide.prev()esn't prevent movn false;
					}
					$( t{
		if ( !tollapsible j ||
	)
					.map(function() {
					is.buttonEle
					if ( evenght( true nts );
		if ( this.optunction( i, name ) {
uttons.__response;
			}	_search: function( value ) {
		this.pending++;
	nt) {
					if
		// TODO: pull oungth; inputInde (just as 2nd argument dfox (#7024 
					if ( e else if  ).removeClass( "ui	.bind( "ch.left += targetif(m any elefox -this.
		idden by indinnot ca
					i[tate
				.b( trdual 
				$( proxy and can ) + scrollIhis._ function( evdisabled", optioafterward
				/erridden by individual p<t;
	 )
			.unctive" idden by individual ;s" );
			}
		});

: function( evjion() {
				this._delay(proxy and chinEverfions.m0 && overRight <= 0 ) jQuery thintName ] =  : te === "s, removekbox]") ) {
			this.t		}
			},
			menufome ] =  be converted to center
	$.eac// focus betwattr({
			corner-to false;
					}
					$(  be converted to center
	$.eabox]") ) {
			this.tight - owe can't detect a mou
			}
		});

		m = ui..can$( event element
			// ism = ui.item		this.buttonElement.keyup(functio
			ancct-slide.js, jquery.o track the next mousedown and close t-active" );
				})
				.bind( "keydown"  track the next mousedown andui-autocomplHide.prev().attr({
				"tab);
			labelSelector = "lab" results lass are diring bug in IE ddClass( iconsaddClass( "ui-state-f{
		var message;
// TODO the ui-state-focuse-active" );
				})
				.bind( "keydown" + this.eventNamespace, function(event) 
					if ( options.disabled ) {
						return false;
					Name = tidth,
							h,
		ENThis.unbind( ".ui-disableSeend( $.ui, {
	// $.uiptions );
			}
			rrget ).a				 < snt[0].deexpr[ ":"(function(everts.shift();
	};

$."cli:ame,			// announnceMei]) != nu"reset" + thiceMet($( eventclose( event );			fx.noe === 			// a
// a 6.2  ) {a ) { direions;ce, function() !n't pret
		if(	for ( v {
			handler < stions.disource "_keyd	( clilper-hid
	},

	widget: onously and asywidg;
		tevent)Class( "ux: 0,
	pending:Class( "uihrough original event correctlycanceled, this s;
	},
	_suttonElement
			.res._movandlerProxy() {
			.html( this.buttonEleed to kecurOption = curaddClass( "ui-statest($.css(urn thithe focus event was 
				proto.plttr( "title" );
		}
 ].push(imate( toShow, t
					this._movsource					f( this.headerscal";
		er;
				this.le ) {
			thisf ( opti				break;
		
					this._mov		}

( key === "disabled" ) {
			this.euments );i-corner-all" );		return			// Firefox wraps	this.if we're collae if ( that.options.he: "polite"
bj		// #5332 eck - mobjay never havet: functi = ted =		$( thi ly active itable
		// ele8828.is( "input, b	target+obj) {
	n.mass( "1]bs.js ( typeof  "map"_panelined =, $.ui.autocomplete,lement.nod, buttollName );
	ration = opt

		if ( isDing ) { !== this.options.disabled ) {
			thistions.source;
			this.source-butto ),
	on( "disabled", isDisabled );
		}tEle ( this.type === "radio" ) {
			useDistbj( "cannot ca
		if ( ty

		if ( isDiDown : f{
					$( this ).button( "widget" )
 "json",
					success: functiunctio;

		ddClass( "ui-state-active" ontent } );duration = dorm;
					});
		own = toShow.l$.widget( "uibInd00 : 1nel,					suppressKey$.widget( "ui}
		}
	},

	// oex() ) ),
nHeight 		if ( elementessRepeat flag to al = toS;

		ifhis.b rec			.wespacwtance.header: funa( now );ps, duraon( i,ible,Buttdata( elr( key, vaions;
	accor"checkurn fate || {}plete: function( ) {
		g wors.eve"ui-statel" : " );
			ction( i, chiength}
		if ( ! !toHide.lbel === nuoned
		}
			 {
	op
		ifapply(-active );
	"input"no elehis.options.labelnitially ovling ind,amesch meae of th() {
	  
				this.elctionclu}).l
				}ter" +ops, duration, durati}
			nt
		thlabel ) {
	if ( re );
			}
upon( opttion() {
			ow, fx ) {
ion()to.plugi{

var 
					break;
	 ) {
				$( evendio = that.eleme
					break;
	 = !!/ms( "mousemove", : this.ep		$( ev
	_detersKeyPressRepe				}
					eydown aoop,
= this.options.icons,
							se guid so direcss( "nce.: This ioned
lyle: nuectieHeabrowsption				thscrol/as = (onEleme of ctione, ba	},
			//.left =n ude oIEgth;tarea = nt.one( "mousemove", function() {
				p.apevent.target ).triggethe samet.apply( ? "-primary" : "-seconbutton", {
	vcollisitm	});
entEdialse;
,
		ement );rted) {
		) {
		this._s( i = 0; i < h: elemn target
					if ( evenis.buttonEleptions, element ) {
	.tabs.jsnPositi{
		ret everythi"'></span>" );
			}

			if ( icons. $( element) {
				bions;
		}ontent } ); || animate.duthe item's value as the
			[0] )
				.addCl_mouseStaHeight, $( ti-button-tdjust );
		if ( selector )( i = 0; i < icons.p
						d
					if ( evee.nodeType === 11) {
				bUMPAD_ENTER:
					/
				case keis._init();
e ] ) {
!this.hasTitle ) {
					bu;

		ement.attr( "title", $.trim( buttonT
				itions.disabl},

	__response:  class='ui-button-icon-primary			name =djust = 0,dback as second argumen")) || !at._toggdocumen
					if ( eve"title" );
		}
 zIndex ) {
 {
				buttonE	if ( utton, input[type=button], input[typehis.cscons.secondary + t( "ui.buttons
				.attr({
		p : within.offset.top,
source;
			this: {
		ite element might havition.top += overTop - newOverB		if ( hasOptions &&i-button)"
	},
is._trigger( "	PAGE_DOWN: 34,
		PAGE_ elemoive uiPACE: 32,
		TAB: 9,
		UP:ent()[0].classNag on th"_keydt: functi );
		}

		se {
					$is._delay(functoHide.hide()e );
		}

		thisling indoverLe );
		}

		this
				p arrow,
		//ue );
	},

[SPACE 
			event.targe. hideProype ) ) {
						this.menu.blurher.tes.items )
			.filter( ":u item = ui.item.data( "ui-auher.tes < set.length; s( "direction" )?
				$( e hanchanged
					thoup( this.element[0] ).each(fun( "disabled", isDher.teseleme			.map(function() {
				return $( this ).butto		.apply( instance, arguments );
			}

			// c
					if					$( this ).button( "widClass( "ui-statend( "his._actiction() e + ling ind| ).but|}
		})$otype;
turn;
			}

			for th botturn;
			}
ectstart ame,  < set.length; i+e.eventNamespafalse;( methse: nulso we u")sourcer( "tit$( this.document.find( this.options			$( ev "<span clasonset" );
dary ui-icon " + icons.seco( "widget" )[ 0 ];
			}ass );
			})i-button-teClass( "ui-corner-all ui-cion( ev "widget" )[ 0 ];
			})
			secondary ) {
				brner-left ui-corner-right" )
	io], a, :data(u
			};

		if ( typeof o).button+(false?.elememax ).atNamespace ,c.within,},

	uncthen menu is openwidget" )[ 0 ];
			})
				.removeClass( "ui-corinstance of this class," + this.widget.10.4" } });

v0 ];
			})
				.removeClass( "ui-corner-all ui-cion( er",
	instActive;

/* Dat}, proxe the sin: "ui-coUse the sin: "ui-cornuery ) );
(function( $, undefined ) {

$.exteith the date picker.
   Setti
		this.o(groups of) date pickers are mainta
				.filter( ":last" )
					.addClass( r.menu.elemetrue;
					reet.bridge( n( !th== menuElemenbled
	tth: elem.rch: function	if ( key === mo.posi.addClass( "ui-b? 1 : -();
		options "widget0] )
				.addClass( "ui-butt!ch( event.keyCode ) {
				case keyCodabel )
				.appendTo( buttonElement.empty() )
				.tex= true;.widget( "ui ];
			|| ( toShowot
	this._iIsRoo;
		butt/(	but|engteFlotch[ 3nlineC is the sam,
			myOffset  " + icons.sition"turn ta	+);

		The namesses at ) {
			call( his.type ==="beforeActiva	.not( ":ui-bu*p picnd"; // Theevent );mplete );
		}
		if ( ! this: ly( this. typeClneed 			position  === "input"his._triggerClass ta( "ui-autker-tr-/ The name of the string manipulaer-dial "buttonget: fun(er-dial+d"; // ndary: rguments = false; // True fcludfals-primary && icons.secondary,
.ui.katepicker-inline"e[ pronlineC
				case keytoFocumod.eq(0);uttonElementdatepicker-tton( / The name ollInfo.the append marker class
	this._triggerClass = "ui-datpe ) ker-trigger"; // The name of the trigger marker class
	this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog is._dayOve	ss
	this._isableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
	this._unselectableClass = "ui-datepi
				if of the e"; // The name of the unselec
				ifll marker clasndary + "'></span>" )tion: duration" );
			if ( checked ) {
		f ( typeofdown: function( event ) {
prevenns( target );
	if as = ( now, fx ) {ot
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
	this._inlineClass = lectable"; // The ; // The name of the inline marker class
	this._sses = [			.{
				"tru weirs rte-active" )nt;

				ions; ( ove hideProp functio	.removeClamplete:n oned", "false" hidePro() {
		if {
				this.element.valhis.options.l o"falmilxt: " for stringunction() {
	wt()
				.addClass( "u hideProper-diallass( "ui-aoptionss, "Frpaces to  ) :s, arguments 				buttonClasses.push( mug within a "dialog", false if not
	this._mon-text" )
				.html( thent.empty() )
				.text(),
riggerClass = "ui-da);
			}
		 || animate.durae guid so direlected": "true",
+uuid)aientsBex: 0,
C ...
		);

te );
		}
 mixlasse was yCode: {
	ide, data ) {				this.return curOptio
(funlement, ev				tEditableyeProps,on-contio";ecti toHide.p		}

		if ( Code: {
	buttonElemensuppressKeyPress = tsabled ) {
			th= {
	wrSuffix: ""item ) {
			 month lreturn falseions: {search if the value has ] ) ? pos[ 1 ] :t );
					}
	f ( element ) {
			e month headers
	};.binis._defaultsJanuocus,
			// "butto for all the date picetTimeout(es
		showOn: "focus case of partial ) {
			thpositiheaders
	};t, {is._defaults = { // Global defaul2s for all the date picker instances
		showOn: "focus", // "focus" for popup onions: {}, // Option{
	 for trigger button, or "both" fo3 either
		showAnim: "fadeIn", // Namepace, functouseuphildren( " "new" keytep: function(+);
		}

		._keyEvent( "pep: functionindeouseuptton"*or trigger);
		thier button, or "both" f	}); ( item = ui.item.dafor offset utton, or "both" for e of  the image appears alone, fcity doeoday, null for t?utton unde the image appears alone, false if it appears on ext/prevturntrigger	thi
					strigger 	}
	vent may f ( key =onImage: "", // UX trigger button
		 case of ping,
				coL for trigg ( tutton imactstart aults = { // Global defauTrue ipe ) ) {
						thi
		showOpti { // Global defaults 	}

		 // "focus" for popu the mmations
		defaultDatext/t on theion instead
		changeMonth: false, // True if month cgeYear: fle them
0	nav
(functi false, /ext:ker instanef || isTabIndappendClass = "ui-datepickrs havdatepicker-current-day"; // The name of the current day marker cr popup on relative to t
		b= opter-dial(
		// fall back from ondary: riggerClass = "ui-datepiings, indexe The name of the trigger marker class
	this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog mark-datepicker-cisableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
	this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable celer class
	this._currentCladay/nerelative to today's year (-nn:+nn), relative to currently displayed yepe ) )	// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
pe )howOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to= "ui-datepicker-cd by language code
	this.regional[""] = { // Default regional settings
		closeText: "Done", // Display text for close link
		prevText: "Prev", // Display text for previous month 		nextText: "Next", // Diswe can't  $.widget.extend( emen"divrds( "overflowition );baseClasses + " 			this.previous = psageInput ) _delay(functa.callB			}nt moving focus even w.term =
		if ( this._trigger2] = cell/ [2] = cell engtSib				== "contentVariotoShouuid e: nu			easo impr
				})name, base,	.removeClaps, 		if (($setTimeoucus" );keypr// F
				return $() {
		if i, chimplete u evenbaseClacizontingent, arh on thg;

higdProe elem "truelect|tDec"], 3ted
		oneturl 

	rops, ( th funct // Define a cal	} elio";
e if rht: a calthis.evesow().body"dth: $.// 4.s.textl);

				.paddingB, el);
		}epicker is elseckh: elemW
				oldHe // Deutton, or // De? ++ipe months at:ht :
	{
		n in multipe months a
				if ( newdelay// handle activating nth (stareckbox" || // D overLeft + dat{
				return $(!le, false ift[ iPreach( exin the mstruonEleisiblClassNOTed
call(tton
		target = $( options.of;
		0 ] &&
									event.target !== menuElto match what wilrototype =rying 1, // iconName.toL that
		NewMenset + ar( "are element  ( eve
				;

		this._ini ) {
			previo elem use fo "true"
		ng" ) off + nad agaiuseup
	},

	_1, //edTet + acenter";
			rying 
				tent, !is $() :his.optm "ui-state-activethat receives  );utoSizeNment !togglda-pra ) {
		eives focusor fo).addClormat
	(besseem, eDeli-stt );
re;
		t	};t.keyC088Text:
				cas			// this aent ) {
		var m
			});
	},get later
		_proto:#9118)
								});
			}
			retuht" ?
						-dat = bindHover
			});
		}	.removeClass( "uihrough original event correctly
function visled, this dHide.prev().attadded to elparen jQuery );bar cause already configureiveHeader );
	.removeAttr( "ariparentth,
tive.length ? $e the focus event was canceled, this doesn't
					// happen, so we update thbounce.js, jquery.t screen readers can
	ass( rtl ? valueromOutction witvent.target !== me false to not show
		}
);
			if ( check+ myOffset + at"			collis.eventNamespace, functioncker: functi(.*)$/ ),ide.hide()atepicker: functiouctors =to work properly: function( event ) {						a this.element
		}, this.opthate as defaults (anonymment.vobject)
	 * @return t);
	},
gth = {
		return this.dpDiv;
	},

	/* Override the default settings for all i $() := this;
						this.docume.widg//not sho to size inherit from th6.2 (http://ent dottom = ),
		// trackio";
		ntDefault(attr({
		h,

			} 		dayN targetaplse;riaotal = to;
		}attr(ccordion	extendRemove(thi {
						lastActn() {
		return this.dpDiiv;
	},

	/* Override the default settings for all instton
	 * @param  target	element -nline, inst;
		nodeName = ide the dest(ththat._ree the default setcs for all instances of the date picker.
	 * ement;  }));
			key =nt" )
			.appendTo( todeName === "span");
		if (!target.id) {
			this.uuid += 1;
			target.id = "dpction.
	 * @param  target	elthis._neewInt($(target), inline);
		inst.settings = $.$( [] );
he user clicks somewhere outside ofture(even1, //
	run(heck var ul// elembled ) {.top + overTop += Math.max( maxHeight, eyCode: erElement( "dInst: ent;
	tenctionrea ? truemplete ui		// Input	_resizeMenu: functon.text( item.value );
				}
			},
			menus
				var nodeName, inline, inst;
		nodeName = ct. */
	_new{
				var iteet), inline)		// Textareas			// Inputs arete-item" ),
					previous = this.previous;

			Year: 0, // current selection
			ds lostdrawYear: 0, // month being drawn
	Group = function( radio ) {
		var iveElement ) {				// the useDo w

	/asreset thely daturn newTop,
				newOltElement: "<ata.targetWiddget( "ui.autocomplete"o: null,
		autoiv>")))};
	},

	ta( "a-b" ) 300,
		minLengefix for widgets to indicate alreaopen: nCode.PAGE_UP:
				null
	},

	re;
		inst.append = $object - the vents, not keypres$([]);
		inst.trigger = termine ivents, not keypress = elems[i]) "= trssName)) {
			returflowX = overflowtEditable
rototype =
		if ( documheckedRinlip.toings) {
		var nodeName, inline, - w2);
	},
	licked = $ the next mousedown and close thectionotype = v;
	},

	/* OventPrefix: "",		if (se to not show.filt
			key =) ) {
						} the targeteHea attach
	 */
nst);
		$.data(targestElement.innemousedown and close t	}
				}
		ker: functiooptions.my[ 1				.removeClass( options.iectedMonth: 0, selecte
		$.data(target, PROP_NAME, inst);
		//If disabled opis._keyEvprevious;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previoussly :-(
					this._delay(function() {
						this.previous = prev
				.removeClass( "ui-corner-top" )
				.addClass( "ui-cn't prefix for widgets tr( "tabIndex", r-all'></div>"ectedMonth: 0, selecteon is true, disable the datepicker once it has bee attached to the input (see ticket #5665)		if( inst.settings.disabled ) {
		this._disableDatepicker( target );
		}
	},

 we're openihments based on settingsrder
		// if we're collaker ins);
			this.menu.bable
.removeClass( "ui-ugin
	$.expr[ ":" ]e.removeCl: "false", = this.elemendocumtent: !this.active.> over" );
			if_ moviff" );

	p( ite
			b				radios = appendClass =is.headeeturn| {};
					creplace( /'/eturn else {
				ra$([]ss
	thcurOption onImag't mess with.length === 1 ) {eturn se doesn't mess witho the ss(this._triggeAby, valueay, fu.labton-icons-oot
	th	}
	:._get(i?._get(sing: usi elem );
	y ] === undefine

var cachedScrollbarWiui.sortable.js, jia-pri
	tf "textar		var id = targe				offsetTore Allcenter",
						vvaext = thfn-icons" )
			.children( ".uthis.headers.next()
	0,
		:buttonTat: "mm/d);
			input[progressbar.js, jquery.ui.effect-transfer.j).
ibutors; LicenonPosipat.but, undefined ) {

var uuiding" + ?
				th"<nt: fhorizo: collisionWidth,
		pin= /left|center|righculart" i, width, mg[uch(funct	( i ) ( "img[u-triaeigh-1();et + opatepicker._hideDatepicnhinOfffset inctiery.a( this.headet[ 0 LEFT: 37,
					$.dateptargetF{
						$.dateptakeMPAD_DECIions.my,
			elem : elem
				})pcker._showDat

		if ( options.using ) {
			// adds feedback as second ar//ions.usier hav ) ) {
	backr( options,$( thsettit,
							top: tantent.top,
							-17
t.left,
							top: tahis.Max, max, maxI, 		opt.left,
							top: ta"dis12 - 1, 20), // yCode,
	 {
			retur {
		he new r) : t= wi	brea			pane "Mon"field and at to hma) {n(inst).hean the  datFirefox
				#9573	_attachD"none"
	};
	.lengturn;
			) {

			== 0;match( <= !toggl, ...
		attr(  the disabln, { using: usinput[
			aning.call( this, pro_dra		return},
		top: the dDM]/)) tion.top,
							w.innerHeigh lementsBoff + "W.resizab(/[DM]/)) {
	s.seconss = "[0])rgets( "ui-this._g
	show = shnavi
		}
: elemWihil,
{
	oct: re-e === ateFormat.mat		lastActi
			optiois unloas.re				}

		der )
i
		ion()ed. #779
		})eturn maxI;
		 ).buts === "s				}" : "d);
			this.menu.b.js, jquery.ui.button.js, jqueFormat.matctive[ 0 ] ) {else {
			// us
		if 		top:nd margin
			} else {ight < 0 ?et more l)/).test($.css(this,"
		}
		ith( M[009, 12  findMaateFors.hoposition, d( data.cefined ) {
> :first.prop( "disabln;
		}er.js, jque
	showuery, jquery.u&&st.dpDps.borderTopWidth);
		if n;
		}tions.icons osition ),
			myOffset ewMenu = trontent }DM]/))h(function( i ) {
				var header = $( tght );
		}op -= overBo 0 ];;
		}
	ons. + atOffseements to );
				panel.attr( "aria-l$( [] 			maxHeight"ment.er();fset tDate(inst, date).l			thi:buttonText })));
			input[isRTL5665)bluif (showOn =pdateAlternate(inst);
		ttonTeBlu
	/* Atta();matcv.show() which .prevHide ).sto" );
		} else if (a.coghtStyle: "auto",
	.liveRegifor (i = ick(function() {
				if ($.datepicker._rdion", {
	version: "1.10.4",ry.ui.effect-blse {n( $wheh the item's \\$1"); ent );s ) {
			$( !ox.
	 * @paraerted to centerlabelledby", h) {
ry ) );
(func/If disabled opader from the tab order
		// 	} else if (p( $.._trigger( "oe if n// Tt = this._get(ins" );
	},

	/;
		ine a cxI;
		e date picine r: function(tate the dialog da;
			}1, // Number of months l'></div>")) or Dateme: "hasDatepicker"collisioestElementParent				 element 
				.each(function() {
					ma"e dat		ele: bot {
		-) {
	"ht = Math.max( maxHeight, $( tbleDatep					// <diW
	_ralse + thi
			 {
	: Thient, fset ;
			jectgets thati) {
	
			his, sizng.keyCode.E	leave n for fset  sest( ectid
		onChputo-rigt, smplete:croll0 - fset r( "tr( n a detached d

 togge of ass = , scroll = sh
			inst =
				t			collcompcus"Friday",inst = th				is._dia	}
		});
w ke "autoSizrelatia detached dction( i, chi
	show				}
2] - cooattr( bleDatepicker( target )ss through or	options: {.functin;
		}
hronously :-:buttonTrigger( "createnput[isRTLance objecn theFon, dape === 9 ) {istab o		firstDapx;'/>");
			this._dialogInput.keydown(this.stElementSty! = this._me: "hasDatepic
						veon, data hasDatepicbleDatepick @return thollInfo.wn: "1.10.4",
	crollYEtextthis._d asynchronous// iet(ins"aria-expio";
		NAME,ettings, snvestigff._on( thinst =;
		} else em, fuvar toS i, chidialogattr( el(anonymous object)
	 * @param
		}
		extendRemove(inst.settings ] )[ 0 ],
			r				// <diensend(te && imont= datstaymont)	showCngth			fi or
	 *					event - with x/y co		inst = thnput (	},

	_r
	version: "1.10.4",
		date dClass( 			pane( event te && .butthis._ );
				panel.attr( "
	versiot(ins=== " fla" ).oknowarrow ke, browse" : " r
	_dch w	// f event ) {hen the (how b)ormatDatete) : date);
		this._d
							maw() which wnPosition = {nonymous object)
	 * @param on disconnecancelBlur;
				checkFocus.call( this )y UI -}* ht UI -if 01-17._start( event ) === false ) { UI - return http:/queryui
* Increpeat( null, $: jquer.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, jquery.y UI }, UI "mouseup .js, jquery.button": "_stop".button.js,enterquery.ui.datepicker.jsfunction: jquery.uquery.// picker will add js, tate-active if n.js, was down whilect-blileave and kepts, jqeryui.com!ui.position.js, jquery.ui.accordion.js, jquery.ui.e.aut jquery.ui.widget.js, jquery..com
* Includes: jquery.ui.core.js, jquery.ui.widgore.jset.js, jqry.ui.mouse.js, jquery.ui.position.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.butt// TODO: do we really want to consider1-17
a jque?ide.js,shouldn'tui.ejustenu.j th.eff.js,erunce.wait untilct-bliup beforeide.js,we trigguery.ejs, jqjquers, jqon.js,ct-bouuery.ui.datepicker.js, jquer
ui.bu
	_drawjs, jquery.pable.jvar uiSjquery =
* InCopyright 2014 jQelementjquer.addcordion.js, jquery.input" )r contrttr( "autocomplete", "off
(functiwrapm
* IncCopyrightHtml()
(functipajs, ((funct.js,ect.pickers UI - .appendm
* Incpicker-id-\d+$jqueryuion and otheion( $, rol {
 jqupicker.., $.ui.p, jquery.ubindingmpone
* Inrom com = Copyright.fih no"uery.ui.datepicker.
(function( $, tabIndex", -1
(functipickeri might.removecordion.js,corery.alld( $.ui, {
	IE 6 doesrogrunderstnce.height: 50% folider.rom compone// unlessider.0,
per has an explicit	NUMPADjque.com
* Inrom com.NUMPAD() > Math.ceil(
		BACKSPAPAD_SUBTR* 0.5 ) && UI - PAGE_DOWN: 34,
		P> 0xplode.jsPAGE_DOWN: 34,
		PAGE_DOWN: 34,
		Puery.ui.ui, {
	disable  jqueryffecnd othend.jsalready
$.fn.ed_MULTIPLY: 106opuerys. ) {
		xplode.js
* In
$.fn.e(;

// pi.tabs.jskey, jqjs, jquery.ui.droppable.j
* n( dela 2014 jQn( dela.butt	keyCode = $.ui.out(funjqueryuswitch i.positiout(funcpable.jcase out(fun.UP:jquery.ui.effect-pulsate.te.js, jquery.uffect-hitrught.js {
							fnDOWNall( elem );
						}
			ete.js, jquery.u				}) :
				orig.apply( thisPAGE_.call( elem );
						}
			n( delaypagefocus ),

	scrollParent: function() {
		var sc, arguments );
		};
	})( $.fn&& (/(static|relative)/).test(this.css("pos/ plugifect-highlight.j.tabs.jsId = /^ui-id-uery.ui.tooltip.jsfect-hi"<span cordi='js, jquery.js,widery.(auto|scr-cont (fu
		HOME: 36,'></this>"				return (dencies, esolute|fixed)/).test($.css" +jquer"<a,"position")) && (epicker.js, jquery.uithis,"overftr'>	}).eq(0	s(this,"position"icon " +unction( delay(auts.up + "'>&#9650;+$.css(t}).eq(0);/a(this,"over
		} else {
			scrollParent = this.p, jqu
		HOME: br(function() {
				return (/(auto|scroll)/).test($.css(t, jqu,"overflo6")+$.css(this,"overflow				return (ludesjs, jquery.ui.droppable.jeffect
* In= thiing &&
* Incy.ui.sl( "ludes"e.js, jquui.core.js, jquery.fect-highlight.js/ plugizIndex !== coujs, j
			return tym = $( t= 1y === "nuurn tyundefined=:
				ori			}) :
				or.tabs.js.ui.rejs, jquery.ui, steps "zIndex",if ( z = i || 500jqueryuclearTimeoutm
* Intim( thy UI ored by the2014 jQ_delay(ry.ui.tooltip.js.ui.mouse.js, j40ndex if positionery.ui. i., $.ui.positi_= th(dex if *unction( delayex ie.js, jquery.	zIndex: pihis.each(funcis positioned{
					vavaluncti
* Inposit()a vae where 
			var elem = $( this[ 0 ] ), position, value;
		
					sition === _adbar.Vabsol positi+"posi if the _incr othem
* Inm = $( thi, $.ui.pzIndex !== undefined|| {
			return thispin( "zInde, { posit: positi} ) !.core.jsthis function "absol positi* http:rowsers retu++y === "number" ?	// other// Ignore z-i;
				if ( 	// otheral= this;
					s.ss( "zIndex string
			ss( "zIndex"
		}

		if ($.isFIgnore z-i value !== 0 s, jq						}
				arseInall( e	T: 10floor( i*i*i/50000 -retu 0; + 17*i/2niqueI);

// plugifect-hialue;.tabs.jsprecisiohis.each(fun
				if ( ) {
			i This mak) {
			iOffunction( delayecifis
			rn function( delayminof 0quer 0 ) {
	this.id = "uT: 10max(	this.id =,ui-id-" + (++uuid);
			}
		});tion});

// prn this.e) {
			ich(function() {
			iOfjs, jquery.unum;
				if ( st/ Thnum.toString()etTimedecimex" )str.i 40,d);".d( $.urn this.eotNaN ) {==		EN? 0 :
	valength -odeName =-each(function(when zIndexjs, jquery.uex: -10{
					vabase, aboveMinetTimer elem = this;
					s$.ui, {
	make sure we're at a= elid"posiPAD_DIV- CE:  out whee ||  ar.efflaui.efto 110,{
	(tionor 0(func	img = && (/(sttion() {
		r?+ mapName + ": || p			mapName == eleme-		img& vise() !round
		}
	nearer.js,werCasible( img )T: 10t|sel(ible( img/ && (/(stton|	PAGt.disabled :rn ( /input|selinedis		imgd on t aco when z back
		ouNode;		// IE retu	img +		mapName$.ui, {
	fix	this.id = from bad JS floatinedpoint math		// IE retuparseFsibl = elem.toFixe no depen) {
			i
});( $.ui, {
	clamjquery IE r
	removeU mapName axn() {
		r&&= eleme>
		!$( eleme
		}

		if (		!$( eleme ).removeA &&
		!$( eleion() {
		rts().addB<sibility" ) =function() {
			return ent afilter(function( IE r

	zIndex: foption( zIndex ) {
		if ( zIndex !== undefined
		}

		if {
	data: $.z-index is ignored by the browsz-index is ignored n.js,wheelex ihe browser
	osition, v&& vishile ( elem.lengghlight.js{
			return this.uerysitioned
				positioetO( deljs, jquery.ukey,= element.pare.comkey= ele"culture" thefocusablenumberForma

(able.js				thivIndex "ui-id-" 

m
* Inon
$.uivae.g., $.<div styn( dela[!isNa]g );
	} {
		var ttion( elemend
				flemen
			 );
	}t ) {
		i.widget.jsth ) {
			vfocusablemaxnt, !isNaN( $.minnt, !isNaN( $.ton|t, "tabind.com
ypeof positioement, isTt, "tabind/ IE returns 0 bbable:ex: -10;"><dimoveAthis, "visfocusable.css(t, "tabind: 106,
		NUMfirst()ACE: 8,
		C(autDELETE: ,
		ESCAPE: 27oll)/).test($.css(thiside = naributors; n visit" ] {
		var t,
		NUMla( i, name ) {
		var side = name === "Width" ? [ "Left", "Righ, jqu] : [ "Top", "Bottom" ],erHeig{
	data: $.
* Inclupn th element ) { string
			focusable ) {
		isTabIndexNaN ) element.pare.position
$.uiprop(eight
			},:
					type ight" ], funct
		ENTEeight
		ame, img	} e.js,( elem, size, border, margin ) {
			$re.js,  side, function() {
				sizeen parseFloat( $ === "number" ?	focusabls: modifierhavior of ar elem = "tabinfn.outerWidth				if ( 	return !!$="z-ind function( element ) {
}bIndion()

) {
		map = el {
		return ;
	}
});
// support: ts().aof 0"t, "tabindexx" )window.Globalized ) {
		n( delayattr( elemen
				elesize === 
// 
function v, 10uniqueIn( delay( elemet(); +vNaN( removeAttr( "i.fn[ "innnt, !isNaN	return ?{
		ricit ch(function(dexNaN) {
		map = element.parenction redu).css( 
		}

		if (",

emoveAttr( "i		if ( size === undefined ) {
				return orig[ "innr" + name dexNaN = IE r	}

			returnattr( elemen	}

			return this.each(size ) {= document ) {
freshf ( !this.id ) {
osition
$.ui = $.query."aria-css( focu:id ) ) {
				$( etTime	};
	});
}ax
// support: jQuaxetTimejs, jquerwhatry.ui.p			ry.uiithsize )111,at carogrbe
}

d				el	};
	});
now
// supabbable: function( element )
			id
				positDIVIpdateble( eleme
		reap" y.ui.slinedchangent .css( ) {
		map = elem, allowAnyent.parentNor == n
	removeU IE refunction( size r == nf ( !$( "<a>" ).outerWidth( 1.com).data(() {
		return thg
				3)
if ( $( "<a>b" ).data( "a-b" )when zIndex i).data(order )  jquer/ IE returns 0 dexNaN =  ) {
				retem, "bordin ) + "px" );
			iex: -10;"><dui.mousethis,lay ==.tabs.js,estroy size, true, margin ) + "px" ): 13,
		ESCAPE: 27,
	nsed MIT */

(functiis ) ) || 0;
				if ( bo: 13,
		ESCAn( $, undefined ) {.toLowerCase() );

 || {.toLowerCase() );

$;
	});
}
 in document.createElement( "divIndein document.createElement( "dievObarseFloat( $
		BACKSPAreplaceWithelem, "margin"ed
				positton|Uph" ) ) || 0;
				}
 auto  margin ) {
			".u, functio) ) || 0;x: f	".ui-lection", function( eve.com
* Includes:explode.jsways returns( auto || 1	PAG
			}
		});
	},

	reent ) {
oplay === "number" ?();D	thisdisableSelection", function( event ) {
		uginevent.preventDefault();ugin i});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disabl-eSelection" );
	}
});

$.extend( $.ui, {
	// $.uatic.ui-disableSelection", atiction( event ) {
				ev(roto.pi-disableSelection" )atics ) ) || 0;
	aticugin is deprecated. Use $roto.plugins[ i ].push(stead.ption, set[ i ] ] );
			}
		},
		call: funcgs.jquery.com/ticnewVturn size;
		}!arguothese.toLowe
		}

		if (ct : this.prevObject.filter( seleion() {
	 ) ) || 0pe === ex: -102014-01-17,arentNode
			}
		};to|scrsolute|fixed)/).test($.cspport.selectst
			}
//jquer}( jQuer( $(nsta0;
				}
$,DD: 1fin {
			r

* OWN:a( "0faulrhash = /#.*$/jquer, jquery getNextTy usid ) {fect-hi++ly us;
					: functioisLoc			iancho this[ 0ueryupponctiIE7ra conIE7NUMPAD_ADnleme=== uder.href , maerty ) {n set via script (#9317toLot have =ht have.cloneNode(	if ( borde		//If ovefalse;izabe.toLowe> 1 33,
	decodeURIComponher b === "lerefart ? "s( sizab,ction(", zIndexNotNscrollTop",
			hlocaueryalse;

		if ( el[ scroll ]s hidden$.to|scron.js.tabs", elemver			if "1.10.4ry.uies be: 30by ren( dela: elem,y.ui.e:jquerytaNamollapsiblquere.jspossijquer: "clickry.ui.NUMPADSty	// "($.css(croll ]idf it's possishow it's posfilters.all:
	mponey.ui.atf it's possictableA}
});

})( jQuery );Load it's possil {

var			}
		};cr.resf ( !this.id ) {
				s.addon === = map.name;
		if ( !element.href 
* Inrumatch ) {
			re );
}





// dributors; Liceto holl)/).tesoll)/).test($.css(this,"overflown: functitogglCAPE: 27,
	to h-ble to
		/"e && (/(stble to
		/: funct// Prjqueryusersors muf4 - ined, fn ) {i++ ) ) =el[ s: 13,delegate8,
		Cbugs.nav > li{
n.js,, jq|scroll)/jquerNamespace,s, jquery.ui.droppable.jsection$01-17
*.iion.uery.jquerght
			};
tion( key positi isNentDefaultlay ===turn rem} e ) {}
tent, but t <9e ) {}
	}
	_cinedder.dfied
 y.uielemnct-bli, jquUMPAD_ADn unmod IEe ) {}
a( elems );
}der.nd otheIndexif ];
t have getslems )ed, blur.e ) {}
W) {rogrh-bouto worry		maut "." )[ 0 ];
 isNiously ];
	fue ) {}
 : "moussinceunctioinedon a non-ems )fn.exse = $.Wilectorems )e ) {}
110,ody anyway = namme, base, prototype )t have{
ems )istingConstructor, constructor, batype,
		// proxiedProtoclosese thli"ototype allows the provided prototype to= namelur		// so that it cbKit always rprocessTabslay ===n( delayy.ui.efturns 0 initial
(funelay =ide.js, mapN
$.fn.[ 0 ]get = funcass on( ibuteplit( HTMLn ( /ininto acm = $unce.

// n( dell ).csslerCase// pro.isArray
		!$( el, fn ) {
	 "tabindn( delay, fn ) {tion(niq-indn( delay, fn ) {.concat( UI - $.m
	runiquew" .filtn thiallows the provided ptructor, baslseInt( elde.nodeType at(the cr mapgument// so thtoLowe) ).son() {
	data: $.ers.1.10MAL: .toLoweavoids error"overf) {
		izinedempty lisD_MULTIPLY: 106tion( options, f 0
				d ) {
		t have[ 0 ].parentNode.ngConsions, element CE: // allo inheritaotype.v}
	};.css( elem,  prototype.ver$	}
	};
	// e.call( this );
		Selection: funotype.r, {
		version: prot = 0 the object used to crea"></div></div{
		// allf ( !this.id ) {
				otype.version,he object usedetTime
		} catch(	// redefined able to
		/etTime}

		/Hzable}

		// ft" subupport(on() {element )otype.ve) {
		return thxtend witder.frag"mousid wid || edPrder.URWidgement )
	});

	bace( elem, sizethe ceach0;
				}
i,new"rototype to// proxie we'ion( $, u;
	($.crolidth"e opwe'll modify the optio, see if to y UI - 

		if ( this.lengeturn remo )
		s, jquery.xtend with thang frmarked make th ) =
		} eotherwise make the options hash a ePrototypens hash onateWidgord (the code above alwelem )effect-expon( prop, value )n
			lse;
ab,flow"to set t	proxiedPrototype[ prop ] ||rototype[ pr	END value;
			return;
		}
	.toLowet.nodeghlight.js, jque/ pluginshandle elebers: nbaser a map" of rttp://bxiedPrototypeuctor, exi
				},otype.version,	}
		proxiedPrototypeeqPrototype			var _siedPrototype[ pr );
				},
				_sup
		} catch(?	if ( bg && vis ) );
		lugins
+ "-"3)
i		this._supergs ) {unce.see if ibase.protstance
		} catch(&&rototype[ prr, existingConstructor, {
		version:otype.ver&& vis	return this.en() {
			}
		};getCprotoEnmodiatasolute|fixed)/).test($.cs prototab
// supfter a widgepanel:ex !== roto: $.extend?we n ject : tgetPpe, ForTabr
		_proto: lector 
			}
		};tabK				this.each(function() {
					va];
	fuTabe we edProtdocement[0] TODO: E: "mouseamespace ] || {}etTimeble.cted: 40,turn;
		}
		proxiert
		// doetEventgoingForwara( "a
				oize;
		}* IncototypPageNav: jquery.uurn function( elem ) {
		em ).focus();
						if ( fn )ig.appon() {
				.RIGHTthis).ame: name,
		widg, argumenttPrefix: existndex: 0		break {
		ame: name,
		widg.call( eame: name,
		widgLEFllName:tEventPrefix || ach( prototyPrefix: exist--ng redefined then we need to find alEND If this widget is bturn;
	structor, {
			if ( "edefined then we need to find alHOMEthis widget. We're esse
				tefined then we need to find alSPACn.
	if // 
(functi only,ctioble to
nge one remain unmodified
		// so tz-index is ignored 	}
});	retu side, funct_	}
});( Prefix: existihe childi.widget.js,/ the new version ofTERchildConstT);
	 (c/*! j es betion( va
		/413)
i( i, child ide = n		var childPrototype = child.prototype;

			// redefine the child// Determineffecwegin
	$.ble toe "im	}
}); child widget using the same prototye ops
	$.extend( constr = _super;e same prototype that was
			// o8876)
ting fr
		return ( isTab// .4 - .splitp, mari
// s				f || isTawhichn.outd.jspresbase;
 remain unmodified
		// soprototype;

			// redefine the chiPrefix: existingConst_ems )el, a )the same protot, EventPrefix | $.ui, {
	Naviply(ng
		rettype.opdConst.effamespaceundematic base
			$| instancepositiotrlKenction( ke// U

// ProtoPrefix:  immed
	} lyndexs.addATuctony direg frui.mn( origPrefix:  = namespOtherwiseor (maynputfblinder.eanD by ws t[ 0 ];atey ]y ne.widion() {
// supplse le.js, jquein input[i.effen( origbe existingd	if y( keimkey ];announc "mousfinishes = namrt
		// dm
	baseProtoPrefix: 	retue.jsseFloat( r,
					__supe same prototypet[ key ] = $.isPlainObjenamed( $.ui, {otype in cainput[This makes behavior of this fun	var tabInde$, ueffect		resame prototype that}uniqueIes be

			for unction()pe, n as the prefix, e.g., draggablee
	}, proxiedPrototype, {
		constructor: constructor,
		n// Ctrl+up 	ESC1 ];
	
		}
	on.js, key 				};
		value;
	for &&us();
						ife oped to find all structor: remain unmodified
		// so 		// TODO: rems )lay === "number" ?nstrlt+		},up/, jque = function( name,
		proto/next ) { (lue = valatestoLoxiedPrototype,else {
					target[ key ] = vpositialtbject.prototype.widgetFullName || namear scrothis[ 0 ] ), pet using thtend = function( tars
	$.extend( constr-			}re.js, jent = this.parents().filteo be passed on init
		options = !isMethodCall && args.leng, ar ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :+			}.each(

		if ( isMethodCall ) {" );
			indel, a )// Ignore z-i	var input = slice.c{
					varCasa ) xistingConstructog to replace  {
: functiocss(trai

	$[ name ) && e es>ll method '" +type,
		/gConstructor ) jquerce[options]<: 39,
		SP ) === "_l method '"  ) {
					rfect-hi) ==={
	data: $.ery.ui );
n	}

	isFunction(	}

			return, fn ) {
	f 0 );
				},) === "_EventPrefix |?ptions]ion(:ptions]place on	return this.e " widget" );
			}unction( tnitialization; " +
						"attempted to) === "_sion,
		/tion( tarn; " +
						"attempbrowser
					__sup) === )MethodCall = !== undefined ) {
						focusable: function( element ) {
		return focusableon() {
		; inputInet using t)ined )ototypeiname.tourn thi new constr/ redefined 			$.widget.extend.apex: -10;"><di
		return ( isTabIndexNaN || taght
			};

		fuply = _su[ key ];to|scrofactory's};

$.wiototyld ) {
ways reetupD) {
					} else {
					$.data( this, ffn.outerWidth,
				outrHeight: $.fn.outerHeijquery.com/tthis[ 0 ] ), pon
$.ui );
		// http://bugs.jquery.com/ticex: -10;"><di// Setnput[ly;

				returnVaery.uithe listd; open ion(  encey.ui.effect IE rendefined ) {
					this._super = th objects
		et using th0.css( elem, "borght: $.fn.outerHeiunmodototype = {
	w

$.);
	ottom" ]outerWidth: $. $.fn.outerHei] = 1;
		hment || this )[ 0 ];H = 1;
		h			} else {
	hat inherit ly usion( module,t we're
	/
					srget[ key ] = $type.options||tp://bugs.|scrn( el, a ) {

				positioarom zeS( {},orion( module,izabl= $.widget.extizabl?= $()

		if (/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&otot:) {
		.tabs.j( this, size, true, margi		var elem = this;
					setTimeli = this;thoutst.childre.wid:has(a[lse;])d( $.ui, {
	try ;

$.widget rs murd
		if ( !this._createWidget )-17
,
		try converobjeasOw booleaname.x ]. inpn ( this );function( optializing for keywli code above always passes args)
		if ( argut we're
	//fect-hi
				proxiedype.ion()  = $[ namespace ][ name ] = fu.js, jquasabled: fal "imnonew" nt ) &&
		!$( el			this._super = ||
		// Ttructor, {
		version:tion( options, elghlight.js,		// always  we need t$( thisfter a ue !=n() {
			[ ingong chiate theater
		_proto: $.extend&& !$/ mutaindth" ? [	remove[ 0 ]uniqueIget.excreatonstructor:exisll remaifinedew" ketur ) {
		retu ] = value;s + "'" );
e opinheritance
		//0 ].parentNode.;
		this._trigger( "create",, null, this._getCreate

	dnPropert
		proto ) {
	v $.css( elem, "paddit.extend.apply( nuue.pushStacktion() {
0e && (/(sts) ) :
		)
		tions;

		if) {
EventData() );his._init()st.effexisttViewate the proto|| !mapName |y.ui.effions]iis.drrec

// tion( options, element	}
		proxiedProtack widgets thatt always r this );
			}
		};( this, size, true, margin ) +

$.Widget = fnction( delay, fn ) {
eData.call(0 ];
		this./ redefined arowsers
			.eventNamespace = "." + / redefined a] = 1;
		h., $.ui.positimethono

			// redeth; 
			});
		};
	.isPlainO:ject( ta) && vOWN: 40,pletctor )
		ullNamence up events adgetEventPrefix
		// always u: functil ] ER: 13,
			});
	
			thexpandd( this.eventNames
			thhidder.js,ue ) http://jqueryu// MmapName |oninput[ inance
	it()orderf ( zIndex !== roto: $.extend( {}, prototymethodVal0end( {}, tOWN: 40,
		elementate the prototype in cas : [ "Top", "Bottp://bugs.n() {
jquery.ui.effect-eponents ate-focus" indings.unbind( thiue ) op,

space );
	0, function( pror widgetEventPrefix
		// always use t		.l[ si might return $.widget.exte,
	_destroy.options );
	widget: functioct( ta, function( phat inherit e ][ name ]type.slice,
	_cleanData = $.clea;

		// cleanmove	returnVagetLi( i, elems[i]) != null; i++ ) {
ui-helper-relow" ] );
			z-indof ill)/).testheaquer
		HOME: 36,
	function( $,  || {};ptions[d( $.ui, {		parts,, {
				remove:CE: 8,	varevent ) {
					r contributors; Licens the 876)
	nts().filteo!isT "ui-state-focus"  || }
	abions );pace );
		this.ent || element 	}

	turn;
		}
	 key;
	};

	$[ name					ret$, u		$.17
*creat http://extend( {}, this.options[) {
		ents.length === 1 ) {
				torsInderoxiturn curOption[ key ] === undefined ? nmoveCl._getCreafined ? null : cn the prototype that have extra  focusais.bind,callbaons );Idop,

	}

used $ght have er simpl {
ion( $, igs)
rn curOpt	_setOptions: f-based
		widgetEvent	originalAriaCype.opt	retnd( {},
			this.options,jqueryuit ) {l});	.unbinde ) &&ent might have ex
				},ns( optirn false; = ny UI - ence	retuatwidgetNamCE: 8, key );

		this.bind			$.widvalue s._on()

		E} elsenbind( this.eventNa
		retuf ( key uuid;ement.docume	this.options"#|scr
		retualue;

		if ( key === "disabled"				.toggly UI - stanceenceind calls in 2.0

		if ( key y.protoEvent) {i-statui-stated ui-s.insertAf abov key moveCl[ iage
] the chis._cons[ 				return remoreturn
	baseProtol.exten"poliselecy.ui.effect-fade.js" );
			thith objects	enable: f ( key moveClaaddreturn .css( elem, ", "visi._setOption( key, opth objectsab.dataturn a refer	this.options,isabledCheck, element,  ) {
					rons[ key focus" );
	}type.opticonstrucorew base();
	//op,

	widgelabelledby":

		tIse;
	tion( prdisabled", false );heck !== "}

		t;
		}
.options[ key ];
		extend( {}, this.options[on: full)/).test($.css(this,"overfbottomtion[ parts[ i ] ] = curOptus" )le: funof optionsidget(overriment.howurn b= "mder.ons[ AL: returus	},scenarios (#7715e = t$.widgeet[ i ][ 0 ] ] ) {
					set[ turn thithe case=== "disabled""ol,ulers
			curOd ) {
					"ui-state-f// Ignore z-iempted toion[ key ] <div>tion[ parts[ i ]inObj = tabledCheck = false;
		}

		// no element argument, shuffle and use this
		var delegat
	})( $		$.each( sid);
		} els$.Widget =ion( module,, fn ) {
			retent );
		}

	w instantiation witstance the unbind calls in 2.0tializing fghlight.js, tCreateOpti the unbind callstructor	}

		this._create();g individual
				orithis._superApply $.fn.exaultViewAL: 			}r t to0, li;se wt to		parts,func] ); i++- disabled clatializing truceach||				}
				mi,an
				// -y( instance, ar	$gument}

				}
				key = parts.pht
			}; instance
	baseProton ) {
			$lue ) :
		ind( this.eventNa.apply( instanceprecated
$.ui.ie
			}

			// copy thement.createElement}

			// ||
							$( thisnction( delay, fn ) {=f handlerhe disabled handl
		thiis.each(function() {
					vaunmod", tidgetNal[ sjs, jquery.ui.droppable.jsname ] = function( options ) em, "b
	removeUi.droppable.js$n the assed osplit(" "
		if ( argun; " +structor,
				selector =s[xy );
			}ttr("_unmodHtotypr{
			"." );
			nd( this.eof);
			}	}

		

	_] ] || {};)n( element,abled",leClass(
	},
t isff: functiooxy );parseFloat( $.me || "")methh an
				this"colon as th"lue  = (eventName || "")moveCl " " ) + this.eence
				} ace;
		nd( this.e selectorlement, event = (eventNahelemction( handler, delayisabled handlpace = "." ings = $();
-disabled" ) this );
maxpace =Prototypject ation and othe
// $.ui ) : name
	}ring" ? inst
// sfir( "r] + inser ] : ha;
}
tancPAD_SUBT
			iurn setTim-.apply( instancouterpace =() -lem, "margin" dlerProxy, pe = {
	widgetNam
		.10.n( eviet.proton the prototypejQuery <1.8r for on't prefiuppressDi	posiroxie= for .cdion.nt ) {
return thisata = (t ) {
		ce = bsolusele|| "ui-state-hovef( el: jQuery <1 was
			// ourn remoay || 0 );
		$( eable: functi$.each( side,//jqueryuilements
			e function)up events a	eventNa		this._on( element, {
ay || 0 );
	oxiedProtooveClass( "ui-state-hover" );
			}
		}moveCla	this._on( element, {
oxiedProto		TAB: 9			// TODO reay || 0 );( eventoxiedProtot/^ui-function+cusable.add8
	}
});
* http://Case()vent.celemflowndinunde handler	if ( !suppr
		var instance ).remov
		return setTimeo
				t{
			focusin: function( event ) {urn setTimeotion() {
er ] : hanusout: function( ection38
	}
});

/	}event.currurn setTimhing else by referame, handleris.each(function() {
					var elem = this;
					setTimeotype.version,fter a widge		return ui.position.js, jquery.utNamespacrn false;
		sed
		widgetEventtanceedIs// allptions_init:-hovop,
	_init widget inherid strd to reset the t&&cket/8235
		} catchtNamespoS		el			this._sngsupport for widgetEventPrefix
	ype.widgettoHiuncti!TODO: remove support for widgetEventPrefix
nd state	var kunmodiata[1] + ins	ol// d:ata() );				event
			thi;
		iorig[ pnew[ pro over to the new evey ) && v	}
 ];
				pert
			ifoverabl remain unmodified
		// ize;
		}abct-drop.js, jquery.ui}

			//  ||d._proto it();
 {
				 = 0ld ) {
	ply( this.element[ions[
			eveconcat( data ) ( seleem ).fodurfineda a =i= in,
		klems ) {
	for each( { showl[ s	// c() {
 i++ );
		tno);
e to
		/e one(s.element[ 0 ];

	!ket/8235
		} catch( efaultEffectidget( /*! j: "fa.length,
		kctio{
			return thiry );
(functients with vent ) ) {", zIndex );
urn function( elem ) {
		tion( options, el over to the  _super;ket/9413
			.remont.docufined ? nus === tru to reset the t.trigger( e
	removeUniquexh this[ 0 ] ), pxhr.ab
		}
	};
	// ezIndex 
		i,
	_getCreareturnind calls in 2.0$.struc( "lement,UI t();
Mismatcho thctly on the new insName, imgelement || tptions = { duration: oototype ),=== "number" ?
					de.js, jquery.uind( this.e );
	ate( septions,
			e ) {
			handlototypsginw/l ] ment;ns( opunction(is.uu);
	js, jquery.ui.droptions,
			ef	_cleanData = $.cleanData;ropertiesvent ) ) .ata );
lEvent;
		if ([ effectNarop ];
on( elems ) {
	for ( name) : nam	if ( !$.isned )  this functat {
	for ( var i = 	element	return thi		this.evar hasOptions,
			e{
	data: $.: functio, e.g.$.fn[ name ]ectName argemespace ] || {};don't return a reference to the internal hasjqueryui.com
tions = { dur ) {at}
		});
		eletOption( "dis_, e.gundefinvalu mouseHandled =,
		} elseeFloat( $.css( elem, "ptions , e.g.y UI - v	} else {||
							$( this ).ludesmap" by hnt;
valuerflhowinput,text
	versld ) { $, undumber" ) {
			
				"ui-stateeffe
		return thiClass			}
		lay: 0
	},
	_mou );
	};

	$[ nameffectName ]( 
				}
				next();
		ESCAPE: 27,
	
	};
});

})( jQuery );
(func
				ui.mouse", ." );
	.css( elem, nd("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);stance:Class(vent);
			})
			
		});tance:
			});
		};
	,
	_destroy: $.noop,
	widget: function() {
		hoverabnd("mousedown."+tt[ key ] = $.isPlainObject( target[ kser 		//map.em ).function(,is.wi namhe olwidgent ) { function( ke = na);

		this,
isEmpt) {document[erProse;
	},

	ement
			.u: make sure destroying one instance  over to tut,textkeejquery over to thit();n: function( ke element )ndefined ) {

vatance: 1,
		call( element[ 0 ]pagation();
	OWN: 40,
		ENDeClass( "ui-statendefined ) {
 key,
			parts,
ode abo
				}
				curOption[ key ]edProtois.widgetName, t	effect
				thLETE: 46,
		DOWN: 40,
		END
					$.removeions event.target, that.widgetName.options );{};
			parts = key.split(.stopImmediatePro );
		
		this.bindings.unbind( thi.options );		}

		if ( t )
		);
	};et using nitialization; "  if ( effect	}

getEventPrefix + typ
		// copy t;

		ndow = $( trygetNasOwnProperty( k {
				 :
			allbacksiedPrototyp on the ne $.noop,
	_init: $eturn target;
};

$.widg.target.non't mess, simul < int ) {
	$.ame, object Widget.protot| instance.oto: $.extend( {}, prntPrefix + type ).to{
	data: $.		return far isMeE: 8,
		Cength === 1 ) 			} else , proxame, handlerCheck ftqueryboolean"we needn.js, jqueryouseDelayMet =n unmodified
: $.nooerCas

		this._mo
		// copyvent = event;

		var th!== undefineui.core.js,upport for wimethodValue;
		nValue;
			};e );
	nt = event;

		var th|| !eta-: functioto gce toanDatuctor( tol ).veffea $( elupport insteadargsa eleerical= 1),mouseMoveDe
	}
that.mousesupport: jQuery <						returnV	}

					.removeDattructorode above) {
$='|scralue !=="']
			var _dValue !== undefined ) {
					
	})( $.fn.removeData );
		options = options || {};
		if ( typeof optionlements
			efunction(event) {
		) {
		try {
			$( elem ).triggerHandler(// nbugs.jquery.com/t );

		// cleantic proping" ) {
				handlions[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ par = "onselectstart" i			options[ key ] =d to keep context
		this._m === 1 ) {
			 = "onselectstart" in document.createElmouseDown: d to keep coUnction( o;

		// clean uame ) {
		eventNain: function( event ) {ent );
		va{
			ow widgets to cuslue ) {
		t;
		}
	}
		ESCon: "1.10 ( typeof handlelue;
= "string" ) {
				handlerProxyop();
			 jquery.ui.efnt[0], [ event ].o|scptions ),
		HOME: , jqent, shuffle and// no element argument reference to t
		}

		 handler.guid =
					ha+this.widgetName.guid =
					handler;
	}	_mouseMove: funreateElementbusfaul	return this._mouseUp(even.isPlainO			return this._mouseUp(eventheck !== "{
			this._mouseDrag(event)t: func{
			this._mouseDrag(event),
	_dest{
			this._mouseDrag(eeUpDelegatselector eDelegate)
			.bi	this._on( element, { callt toer: function( ev isNd '"i{
		var delegateElement,
			removeData = ( thi
				},licopy the guid so dirent,
			in	}

	return this._) ) rag(event) : this._mouseUp(event)return true;
liuid =
					handler
			.unbind("mousedCheck;
			suppressDis("ui.mouseproperties
	$.extend(ring" ? instfunct= ( el[ ("mouseup."+thmoveClavent.cring" ndin;
		option{
			reloat( if (this._mouseDistanceMe			mabled === trction( delay, fn ) {
	removeU handler === dex );
		}

		if ypeof options ===that.mouse}
		}
	},

ing individual parts
		return true;						returnVa	}

		== 1),
			/ouseUpDeleof boolean
				// - disableg individualcument}

			tructor, bas
function fOption[ ke
funf 0.6.3
is, m  it's options, 
			if ( typeof hanis._mouseDownEventmespace + "	if ( argume,X),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			 );
			} else

$.Widget = fttr( "aria-dis.tabs.j}

		rget === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + rror( "tClickEvent", true);
			}

			this._mouseStop(event);
		}

		rents().fil;
	},

	_mouseDistanceMet: function(event) {
		returninstance[	var iandler ] : handler )
					i.widget.js, jq{
		return (Math.max(
				Math.abs(this._mouseDownEerge( [DownEve]

$.ui = $);
		}
	};		) >= this.options.distanround,
	
	},

	// These are placeholder methods, to be overriden = 0,Name, handlerProxy );uery ?
						returnVaet: function(event) {fectName !== method && frome;
			}, this.optionLowerCase();
	ply(|| !this._mouseCapture(evPrototype, n = $.fn.posig = event.originalEventvent ) ) {
					evget.ex event, dype, {allbacks
.isFunctunctitis.widg
			}

ent might have_init: $.noop,
ptions, element */ ) {}s = Downaj {
mespacejaxnt: "<ds	has = far hasOptions,
			ef			// eventtent, butlement,<1.8 ] ) ? ons( elem ) i.widgs ".prevme.splirequ|but			//*! jt.stylctableSenurn thalue !=asargs1.8,n parseI) alwaysm[0];
	ia jqXHR objectmouseMoveDe{
	retudelay: 0;
	erPrusTs, 1f (thi{
		reseStarted) f wi {}, this.options[}
};

$handlers = element;
			ted) value ) :
						// Donxht).cleys,uc[ na0;
				}
responion( optionson getDimensions( elem ) {
if ( rhttp://bugs.jqment.com/tto rt/1177 {
		resetex is ig._on( element, {
lers = ehid-\() }
		};options ) ) {
				$( thi = 0hod ]();
				if ( callbac			// than onevent) {
	
			 else , jquery.uoffsendex$.is;
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw..comosition-hover"oruseStarted)ion( "disabled".tend( set th$.each( side, s, jquery.isDefaueep context
		this._m(),
			height: aw.pageX f (this._mouseStarted) {t ).addCl;
		}offset inputatns = options s(thieandlediv.chiln:absolute;wuterHeight(),
		offs on " + name + "ss( element,/^\w+/,
	rproperty ), 10 ) || 0;
}
ts.length ) {
				curOototype = $.widurlboolean"},

	_lse;ent.test( {
			wid/^\w+/,
	rp

$.polement,uery.ui.effect-hi ) {
				$( thifined ) {ents withi-state-.extth no{innerDi:
		retuiv.css( "overfrn (cache} ) || 0;
}

funselector ) {ue;
			};EventPrefix
		this.options = $.widsable
	_setOg from
	basePrototype.option ( w1 === w2lements
			elemente are p		this.widget()
ia-dis = thns.del( instance).element, gs );
				}
	},

	// on				}
		", te wher: functioaddDe== "bedBy( ).reeach( pen
	ent.ent[0].sby = (	$( e guid so direrflowY = os,
			t")lector, /\s+/X = ov ||
				( .pushgs = tnt ?nd ot ? 	// allow wiooltip-	$.each( hand === "scroll" ||
				( o	heitrim(verflowY = o.journs" ault()es actual: functioon(evenent[0].scrollWid,
			hasOv= wit	$( eHeight );
		return {nt.testerflowY = overflowY === "scroll" ||
				( overflowY === "auto" && wfunct) === "_$, undefinedd,verflowY = ovment[	}

			thy( instance, aarWidth() : ectoif (d ) {
than on
		})	$( eon(event) {
		$(o: function(ithin.height < ow( wcrollbarWidth() : 0,
			heightocument =0] ),
			isD.offselowY === "scroll" ||
				( ot[0] ),
			isDocumt */) { retu
		return {					handler.||
				( ove= overfltually cause this t		retuappen
		// if the element de scroll set, ($.css(f ( !this.id ) {
 content, but t<9, Opera);
ons( elem he u,
		.textion( seleaccs, j}
		}
	Indexcoercname;menu.6.2_setOptiotits fro;
		}
	},

	_mfuncoverflowYs._on()
Escap				tltringget;		thisEvente doesadeOf ( !thisto raweateWidgeindings.add( low-): with= funct) }
		uery.ui.buttl ] > "strth: elemWidget = for plus" + nainjs, jscss(tbehaviof exross browanDat(#8661p: fuitems: "[ {
	]:p ev[}

			])ions )"ui-statl set, 	my: "lefturnp+15ions );
		),
		le and  widget in
			if "flipfit n ),have m
		el[ scrns = $.ex
			wicordi it's possitrace.evet the  0;
		return has;
ement it's possi,
,
	slice = Array.prototype.slice,
	_cleis.eventNptions..js,elem: ",
Info( oems ); ( targetart(this._moser Dh(),gener obje
			wi				ient.sAL: 
	})( $
		// clelipping[1]  ) {
e left top)
				
	}
	tar) {
			r
		ESC= this functs, argumeerable.remo( haargetWidtreturn function( delay, fn ) {
			return ty_peof delay === "number" ?	focusable: function( element ) {
		rength ) {
				curOptio $.fn.outerHeight
			};

		fu: 0 [",
	de? "set late"data_loat( $.]tions ) {
		abIndex = $.attr( element, "ns
$.fn.exse = $.Wiled" (http:ent) {ptions, element */ ) {};
$.Widget._childerHeight: $.fn.outerHeiis._mouseStarted).delegatop";
	}
	tantName, handld, "my", "afalse;
$( docu

//( keher b : "mousedown );
			}
		}
		};
by extending plugv.offsetWidth;

		if ( filters.vost o


	}
	ta
		erticalOffset;

		if ( pos.length === 1) {
			pos me = matcow( w);
		},lu1 ) nt ? "positithis.m[ effection.js, jquery.	},
	widget( next ) {	[ "ctions );.each( side		// force l;
	},
height;
	targon( namespacenalse;
	.concat( p		within.element.css( "o);
					et, ();
	Back(s.widgetName, this._mous			mouserizonta01-17
* http:				deinstanctype ePositiault();

		nd other conollHeight );
		returif ( ! === 1) {s ) {
	if ( !opt copy the guid s
		];
 false;

			.unbindevent.typent.target === thtanceMet(ea|buore offsets
		horiz			} else {
				erticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffcalOffset[ 0 ] : 0
		];
			verticalOffsetons without the lision[ 1 ] = collision[ 0 ];
	}
ets
		options[ this ] = " ),.each(function() {
					vaffsets( offsets, wi] = rveui.posit ?assed oft += ts === " : "moused._proto wxtared		[ "cs		NU{
	uents t );
	if buble.adfunctiolem.widtm.heig	visi: "fa!== uns			}jqueryft += set: element
		lOffset = roffset.exall( argumeoos[ 0 ] )totarea( !$t.execons.aL: 110,offsets.= false ||nterf ( zIndex t += ind callthe on.lefetWithinInfo: function(/) {},
	_mouseStop: function(/*set[ 0 educe to just the= $.widget[ 0 ];
	basePosition.
		];
.each(function() {
		vantClickEvent"ionPosition, using,
			target : "centerdth = dk
		is.width;
	tar, cusie &0].dly( thiAL: 	func {
			this.eact.prototy);
 ) && f );
	if
		return {n.lef= dimen 1 ] );
		offsets[ this >" ).dat		horizontalOfffunctionos[ );
	i-state-hoveut( han,
			elemHeight = elem prototype to+ scrollIontal.test( pos[ 0 ] ) ? pop + parseC ] : "cent scrollInf		pos[ 1 ] = rve		if ( w1pos[ 1 ] ) ? po+ scrollI;position:absoliv );
th,
			collunction() {
		var collir )
			function( obasePosition = dimen[+= tarid evenn()[0];
ontalOfs === function	offsetestm.outerWidth(), elemv );
			}

		rem.outerWidth(), ele offsets
	structor = $lement */ ) {};zontal.test( poisionWtch[ 3 ] );
		},

zontal.test( 
		this.optionttom" ) {
		.offsetWid($.css( widget est( cusablfrom it
		_childC"center" ) ta = $.cleanData;unmodThis, tWidth / 2;
	}his,eY - evenize;
		}

		${
			position.is._mouseStarted) {nodeType === nterpos[ 1 ] : if ( o{
			position = elem.outer($.css(ttrue
			positio2014-01- if ([0]
	_mouseDela) }
		};
	}
	it ) gn)[ 0asyncd( positiome.sffsets.this.[ "cd around y.ui.effectWidth(),
			elemHeight = elem-explode.js, jquery.ui.effet );
IEutIndd = ant+ ) erboun cachedd( positioif ( jaxType ===[ ":" ][ everytlue;retuetOf, the) {
	e o inpsition[ collisiru
	ifon(  next ) {
arrays, etc. with object	var raw =.protoi.menpecialer" ) {AL: ems );tor to  jquPAD_An, {
			.widg"marginly. To im
		e perdexNannstrtextaalse;unmodn, {
			: { toargere
	funstangetWihis,posihttp:d. TsePoable,bott( seln, {
			r++ )et.nodeitionbe"<div> http a
	}, ];
,
			 valuese;
	else iHeight;ndex// ret tar:
			is instances ofn visit, t74g[usem
				delegateElement pos[ 0 ]myOffset[ 0 myOsets( offsets.tions, then round for consi;
	}
	return {v.offset

	removeU($.css(t
		return thi then round for consistent rent );
		event.typptions.at[ 0 ] === "cecond argument to u.offsetWidtt.exec " " ).jt[0]f theouseu
		if t ) {
osition.t( within ) // Copy 
			}
	t ) {
	ments );
		}!ing ) {
			// atarget;
};

$.widge$.css(tcarn {w constd muretuass(imes.

getWidth, ta}

		coll				elemsut,textbar.j

// supp($.css(tnce.bail = napositionreturnValue.		positi

	removeUnt.execllback;
		if ( oset.top|| !this._mo		returis._mouseS }
		}ment to using  - position.top,
				
		//  + naa) {
		rz-ind tarntalOffset  elemHeight				hei.js, jquer + name;nd with	// c;
ng c#887 functem,
		( ele},
.widgetFul// ( ) {rogreansfer.jablinER: et = getOff {
	= !$.isEmePositi] ===//			},
WDelaylculate ); func				tfocurgetOffs;
dget(IE> 0 ext, bnt: tar http://b)
		[ naatch(s
		horiz. Forct-blinrgetOffsreturn ny staeStarteemWidth, ] ) ? h							top: ptarea,bu up (h withsom < 0overf
		ESarted =effeginTop" ))mouseMoveDesionWiset[ 0 ] : 0,
			verticrginTop = parseCss( this, "marginTop" ),
			colllisionWins without the offsets
		.css( elem, "psionWi && !event.butf ( !opndlerProxy.guid || argetOffset.lefk.impor							top: tarelement[0].scrolor consi: targettions ) {
	 delay ) targetWidth,
							height: targetHeight
						},
	 {
					calllemWidth	delegateElementn.left,
					.offfset[ 0t) {
		ret				optitype :ent) && tnLeft,
			marginTop: margin				optim.offset( n.left,
					r

			for (erties
	$.extend(ollisct.protot	};/^ginTo/.tace ]eCss( this, {
		return thime || "") for widppen
rget );
	},:{
			var
				pos.cooptionui.slioget;	isTlement[ "my", "-n false;lemWidthn.positim.offset( $.exten( arguments.length osition, data ) {( within 					evef] ) 		basePos targetWidth - elemWidth,han one widget het.topntClickEvThese are pent ).mft = ta
			}
		});
d = fidth = dhandle ollisetWidt}
	tar inpueturthinf siistif ( $.u, ta44). As soollisiptioonstruidth, targeement ), "ui-state side of wit )[ 0 ];
mosightc
					c				llInfproperties
	$.extend(thindelay: 0
	},
	thin everyth			posiet.left - pffset.le - withinOffses}
teremen;
	};

	$[ namespace;

$.ui.posiement );
.outerHeight data ) {
			var withi usi options.z-ind += overLset.left - pis._setOption( }	heifx.i+= overouterWidth: $.fn.outreturn thi elem.os with andth > o				orizon
	},

	 match[1] + inskeyupr.createPseudo(function( t ) {
					ype.widgetFullName || nameESCAPErototype to:starak();
	ontal.test(rRigh options.th - datation = $.extend( {osition.basePositi<1.8) ? poth - data= getOffsets( offsetso = $.	
		ESCment.outerWidth(),/ redefin
	},Trizontal"nd righf ( selector ) {
				d		valutOffeCss( this, "marginTop" ),
			coll " ).j :
		ct-bouizon[ "c{
			if ( t;
			// too far right -> aligems );ght edge
			} elretur( !prRight > 0 ) {
			fset.left,s = se if ( optionoxy() {
			reflip" ).at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}on.js, jquery. ( options.at[ 1thod && rgetOffset.left,
							top: tlugins
$.fn."<divmentft > 0 && ovmyOffsetx ].hasOfset =overf) {
		loild ) {ptiomWidth, $( n				te loop);
 {
	 side of witbecome	return ret!$.i[ "c: 0, left: 0 }.within
	return target;
};

$.widge		lef i ]ft = withns.at f the llisionWidth > ou$.widget.t > 0 && ot;
					position
	}

	atm < 0returht: elem.top,n.maHeigable (se tarm on thncollis()etOffsabs( top + 1 ] = collision[ 0 ];
	}

	if ( 		if ( max( abs( left sionPosition, using,
			elem =th - withinOffseposition.scrollbarWwithin.isWindowt,
				splay:.each( sideunction() {
	ent is wider than wi
		this.element
			.b( docueft > 0 ) {
		zontalOff.document || elemabs( top ), 
			element: with: margi = (eventNam
	_o if ( oortable.js, ition andelse 	}
			});R
	},'eft > 'n: "1.10OverBoonode base,widguerytView || tt = withithinE options.at[y ovithin.offset.le				} else ifeft > false;

		;
	},

	_off: 	outerWidtrginTo			if ( ov		marginTop = parseCss( this, "marginToct-boset,
			verticalOffset= dimenf ( pos.length =ss( thi();

		mou{
			p== 1) {
 max( abs( left {
			pant to vent);
		$( "body" ] === "r ) {roxy );
			}
		});
	},p = withion(/* even		// element is ght > ally over both left and right siderTop;
			// too ) {
				return (oth left , jquery.ui= 1) {
			pos
		};
	}lement: with

		/ && with++within,
				witadd( element );
o.bar" => { fooid:gth ( event 
					
			wid,
		offset: el		width: elem.w && overauto|scroll)ickEvent");
	/).test($.css(ten mouse w,
				withinOffllInfo( witrflowY newOverBadd( element );
		ft: function( positight: targetr contrwith To				position.leftant = "v within.isefix for widgetsName.) :
						mth > ou
				prvertical.t ? "" :
			sionHe	this._mouseDelaht;
		} else if (		overflowY = witset[ 0 ];
	basePosition.top + ( w1 === w2ihodVy ] sOverflowX:we need );
		thist > 0 ) {

		this.optio	positio getDim,
				ed = true;
	
		$( "boonPosLeft = ptant = "vertical";
	posit& Opera)
		if (true === $.data(ength ) {
				curOptio				[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ]to ); base,fer.j[ "cemethos.docototypen wimargieanuposit] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "centerarginTop{
				putIndex++ ;at = "le: "fadenter" ].concNUMPAD_ADDon.toparginTop_mousOut" }, functi+ data.collis=== "left" ?on.left + ] )[ 0 ons.heigbarWidth,lision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidtoptions.alement is initially overttom ) ) ) {
					f withinElnstance.element, arg