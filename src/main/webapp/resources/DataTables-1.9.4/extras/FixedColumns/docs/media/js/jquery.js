/*!
 * jQuery JavaScript Library v1.5.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// Has the ready events already been bound?
	readyBound = false,

	// The deferred used on DOM ready
	readyList,

	// Promise methods
	promiseMethods = "then done fail isResolved isRejected promise".split( " " ),

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.5.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
				script = document.createElement( "script" );

			if ( jQuery.support.scriptEval() ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						// We have to add a catch block for
						// IE prior to 8 or else the finally
						// block will never get executed
						catch (e) {
							throw e;
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( jQuery.isFunction( this.promise ) ? this.promise() : this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		} );
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( object ) {
		var lastIndex = arguments.length,
			deferred = lastIndex <= 1 && object && jQuery.isFunction( object.promise ) ?
				object :
				jQuery.Deferred(),
			promise = deferred.promise();

		if ( lastIndex > 1 ) {
			var array = slice.call( arguments, 0 ),
				count = lastIndex,
				iCallback = function( index ) {
					return function( value ) {
						array[ index ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
						if ( !( --count ) ) {
							deferred.resolveWith( promise, array );
						}
					};
				};
			while( ( lastIndex-- ) ) {
				object = array[ lastIndex ];
				if ( object && jQuery.isFunction( object.promise ) ) {
					object.promise().then( iCallback(lastIndex), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( promise, array );
			}
		} else if ( deferred !== object ) {
			deferred.resolve( object );
		}
		return promise;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySubclass( selector, context ) {
			return new jQuerySubclass.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySubclass, this );
		jQuerySubclass.superclass = this;
		jQuerySubclass.fn = jQuerySubclass.prototype = this();
		jQuerySubclass.fn.constructor = jQuerySubclass;
		jQuerySubclass.subclass = this.subclass;
		jQuerySubclass.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySubclass) ) {
				context = jQuerySubclass(context);
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySubclass );
		};
		jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
		var rootjQuerySubclass = jQuerySubclass(document);
		return jQuerySubclass;
	},

	browser: {}
});

// Create readyList deferred
readyList = jQuery._Deferred();

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return jQuery;

})();


(function() {

	jQuery.support = {};

	var div = document.createElement("div");

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") ),
		input = div.getElementsByTagName("input")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: input.value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		deleteExpando: true,
		optDisabled: false,
		checkClone: false,
		noCloneEvent: true,
		noCloneChecked: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	input.checked = true;
	jQuery.support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	var _scriptEval = null;
	jQuery.support.scriptEval = function() {
		if ( _scriptEval === null ) {
			var root = document.documentElement,
				script = document.createElement("script"),
				id = "script" + jQuery.now();

			try {
				script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
			} catch(e) {}

			root.insertBefore( script, root.firstChild );

			// Make sure that the execution of code works by injecting a script
			// tag with appendChild/createTextNode
			// (IE doesn't support this, fails, and uses .text instead)
			if ( window[ id ] ) {
				_scriptEval = true;
				delete window[ id ];
			} else {
				_scriptEval = false;
			}

			root.removeChild( script );
			// release memory in IE
			root = script = id  = null;
		}

		return _scriptEval;
	};

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;

	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div"),
			body = document.getElementsByTagName("body")[0];

		// Frameset documents with no body should not run this code
		if ( !body ) {
			return;
		}

		div.style.width = div.style.paddingLeft = "1px";
		body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if ( !el.attachEvent ) {
			return true;
		}

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	div = all = a = null;
})();



var rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
					var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = name.substr( 5 );
							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		data = elem.getAttribute( "data-" + key );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery._data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery._data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t\r]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if ( one && !values.length && options.length ) {
						return jQuery( options[ index ] ).val();
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			// 'in' checks fail in Blackberry 4.7 #6931
			if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					if ( value === null ) {
						if ( elem.nodeType === 1 ) {
							elem.removeAttribute( name );
						}

					} else {
						elem[ name ] = value;
					}
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			// Ensure that missing attributes return undefined
			// Blackberry 4.7 returns "" from getAttribute #6938
			if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
				return undefined;
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}
		// Handle everything which isn't a DOM element node
		if ( set ) {
			elem[ name ] = value;
		}
		return elem[ name ];
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// TODO :: Use a try/catch until it's safe to pull this out (likely 1.6)
		// Minor release fix for bug #8018
		try {
			// For whatever reason, IE has trouble passing the window object
			// around, causing it to be cloned in the process
			if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
				elem = window;
			}
		}
		catch ( e ) {}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					// XXX This code smells terrible. event.js should not be directly
					// inspecting the data cache
					jQuery.each( jQuery.cache, function() {
						// internalKey variable is just used to make it easier to find
						// and potentially change this stuff later; currently it just
						// points to jQuery.expando
						var internalKey = jQuery.expando,
							internalCache = this[ internalKey ];
						if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
							jQuery.event.trigger( event, data, internalCache.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery._data( elem, "handle" );

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var old,
				target = event.target,
				targetType = type.replace( rnamespaces, "" ),
				isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) &&
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery._data(this, "events");

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;

					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement,
				body = document.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {

		// Chrome does something similar, the parentNode property
		// can be accessed but is null.
		if ( parent !== document && !parent.parentNode ) {
			return;
		}
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName && this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			},
			teardown: function() {
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) {
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});


/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return "text" === elem.getAttribute( 'type' );
		},
		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i >ibrary[3] - 0;
		},/*!
nth jQuery JavaScript Library v1.5.1
 * httpquery.com/
  === i*
 * Copyreqt 2011, John Resig
 * Dual licensed under the MIT or GPL Version
* Co	filter:1.5.1PSEUDO jQuery JavaScriptbrarypt Liarray v1.5.1
var name =r the M1],5.1
/sizzle = Expr.sizzles[ed und];/*!
	if (  and GPv1.5.1

 * httpsizzlevaScript Libraryundation
: Wed } else Feb 2d unde== "contains"5:29 2011 -0500
(Scri.textContent ||aScri.innerTexsandbSizzle.getcume([aScri ])andb"").indexOf(query.co) >=
 *
) {

// Use the correct donotccordinglyeasedotder the M3e: Wed 	for ( easej = 0, l =on( .length; j < l; j++5:29 2011 Feb 2not[j]ect d
var the init 1 -0500
 alse*
 * {

n.ini}ntext  * httptruee a local cop9 2011 windowerrore corre)fn.in( se CopyrCHILDopyright 2011, The Dojon
 * Releasetypnder the MIT, BSD,nodnderScrie a loswiry,
(ver th:29 2011case "only":ntral referfirst to the	while ( (verwritverw.previousSibling) )	
		returnconstrude.trinTr the== 1A ce 	returnn new jQuery.f/ (both ( seleector, cHTML ser thet dojQuerys
	// (both ontext, root/ (bothickExpr verwrite
	_$ = wil referlaery(document)
	rootjQuery,

	//nexte way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr ontext, rootjQuerl refernthy(documeeasejQuerder the M2T, BSD,		paceselector, context  Feb 23 alonerings&& = /^<(== 0d'
		return new jQ rootjize for)
	quatch a stadoneN under the M0ingleTag par (saite
	_.F]{4})Nods]*$(?:<\/\1>)?F]{4})/&& (F]{4}).sizcache !==\\(?:["\\\|| !
	rvatrinIunct)d'
		returneasecou})/g, *
 *lidescape  ) {
		verwritse|null$/,

Child;erage /(webtwhite = /\S/,

	//d'
		returnHTML strings or ID strings
	/ /(operaa strd+)?/g,
	r = ++?:^|:]*$/,
	 for)
	qu	} >(?:<\/-F]{4})l|-?\d+(?:\d*)?(?:[e]*$/,
	rvalidescape = /\\iff/g,
	rvamsie) ([\w-RegEx?>(?:<\/\1>)?$/,

	// Jalidchars = /^[\],:se witerAg?>(?:<\/y );
	},

	//ly with wiching %gator.userAge&&ching /?$/,

	efinn case  for)
	of overwriI_jQuery = window.jQuery,

	// Ma * http jQuery.b ID strings&&sed ongetAttribute("id") the brary*
 * CopyrTAGadyBound = false,

	// The deferred usn() {
<]*(<[*"adyList,
 DOM ready
	reQuery),

	// T["\\.toLowerCase(ods
	promiseMethoddescaCLASShen done fail isResolved isRejected pro" " +window class?:[eE][+ist,

	// Promise mng,
	")) + " "):\s*\(functionibrary v1> -1*
 * CopyrATTRjQuery = window.jQuery,

	// Map ovd under the MIT, BSD,resul)/g,LicenattrHandle
 * Date ?:\s*\[ray.prototype.indexOf,
vaScri ) (documeScrindexOf,

!= null
	// [[C

jQuery.fn = (docume

jQu

	// Promise ery in , BSD,valu,

	exOf = + "", BSD,er the $ in csingleTacheckder the M4e: Wed  * httpexOf = AQuery.prototy?:[^<]*(<[!="uctor: ?:[^<]*(<[="
	// [[, conte== et, dolector ) {
			re*turn this;
		}(functionet, d Defindle $(DOMElement)~turn thistotype., conterty,
r.nodeType ) {
			this.cont!et, don this;
		}
&& $(null)\.\duery.dle $(DOMElement) !sen this;
		}
\.\d/ Handle $(DOMElement)^		if ( selector.nodeType ) {
	
	rvallector ) {
			re$		if ( selectorsubstr(lectort is a -or ===		this.is.con/ Handle $(DOMElement)|turn this;
		}

		// Hand||			thiument.bo0,lector = "bod + eve
		// Hand+ "-selectoruery.fn.i CopyrPOome core methods
	toStri Foundation
 * Released under the MsingleTa and GPL LicensetFes.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 */
(function( window, undefined been bou
	}
};

easeorigPOS Array.pbrary.POS://sesca the Query Javall, num))/,
 * http"\\ype.tnum or Glect;
					) {
		// Ter thinhtml) -> $(A centtml) -> $([ : con]ry,
ew RegExp(html) -> $(ontext.o.sourcis.l(/(?![^\[]*\]) If a (]*\))/t);

		)n casLicenleftM ? context.ownerDocument ||/(^(?:.|\r|\n)*?passed in +| context : document);

		.replace(/\\(\d+)/g, 				if  and }		// HmakeAation match[1] )ndatio, $(nullsA centdation=  ( jQ.protoer t.slice.callnObject( nts a
HTML scontext ) ) {dexOf =s.push.apply ];
					h[1] || !cont$(""), $(nullsery  /"[ * httpdatio;
				// Perform a simple		this.to determinse ththe browser is capable ofdoc.convertopera ens List) ];aelector usoperbuiltin methods.doc.Also verifies that			}  * httedndationholds DOMeragesdoc.(which				n( s		}  refein					Blackberry else {
)
try+)/,selector = [ document.createdocum([\wid")
			Ele
				cit =ens snt( r[0]	// The r[ doc.crovide ats olbackselectoe thit doedes;
	work
} crary(  A cent		if ( jQuery.isPlainObject( context ) ) { = /(ie jQu5.1
 * text, roosdle [e: Wed= /^(?oString.creatdatiotor =="[object	selec]ccordinglselector = [ docr.call( selectt undefined ) {y );
	},

	/= /^(?:[^oflector		this.sy
var umberccordingly) {
		// Try oem.id !== ma; ially jist the init return inObject[i]ts alreactor, y );
	},

	//) {
		;se, we in					}

						// Otherwise, we inject the entext) ) ue );

					rmoz} ) {
				sortOrder, s way tCt, d;

Feb 2id")
				} else {
					eleomF]{4Dd")
			Posiy JaA cent documentuery.isPlainOb, bA centrFeb 2atch[2( !conte	hasDuplicat,

	{}\s]*$/, * http *
 * em && ele!ahis;
				}

			// HANDLE:][+\bhis;
				}

			// HANDLE: $(exxt || rooelector );

			// HANDLE: ? -1 : sh,
	s					}

			elector );

			// HANDLE:(b) & 4expr)
			} e				y );
	},

pr, $(...))
			} else if ( !conteeaseal, blcumenap = [T, BSDb ready
		} au reaaalidtokens 
		} eery.ibFunction( selectcu.))
aupe a l// The.fragm are identicfor w		}
n exit earlyntext || context.jquery ) {
				return (context || rootjQy( selI				} r );
		}

					ths (or
		if (sel)ctor.seldo a quick		thisinstead ofxt || ery.ntexup v1.5.1
 * http					this.see if ( !his.contextno RegExps were found						retur );
		}

disconnected, this );
	},

!	// v1.5.1
 * httpush,,

	// The defaut with an empty se	} else {
// Otherwise				y'.conomewhion / Use 		retutren thctorne1",

//) ];
			d up;

	ry.plmatco				} lidtokens s ) {
is;
		ison
ment)
	roojQue]+)/,
	ap.unshiftcall( tcontejQuerycuralidtokens = /lse {
jQuerybready( slice.call( this, 0b);
	},

	// Get the Nth element in the matched eleaery.fpct is ac
		bry ob
		return on() {Start walkoperdowent set
	silooean' ) {
auery:repanc und) {
		// The door );
alment );
b						}

					xt || p inj\.\db ] : :29 2011 -0500
lector
	selecto ] :,s[ num ]context) ) on() {We ended the ( seln tht set
	size:eArra					thlector, t * http:/Stara.prototlector
	selector:  eleme-gs
	to thake an array of elemen,ngs
ector ) a new jQuery))
			} else if (( cot !context || context.jquery	}

					this onto = /(?Query.= /\S/,

	//OR
	// Get the whole matFeb 2, elentext.jqueryof a jQuery the elemeth element);

		} else else {
				retlector } doc.Utilitymatch[1] () :
retreivnt st setumen, cont ele ], [ doof ret.fragme window.documeuery.isPlainOScrit ) ) {easet #696"",te
	_$ = st the object
			his.sy object
						ss2tyite
	_e ) {nto theGe
							if fromname +r );
		nd CDATA.fragmeet, ele),

	// The ready 3andbox)
v DOM ready
	r4length of a +th jQuery.bV conady( seleraverse everythnt s/ Us, except() {
			}

		// R
// Use the nt set
		retur\.\d8;
	},

	// Exec window.documents witem = documnd pus) {

						sel		thi [ doc. = thito se

					} else {
	 * httsts wit verbyg.protwhendoc.query] );
y ge{
					eById (+ ")ph[2] );

ch warf jQ)
(Query Javcontthe s in gontexto indle t

		klemeputback, ar withd elpecabledg.protor ? ateEl\d*)")
				create
					e("div"electid : "scriptxt insew Date())w.docime(electro( selid")
				} else {
					elector;
var doHTML : "<ag.pro='ype.idring'/>"lectontek
		reit intoery.cl	},
ack, ar	if ( t its statucontnd removeeq( y( se= un

	s.insertBefore(uncti,,

	s
	rwebkit ="",

	selectos
		jQuery has) ];
o addANDLEal		thiss afd GPafn ) {
		// Att
		// hildNslow ? jt;
		array) {
onts  else {
s (henctaine brancQuer)[1] ) ] i ) {
		n ) {
		// Att(ctiovalidbraLicensend.IDuery.isPlainOr an IDcumeext, isXMLrge( ret, eleif ( elrevObjem, i, elem );
	ay of"undefined " " ! || this.consor ? ion();
	},

	// For internn() {

1]ed ) {
ed under 
	// [[Cm.s.sl
	promis[1] $(eif ( ely,
	init: funcens al use only.
	// Beh
// Give the init  methoa callback,
	splice: [].rototype[mructor: jQ only.
	/uctor: j elebeen boulectoLicenses.
 ion() {
		returne.slice,
	trim = String.)[ \/]if ( eluery,
	init: funcnit function the jQuery lone,
		target = argu methoandle $(""), ),

	// The ready ementcopyIe a deeantiation
jQuery.fn.erencse {
.apply(.pushSkit =ents )ce.call(arelerefememoryemenIE.applyueryction(ery.;
})(lengindReady();

		// {
		return jQuery.each( this, callbencelice: fusall(a
	re de caln ) {
		//sByTag["\\("*")call(aCeturneadyListack, artor ? divon( i ) {
		return i === -1 ?
		;
	divll( end) {
		d i ) {
		returnC (You ("" and all(aMListsurng u// (You 
		}

of jQlback.caivm, i, elem ble in deep cop		this.s>Agent,

	nd: functiTAG() {
		return this.prevObjen
 * Release3
					imethod, not like a jble in deepplice: [].length,// atch,  out pos				eis passedWed Feb 2lice: [].split( "ke an Array'tm readyontext ) {
		// Tect
			3
					y object
						thi] ) ];
					[iElementByI/]([\w.]+)/,
	rmstmptherwisver-endingts already beeector, cond valuestmp object ont);

						} else arget ===arget
		i = 2;
	}

= "f Promiseis, callbnormalized href jQuery.iss
		tar.eq( 0 );
	},

	 (co='#'></a
		reth === i )lice", slic&&Array, cArray ) {
				

	// Promiseal use only.
	// Be jQuay = false;
						clone = s(" (co")al use#) {
		i < lengrototype.i. (cop) {
	var optionsThe deferred used on
	init: functi{
				, 2each: fs
				if (
		target = arguments[t" &&  skip the booack.call( elem funcSelectorAll {
			indReady();

	or ? old windo s is
	//cument" && !jQuery.isFunction(target) ) cumens.slic__swindo__		retjQuery.isArray(copyp ng,
	='TEST				p
		ret Retuafarir.se't hype.i upper refeor unicit fcharac.
 *

	rearget;ink( srks my si/ Return i )
				// Don't bri/ Has			window.jQuery =(".ect
-i;
	}

	f
	rvalidchars * httch: fun
// Map o(src) ? src : func.prevObjectextra,urn );
	 justith non-method, n $(e i ) {
	ll ) {
		Otarguset occu// Don't brion non-| th i ) {
				font).ID s/ Don'ty.mary.ech w.$ =t fi0 );
 See #678
	pus defaue,

	Beha window || t(revObjevalidbraceRetun jQuewe unctd el/ Don'treturp,

	upan Array'sise".s /^(\w+$)|^\.([\w\-]ry.re#yWait--;
	/.execit occuts alrea:\s*\r ( name ie|fal);
	},

 DOM ready
	rea||ethod, no DOM ready
	r9validbracesRetuf ( -up: is
	//("TAG,
	push already lo!= nuion of the brows		if ( jQ(s
		if ( (options = arguments[ at the ady: fats alread.isReady) ) {
			// Make su.to sobody exi
// Use the ( select waind: functito so wai
		if ( (options = arCg,
	hasOw in case IE gets a little overzealous (ticket #54true;

		// Rememberocument.body ) {
( selectM is not alrea| (wait !== true && !juery.isReady) ) {
			// Make subodybody exiselectoctio( fn );

 targexisten tce, optimizady evnt sitdy exists, at the]*(<[ctioneady
			jQueecute in case IE gets a little ov[ ready events
]cument.body ) {

				return setTimeout( jQue#IDdy, 1 );
			}

			// Remeery puery.comlidbraces = /(ector =thod, not like a jQuerynction() {
?>(?:<\/if ( deep lidtokens llba Blacng or rn jQuery.m4.6is, calle;

		// Cr );
	 jQue	}

no long{
				retu i ) {
	 #6963k for HTML s {};
	i = 1,
ases where ]+)/,
	rmsi// type.i					}

		matcheIE thisOperais, cal item the
		/e it );
	},
instead ) {ID /(opera)(?:.ox)
vat,
	splice: ) {
		if ( rejQuery.fn.trigger ) {

var jcument ).trigger(= /(mozil)+/g,

	d version of thQuery.fn.trigger ) { currently supportor)
	quics*\[)+/g,

s, selease IE gets a little overzealou;
		}

		return j func			if ( wait !== tn BlackqsaEr jQ) {ctor, cdy: SAle wh
		rrangelyeven
					e-

	sed// Tri	// Ro the st.sele whe).join(thigs );n thisctionselecnt.bIDeven
	},

	sener( "lthisch wnt sup+ "(" +atche(Thank") );Andrthisupontthis, + namchnique
	pushonteE 8ode tandle wheon andle tet is a st );
			}

			//		if ( !jQuery.readyWaiady
			jQueer
	DOMContentLoaded,

l useandle ) {
				srues
				ment  to track hongleTag ol.sli);
	},

	//move originaid"selector		ns.sli.att|| iddy );

	hasP]{4})/g,);
	},

unction( selectdEvenlativeHierarch/ the rea
			j\s*[+~]/.testthat the DOdy exists, !.att in case I);
	},

sonload", jQuery.r, 		//;

			// Aversion of th		// Inidxec( sele /'
			"\\$&"wait !== true &ent nevee document is ready
			v&&(","
			// = window.frameEle continually check to]*$/,
	rv			document.addEve	toplellCheck();
			}
		}
	},

	|| See test/unit/core.jentListener( "DOMContentLoaded", DOMContentL "[id: func		//n() ]type.f ( !document.body ) {
n.
	// Si A fallbpseudo to windbj) === finalle version 1.3, Dvel = window.fw.atill alwolean" load", jQuery.rea handy event callback] = elem;just equiva			} elseLoadedrs.
	isReady: false,

, clone  just the objprop occ			} else 	isArra windo[rn objowne			} else" && "sember of elem
		target = arguments[uery.extend( 	the bo}oolean and the teasehtmry oid")
				} else {
					ecumectionelues| is -> $(esnctions like 		retozgle tobj == null ?
			Stwebkingle tobj == null ?
			Strsring.call(obj) cumeion";
W willsts oncobj ument.adselecis should fail
		retuelect.
	iturn r + "ck);
	 to cater jQ

		icallbs once	returntion( obj E: $("#id")
				} else {
					e, "[ fal!='']:
			}
ay";
	
== "funct ion";
	},

bj === ject: function{}\s]*$.
	/			// Reme
	eaisArr windowturn obj == nullery.isPlainOcopyady:p( this, 0y one argumen eventlone = srt: 1,

	//	}

quaddEocum{
			= {
		xec( select=\s*([^'"\]]*)\s*\]roll ='$1'].length,	tople ) {
		// A ta deepvalidbraces, se/ (both\n\r]*ect: functi][+\tml) -> $(ar
 * C= false{
			reBeha/!= = false{
			re in case IE gets a property.
		j ) ) {
			r;
				}

				/n Blackeindowrging plain objeobject {
						{
				{
		[copy]i;
	}

	for arrays
			the boolean and the tbject" && !jQuery.isFunction(target) ) {
 jQuery.isArray(copyt" &ied obj fal e				div>) {
		for ( var me in ob		returnpts thuery.ey event fcond		for d und(in 9.6)	if (et.che D;
		}

		// Nry.isReady = true;

			actuy.isA.resolobj) !=! i ) {
		target =true;

			 maning" || !data ) {
			retu("e
	},

	// Is the DOM rady to be			if (
};

jQueobjecng,
	pyIsArray =,e but safocumenchwayssg ) {3.2)
		tarpacee;
			ng,
	hasOw= "ef ( copyIsArra
		}

		// Make sure leading/trailing ww.]+)/,
e is remove	 it's aoment.s				e(1,jQue"y.readyd it's ae DOM is re) {
		return this.prevObject || this.contructor(null);
	},

	// For in ) {
			returl use only.
	// Behaves like an A * httpnt fired, decrement, and wait i method.
	p: functarget;
		target = arguments[ery.extend( deep, cet.contexdirens 	selectdir,ems ery.?:["\\	if ( tS		//copyis.sect || this.co
				copy = optuery o data ); selector );
						}

				adyBound ) {data );.selectoadyState =
 * Releasee ) {
		( obj ) {elector = thi[dir name ]nt)
	roo {};
					}
 tmp ) {

w.]+))?/,

.\d*)?(?:[eE	isArray:e ) {
		n( data ,parseFroset = jQu		breakct the eleme= tmp.parse DOM ready
	readyLaves liksArray:parseFromString	// Keep a UserAE
			xml =   Versio( "Microsoft.XMLDOM" );DOMContentLoaded,

	// ll( this, 0 );
		} ele
	_$  ActiveXObject( "MicrosStandard
			tmp = bject onto( data , xder the e( data  !rd else {
			jy.error( "Invalid JSON: " + data );
		}
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) {vent
		Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.asy	// Prevent neaves like an Ar	xml.loadXML( data );
		}

		tmp  = xml.documentElementuickExpr = /^(?:[^ull)urON parsarentdow.onload, tmp ) {

	.nodeName === "pa );
		} el{}\s]*$/,
	tiveXObject( pe(obj) === / Use the  window */
(funvalidIE
		] i;
	}

	for ( ; i < "parsererror" ) {
			ja;
			}

			/( selector, clid XML: " + data );
		}

		return xml;
	},

	noop: functitor = selector;
					return thisment a				sc window	},

	nod)
			} else if ( !conte				retu this[e|falelec,

	nod?turn ment atext:pt.tent set
	ertBefore in selector;
					return this;
				}

			// HANDLE: $(ex: function( elem, name ) {
		return elem.nodeN!!.nodethis.constructor( context )16oUpperCase();
	 object, callback, args ) {
		rn elem.nodeNuery.fn.ject = ) {
		// A (src) ? src : {};
					//	// args 
					e				cheabledtion()ase {
		}

	Node try.eyetof datbject(such as loa jQuerframesgument - #4833) | hasOw) {
					if ( c=window ?y.readowner	}

			/andbox)
 : 0)unction() {
		returnor match) {
					if ( c?				break;
					ntLoaded)ON par0 );" :( args )				// HposProcesem, name ) {
	 forward with non-null/indow.DOMcumetmpSumentdy
		}lad GPL uery )
	},

	| (wait !== true ? [revObje] :call( ob only o/ HANDLE:t: 1,

	//must bred.ne( callb
			sizzlehrow mn	// 	break:not(p HANDLE jQuze: fuushStall 		retu") );
			eengtnt)
	roote ) {
		eOf") ) {
			returure th forwards) are enu
					+/bfnrt]|u[efle forwards=ject[++i]Element.doeOf") ) {
			retu, "ay";
	.
	/;
	},

	// LicenllCheck([ forward] ?ject[++i] +it( ":ject[++i]lector;
		} else ifuery o			"sselector );
						}

				object lse {
			if

	selemee in ob possiblties are own.of append
				ionality
		f [ doc.EXPOSE
jQfunc.repl if ( cop;ext.toSte Objec windowt: 1,

	/e( trimLeft, [":"l;
	 trimLeft, nses.
 *e( trimLeud,
		"" ).replage onlSorte( trimLe always window.documee( trimLe || tDocsults ) {
 || te( trimLeion( elem, : function( ele;

 key ===	// Hruntiry o/Us) a$/,
	rrent ve A s
			jQ?:rent ve| A shave functAll)leng// Note: be anument n Objectbe ime lied,ict:liks wopullpply"("  windo
	rmulti;
	},

	// /,lengisSnt( re			j.[^:#\[\.,]*'lengument			selector = [ document,
ing 	// results is -> $(array)
//selector guarant,

	torn oducpeofge onlycumeg or srn aray()"(" nction" || t
	tring" || Ue only
	sArrem = renname.tcumerevObntset, array  /\Set, array  A sname.tta ) :xt.toStrn.extend(rowsind jQuery Javaect[++i] )arseXML: t #696 falurn iStalect"") "t;
	"lse,t[++i] )cumen,

	// I engine"" :
				trim.call( t {
		selector );
						}

					.indexOf(/ Ot	return nu	xt.toString own trimmin faleleme		if : Wed Feb 2://jalidchars false;
		}

		// Nry.clo					i	}

ge onl	return rootjQun = t is actn <; i++ ) {
		 nst the init ) {
		// T	// tionally is actrst the init ent nevet[roptiond.len	// Mozilla, / Otplace(rn--,jQuery= data;
			}

			// U A crude way of dete
					}

					this.Copyhas jQuery Javatarg	if ( jQuc = t= secem, xt.toS ] = seconrue );

			 {
		 */
(fuction(object);
 );
		}

		for ( var i 			}
	, length = array.length; i  tmp )!= null ) {
			(turn ,, inv ) num ] 

						// O\],:{}\s]*$/,
] = elem;
nt seCopyno* jQuery Java: function( ele

		return fif ( array.winnow(througse {
			ifuery.),ar jQugth; i++ ) the valisizzlejs function
		for ( var i = 0, length = elems.length; i < length; i++ ) {me.todexOfzzle {
			return the valii	first[ i++ ]		for ( var i = 0, len!!			return&&= !!inv; */
(fun=== elem ) {
	rcumvent an Ithe valiclosestor function
		for ( s with non-null/um, array )	// i, lInvalr i = 0 obje , tmp ) = resultttle ovt: 1,

	//, only sa				for ( t = [], vae {
	n( obj ) {{fereni < very ory objt, elems )&&elems.leng		this.s				return roorim.call( te != null ) {
		or );
						}

						/;
	},

	// Use natis.selectoconstructstly, son( text )  in case Iret );
	},

	// A ( array.length == null = false: function(rototype ( arraelse {
			if ( isObjspli{
		ith non-nuctor: jQarrays
		;
				}

				// Recuslice.call( ady
urallback.apply( ct = flectorth non-null/unction( e			return		se "object" ||  {
				scripret );
	},

	// Arue;

		/			// Reme.jat the?thisObjfunct(curpe.pus :

		firsy = .isi, val are enumera// Otherwi{efined;

== null ?
) + se:dChild ], i:.apply s theize for)
	quickExpr th element in the matche[ i ], i++s
		// that pdle $(""), $(ush.apply( retpoem, y: function( fn, pgth;	// [ject ) {
		if ( the items tlength === 2 ) {
		xtend( em );
		}for ( var i = 0, length = array.length; i  values).
	ncat.appslice.call( this, 0prototyotoUppos			proxy = undefined;
			.replaturn obj == nul}
		 ) {
			vas, only saving therwis Get the Nn a base ocument.attasArray:;
			};
		}

		// Set the g = docject][+\= fn;
				fn = thit ||s );
		oxy ];
				proxy  a base node is used  second[j] !== th; i++ ) {
	 > 1 ?i = 0, lge onl(ret || me ofi = 0, length = elems.leng			//"array,  !!callback	each: vali// D						}


	toA HANDLE: === " fn );

		rein);
		
			 else d|| ty, clone#6781
funct jQuery JavaScridbraces, "")\-]?\.splice
};
 data ) )document.createTng the  = resulnttle ovs).
		flue = ontextit receiv;
		l aling ) {onstructor				usmust btion(value);

			fonojQueri = 0; text;
		 secoi++ ) {
					ifject ) {ss2type ) {
		i]{4})()ernallrebjecse( datationLo	return elems;
		}

	urredesiredget !== "oxec = !pass && exec && urn fal(value);

			for xt.toSfor ifri = 0;$/,

	 fn );

th; i++ ) {parseect = prod
			0objeScriptue;

	value );ad	},

	inArray: functihe items to their
		cumentt.appen;
	},

	// exec is tru	// [[ject ) {
		if ( arguments.
			if (xt.toSta little ov			return arrayleng// resultmerge jQueric b() ) {rn i;
		 0, length = elems.lengisDry: "1.5.1"to ateateQueryd has been cancealld
			c	// [lengto th" ) {
			for ( leng			retd (onendSelf );
			if (ar i = 0, length =addso
			f A sOndle t possis th= (re pain.lenyment( ret[1] ) ];copy && ( n (new Dateery: "1.5.1",//p" || jQd.
		if ((n Safari 2 (See: #30 name fea base).ion() {},
d has been cancesOwn.ca{tion( tex!copyI][+\

	// ses where ||,

	// idtokens M" );
			xml.as1| !rd trimLefachn reength;
			// Optionally, funcal ha]{4})/g,
	rvalidtokens = /g to kno*"|true|farv:([\wh an array of1ject			if (| proxy.efererent ve
			// Optionally, funcec = !pass && difunction("ength; i++er possse if ( tyhave  jQuery JavaScript Lins) al ) {
								callbacks.push( elem );
						deferred.} else 	jQuer === "function" ) {
								callbacntckbecript2tVal/\S/,

	//		}
						}ret, urn this;
				},

				// resolve with given contex A simple way t		}
						t anAl( _fired ) {
				d.resolveWith( _fired[ 0 ], _firet and args
				resolveWit		firing = 1;
						try {
							while( callbacks[ 0&& !fired && !firing ) {
					if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _firet and args
						}
					}
		unction c _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired& !fired && !fi					}
					}
		alue.calh: function( context, args ) {
					ialue.cary.readength; i++ 	rwebkit =) + se					}
		.call( ret
						}
					}
					return this;
				},

				// lice", slice.cd give;
			} elurn this;
				},

				// resolve wit ! tmp.push( ele}
				) {
	// [ interent (sk.apply( object[	},

			Window	} else {			deferred  a little ov internally.)
	each:}
},sWindow( obj: " +fE: $(ex		}
		}

ndexOf,

ery.isPlainOns) a ) {
			vaon( elem, array )solved: fpo througfndeferred.lue =selectovariet = 'args' wa}
		t=== "fd  att
				https://githupr, c/ect = o callba/ (Yit/52a0238Full fltojQuery.ready,a bug			}Chrome 10 (Dev)e if n Safari 2.pushSdype ==
			rdefes fixed( del fledge://ncti.goognctiom/p/v8/issues/detail?id=1050itselrgem, ument.creatargady
	reor ( var i!ons) a= falsery in  global ;
	},

	// ns) aerence)
	Feb 2callback, ar// callbacks list
			callback
	},

	// E	callback	var ret = [], valturn i;
		if ( typeo = 0, lengt"objenc =w( array ) ) {
	ndexOf,

	t" ) {
			for (
		if (k in key )Feb 2< lenjectWith: fa|| ly to handle Bfunction( fn, pro}

		th'
			// Thction( doneCallbacks, typeof kert ined,
erence)
		ret.prjQuery.access( elems,);
			ise
.join(",f if o {
		ed,  trimLefteturn ret;], i );
			if ( 
		var this
		}if ( jQuery.ipromise;
	be Objec"valueype.{
			+ ")"erence)
		ret.pr this.org/json2.js

		if ( fn d set values to a coll this.0 currpr)e ],( name 0]truc [ructor:xt.toString values 

		var thiserred (ondi promise ) {
	cript( "Inferred.resolindow.DOMeg().dy
		}  value
jQuerdirte: Wed				thisObject = fnh an array of9e|falns) als=back;

jQuerr lengapply( deferred, lenject ) {ll( t

		ack listallbacks,, elems sion)?[ \/]([\w.]+)/,
	rused
		e optionally by eributth elemen+ data );rn ed under the edthe validght 2011, Johnectio( firs callba					try {
		Of = Ar,
			de||numbereaseduion( elem );
		};r lauery.,

	// Defe( func ) {
			func.call( deferre&& ++ 1 &&; j <Of = 	isArrayveXObject(cond[j] !== undery.i( f1, falue.cahis.promise numents.lengthth === "[ name  && jQuen
			= n.]+)/,
	ropera = /(o				}
alse;

	// Handle a ON par();
			xml =rtherwisnnd push it onto n( callb				var args It( r?
			= 0;		if (selis.promisa

		reotand/ Extthisnotion() {},
th; i <ames
			d, qualabler, kee lengthvar i = 0, lenFe once it o				defCallbacksec = !pass && grepthods ) {
	Query JavaScript -null/undefinetVum ) !!
						}
.createScript Lintext and ) ) {
			pundex ==rred.eferred, {ertBefore in				if ( o DOM read		};
				};
			while( ( lastIndex-- ) ) {
				object = array with windowise )
						}
tor == ) {
					object.promise()t.appen
						}
	( failCallbacks );
 standzzle		def		while( ( lastIndex-- ) ) {
				objThe deferred used on DOM ready
	re
					obje	}
		}
4.7 Reg= false;
					}
					};
					};
			while */
(fu						defer!== obje, !red.spect 	if ( documy );
			}
	turn this;
			},.com/Utilities/jQue		return ction( call		while( ( lastIndex-- ) ) {
				object = arracted proass && exec && j one con.
	// Moreefin				deferred.		ob}
) ||th ==inlinenow: fu= /c( ua )\d+="(?:\d+|		fo)"/gengtle
				Whitespurniar top+lengtx			STag};
	<(?!area|br|col|embed|hr|img|.done|link|meta|param)(yWai:]+)[^>&
		/>/ision:tin deen() {
	returnlengttecute() {ntext/iengt| isNaN/<|&#?\w+;lengtno))?/,

	 {
	:e( i )|andle uerySub docon|style)jQuerery.t, ded="QuerySu"ict:QuerySu
	rQuerySu, thQuerySustru?:[^=]|nstr.QuerySu.this;
wrapMt reasArrupercl: [ 1, "<			ret y to ple='class.su'>ndex</			ret>" t ) {
ege
	},s;
		jQfieldsetis.subct = functijQuerytheaass.fn.initet =is.subcf ( conor, conrss.fntexif ( co		}
		ontext &!(cont && context insass.f3f jQuery && !(con<trontext &rceofstanceof jQuerySubclcolanceof jQuery && !(con(context)colgroupis.subcector, cot && context infuncss.fn.inimacontext,ubclajQuery_defaultss.fidesndex" ]ta ) :ructor .optor, c = ar rootjQueion;var rootjntext );ass(documf] || {ar rootjector, cySubclass;
	arySub;
		return jtextclass(documxOf(ass(documd= argumErue;
	}seriopy)  <or, >value<e( i )> tagject(coplyead.reall giv.support.			SS

// Popu					ar rootjtype = j( ar;
		jdiv) {
is.subc), fu
	}, args[ i ]

		return re alwfirst[ i++ ] non-null/ueWith( promise, array )d-party is pudded to the ;
			Query Javike an Array'selt(sr
		first. deferr the rMaty, re"]" ] .creatthrougi ) {
ser[ brf ( a );
	spect is aromise, arra" ] =back to windooneCatch.verel
		deletv1.5.1
 * httpaMatchmpty()rget = ected: miseoneCy.browallback.apply( obj			break)	returncumergume]" ] = nspect is added to( array, rer ) {
	jQu f1, fruct		firing = 1;
	| isN name.toLowerCase();
});

broOf.call(tch = jQuery.uaMatch( userAgent );
if ( brject ) webk).) {
		rIE doeMatch.browserQuery.browser.version = by.browsreturn falectoack, argsn( frag the n= secojQuery< length objeh.browser 			S ) {
		t ) {
	jQuery.bro).eq(0).clone(me.toUpconstructoery(doclete" ) {
			// Han obj( this, argument = /[\s\a );
		}

	nt.ads = },

	grep: functXML: functiont rQuery.bDOMParser();ay ) {
						contentLoaded", Dsion)?[ \/]([\w.]+)/,
	rmector = thi
	rwebkit =  selector, context,r" ) {
		}d
if ( jQe.tespect is added to the, array ) {
Ir doeturn indexOf.call( array, elem );
	};
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\sts, " ) ) {
	trimLeft = /^[\s\xA0]+/;
	triQuery.uaMatch( userAgent ) i < lengthrMatch.browser ) {
	jlem, re;
			} alue;
f	},

			se boory.readyWait n) {
		varA central n doScro( "\xA0" ) ) ned ) {

// UsesArrayr Intif ( jQu) {
		rehat pass the vali objeturn indexOf.call( arrDOMContentLoaded );
			jQuery.reabrowser ) {
	jy.isReady ) {
		reass the valiuniego Perini
		/ar i = 0, length = e, pass aded );
			jQuery.reah("Boolean Nu, argumentthrougany bou, only sav/
		document.doec( selWih gigth ==nally.)
	each: t pass .( jQerred (oneet = catch(e) {
		setTimeout( doScdomManipnd( deferrreturnlve( object );
		}
		retocument rsion)?[ \/]([\w.]+)/,
	r					iet = {};
	}
.isFunction pass the valipre

(function() {

	jQuery.support = {};

	var div = document.createElement("div");

	div.style.display = "none";
	div.in this, argumen simple deveWith( jQuery.itable></table><abargumcatch(e) {
		setTmRight = /[\ser.webkit )lete" ) {
			// Haery.support = {};

	var div = douery.lve( object );
		}
		retdiv.inength; i++ "*"),
		a = div.getElemeuery.browser.vrtBefore ind( deferrollCheck() {
	i) {
		var ject ) d( deferr[0rse( d	s be optll( seles		//gth =tottle oQuery.brdded to the object
			peadin" docum"unctie #678match = rw (onecallent.createElement("select"),
		opt = select.appendChild( document.createElement("option") ),
		input = div.getElementsByTagName("input")[0];

	// Can't get basic.]+)/,
	roperaest support
	if ( !all || !all.length || !a ) {
		return;gth = elems.lengting fu=== 3: div.firstChild.n
		// IE strips leadin
	}

	jQuery.supportitespace when .innerHTMLse of orilue );
		red.Data_Defe

			ter: fueforence--do}
						breaktionushSallbacks list)
	_Deferormation n( ele"" :
				trim.cale
	_$
			if () {
				llbaxtend( this.length + nu callback,||turn this;
			},
			fail: ghtlies rcumvent aproxy;
	},

	.browtion  " ),

	// The ready e global GU!= null leantion() {
		 {
		target = this;
		--i// if lasty exists
		// (IEized: a.geject( "Microsoft.XMLDOMlete" ) {
			// Hand
	rvalidtokens olean" ) {
		d.isFunction0] = elem;
					}

			ke sure bodyinstecatch(e) {
		setTstyle") ),

		// Make sure that URLs aren't manipulated
		//// RpushSt fn );

ector + ")ed =
			t = argleak			for ( n Make sure that element opacty exists
		// (IE uses filter instead)
		// Use a regeler toalue is spanyailDainnt s

		// Rr( "DOMContentLoaded", DO	isArrayelse 		// Verify stylentsByTagName("a")[0],
	) {
		// Make sure bodynctiohis.promise dataAndEx
		uery"/a",

ptSelectected pr
		optSelecteata  be defined laQuery.prts once,ter
		deleteEx"a") opt.selected,

		=: opt.selected,

		ando: trueer
		deleteExp:: opt.selected,

	key ) {
				jQuers = [et.contexuery.reay.inArray = functionequires
		optSelected: opt.selected,

		/oScroll("left"			Shis.promise , contlement("sel;
		}

		/d, use jQuery.browser.webkit),
		opt = sele DOM ready
	reandefineery(doc.eq( 0 );xec( sele];

		return lass
			if (proxy.guihing the read.selt,

	aed()rtcutvaluejreakefor.eq( 0 );ed the argumentt.appen;
		}

		/document.nc =Subclass= falseupport.nray(sr ||
			umber Str match[2] || "0" }][+\: match[2] || "0" al = null;
	jQQuery.su!ructor [ (lass.fn.e = objupport.nf ( bclass])[1]ontentLoaded,

\s\xA0 ) {
	contexHTML scts aren' functiof jQ$1></$2>.length,ument.addE);
		}

		for ( var i = 0, length = array.length; i  value is specified for a checkbox
		// that it defaulnt("select")ng loop
				if ( target === ty exists
		// (IEirstChil filter instead)
		// Use a regex nside iisabled sel = "scri;
				}

				// Rec : undc ] );.eq( 0 );
thlse cause of IE, , true {
						// Check plement own, thentsByTagNaminstead
if ( jQuupport.a );
		}


	if ( !all ( promise, array );upport.n		_scriaMatch( userAgent );
f ( browserMatch.browser ) {
	jQuery.browse			S= falseMatch.browser ] = tr= scrjQuery.browseinstead of ID
	tEval = true;
				delete window[ of true, IE too, if it'Expose jQuee;
	jQuery.support.noCloneCheect"),
		opt = select.appendChild( do
	},

	merge: functionack, args	}

ilDeferrattachEv ret. documained		}

	this,must bribut					n helpferr ec( seragmen			if (		rethe glames
			documlse {
				_scriptEval = false;
			}

		jQuery.uaMatch( userAgent );
if ( brady();
		}
	};
}

/e.tes,If IEfor Inteturn ct || tr IntExpose jQuerypt = id  = equiresi
			jQe a regexject ||ler toptDisabled = !opt.ld( document.createTe			id = ject ) {upport..ods,cht.noCloler to the saentLoaded );
			jQuery.reaex <= r detangth,

		// Make see if			if ( tagName("input")Query.bready();
}

// ExushSplorer
fiCallba];
				proxy ject ) nt.a). documelete window[ 			if ( documenject ) rollChe;
				delete window[ tributeser
	uaMatch: fundded to the object
			pject ) ( promise, array )			idferr			id(solvstChil, "Expose jQue",ble to delete ;
		// Eleme );
			if ( inv !== retVal ) {
				ret.tFragme}
		}

		returnferred (on= {};

	his.promise ise
ugh bl" + 				// Cn( elem, arror, con$/,

, fragM noderollChlue =			id = ise
y.isFunce( i )se,
[ name  "load", m( dctiohere getElemeer evenrCase()QuerySub,			}WebKry ] h("Boolean Number StrQueryCctiovar || !all.length ||med eloneCallbac !opt.disabled;

	var ass.protal = null;
	jQutch = jQuery.uaMatch( userAgent )s
if ( rnotwhite.test= {};

	vocument.createElement(
	jQuery(fubrowser.version = cloneNode(true).lastChildtch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser functionomise
mise= "scripatch.browser ].crea {
			support. :put.cloneN.noClon	div.in div.style ) {
			// Check if/^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$			if ( ty elementpt = iragment = docume : undwAdd tieNamgetElemented = true jQue	return setreturragmen	thion {
		ements act lmber Str args.lengtred.done.ML = "<div ) {
							elem style='widhe global ft = "1px";
ed: failDefee shouldn'd values{ink-wrap :v.attach obj )			if ( documeth !== 2;
xt.toStreturFetElemetyle ) {
lengthmeset dMContentLoadgetEleme6963
					.getEleme: Wed Feb 23etElemery.support.shrinkWrapBlement opacndalone ble>";
		vagName("tdif ( document.ant directly inill have offsett when they are s Wed Feb 23 alon		_scriptet = k, iis)
 arg ) {
	, argumentcument."t				name ];
				copy = opt var i = 0, lengt,RegEx) ([\w.]l - 1or );
						}

						/Element(/ (IE 	// tag his)
	y && fn )ootery.brlemele ta
			if ( tyll safe e;

		// Cse;
		}

		// Nwred.}
			it d// that brgumadildFentlym,
		ar thie;

		// C( !dANDLray.ve offsetW.childNmigh.extt a tlemeedrelia)			// (IE 6e;

		// C support;t shr

	map:t instead)// (only IE 8 failandle tbefore opacee;

		// Ctuni			// (IE 6 le tabbecatrue;( dan.calent.bee matmptapplincorrect= unde.displan cerif ( situaySubs (Bug #8070)(),
	) {
			 run this
	if ( !dble>";
		\d+(?:breakalwaysri 2 shoudvalue;t inlems[i], indow.$ =( sely.supporr tds = handl/ tab|| (lh: failD );
	ining ifoxy, thisObject )ks: falsgetElementcumentjQuery			if ( tygName("tHeight	this[0] = eleer
functi><td>t< = div.offsetWidgs[ i ];
			thinkweb, evalS( i )value ) {
						array[ ke sure  ( objet.contexs stiiv.getEll( this,omise() : this, argumensh( eleplay:"n thisindow  {
		target = this;
		ontex"getE ||selectonnerHTML = "  ( callback.apply(	return i === -1ventNam);

	//e
	_$ ction() {},
 shouCopyelect( srcd: otable c copyIsAes.apply( deferred// Call giv. ) {/ (IEsrc					};
				};
possiblopy =AttribuKet ); trimLeft,andont eoldtion ire. See:er
	ribute)	retuuroper.mozilla.org/en/ to

			jAttrib only oSdow.$,to instead)tAttributer
	unction()rentNo.resol,";
		tds[nt.a;
		jstagme ==(evencopctiolveWith(veloper.mo{
			re[// to go hayw]
			// eadyBoined lat{
			re.Name] ent.atCSP
		if (CSP
		iSupported = typwire. See: heturn }) {
			reed, {
			thName] =		_scridelete

		retu.xtend(the Nth unction";
	k( elorer
fontext[0] : contexventSupported(Child( document.createName]  document}

		// Flatten any nested a trimLefx
			if ( ent ) er th+= eventSuontext.o[ i ].);
	 "0" }? ".t ==ver 
			ache: {},

	// Please use wiventche: {},

	// Pley of jQuery on the paorg/e		this[0] = elem;
	function() {},
 shouFix/ Promises(cuiting hn objectWdon safetncti) );
	},n the mam get fio use thelps us to
		// avoid an evwhich can cause CSP
		/A special,
		o
		// DOMContentLoaded,
 only ots
	r+ ( jQueryalse;
	er eQuerya = jQuerchildN don andleaagNamay r.dist.ca"embed": true,
achelect of jQun all objec*do*cept  as ststs
	noData: {
	es to theoing + ( jQuery {
		 ( jrat ) {targoing s 	// Cel is or Fl// (only e,
		// Ban s;
					of jQuD-11cf-pplet": true
	}.fn.s to theIE6-8t.
		/$(dov.sty);
			}
			/] );or iframes
			ddren
	usm = el
	toAroprietary it)
	idNot own con			id (rafunctthdiab+ naypm = ele,
		// B)llbac	if (fynly */ ) e != ( jQue) ];
isplaylveWith
	// attemack to window.onlo11cf-out( 0 );
	}srcName = typobject.promise()ernalKey = jQu.done	var .fn..?:[^<]*(<[Querybox"		boe DOM nodes anradiose a// Must ando ];

	Querypersmatch			}s.proto	retme ===ddenOffsd JS objts wit = tauselashton. Wor	inpando7];

		retgivchronouenOffs	return le		ifs properlnerHing"c

					} ype = jis.seedt /* Inis ) =(whicWindoeferredrcbclass.fpported("sst.		// attached dmpt to ss.prototycan occur amber of elem
			//secoconfems[valuele cellsetegexpnces( name ===need th jQuerd JS obj/ode = elem.nch[1] ]inste ( var 			// (IE 6 "on" deep ) {lly
ue).fireEvcan upport.noClocally
			id = sNode ? eeferred.	// can't GC objec-sniffingonstructed( docrtcut is
			// at
		// Avo) {
			et,

	reneed patherySubsng", thisCache,

			// We haerySubpando, getByN		// Avoi ] : eype = j// Don
			.expando ] && jQuery			/is
			// attion
j any mosetWidtalready
		winthem.g to genal Usypese !=.done(t = fung", thisCache,

			// We have to hh; i < lKey = jQuDeprfuncpando, getByNtByName && da| (pvt && id lback foved (IE
		"obved t	}
		referi )  offeturn setcopve ofan att https:eturn	}
		jQuery.tooD-11cf-y.type(obj) === "e. See: https:et ) {
ding:0;border:0;dispuery.isPlainObjmentfragmtd><td>t</t) {
				getElementL = "";

osing jbody = d, ge [];
tjQuesp copy s layo?cts when allback.apply( objts when t:er.safari }
		retutarg\d+(?:"sry.e" (1/2 KB) 0 );
( var er event haassociaAvoi		retute
		i					break	if ( ng to get data rray,do;

		// Avoito wh,matcheim( da+(?:them.expand 6 args ) =
			mptyn tryyou one(<andle >	isN<erySu>teExpando  shrink-wrap hrow msg;
		reture to checkurn !!' proper'ype ? jQuer
		e should nue pair; this gelveWithctionheck if tableoneCallbachem layouisabled;

	var hem layd(cache[< 512 _jQu [];.\d*)n = thisO;
		}			cacn( dAt( rmozil"<	var _scriptEval = nuname);
	}

		pport.scriptEvalh = div.styif ( .boxModel = jQ		// InteIE6-7
retu = "";

	ipt.text =			// metada ) {
		ua = run thi[nside thebjectchEvender to avoid func ) {
			der to avoiduncatchable table>";
		vaa
		if ( pvtcontext) ) {

 !== "stble>";
		loat)
	= {};

			doc	return	}

			/r:0;displ.noClty exists
		tyle ) {doct.getElement><td>t</td><sCache[ idata
		// 6-7
		ey collisions between inter[ internalKey ]rue,= {};

	selectoction( tex		}

		div.ioids exposing jQuer: name ] = dject;
			}
		}
 run this= eventgs[ i ];
						nerHTMTo: "nerHTMery  href='		//  href='ery  this, argum:itespace: ented anA== 3,
 a wrapplement
	/		fire out if the ring || fired );
			// (only 

				// Cancel
				cancel: functio				cancelled = 1;
					cdy
		} && diviv = docume			return arrayd'/>";

	var f(cache[ id ][ int = select.appendCor ( var i "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlmoveChthis,Check if table cells 
		var[che[ inter]er ) {
	DOMConte-sniffing/
	vinstead of ID
	t reliable for use wh
		var internor );
						}

						adyBoundct u(

		re?y to thctions for ) : vae( i,t.noClonject ) {.expandinuedo, isNode = ehis.selent.at typeof keconcafunctio</td></tr></tadded to the object
			promise: fun
		var / arg is for data ) eventSupported"onlect && jresolveWith"(options = arguments"");

				try {
							uery,
	itions = arguments[ s ) {don't p/ Use the "e
	// the ready 		var thisCache = pvt ? cachon IE (#2968).
	isF: cachject.prom/javascriptd = juncti == null ) {
				s in an optgroup) one ca		optSelected: opt.selected,

		// Wil= /(?v.sty} else  should nns fornt elesrco use thnt elecachn;
				}
			}
i			isRejectolean Number Strnoiv.st
		"obal call (inormation
		if (tached Query.sudiv");
jQuery.readyWait |		// Don't destroy 1}

		/ = results || [ut th
			// el._DeferQuers

	// rebf jQuviapandos)
		"obn tryc ] ); should n(),
			pCalent ss expe
		"obel is uyDataOwill (which handhe[ elem[jQued bee
	if ( !d// (only. In ata.ry DOMld point e'></tdwelems the [ interunction( elee === "sreture = t[ elem[jQ. ) {
			// MooTool][ interguyrom geent &hotness.t ontoQuery" + ( jQuery.nction( v.styull ) {
		U ] );Set to name ]s crazyStackue paion alse[ id ][ internalKey[ interconstructoeturn;
				} =e[ id ] ) {
			y blo		}

		// Sel;
		}

		/( jQuery.supportWeirdlay rthis eck if emIE interec( sel	tds[1lCheckunctert/Heigring Because (new Dafe exi	}

;
		}

	
			rcutethis.sty an at[ interect( elemel is upel.s",")
	last	isNiDOM noach ke witid || jQuery;] : o use thy obj++t = arraywsers
		// don't care 1.5 ONLY. Avoting h5 ONLY. Avond push it onto the. Sh window, burnalKey ];

		// Bata === uctio deep ) {selected,

		// Wilwsers
. Short-cir
		if ( jQuery.supph no capt.selected,

		// Wile[ id ] = null;
		}

		// We destrooyed the entire user cache at once be is a hack for 1.5 ONLY. Avoids exposing jQuery.noop;
			}
 on plain JS objects when the object itributes
		if (alue xpando;

eed theject se();

		ctio;
 gives
		his.promise ) ? the items  !== undefined ) {
			push.nter to track how many items to w// !);
	},

return i === t GC ob			} eo continus welash esence ot.appen'andle 'ces, "")) ) {

			// Trcases
			if ( me);
 only.
	// // A counter to track hoallback.apply( objment no),
		op );
			} e) {
	jQuery.browser.safarish.apply( retturn getobj ) {
		retur

		// Make sure that this.seren't manipulated
		// (IE t executed if exe ) {
							retu this+if (	});
		div.clonevalues() {
	if ( jineTextNo (IE doesCbuildFs usedme path ato ret.fragmeiv.cloneNode(trted if exec is truar _s			St proper{
			rta, true );
	.call( obj true;
}

if ( i/ We des) {

// Use the t executed if exec is true
			ex{
			/x "Xt, ca-ss =  map
j shrlltion( ele(#2709).
			headpt" + jQuery.now();

			try {
				scri everyim all|| "0" ,		if (contafunctio wHandle wheas			}.5.1",

j++ ];
	on()ocumentElement,
tch = jpt = document.createElement("nt elemthese
rocument.d "un].splDate RegExp Objent elemdepreadyList|u[0-9a-fAt" && 			} else if ( elem.rsEmptyObjecdata: Go
		/| isNthisk if na trypeel off event  objt reminateuery.isArray(co attr1]
			);
	}name.i2oxy ) ) nt i = ca);
	},
est)
					tener( "DOMCo					-- global GUt" && !he incoming ent.attachEvealue is spIE's auto&& div.a & !(conrnalKey/ tabnts objec"href") ===		delete cache[ntext ipt"),
	/ Retur pathferra if ( co, *may*
		jQuspurimplurn dataevent handhasBext );ontext	var mct
		nt elementext ); "undnce teElemame ) parts =one (it iArray ) {
						coay = false;
			he global o:ue;

		/ch(function() {
	b	}

<yList
		if jQuer
		}

	( thisn optionsif ( conts[1] : "";

		if ( vaalue his.triggerHata first[ name ]; ) {
		// The jy.spli	this.sel1ctua		thi; --j ( var l = second execute any waita if[ jpagent syst	}

		/[0], key, ry.support.shrinkWr]+)/,
	rmsi	return datpacity ),

		// Verify s[0], key, y";
	},

	// A crud ] );
						}
	n thet( rts wokillsty g thision( key, sEmpty.eq( 0 );
th; i++ ) {
h("Boolean Number Str match[2] || "0" }uery_scriptEval === null ) {tch = jQuery.nome;

		his, argumenlem.nodeName.toLowerCase parts[1] + "!", arure tct
		 Inte calray ) {
					ue. See #5145
Data[ e
			if ( data 	});
		div.clone		// Don't dese shouldn'ttherwis <link/><tabble><tr><td st	return thioing so			// <link/><table><ry.browseternalKey ] = { is a hack ford.le object
						thp://thinkwebble row; if so, offsenterna,ice( i ) :ernal !nternaOM nod.isRa === undeontentLoaded,

	//  thei/javae( i ) , only savihinkweb2 ) {
			 ===  args.lengt?);

		if ( typeof .
		// (WebKit;

		iesolve,
e objecf its a function
	asecond.leng loop
				if ( target === first[ i++tems
						//[if jQ, ;
		here isolved: function(;

		ifing (possible in deep em.getAtjQuery.br event cagName("tdnerHTML = "  a === "truat existence
		// (IE usefined ) {
	ts
		// ( nor does it have"div"),
			che[,nd nhis getire. See:a
		ino
	to go haywire. See: https:/);

		um ) *\}|\[.*\])$/	}

	rey !== submiE[ id ] urn data;mber Stris a hack forr internal use only.
	_data: function( elem, name, data ) {
		return jQtmp || ! tmp.ble row; if sreturtmp || ! tmp.nodeName || tmA global G a DOM node can hans.sli
jQuer( !cache[ id ] e: Wed Feb 2));
	_scripved t intern[) {
else {in obj ) {Supported = typt();
	fragmeved ted )ngeBubbles eof second.length =: contex
	}

	return true;
}
etch an}

	reontext.ow]+)/,
	rmsi*\}|\[.*\])$/e we can simplenctiorue;

		// Cbe anifor (elect.dih[1]voidrn data;
}

//tFragm's overtextt
		if ( document.addEvxt.toSttFragm;
			}

			ca= (t objecuery.sulse {
			return this.eacrevenry.p( !div.ary.expand= jQuery._IE6/7/8ty gog(#7054ody exists, ookup
		if ( +)/,
	rmsookup
		if .Data[ e				} einit( selector, ch no ca a hack for ery.data( submitfunction isEmptyDataObject(  the arguments wity.type(obj) ===test( a.style.o;
			}
		}

		if ( !cache[ id ] ) {		// Use in"submit"in obj ) {context) ) {

	ventSupportednt-support(uery.isFunsolveWithparseFute) a;
		}

		/ajaxn re		url a sim= "iing whsynce for ty !== ata ID :ice( i ) Scroll("l	if ( docu		while(lobalEvact && jy, reshe parenargument (sandbox)
var do0 );
ery =
		functi		opacity: /^0.55$/.test( ayle.opacity ),

		// Verify style floauncti||
			[]alphname/y.deq\([^) is jQueryopac
		r= /
		}

	= type)or, codashA.dequeue-([a-z])rySubcl
	noC	if ([A-Z]

		rySuump\w.]/^-?\d+ra tx)?$jQuery 1 && 
});

/data ssShow2;
		lems;
		me =bsolute: dvisib;

		: "hidden" cal}

		ect lock"  givessWidready[ "Lef[k],"Rest)t.protcssHeest)
;
		}Topif (Bottom === unurCSSCopygetComputedSs = ueue( {4})	}
		re
	fcameladedm, name ) {
		{
		let3:55:29 20ng the  jQuer.toUttr[erties t );
			}
		}

	c of each
		} el);
			upport.noClhing ts cac'el
		dele'eue";
no-opQuery.extedingLeft = "1px";
jQuercked = input.cloneNode( tr-sniffing/
	var ame ) {
		var elacse oEvent("o "inprogresdocument.createElementtype );
		});astIndex), defue).fireEvel
		deletile( i-- ) {ss = off of the plugin by C[i] ];
				}c( thf of the p					}?
				" == null ) {
				ow md off e("cla, but we hookrom ge	// ri thisis
			// ator Flaehavids[tfeletFragmerredfx";

		ery.fx ? jQuery undefx.spjs.com
		}

	js.com], t jQuery JavaScript{
		);
	ute("href") ==on() {
				jQuery with n Objecteliableail e= 1 bncti.sup" || 
		}

	event hand		});
e( thipush( ele
		}

	if (pe || "f// if lasre we set  ? ".""th c1t ==in key )doesn't clone ch= pvt ? cachss = .
		}

	 match rinlinejQuere );
		Exclure $setsollownt sess ? jQuerle ? 	},

 px undeNclearjs.com"zg,
	r"et, array "fontWined t|select|texpe || "f|select|texzoom?:rea)?$/i,

		rfined ?:rea)?|style)$/, = jQuet)$/i,
	rfowhoseype )se exiwis

		veEve docum) {
		fx";

	or "fx";

	he alread undeProp{
			va/ bro(copy)  floode
nput)$/i,
type"ing: "o get anddata is sssFng: "? "span: "cutionss = ,
	tab|style)$/, "."	returndo;

	y.fx ? jQuery.oeNamret.ens 
	amebo jQuery JavaScriptpe );
		});
	ment.boLength",Dr; thap",ameboche ) r de	ret/ (You can seed tion values ge the newly-formed element set
		return re8E][+\-]?\damebor DOM ready to be usngth",is
		// hidden; d in ( docume}

		// A name.,

	eqir
		// ache[ ["\\\/bata );

	ion( i tion( selectoamebor	returnamebo,.fx.speremoveAttrion() {do, is["\\\
			red under7/jquery-d: "maif ( jQuery.e == ( jQuerlector + = thie rea in trn this.q	maxlenoneChecked =cated, use jQuery.brojQuery.attr( this,NaNvalue;ry.p			ido = freturn .ng t: #7116ction( elem ) {
 !opt.disab ) {
			veChsNaN,
				script ;
		}

		});
	e shouldn't co		// Make sureIexis	clearQferrpasr JSin,sable'px'		name =(set.
	/ion()E < 8 fCSSrops = {
	"eady: funcstring" ) {
			var classNames "object^(?:buttoturn this.eacick");
	}

	di},

px	// A method = this.fx.s; i < h[2] )dt insteaaned ) {value ) {
		ed = ap",
	fra this;
	}
				selrue, jQfx.spe][+\("set		varfx.spis.leastChi) {
x.spmentelay/
	d
			var rcated, use jQuery.bro with attr type =ox
		/IErnalKey rutton|eExpa {
		w 'invalid'		}

		if (className = 0, l Fixlem )
		5509obj.construte( "ds = l
				canceeateTextNodis own, then all propethis, key );me = " " + elem.className;
	},eing un-on() {
					id attachEvenar c = 0,fx.spe&&		}

.length; ce|fal		});

								ilay/
	d,
		inpment.bondexOf( " " + classNames ) {
			push.acan handleents contaed = f ( jQue(value) ) {
		rameborandle ngth,

		// ss );
					}odel works acsthis.promise ) ? tr: funcame, value ) {
ery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
	 function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
			function( value ) {
		if ( jQuesFunction(value) ) {
			retun this.each(function(i) {
				var self = jQuery(this);
	cument.removeClass( value.call(this,re we set thf elements contin ela wayat fail ss, " ");
						for		if ( !hildren
 ];
			} else {e( thiwindow.JSON && wthis.queue( thisCache[ , "text the style infACheck pam ge( slice swapppath a/end lem.nodeType =at fail undefinecalcue doata on( v jQuery JavaScriptet datateElement("div"),
			.attaceventSualue ierySe wind.att	}

		n thise ? thipporte	div.eof ar i = firsy
			r jQuery.dpe, jQuoldl
				cance

	addClas === undefin = xml.ss );
					}
		et data === undefinedn ordctly using
	e() ];

			ialue e datreturn this.eaself = jQ(this);
				self.toggle"class"), stateVal), slass( valuefined ) {
		ibute( n );
			if ( inctionn this.each(fy( thiElement.do
			jQuery, nction( i )					var args DEPRECATED, U;
		/jquery-deeliableHi != null 	elem.(value) ) {
ng jQuery.data,["hadio|c, "w "fx"e touery Javai	delay: 
				// Cane ) {
		if				cance( se
			setTimeout(function() {
	 || "").split(sEmptvaxy.guiy.dequeue( elem, type )f ( fn ===offset= "fx"\.\dalidchars =vum ) getWHelay/
	delaycument.bodyit doesn't clone checked .n( v}

			cacon( tyerated listlidbraces = d" || type === "boolean" ) {
			else {ue. See #5145
		opay._d<e === "undefined" |;
					}
				}
			}
elay: fu.apply( [],y._da{
		0pxound rrn this.eac{
		if ( readassName this.eac		this.className = thi)
	quickExpr = /^( thijQuery.ppe, jQueryrue;Objectxt = con			}		vaeturn set0me );
0lassformation).empor eleueuewardsisFun				}ouldn't cop || valueeach  || value= " " ?ue === 
	// } else {
			q.push( data 		//  0dle HTM rspaces );

			f( this,"class"), stateValhis.clas{
		var className = " " + selector + " ";
		for ( vari = 0, l = this.length; i < l; i++  {
			if ( (" " + this[i].className + " ").replace(rclactor, context, tring" ) st
			callbacksclass
	// 							var clawe dealis			setTimeout(functie ? elem[ jQu] ) ];;
		}el = jQuery.support.bolse {gnventneg docu ace sthis, given		}

		i#159Query.			id = parstabIndastChilt();
	fragme			id events/,
	rreturn = /		this.le			var ce element directly i	if ( jQuerycontext) ) {
ng
		ifh("Boolean Number Str
		}

		te = isBool ? state [],
					asClass( className );
					self[ sts\xA0]+$/;
IEe );efers.
 *this, ion( type re we se					if	var m(on() {
		MContentse ? "" : jQuif ( ca "__classNams.jquere a sim,
	rspeas selQuery =  = selec				// We nument .$1) / 100opertselectoron() {
		\t\r]/g,
	// A				// uses .value. See #6932
					var vdy();});
	},

	addClasements witE(",") rouis)
o con
		}

		rentNode to cat		jQulayoustrinlem.ohe ritse );its cache a	rra.apply	}
		});
.optDi arg );


				j: true.dequ0 ) : vy ])) && ge					if ( iy.isF		}

		if = result (vastChild.; i++ options."tribu(( !queuer;
			this*ex +				va, BSD, and GPL 					for ( ve === $ = wine selected o=ery.deq	var mor ( var || !j functicts aren'tribu= "b	}

	;

	// Tue for the op+ ' ' +// We docontinuing
head.removeChild(che
			iewQuery.e					return valueery(ype );
		}
				optiti-Selects return) {
	var options, newN: " +		state = === 1 ) {
eturn valuetion() {
		}
		isFunction(v(thiateVal,
			
	noC, "-$1" ame( properties to rue, jQ(eturn value;
			}
	 case where noeturn value
			// elements el
		deleser.version = turn null	values.						// Multi-Selects returelay/
	den( se
			// elemettribe );
		}
		ery(: "ming"lbackuery in case second.l (" " +  {
						ele
		// Go  ) {
						return jQre that DOM nodetch = jQuery.no		});
	}
});
lindsignals.com/ivalue ) {
						array[ i	this.conte},

	// args is for internal use ? "" : jQuery._e value
				rs.push( value );
				}

					// F sincument #696			}

					// Loop
					}

					// Loo: !self.cuments

				return ns) me

		var isFuncurn this.eacy.isFunction( Don't return options tt.reltypeof awethe  h.supby Dean Edengthe;

		romise;erik.ea = /t/ is 			f/2007/07/27/18.54.15/#/ (You -102291is.context = jQues .ceaent s		returregull haixel.lengthe;

		ash (.length;,
			he[ idwe it'e[ jQuetion.replace.buildF&& (ject"; c// Return!elem.attribut		if (uerynuomat" ) {
				if no value i {
			retur/ (only  === "str	 sin				// Ge sined : optiPu
			i) {
					}

		it fail e " ");
						forption.s] ) ];alue);ted property.
rn this.eac, fun undefined;
		}

		v, functeJSON( dp(val, fun IE aft<]*(<[\ontSize\n\t\rem.repr sel|| 0Type,

						// Ge( typlue);nodeNameno value 
			if ( ;

		/pe === "str{
				this.chehis.type 			});
			}

			if ( jQuery.isArray(val) && r;
			}e instead of true, IElass = /[\n\t\= " " g,
	rsp {
			i ]) ) {
	ti-Selects returnr leng this.eac	if ( !cache[ iype === "boolean" ) {
	) {
				childNhecked = jQuace se ?e cl= "fx":e clfined ta o this,
			} else {
				th
			} else if ( tptions
 else fined et[1] ) ]event ger anyment) {
					if ( jQue	thisCarototype/detechildame if set
					j for de ? "addClass" l -

				// We n(className ush( elem d thiype.) {
	jis.letjQuery).find( : true,
		tmargita at alluncti+n( elem, name, value, pass ) {
	d attrib get/set attribu},

	removeClasnction( elem, name, value, pass ) {
	ext: tru get/se+ "= "fx"et attributes 			objeata: true,
	 Everyth trimLeft, " arg ) {
	s is for int		options = es is for int.ing" )(src) ? src : {};
					}= -1; "fx";

			} else if (  elem.ined ) { true,
		css: true,
	ec( ua ) her we ,

	// Hg)
			sepe = < cl; "object" ) {
		rel

		rHng" )Oelse 			varions
					f			datas it by defy-delay/
	d"			datan jQuy
var jne "@")ventSnodeType !== 1 || !jtype ue || "").replace(runction( elems,nodeType !== 1 || !jQuery., function()ua ) ||
			[]20
	qu%20true )brack

			/\[\]'lengtCRLFafarir?\ntrue )has{
			#.
			va Speel = 			jQ.*?):[ \t]ruct\r\n&
		r?$/mg, / Nothlea		forn \jQue deep ) at EOL
	r.done( extra color|date && ! thi|ctedl|ing" )|month|	clear| l; word|lways|se is |tel|ss( |y.supurl|week)n.exte// #7653, #8125t.sel52: loliceor = col;
			ry Jaon: 
			P// Make  "qu?:^file|^widget|\-ery.ssion):'lengtnoment (sa extra GET|HEAD)'lengthworks with ^\/\/lengt/ Trigg /\?lengt><td>t, thi><td>t\b[^<]);
	(?!<\/ss2type)<cable)*ss the att/gQuery			retcumefuncode ) {
			retde;
	func
			}); "0" sAja}
	}
,

	sub:tire /([?&])_=[^&]*lengtucHan option
(^|\-)veData( lem, tefined) , ar || "").repla_, $1, $2s ),
					stat$1 + $2 data );

			if ( = undre.seleyWait+\.t--;:)ctedng t/?#:]*)(?::r );
)			}					Ked.ribute(	},

	to.attk;
	 window[ _eName) {
		ua =n.k;
	"type* Preas sele
	, "o)
}

tener usefuf ( !ed;
	},

 customata(  ID s (rn j
			/jsonp.jected
ause at( r)type 2roperseinternaeake:type    - BEFORE asrray() :

	alwasr St	elem.remoAFTER
			am);

// Poster t(soved tue";
	e path f nceluse otion frome.totype 3) key indes
					if (type 4)					}
tch== msymbole is  tabbelems[i] * 5) ure uif ( !(attrrn a '

		/						}
on forms,this,THEN );
	OM n array
oe is ifval =uery.n/ dataas selec( elemjQuerT						}
s b [ jQu"type proy id/name on forms, give2priority to attributes.
				if ( jQuery.no3)ame ] :lem, "form" ) && elem.getAttributeNode(name) ) {g attr.getAttributeNode( nm.getAttreValue;
			{
		ed?
			 alsIE, we
			s;
		ht = );
			cript/
				if (  se( typeofme === Parull,
			p8138,

	 mem.cClascause of IE, sEmptyueue( evenuery t = fe) ) {					}

	ar attribif	// args is n obj",")be ===etis, seleme === "tabINaN( obj );
			if ( bject;hen Blackberry 4.ort.de = /^ (copyIsArray }

		//Ae global j{
		i| jQ iteratimodata(itOM no					break rclickab.test( elem.nodeName ) || return i === - "ata
;.test( elem.nobject(sr
	// est( elem.nodeN" ) {
				if ( seect = thSteNodevar attribcceptpAttr
elem.getAttr(funurle = obj" ) {
				if ntentLoaded,

r args Breferconstruon't"lass:ss" ) {
			y.error( isables" ) {
			

				// tSupportedaddToy.error( "Or

				// eery( uctumenject'sect 			if (LiceNode					 stateVeTypnd

				//alue "*"			return optgroup)
		o return undefieratedrn this.) {
					if utes return undefinld( document.createTem.atater
	 return undefiestroytes return undefinlit( -level elements act like inline-lem.attr;

						//				if ( vame )) ) {
				returvert the valuest[ i ) {1
			if ( (	parts[he documen < length;				if ( 	// deter ( var n ID ribute(is= 1 ) {( sel argumll ) {
			or ;
		ibuteNode(occurred )) ) {
				returthing w(or );
	Node ? jst the initbuteNode( 2 ) :
				/ Ple	});
	 "load"sDatolself = jQuasr aucusablelassName} else ieof date matceturn leNon-existent };
	},+ = falsebuteNode(		});
	ernal 	}
		returnery.data(  attr;
		}
		// Haument.boatchaery ttr = e is useth;
				/at miss[;
	}
});

ack \./g,
	rspace = / /g,
f ( elemation).
	n {
	able	name =that missiaccore inh/Heigh

		[espaces = /\.?eAtt},

	ax; ir.ca" = eem.attex = elem.selectbutering in

		ontextt.context = ame ).nodeVckbeindex-valured;
						.
 * Me );
			}

			// Ensure that miss= "boolean"l) ) {
	Oboolean"jqXHRta onuteNode(/*pported = */no
		 typeot
	// Original ing attrformElems = /^(?:tch(fut dataorg/e/ Handl0 ever Dean Edwacachean Edwa||ion( vaelem.nodepace = / /g,
	r rootjQu
			}od = /\./g,
	rspace = / /g,	thise docume.indexOf(e a t?ikelya = jQue:documeame( eef ( !=//thhat missihe name ).nodeV	part
				// hlector; attr === nule|falName( e for b][+\
				// ht)l ? undefine
				// htlikely/ Ple(ry.event = {

	// Bind an event ons us);
			}
 go ) {diWidtent nodkey,epecial ?
	em ) &wset
ing
	out 			ne( elonlytargalue;
						}
lread undefine// callbacks .node exec is true
			extrue
	},window object ) {
			ret false ) {;

					} t to be clonal();
					}
 this, key );
ta ) {
		if ( ele;
	},

	//			// aroundug #7229. Fix rec Dean Edwards' addEvent librar; i++ ).
 */
jQuery.event = {

	// Bind an event t, handleObby Dean Edwa!context) ) {

s with layoutyList.rw;
			}
	ion( he maferrthan we need {
				elemity to attnull, we ne cu ( e ) {}

		if 	returhe window object
			// arounync = ) {
			ret is ;

					 ( handler.handler ) {
			handleObjIn = handler			handler = handleObjIn.handler;
		}

		// "*" that the functiexecutu"1.5ess eleclassunique ID
		if (ame ).nodethrow ash it'= maeurn !vad== 1 = jQulldy occurode
a,

	,

		// Greason, I) {
	class2type[ "[objek;
	his.promise urlntsByave a lement("div"), handler ===nce ld( document.&& em.parv1.5.1
 * httpem.pall( sele'></tdiv.firstChilde ) {
		retueArrarequg he
		//teExpando = fas stilnt is c1",

	// The defauocks = div.offsetWi-sniffing/
	vaapply( ret				=ntHa = Array.potyp;

		Feb 2				es special
	dy();
	ilCallbacrlcumente.app,ents ined && 

		ince itnts ) :
			0,.applction() {

			} work cusa GETloaded
	 j++ ];
r the "GETn target;ext = sor: funandle				lem.classNameInternal Usaer
			jQution(valu	}
	 of the iveClass" ( promise, array );le.elem =assNames[c] noop;umldren
		 HanmData.haueuet = /\d			// C

			am		}
		ele.elemecommended byss")) );
			});
,	returniv.at		elnctio		if ( match ) {
				re
		var tack to window.onload
		var ty	elem.spe = pace
		/div.getE{
					jQuers.tode 	// Bla;

		if preventPOS memerred.promisdy();
		}
	entListenalue  is cary.clomotred.
		if gress" ) {
			fn = queue.ventest tdd a st a {
			// Add a p			S" )) )n el.inne				 handle t				va {
			elem(respons;
}

rts[0], lse {
			ly
	pus{
				vahis.promise 

		// Mreturn ".");

			} ey is pushingtventLis			}

					if

						foelemDatndow( === "strin.inn);

			} e=	handl.handler.guidleanup = If sueue( fulno
	dle t
			[ partcept== mute
		if ( vmes
			documevents 	}

	isResolvedue t type );
		#4825:+ "." + nf ( ty	if ( !han
	ha( !evet ) {
	id++;	// Exti.claes ( can {
		andler, (?:\{.*	}

					ction() {
 			} else {
handler.guid;
	oxy === "		});
	}hing the rnt forwardsguid  this;
	oCloneEvent= scrilem, arguone (it 	if ( typeofdumm forvattr..atttion( firsture that the ( ) {
>body exielse {
 bound tody check  an attrcript/
	 ) {tFragdOnly",
><td>t<setup.call( jQuery._			e'P				ndefinDeni( th " " +  {
		retem.ad If IE ihandler.guid.val();

	><td>tdisabpy)
support.rs;
		}

		/

						fomes
			documeaddE[ i ]callback(rHandler("/ The cu their c elem, data.length !==		// Check for a speue. See #5145
		opa{
			elemData.he";
			de/deteCheck if n[			}

			handce = "";
	ndow( 			this[0] = elem;
/ flag to know if ( lastIn

// Popcatch(e) {
		setTimeout(, handleObjIn)gth =dler.guidspace when .j.handler.guid ( jQcatch(e) {
		setTimeout( doScfunction() {
	y.browser.webkit ick, argsject: faia little ovh events have formatiooScrol
f ( est;
	},

	grep:y.browser.webkit turn,

			ort =is/ tal;
	 ];

	y to theched d.isR		// 'in' chec"";
			v.style.d, "text		//  Che.donebal: {},

	/	// A cinput.c.glofunction() {
uery.isFunClass" : "rech.browser ) {
	jexpaplorer
f {
			if ( ("uery.prototykit "rgs ]
			fireength = eler,oxy, thisallbacks = [vfor 
	jQuery.suppect =t.addEventListe{
});
ptions
 "inprogres
	// ateVal,
			rts ll &r\ta atne tvent h=== unde= false ) {
			handler = returnFalse;
		}

		var ret, type, }n
			id = 	var args =ndos)var dnch

		/uery Jaected
xtendnt seommon AJAXelem[jQurototype/dete" ) {
rn a  elemDop.evenice(0).so
			as wel ) {
 of fus ) {
	nd"cial cal.evenerated list
			o		if 	// Cancel
ocancel: functiof		if (iv.innerHTMLem.t( o, && ry(this to arototype/dete[unctio				oW]+>perated list
			heck pate = isBool[ll eventancel: functionentHdata( Check if nanction() {{
		,

	 trigger anttried t		});
	}ventLomit				revents separated by a spaved to			}

			r the undefinees = typthe Nts = types.) {
n undefinrecommended by jjQuery.inArray = fu
			fn = qespaceelectopaces			type = nampace =data(r val of fuo ineck if {
			// Add a / ) {
ss the s.handler;
			ty ) {
			 arraupport}

		if ( !eventH{
			elemData.hit.exec( ua ) |y(th typeel
		deleypes === "sttribute
	iement's getJSON}

		if ( !eventHof types === "	handleObj = null;
			all = typof types === "st"ull paces = [];	if ( typandle ll fled) {
ery.supsyDataObj-1 );
= sechandle	retboifie) {
				han		return thiefer= fu.xecuted should ed
	s || ", wrn( ks event: handler, d					eSet		//ayout: falp ).joi,
			e(0).sfset: true
	
			if ( !event			if ( !.stytive evenetionpe = ts ) {
				handler
			if ( k, inv )pe, fshould 	};

	jQuery.supme = cl handler: handler, ;

			if ( !er
	uaMatch: fune gl= secoem.className + ) {
				f evenry ] )handleObj = eventTypetype ];
[ j ];

					if ( all || namespace.te;

			latte0
 *= fubjects except alKey {
				/attahas 	// TibuteNi=== ment no:.isNueue.1 }ined
		// datuery.even {
				continue; ) {
		[ j = po,
	re			if (th; j++ )by jdalton
	if( j = pos | handler: handler, ble cells ilength; j++ ) {
 handler: handler, leObj = eventTyred helper
	whength; j+Type =) {
				hanjs.comueue.me === "tabInd		iss;
	l: t also works wject inslem.getAttr[ 1hand) {
x queuet, array espacet a mray );
			}Add a pl( s		reion/x-www-};
	-urlenncticumen	// browserset, array 
		if (, array /*		}
imeoutr releapace =		for{
					Add a reak;
		ustriblse reak;
		ar parenove generihe fxove generiata: data } ( fn ) {
	 an opt: elems[crossDvalueove generi*/n( nuct.
	( handl	xrue;) {
							spe= jQuata xbj.names true;	data eObj.namescial[ 	data plain" )) )ull ) {
				if ( !sull ial.tea= elem.getA
		ty"*": "*/ns " {
				ction( thih === 1 ) ardoleng| speciardown
				d falseuery./.handle )handler.F	}
		gth === 1 ) {handler.XML.call( elem, handler.guida.handle ), evh;
	},
ttributuildFr[i].n//doesn't };
	n
		s ");

		_y.evecachin				se ) {" ( elengle, f,
		in-between
	re//orrect value when it hasn't been expliclass: handle ) {e );
	ndle = 
			 handle the dat\D/g, "" 	named ) pe, ata( ": !( resounctioCopyr				}	} ettr.lengns fory,

de orile;
			if elem,ss( teObj.

					i
		}
	}e fru		}

s( th,

	nsve tefined
			retion( e				to get and				/		if elem /*,P			/g */ ) {
xmed ? ion( erdow		var type = eXry.sup || namespay.error( :+ value );
			}

			// Ensure 		// For whatevetAttribute( of event === "object" ?
				// index-value)ndex" )M objwindow[ 				}

		if ( !eventH				self.togem ) && (nce ue"; for ifr;
		m			i				e-1.5 signamissa.handle = eventHanleObjIn ?
				jQueryjQuery.d// Ad;
		}

		// l();
					}

				elected &jQuery.d
		re(naeObj.guid >= 0 ) {
	jQuery.dype === 8
			i	if ( type {
		r BlajQuery.d=== "strinction( valu		eventTy( ele(type), evpaces.sli", fn);id =l alwpe + types )ill always === 2 ) {ts dpaces.slicl alwam gex queue[ id ][ interImouseout", fn);
trigger if			ifvalue ) {
		i {
				et data o else if rentNHandlret.frag ( !
	now: fucolalse ) his;
 queue enument  detait
				if ( jQue = ismory leaksecting the data Don't desve( elem, tf ( jQuernstct dof	now: fuoxy, thisOll given on() {
						//form*\}|\[.*\])$paces.slDy.exreeturn	dentiall remove thtentiallry.data{
				vatentiall remove th_er; currently iReturntus-dref='Query.o much r valuvar C)[ \/]s.ando,
					ype =paces.slifMrn eapplketype rnalKey ];Keypaces.slfined) &(Listener handl== ma		}
c		// mnt is cfined) && this[ inteRf ( !han an opttails:ndler.fined)  );
			}r( event, data, inpaces.sl
						}

	lers 				}

						}
!= nulextend(
				!= nul +i alue =	if (oss-.value sure that		};ger( le.cspaces.slectondow( to wh.expandos inocumenes
	o know code've ever bouinternt.exc			dn: funthingireG queunt nodes
Loop		};

		rveClapaces.slF,

	xhr ( vndow( asClid = haady		vaer releanup = Candle em.hran opug #722t") > -1fined)1 ) {
			var "inprogress" ) {pply( [], to whe in case IE nts[ type ] : !sel require a specr form.reseefined) ,

		// Trig ( se"scr				}
			}
		lse {
		d" && !jQuery.ehandle )Of("."awtypes[ i++ ;

	Alluery.evefined) catch(e) {
		setTring") || va.node: funata ent, data, internal							} e
		var handle Betursnt.trigg :
	h else AttributeNota( el "handle" );

his.promise y idnd event hand},

	noop elem, typply( elem,nction( elem, t!ata );
		}

		vproxy && fn ) owerCase()]) )tion( 			// Trt)
	 evee ) {
		f an opte = objata );
		}

		var pare				/ Mozilla, Opehandle" );

	[name in oreateElement("screr the M 2 everytha = /(mozillproxy && !jQueralse;
					event.keyreateElement("sc that "handle" is a fmise".splirmission.
	bkit ":elem.nodeNamvar handle Oime] |
		"e ( !han ( jQue-y.evene the incotime] |eMimM reafirst[ i++ ] nction() {
	ta );
			data.unshift( s.m data, ent.rem that "handle" is a function
		var handle Cct d			var	// This i		abvent[lf = jQuery(var handleObj.typpando,
guid;
	" ),
				isery e( rnct)$/i,handle .getAttriarget === c}
			}

.e( rn "" ),
				isC]*$/,
	rvalidets[ tas a.special[ targetTyp is a function
		vent hi) {
				s = typem geclasst in the malem, ) {
	n eve			!i

jQuerem = ck if emjsliueryce(0
	nodrentNotargeclarllows
		t.deletet exan attayout: falall objSafari 2mturnlogslicethis.pad/ tafunc else {
		};

	 = "";
	" ),
				i
			}

			s,ownerDocuipt"),
	 ]) ) {voidncreturn thiQuery.noData[elem.noor ( var i = 0, l = ent.t	if (hat " now| elem.nodeT2, namespaC the wdle tri el);
		if (ction( eleingle elemexposing jQuear +i ou {},ed = true;
		var className De( !q || jQu.getAttrim ge !==  garbel.sshould not be {
		notch vent typlrea
				handleObj.gu, "for ( jQuefunctrowing an type, i = 0, namespa

			 parent ) t.trigger( event, data, internallf =an optipecific valption.g			event.tesult = u.			event.tName( tar ? 4or r, nameuse os ) {
						retespaces, nam the pid = handler.r for some toUppjaxtype.iuery.evere t	}

		// t = [],
		.display = "iribute(astalKey ];re, evetase {
	ent list of functioxtend({ );

ched-by-arget[ "on" +usly( 20	// H/ Names< 30me ) / Namesmed e0t;
	}, handle on.getAtIf-alKey ];-S			}
and/or!eveNone-gle t.triggein el)	attalKey ];
	if ( deelem, ty.nt.type.spln this.eact's eveuery.event.f;
			}

	nline bound scrip( "Lastent.excluons
	je sure that the euery.event.f[ent.type.sprted;
	}uery.event.fevel ) {
				doScro( ent _sort = namespaces.slice(0).sEtabacksce_re = new RegExp(ent namespace_sort.join(ent ||else {
			q.push( 				elem.turn er/attach

		// Namest.type.indexOf(".jQuery.nodeNamr jQers = (etargetTypamespace		// TODO :nts with la			if ) {
aces = /\s+/,
			document.addEveespace_e.cssTe the daray( parent ) ";
	},

	" ),
				issabl of futargetTyone the handlers toj) === "funct			_scripthing wh		jQue
				/reExpagth; j < l; j++ ) {
	
				if ( ahandleObjeExpan= TextNode
			// ( jdalton
			retuthe staventframs wel" || " ),
				ieanup = funct
	cellspac" ),
				is	retu Names),

	// e( rn			}
		ce ) ) " ),
				i

var rn;
			daarget, "a"event.hClick = jQuery.nodeNam"ndleObj.names

		// NamesNameisDefaultPr)[ even)(?:\s*\[ny attributesd ) {
		e		elem[before oyListxhr		// Don't = evenpply( thipply( 		if (ret;
						nodeName( target,, namespa ) {
		/ to wct( obj ) e the han	for ( vaentiall			/al =jQueryo make it easie eleespace_raccidentally f ( !handleObjthis, key );
}
					}

	dle f ( event.isImmediatePropmespace = "";tally handleDOMContentLoad					var internalKey = jQuery.expalse ) {
							we don't					in IE
	ndo,
							pe, i = 0, namevisible 	}

			/);
						directly
					// i.trigg(0).srgs ype.topagation()? " ) {
		ax; i to wready );

	props: "alct |tY pageX p
			for :hange attrName bubbles bice(0).sly it just
						// 

					if ( event.isImmediatePropops: "altKey attrattrNaomElement handler keyCode layerX layerY metaKey newValue offseice(0).s"n( event ) {else {
		 it asynchronoe've ev),
		?:^|:he incogth && [0],ry.dequeval.sce_re = new*\}|\[.*\])$/newValue offsets;
	}
});


does not allow us = jQue}
					}ent.}
					}
promi namndow( elem alse ) 			for ( = events[ is.props[ handler;alse ).
		is.props[ {
				va insteaelDelta which prop // Returnar internalKey = jQuery.exntX clientY ctrlalidtokens, "]" length o			// R length orc = tar

var rnameQuery.<ata[elem.nodcial targ		} eeither
			 data detail[nt;
	
			[ey currentT[tmp]he Dp	if (ypes, see #3533		if ( documentargetventnt[ propply( tpes, seealse )funcent;
ionalvent );

		for ( ed" && !jQuery.evry
		if e is spected fixes it
(#7531:					ev.even) {
oer: func
jQueryrentNode.
		// Ie ) {
		i(#5866: IE7 ed me				jQrentNode-lfor url=== 1.).bindt.cainstead)nce tive eventOnlyvaile it iss.nce it;
		nce a;
	clien 1 : opet = elem;

mentrever t = elem;

rentNode,					eventType.spli+ "//ght are $/,
	dler f				if ( ve a and ccial ?
					( array,rimvent handler, da is n require a special call on IE
					 when
									}

			a  0 ||'t do evnt is cal		if xt: tentType ) . 0 || pos ! div.offset

			if ( set ) e
		ivert the value to ltPreft || 0);
		 ];
pace
] || y leaksrollTe.spli!.cssText ntType.spli|| - (doc 2& doc.clientTop  || lien event o) - (doc 3ody &&) - (doc && dleObjromis		th80 : 443t = e!=&& elem						eventType.ey events				eventType.splint.which == null && (event.functperty of the  the datue;
				// I{}

		ior ( var t so GC coved tvent	// browsers oneCallbackoved tld( document.createTr PC's {}, handleObjIn)r PC's,  data: data };

			var i = t( se jQuery.Eve {
	Dean Edwards' addEvent libraryame ).noderget "boolean"ndow( eleem ) && (nt is ca() {
( rndo ] =] );

ame ).nt;
	s;

r c = 0, cl =Query.noData[elem.n
		if ( args )  onto the st tab hanodeType === 8 ) paceselem.nolement n Makhandler key		indirectright
		ta ); refely */ ) {
	from an		inem.nodeta );

			if rollLeft || 0) - (dnt is ca",") ( jQue);
		hasparentNode_scrment (sfunctionrom an  DeprecaWrary ) :

					alue !=event )// Return.button & 2  arg ) {
	alEven++ Is the DOM re	event = jQuery.Event( originarspaces ){
			jQueturnjQuery.dery._datat = thecial:				jQt is d
	guid:clientLeE8,

	// DeO events
		I
			varue";missing ,JS obkberturn		vared ? etaKey to nos bug #72clien+tX/Yx;
			 jQuery.p		if (? "&ax; i?
	uuidr PC'sName bubbles b "."mespace_sort.jddEvent// don: truenti-is gettive even			if ( internalC	retu			ev window = je: functionin	// Ju Trigger an etaKey mString( ds oncendexOf(".uery.ction( valu i <	parts[1		}
	elec ) {
		d_=ta[target.
			returetAttribtY + (teVal,
			": ""$1_paren and when intern key, exuttonec( seld {
			e ](stampallback.call(
					jQu j < d({
	r self= isleObj, {h.extend({}, handleObj, {handler: liveHa" only wanion
	uvent handlers
") < 0 && !undefinemespaces = 				lives stilhandd metaKey to non-MacE8,

	// Den-Macecial.removexists once data ) {
	 null;
				}v1.5.1
 *ent );
		}

		"ment (s- ID lem agation().removeardown: jQu< 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");		event.type = namespaj ) {
				jQuery.evmespace_sort.jable
		ieArray(valRegExp("(^|\\.)" + namespace_sort.joiype ];

		ment.removeEvenevent.exclusive;
	functRegExp("(^|\\.)" + namespace_sort.jotype ) ) {elem)[name](v(".");

		events = jQtype, handle );
		}
	};

jQul ) {
			nnction( src )d
	if ( !this.preventpaces, eventHandle ) {
		Ape.lenthis.onned ) {
	servacesnterna		}
		ame on forms, gandle );
		}
	}.s.orignctio	if ( elem.nodload =ype.len[nt may have biseMe( elemd as prevented
		// by a ha offt may have been ml use*e + ", */*; q=0.0max; i+/ Build ad as preve elemi) {
				var s jQuean optita ) {guid || jQus ||.the onFOO evlientX cliing data, if ann( elefault &&/ Pleoperty of the A:but				}

	 false /vent!id )  obje for  is ndle, false documrn;
ing this buggy for.createent.isImmediatePr

		// M de (fa}
		}
	}
Query.noData[e;
					retuA( rn

		// Init the elemenntNode;
	y.evenxpando;

	if ( args )	// Only defintelly = jQuery.typops.length, getPreventD{eenY shi[ typhandl[ typ[];
				ha| {};

			false n the pturnFalse;

	// Even "." 					});
					if ( old 	}

		// Add which for click: 1index-valu 2 === middle; 3 === right
		// ternal
		}

	tion(uto= handbj ) {
		= "click",
				sphat we-
		jNo}

				// 		teardo	if ( docum: function( event )d objee ) {ndodeType === 8omElement handler keyCode layerX layerY metaKey newValue offsern;
	n( event ) {attrName bu === 3 argetTarget[ "on.
		ifload =	}

						return -1;e ]();
					}{
			targetTypundefined valus fixed
	this[  "e ]();
Event );

.ctrldle tri

				// pretrim( setCQuery.n = retuial = jQuers( jQundle );
		}
	}id JSOreak;
			ocumener the funmatch[pagvent		return a	if s wel
		// Init rget = event.sndleOta[elem.nod = {
	prev.length; e ) nt( elec" );

lue ) {
		if ( this.className ) {
	er jQueagments
	jQueryHandle multiple ent value );
		Function A= "find" ) {};
		ernalCache. evalue !e infory/	}

		i event ) {
		ypes[ i+ namevar div = docame a: data };
tion() {
	se if ( jQude_so		try {
			ifry.makeArray( dahis,
	irectly ndle multipno
	voer ontthis.popportusor ( var c	}

	div = docuscriptEval = false;
	.checked;

	// Fi

		if ventach keyjQuerll( eURIice(ont-cir	if ( +retur+	isImmediatePropagatiete window[ iry
		if ( speci: data };	nam is do this bu/ to1.3.2pe = type( deep ) n an elementcancel
		delet		}

			t.special.mo{ handler: handler, data: data }		// Only def=== "find"  i < l; i++ ) {
("mouseover mJust ththerwise set the cance( deep ) lem.nodeType ===ctorCode !);
	},

 {
						elisP.noDd ) {
Targetse if ( jQueFunction A= /^(?t the cance	if ( arraye/deteames if set
					jQuif ( !cancjQueryto prete window[ iame instead of ID
	 leak w an elemen,	isImmewhich"old"elem.Cachelem.t
// Uds[tlthe incect it's )
		nts contabe accele.elemrecursively.");
 {
		return eeEve shri		promiseeturPnames 1 === x, a" &&e tretionty
		// can tionspaces, eventHandl to delete th !=== evenm[ name ] =
					staten( objhandlent.clientX 2ides+ "fx" ) always remove arent && parent !== tobjparent = parent.paresolveWith( promisettle ovob, ke&&.evefined && partson();
		}
		//ationtuni( de the parentNoy jusated list
			v{
		return jQu an element.isR			// S"";
			 ) {
		timeStamp = jTetureturn 		}

	// a) {
		scalajQuery {

		nt !== tv		return;
	}

	try {
.classNevent deleodes;n-n, we  ) {
		ent !ndle ocume acceidleObj./ brumeric	var duery.e				i
			
			// set t ambiguabledd metonly nevent c

		if		// (button1.0.0)rue;
	}

				i2 fo
	jQuery. set ) {
nd
			dler wput)$/i,lyn thistype havmoveDadoor ( a !is},

	t handle		thise;

		.=== === 1 erre ) {
				urn ele		//'event ) {;
	jQuery.event.hlgorithment ype ==2] );
;
				seent flanformae globfted &ler wi	jQuery.event.nt.excso atowonly narent && parent !==pped[tX offtributes ( type.indexO it by def		jQueryvse,
ition
	uuid"]of tparent = parent.parentNode;
		no data left
jQuery.E: data };handlenction( soneCallbacf ( leObjIn ?
				jQuerent maniplue =same parem =,hin thethe saerred(),
			fateturnd) {
	n the sry
			i== "striub-element
			jQuery.event.ove( this, fEnste relatedevent.this, 0 ed to rename= "fx"s, arguments );
w RegExp/ assumy.data for more inform(this);
	vent.le ( parent && parent !==ion( dataturn,ector ?objy.isFunctarent = parent.parentNode;
		}

() {
		thiselement
	// w of thee ) {
		dd(this, "clitype on() {
	) + "queue"st"fortype;

now: function...handlerw			}Wntinial[ = cacdataoemove the gi the  dayle ( (type = types[.charnly pe === os thispportclearQalKelEvententListen=== "target =an urt();
			namnalEventis get),

	( ev	// This uery.event.fngth ==d
	ingthgs (ibut*t async& parent )focusars ) {).length:
 * -le ps& into longer XX			}
			replace(resc			})t;
	// Clo name.shandler,(med		}
d == elem {
			jQuery.e obje( typeotion( nam)	},

	 {
				de
				if ndle src.parent )
de( ame, "" + gs = jQuery.makeArray( arguments );

		eve han= /(?: check forternet Ex;
					}
			2 ? 3 ,

	getVa callmove the expanctio ) {
		var typ === 
			/s.shift( !eletAtte( name le taype === e[ id ]Fratinge {
				return fE has y.extend( ) {
		var typeData.handle = e
		} else ifeyCode la.Event  ) {
		var typ[ );
 hack le" ) {
	ontext.otch = rwebkure that a uave:uteNode(name an ID 		jQuery.e {
				// browl( valu];
	}
});
 been mtions ) {
				
		var han},

	/nt.handle.conbefoenter and mousele" )  revented()  it t = namespaces.slice(0).sselected;
				teardowoved (IE	var self = jQureat null/undef eleuery.event.remCache[ ney ] = {} {
		;
				})s ) {

	v func ) {
			 ) {

	ontext.owse {
			a = null;
})";
			.test	for ( var nar handleObjIn,= (type omise = deferred.proge( e ) {
		va					lengtnipulativentspace_sbefore othis, ".specialSu copyIsAay have been mtiple" ) {
			val =f ( type === 		}
		// HandlnodeTyform").length Tjs shuildFr= 1 || elem.t elem.nodeName ) le" ) {
			val = == "stray have been mable
bject( eleontext.erty, + || elem.tyiseMe cells stiry._data( elem{
			var oe = deferred.pche[ into" || type =e cells still ed;
			jQuery.event.ven typeStoprheir childle tabhis.ordefined;
			jQuedefined;
			jQ||	focus| type ===oved (IE manipof jQuler qu"focus.).bind				alize to unm ) {
		e a teObj.origTylse if .expando;



// change delegation,lement hry._data( elData.handleodeName.toLowe\.\d*ay have been mototype a" );
		val = getVodeName.toLowerrred helper
	whuery.map( eodeName.toLowee, we wan ) {
f ( ! datadefis name ]pe = type.rs code
		tds[0].stlegation,pens here so j = 0, l = handlers.leg attrib = everget, tyeue
			ifn IE.
		eveetaKey to n	// Ext	jQuery.fpace_sor( (e.keyCodeta ) === fnTru
	}
});




v CSP
		/,

	getVal = function( elembject( ele) {
					reuse {
	this out (li ) :
					elem.getAt// Aent.cha
				i checkboxy );
ndefined || 

				ilem, "_change_datrge( rettiple" )before kevent object or before keivate happens alsoe multiple  befement is blurred
			// witalCa}
		ival.s before kefunc bef1e === "c ] = utes return null, we normalirget m.check pulment has= null ? undefient.cha( type= "checkboxmait =
					jQlntLohe e;
			// Return functement opachecky id/ct e= "checkboxame );
			 ) {
			jy id!(match === true || e== "checkbos with some event typnction( alse;
			}

t.parentdoes not allow us "." + nndefined || / The e

				iin or);
				}
			},

			/e eveuery.evenilters[tnSto) {
					ret, up&& !lse if (revame &				e{4})/gions ) {
				silters[typtearlem ) && (nost( thckber			if ( vy.noo ( typeose wexpa			} else {
				/ The		this.ired.nodeNameunction(O events
		 "." + nchangeFilA countens alsory.eve = "change", changeFtore
ttribualse;
			e.filters;
ll ||us()'d
	chan"*e when the in false; leak wit|| cacn;
		f valus()'d
	c/ Ma is ww.w3.vent,h/Heig, values .fes not expov2recommended by jdnctionore
	e ) || spaces ) {
			ifent.tarore
		}

		// typeargetType ===mpe if ( ele
	};
splisimulated evs ) {
				srmulate a dal ) {
			e.tm.indexOle when the iprevent IEchEvent(vta[elem.nodetore
	focus()'d
	changeFi1prevent IE liveFired1rapBlo
	});
)/,
	rmsieis .focus()2 support tt.attachEvent(e a {}, args[ 0 ] );
	event.type = Value =rt this even
			}

		} else {
			while ( secondk: function( e )n( hanm, args urn undeeleteExpaarguments[Fake oit || (d; thojects/prototyper jQueentDe.filters;
" ||  when.filters;ndle ) {
" ","elem.,

		// Mavent.isDeof jQued() ) {
Nodes;
	{
		quivacallreturn thievent\.\d args[ 0 ] );.charCode :			jQ1ent 2a( elem, "_creplace(rescape, && elem.noevent?ener(ta ) === feventCreatFake orstener ) each({ focusng exe called before ua ) ||
			[js nam
		},

		beforejsurn el(\=)\?(&|$)|()\?\?()/ry.dhe handle full )
				hander;
			tom events ventll ): " = jQuer, tyfix;
lem, eve = handler.guid;
				}
			}

		e[ id ] n: ftX offjscst tlit( rspaces )ure tis acellspacjQuery.d(function returnFalse(do thQueryspecial: his but IE) see #107(;
				ata, f"he element st = {

	// 		if ( allndow( engeBubblecialIery.event.ndler === if ( !e exec is trueet[1] ) ]t may have been ma, ty ( typ// Addbject" ) {
			fo.y.event.handl jQuery.isFunction( data ) |nction( s		// data;
			dthe nating th			}{}, handleObj,  event e ) {
				thi arg = name ===  ) {
				
				jQdefined);

	trigainment

	a ) || data ==nodeer );
			returnf ( elem.nodeT, array );fn.apply( this, se,
fn.apply( this,e.disfn.apply( this,sCacheChange.c=ed, tru[ata, flem, evenction(nce itreunl
		types .nodeNameCache.h throu;
		1hang		} else {
			+ "$2, type			//Use
rproperty of
	try e ) {
	 types );ueue:
		teary );
ation();
	 fn );

		} else {
			f

	// Himplleanup = lem,			jQue() {
	ame, "" + if (ed by beforeactiv");
			eve).unbind( event,  Make sure ted by a spac;

jQuerce_re = new fn );

		} else {
			f!type.preventDefaulge.callial._default.call
			}
	ed;
		}

		var h[ 0 ] )

		// Addlement.doctio han throuied
				if  client{
			if (e );
				}
e ) {
				thi(.*)$/,
	rfor
					tevent.remove( this[i], type, f );

		
			}
			rextend(lector ),
		dTarget  types );man typereturn	jQuery.
			a( elemeObj, {handler: lveHandta, fnped: ret		} else {
		 ) {}

			// Make su clientX elem.d	if ( !evler, g;

function returnFalsance({
	unbind: function( typype ] = []; ) {
				var.addEventLientDefaultode n( type, ptionsis.die( types, nue, hande multiple ode;
		}

		gger( tf ( , handspecialSu& el		var handle =uery.exrievame nt.hcallb		}

		ame( eleme {
	us()'d
	chaa ) ? j type
ancel: functirn;
		}

		ifype.preventDefaultbubbling" focus and blry.event.add( thit lition" 			olmespaces, evthis.removeEvent} else {
			fo{
			jQuery.eector is[0]		// Events
			return this;
	;
				t Deprecatel|| v= ele><td>tntext = cone( i ) ,
			endler
 argum = func);
			en forms,  handler: handype = ype.length ==><td>tm, names= elem.gethandl
					jQuergs.length ) {
			jQuerecms.length ) {
			jQuerx- );
		}

	ex",
	);
				}

				r		while ry.proxy( f| );
		}

	/.isFunctict( elemDat= argumee( i )  + name + "]" ] = name.nt the fx queue from" ] = ction( objec name ueued, alway it asynchhe fx'tListen fun i )rn el queu/ Handle object literals( elem, mespaces, "" non sub-eldleObj.selecenter and mouseldleObj.se( args ) {	event.pret || 0);
			event		}

		ret a memgglee've ev the functiolink a || ing();
			e

		pe !=ecified by	elem.setAttribute( ke sure that clicks ss	var elembe anrowing an 		}
	reatfunctiourn a c.clientLeft |lowing eeturn args[ lastTors
			iflengthtting)paren					}

	er: "wser.safarihe[ id ][ internalKey ] er: ".getEuseleave: "monction() {
		returnndler === = win
(function() {// W{
			elemDataw( thi	}

			/yle && notxml && name ===	namespacesorigSelecto( e.prelass		ifdeName(ive( typelectoCh			/isClick = jQ 0, ma fixcument		selector = or.shift();

		 || thi "ini = 0,  to do thi = jQuextend(lected
== match);
			}
	 || thionm.paren" && !typ			evQuery;

		/et ) {
					// WisQuery.espaces.shift()! || thition( event|| /k;
	ed|{
				vatypes, f key, data, types[jQuery( tndle it asynch/ that it d	if ( elem.ad" && !types.preventDefault ) {
			for ( var proxy.gui1;" ) );
			} ) {
					/member liveFer: "vent 0, malete" ) {
			// Handleer: .
		// (WebKitelector";
	},

	//"").split(t IE from thr	while ( (type =elector /pe, i = 0, naments
						ueue:t.keyCodng.htmlript = docum{
				cont );
	evename !==ced 
			eY prevV";
	},

	// A crude wayleanup = & els, key, valu + selector nerHTML = " 
		//ircumx
		/ament6sNamis, argumbe an		rect[ naeNamb i )copyIlse {
		(#2709uid, #4378ry.suppespacs, key, value .length espactsByTagName("a")[0et = ee( rnamespaces, turn this;
	} );
			nSelector || thiypes.p
			iment s		jQuery.even		// link all al trig#5280:form")=== "teeveneventdgth;
	},
 handler
	s'y = jQuery.exhrI points to 		beforexhrtoo much ndex" )ow( 			if ];
						}

mber Stput)$/i,
	rfjectstopProuteNo/ bindIe {
	etrim lorents"forred.r: "1.5.fn[ nalal.srievedir; thaces,	jQuupes.pion
			keyxhrOnUpes.pQuery			typject ) {lector ). fn, pction() {
		docu= jQuery.dle e = src.special: {
) {
		// T( data,ery.event.adtype ] |ery.event.aders ) {paces;
			}
Fn ) {
ll be , array n
		//( type conexpando: "jeturnStandardXHR			typtrim( se.stopPr				d, trueXMLHttp") > -1ery;

n Blackberry ry
	expando: "jeturnAlEventch, handleObj, elem, j, i, l, data[],
		e related"Miurn ofta, clTTPpaces =ret,
		elems = [],rigger
			if (nt is ca.nodeNa{
		
				});

				ery.suppo(\\.|$)");
			}e, dais.lengt() {
	te !== ")hem can unbind ler, devena, fn );ts" );

	// Maandl/* sure we at.
		| type == "moury.nont( r.length >, close, names	if ( 7 (o bodynt is ca

				so dsto a *];
				instead) || event.butt			args.testmissing an *his, data }ly event.namespace		if ( event mem ) {
	/IE8 so") + 		val = 

					// .Node( nproperty of
	tr	for ( iName("					i		dat, related, match, hus =rs = [],
		eventa", v:ation
			dle  function( elet instead)nter, ma event.namespace.nodeNam = live[j];

		if					{Ts calle as dia {
	varalectondleObj.or ),
	s
var withinElement = fxhr.rep"rowSpan",
	colts ); ];
or ),
						{Dto c falselse {
	mber St

var  0);
		 = j ) {
		// Handledata is s" + = atch = jng th"			jCre	if (als		varatch = jr args Noval = before onl, l = th
		}any tarmatch = jQupe, i = 0, nrigger
			i.getAttri					} else {
	 tabent.add( tht.ree.display = "";
			dts );key innOut ) {
		return thi clicks stop
			e			// donliveMap 		}
		rig ry.uuimber Stf ( hrough event.namespacdy.clientLeft || 0);
		 it by defatch[i];

		fipt"),
			ndlereturn tent.result;bug #722
	},

	inArray false turn true;rn this.each(fp: "u, i, t.resul this rget.d).closenot a frampe.int elemery.datue;
			ps, whicso// S			}

			P namy-de;

			// rem, genfasthift(etTyn popup	jQupts th(#2865ody exists, s.		// rems[ 0 ] );
	xhr.op

		.proxynTru type ( e.pror ( 
					eleame( paren(e) {}

			if ( document
			}
		}
	}

	for ( i = 0, l = targetType 			}

			 = eve			}

			}
			lem.type;

		reType,
			xhr ( type === "d
		// falseta, nm;
		event.data = ma;

	urnFallosest(dex > -le everyth) {
			return q || [pped() & ventdeName  Trigger an iive( typvented() &&t )..r( event, data, l });
				}
			}( event, data, ;

		if ( ret		});
	},

	hasC(".") > -1ed-jQueevent.triggergumentle prion()t || 0);
				add: function( handleObj some evrn jwhywerCromise;dler.dojotoolkit.org/ti// S/948	thrunctionsr; thir ( vaalEvent ? 1e;
		}
				}
						erties
		veturn args[ la {
			jQuery.event.s[1]  : retu"X- === false ) {"		if ( !eleme : retur "`").replace(rspar acce, close, namestargetTyel ) {
			bNsliceE event tlistroxy: jQu
var liveMap = {
	focdleOFirefox ument.rument.addEvetch.handleOault && src.get			}
			tDefault()) ? returnTe : returnFalse;

 match.handln Blackb_ems = iveConverD ])) in sub type.replacust be anseouraonta					return attildNode

			retiveConver.selecif ( handler.gui (s safclick " +
	on tliveConect su jQueis.onbeforeunload = fn, sesingn( sefalse;
	},
 ) )s.puden directly uar key in types ) {
				context[ n			// Deturn	if ( typcidentally				if ( elem[ "on" + t}
});


/*!
 * SiSS Selectoxm|| "").split(mouseoveails, ae of IE, ocus" ||teNode & type, selectveConver === "
		}us" || nete whe;

		voccuame.ton == nulomise;v.fiful.knobs-d; j+rrorDfunct.php/tePropaga_lone(ret_.
		ure_ncti:_0x80040111_(NS_ERROR_NOT_AVAILABLE.setup.cs, seler( type, eWhis[& tds);
			name ]on is not on() {
ent view
			if ( special.ang th			if ( ||== fation( event  ret;
	if ( jQuerye;
			}

	*,\s*)? = targeigger( name );
	[0];
				type = ty{

	// Handlred.r {
	lEventtor === ackslash typesem, type, jQueryi];

		ilt ) {
			for ( var ++ ) {
		otarget ;
	},

	dequ	}

		return tng somerevent IE es = "";

em;

		// Handnpaces, "" );
.browser 	if ( type === "hp = jQuery.ntgate: funh.elem, argumente.
//   Tng,
	hasDuplica}

	t;
	},

	nge select this[ jQuery.Query.event.ha ( document.addEv.apply( thiect s ret === f		if ( elem[ "on" + type= fa elem, "handle" );

	izzle = functle" ) {
		pe ] && elem[yrighext = co longer us= /\W/;

//ecial[ 8018
	function()documenion() {
	basemleObjxmltion( i, name ) t
	/#4958unction(eturn 0;
}r Engine
.text.noght ];
	}
	
	ion( selecrn results;// inspodeType !== ventDefaul011, The Dojo Foundation					return attributeNode &&,
		contextX" ),
				ists, 0 = jyc && doc.clientLeft |/ Bind thseout mouseentif ( events && ha ) {
	resuevent.data "), function(me sort of
// oelem =  ) {
	jQue			jQW toStOM n If IE ehe samef
					// So th; j < l; j++ ) {
	handleObjhe case, disca{
			// Extevent.handler  {
			selee = types;
				break;
	ext = stLeft || bo

				( typeof typpace =e stillaeenY shi,
		soFar = s				se ofnction(  fn,  = nulail notent.fi

		iouseoutb: butt engine iturn;makeArname ]rmElems.tn;
	}

		isBoo.setup.cae if ( !evenu/ Mak{
		handleObjtLeft || 0);
			event.
			if ( m[2]	jQuery.map(cur, p?ced e: 404 m, set, ch/ Noth- #1450: the 	if ();
		}
	}1223).join("\n Safari 2204m, set, ched ];

			if})[ event.tselecec( soFar );

pply( thi2tor = parts.sion( selectozilla = /(mozilla Blackb.butfoxs.orssE	return aa = /(opera)(?:.
			if ( type === "hit just
	
	prev and set the context if event IE from throwzlejs.com/ndle e;
					r].sort(function(&& !type.prev ) {
				if ( not if it don't accidentally re-trigger oLowerCase()]) ) ct || this, argufalse;
	},
elf = jQuta, vel 	if  {};
+ pat the= jQu	} else if :
						r		if ( td( type,ly (type& {
	liveConver		val = "";me.
[0, 0ent.weout", fn);
		typ ) {
				level tring,
	hasDuplicate = fale do the name !== ) {}

			if ( documentrigger
			if ( 0, l = coneturnFalse(pe;

				if ( tyshift(), conandos)/ Calcpes.pr	if ( t "" );
			}

ctor ), fn );
			}
	// optitoo much ope ] && elem[eType } );
				}

ct || this, argdTarget to( var j = 0, l = cony = jQuery.expObj.selec
		chuIdf unique optimization where it doesion
// function. If thnspecting tdata(this, "evet = el

			} else {
				type =	if ( special.add ) {
		eed ?
				0,econd[ j / Pass in a 
function live" ) {
	nts nly do a {
				rfx!id )  extra toggle|showoptSerent.pafxd({
	que([+\-]=)?([\d+roble && !s%]* ) {
		t torIfix(f + ( iatePurn;
		ined )anigger: xpr.[ch([iven, spd attr	returnd attr jQuery{
		// don	return	// don jQuery.queu_data"cifiedxpr.relative[ ace se, context

		if (d attr data  {
			chec

		if (	// don data === uLicen		}

		
	}

	if ( !chec [] );
	}]
			re
	class2type[ "[obje} elamespaces, ""f ( , ired{
		Element("div"),
			 one cal}

		or ( var iif ( wve vf ( wIs the DOM ready to
					i	}

	e(ems.Fx("} el", 3g,
	!prune ) {
			results.al;
	};

	// Test ernal use only.
	{
			d: failDefor );
jl ? undefined re that URLs aiminatelative[ cme;

		// Only do  to do thiReap",
	fr;

		rlts, che ) {

tup:
	}

	ifoIndeport[target functios stilQuery.ibte =scsele rury.acion( of key === "object_rg/eneue( typldis is a placee.contain(faster fuery.data( tcontains(context, checkSett ) {
		 "events");

ed onts have ta, fn		jQu				red() ) ry.i			jQ			data =ter o do thiseNamQuery.hen.geo what& tdsy more work  0, l = meturnor ( i = 0 ( jQ			brinue to pn this;
	},
					result;
		}the following if this is a noresults.push( set[i] [i] && checkSet[i].nodeType ===s Bug #25D;
							// Don'["\\)iy Zaytsev
	// htte ) {
		if ( set[i] );mo;
	},

	tof name === "obor: funlo );
data.seluery._ent.spenter9 ) fl" + tais a hack for || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) )t = function( resultn nul					results.push( set[i] 		}
		}

	} else {
		[i] && checkSet[i].nodeType === 1pecificique handler to the sajQuery.eve ) {
		id	self = jQuery!prune ) {
			results.push.ap );

		} else if ( context && context.nodeType === 1 ) {
			f;
}; i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodbject"ector = functioy-delll safe this is a no set ) {
	return Sizl uses.push {
						elcheckSec( expr ))odeType ===t = event;
		event ;

			if ( left.substr( leftults, che( e.stopPropaga = 1; i < results.length; 				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	retu with ap	}

	} else {
		mter fy no cache entry for tt the style infS	jQuelem.nod";
			ype, data, _";
			o get and s re
			et =ntsByTagf ( types &!elen2		results.push.apply(bo withtributef {
			h	[];eain closvents separated by a spfnplace};
};

Sizzle.filter2
			}

			rootentsByTnd event of a trigger and whens.shift();
	rn { ata = un		[];
		}

			root.removeChild( 
if ( browserm.nodeT	[];
?[],
ned;
			}ation
is(":ing" ) d = isNode ? eatione (saf*
 * or ( ( naar i  ]nt("div"al;
	};

	// Test to see === 1  {
			fundefi i = 0;lementsByTagName(ction() {
		// Make sure bodyfade		//Sizzle.find = funtone ) {
			results.push.ap

		return first;
	& set.leng ].exype || "fx"0).} eleck,Quer), par type ].e{r elem = to evecheckSet[i] != null; i++  f1, f2,=== 1Expr.filter[k" ) "\\" ) {
					continue;
( jQuery.isFpon reibute("valf ( ( checkSet[i] != null; i++ ) {ent = event.rerm" ) {
				jn obj
			// elements when setti	if ( E/ Fix targction() {
		// Make s[XMLFiltequen
jQuers once? ";
		ilternd = 
			property of
	tryonteXX '
			'e to checkeliable by beflways exius" |run
		// dats[ i - pacesuiteeType ===ocumen;

	jQuery.support.f ( E), ltiplbj =ength; ) {v.style.display = "}
});
Query.isX {
							 functione ( expr && set.leng				ret ( type.indexOf--, 1 )
		}
rLoop, 'radio' namhis.removeAttribute( namandler: r rnames			maturn, "");
e( tyop: !self.has						;
	},


		// If ti] = false;
				se
rif (ject( "Microsoft.X					pevent.wh) {
	lize		Sizz && push( item )pr.fils[1] 		Sizzecial
				if ( jothisdone = / (IE < 8 ue. See #5145
		opaoop );
						;

	nt.whiur ]( und =} else {
				Query.event.spse;
		}

		// Nhandler.snt de + "";
	( ret =placpaces3a ) {licet ) {
				cahan
		// it to chec.shift(),e, sele subm						return [];
urn;
								rX {

.shift(), ( expr Y.events
		Si  {
	evelation();
	ue;
ped()			reode  the f	rspecxpr );
 does s {
				break;
X			}
		}

		old = expYn false;
	},

 undleftMat? jQuery.hange
		r-type;e === fest)/];
		.shift(), cxpr.rela	jQuts.pushect( elem );
	}
		= tynull/dth/rror, gnized expressi& type !== "*[ type ].exec( eer ) {
		hasDuplica
	throArray(srsplay = "nonh: {
		ID: owspansDuplicate = baseHasDupe ];

				$this.trigge
	throBype;oad sL opti& parts[1] ?
}
		}

		o.leftMatch-\uFFFFw "Syns, preTyector, context, reExpr.leftMatch );

		if ( has,

	// Detachpe || "fx"lse {
\u00c ], i,eExpando = docum
	throw "Syn m, set, = 0;ype;
		TAG: /^((?:[\.replacentHas.pusha", ge option.seSort = function( resu\uFFFF\-[ 0 ] );
	ev/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.ctor, context, res/,
		ATTR: /\[\s*((?:[\w\u00	extra = m[/,
		ATTR: n.disabledent IE from throwing a{
			q.push( data lem.nodeType ==== true;
Query.event.spy._data(.elem, areferre( nm ) ype, daE) {
	Add whior( e",
		"for": 

			/	},

	attrHandlype =)h( it},

	lef[1 else if push( it
			returobjectytsev
	// http://tor( expr );

ction( selector /,
		ATTR: expr );

		ring" ) a );
		}

	( fouurAniisab;

	jQuery.supporttAttar left the parentNoresulteue[0] !== "inprogr ) {
								s intewp://docs.xhe spf
				Name = this.cla&& !ty {
				a( elev jQu
};

Sizzl[is[i].claspr )) ! ?		anyFou Expr.filter ) {
	 Black]curLoop,			if ( this.classNam							

			ip = p+ partrtSt}
});


m" ) &= e		"+ent();
	fternal Us function( el = isng().				// We n - (docbe
		-]|\\.)+uniuery. (doc3 events(classNameclassNam,
			reje optodeNaype || "fx") +f ( l = "";
	() {
== "regexp	Sizzle.errPartStm.nodl useTag |by getting out qulindsigrd.tesjQuery( (ellastoppem.noselector i{
				if(f ( isPartS/f ( (ele))" +y,
	\-]|\\.)+=== part;
				}
			}

			im" ) &trNotTag ) {
		
		if ( !seethis.+=/-= tokizzlce ) ) {
						m = ee calvente docuxpression: "" );
			}
ype !=st, in case I	 (elem(dex  ( isPesult-g itpr)
			t, tendveHanue );
			}
	
		if ( ! ( (	}

&
			-screne + .nodta, fn ) 		if ( document ; i < l; i++ ) {
		}
= "fx" 			// Pass in a ull ) {
			or JSo true, elmplict dif necessaryj ];

	s the valit usct ) {
		var  elsQd = ,lem oEnd mouseluery. {
	ction( valu	for (or ( var i
					}
		,
		isXMLFiltnd = ([rse( dat contilter = set && set[0] &&l otange romise ers thas /\D/g, "" ad; i+null ) nd = fdu.evenm.typp in bodndle =unction( elems, ca	for (a = jQuery.daiDefine iaAttr( thisriggered .concdata) )pBlocks				script = d}

			} the functionector pported  steuery. namds[1].style.di			}
			}ns for t= m[3];
				b				Sizplace(ri second[ jhandler.guid ) {= selen(i) {
			// intNode === uuid;
	= /^<
				was ) =ectoreventHand!}

			} else {			cheddle ked;tion() {
		// Make sure 		trigg ( !cache[ 
			ust a l 1 &ndex = -1bmitBion( va the parentNoop = co( data ll( sel	// ction( c) :
		0,			ces is actual						ype =
				
		//

			cl {
			returnobj liveHanGs.push(
		var q ction()		}

	
	}

	if ( gs[ i ];
						slideDown:) {
			for ( i 1ng) 		parUppart.toLoar i = ();
				noTtsByTagxec( expr )) != ();
	ter In: {selectorndexr.filp://sadeOull eviousSiblin;
				rt, done= dirNodeviousSiblinisTag ) iring || fired );
			tAtt= elem.nodeTypthisCache[ internalKey ]!prune ) {
			results.push.aptext.nodeType === 1 )text,lt ) {
					result = [];
					if ( obj == null ) {
				tElem" ) {
		if ( !prune ) {
				},

			urLoop[i]) if ( coneCallbackf ( conte to windoject: faiery.supportger iform A coun;
				han: $(exf: "") ) {
	 ? jQuernts );
		}) : fn;

	f ( wplacetEleme chanuaster :f ( typeof  ) {
	: [];	},

		NAME:,

		NAM sometimes as, array ) ) {
	place ) {
	
			jQuer {
	context.rentNode ) xe,
	 ?ntexpport.subName( match[1	var classNa?l = results.le== un = results.le ( handlerfxlter[ e been usedname") ==[ = results.l JSOatch[1] ) {
				gExp Objeis.die( 	}
		getEleor( e	jQue( found !== Chec( found !== dler, data );
			}
nction( end = fi < l; i++ ) {
				if ( "zoom" ieck;
			}

	t the 'new' keywor		}) : fn;

 === 0 ?tr && !isT === 0 etachEvent(rentNode;
		key ) {
				opll || namyName !=			}
ineapt
		try {
		p,r ar1], eNue calprop1.5.1
 * httpe, resulangenot,* {
				teverttonh, curLoop, inplace, result, not, isXML ) {
			(({
		h.cos(p*rn maPI)/2oppe0.5t, t + ma+	match = ).length > 0	for (thodh(fun{
			// Optionall=== middle;null ) {
				chee;
			}

			// HaChech events rror" ) {
	!cancelose
rlaced, {
			theta ) {
	l) )Of("!") >= 0 ) f(matcpe ] && t data( obj == nulfxtor = [ do			one if stop				try {
	 ( jQrn this.queue( 	maxlene );
	ent.createElement("select"m.classN.
				n = dirNodeC		}

			retuetachEvent(ents length,
;
			}
				if ( !mae, valuenametep[).replace "die rBackslash, "gExp Obje)on( elem, array uery.event.snction(ss
jQucu3,

		// Make sure that tboents " );
		},

	!jQuery.sup(+ ) {
ions
					fn.guid =all(this, i );
		},

			curLo
			// elements when sjQuer).replace(	},

	isNa							stypeof a ) {
		ua S: /\.((?h ) {
			ret}

			foentElehe same pat typ	for el
		deletor (nArray(nterntion toparenocumeery.b		}
xturn val				brea"rope i(1rad)3n+2',lone(ret.fueueur || sent( re= /(-?)(\d*)(?:n1 === }
			2] = arenn: "c( de.stopPro= (valdd" && em = elem.prev
					? ! spec}
		} esName + ar i optdd" &&ropagation()Data.ef ( xpr.rel: functn	if ( (ty& !elem.frcksl	}

context.getElro{
		o			elem tion() {
		( type.inpeof f.cur rBackslaeave"/,
		ATar// ot handler, true  " ").rep{
				ifest[" + elem.cng().to " ").repm.nodeT	elemlength =o normal{}

					checkSet[i]h[0] );
			artStrNotTag || 			}
		elemfound =owerCase(;

			ndlerction( mnodeTyy.guidt.context(	}

			} else {vents ) {
	fsh, "Set, parteardown: tdata) );|\s*/g, 'or ( var i}

	 function(				Sizherwit	}

			 {
			rn false;tch[1] {
			data,'t dfx.

fuisXM.se {
rtSt	if ( !set ) {
	nt( re'g", 'ype, data, ray]" ) {
		if alue ) {
ry.isArra name t.spelserunesull en; doelsegois;
	};
}itn text ^ (elem.classNf(mat				if ( !matbute("value") =|\s*/g, '');

				// parse;
		},

		ID:  type, rootjQue || e: elemove:heckSet.lent is
		// hidden; do part = Si ) {
	ctors = {
	orglobal event fn ) {
lcted {
			retuEUDO: fu i < l;).replace(/else {
				length =( ( chunke= result? fine0 does seckSet		// Return a e );hutton|				if ( resuming we	return mat 			if ( ropagation() used
	;
		tch[4] = ( m;
};

Sizzle.fih[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( ;
		h, curLoop, inplace, result, not ) {
imple one
				if  (ele

		value );
		E== 1
				 === "ft, not ) {h, "Expr.filter[}

			} else {
				 handler, true )					}, curLoop, Feb 2}

			} splily( ;
		},

		ID:e( match[ get/s		else if (n = dirNodeCR: functionen.)?") curLoop, inplace, resultF\-]|\ cachi );
	plorer
f;
		},

		ID:	"+": fone++;

			retdlers to preernal use one, refunction( elem ) {eturn this;
	}: function( elem ) {
 : this args[ 0 ] );
 true )uery.fn.ini all proper},

	//func
			}
		}
					resul	break;
m ) {
			return elem.chlem ) {
			return {
						elmber Strshrink + "00c0-function(chnt.removeEventLh ) {
	window.= 0 ) {
			checked: fhis.clasr;
			types = ty ( !X ( !Y	}

		// Unbig ) deame tChildeateElement( "		var "	break;
r;
			thisl), stateVations in [elem pes, see 				}
			}

			&& i.POS				if ( re.toLowernodeChe ) {st) inpartisClick			}
				}
			}

			h.POSpendChild( div.fode.selec)).lencontextX
						}
			ap",
	frt)$/i,
	rfin elesultdele:
						r}
					( jQhowt.leng( match[3], elem ).lenglength =nction( matcheof second.length =
		}
		checked: function( elem ) {		},

		">": fun|\s*/g, '') Add	match[4] = " " +eftMdata(this, "events");

E		} elame = jQuubmite multiple ed: function( elnd !== undefill, null, cuy no cache entry f ] = true;
elem.nodeTypeirst.lt -nplace, rse if idden";
		, resultn Event ters: {
		enabledction (valreateElwindo
		NAMped = returry 4.7 retuce( r.ready();,

	attrHandle:		}
			}

			r,

	attrHandlon( eleord" === elem.type;
						if ( !mCheck typeandle return "password" === efined" ) e, valuelem.ty.ce( rrt = ttontrNot( matcngth ) curLoop, in( elem ) {
		[	href: function( " === elem.ty]der: fy/valuenalide1 case
			returncontext.pe;
		},

	R: function( matct tder: fund"checkbox" ==t, tcurLoop,ull ) {
		"file" === eheck,
				= Expr.lt, not ) {
n";
		},

		disaete an expando ry.type(nternal evebj = eve rBacksla,handlidle.call( this, e )
				for ( ; i < l; i++ ) {
			st the object
			( nu				Sizzle.fiipulated
		// (IE n		checkFn call(obj.cotypeof part == = second[ gation ) atch, array fined && parts[ rBackslash,op		}

			 internf an un: 13rt ? parent : falsen Docum els;
			}

		last:1] =},

	ttrMap[na				} elseode to nction( ly]" 60ocumefa, tr				
		// Default speed
		_d* jQue: 400
	},

	step: {
		opacity: function( fx )tp://	jQuery.style Cop.elem, "jquery.",ig
 now );
	1.5.1
cript Libram/
 *
 * Copyright 2if sig
 * Duohn Re &&uery.org/licen[ig
 prop ] != nullyright 2	*
 * Includes Sizzle.js
 = (izzle.js=== "width" ||Sizzle.jsoundaheight" ? Math.max(0 under t) : Licenses+ig
 unit MIT	} elsesizzlejs.com/
yright 2011, Tnder teb 23 MIT 
	}
});

//jqu011, Joexprse
 e the corre.filtersyrightocument accordingly.animatedion(/
 *
 * C* Duyright returndocumentgrep(011, Jotimers, 2 licenses.nyright 2ment;
vwindooundfn * Du MIT ).length;
	};
}

ocument  ipt LibDisplay( nodeNameyright//jqu!* Dud The j[uery objec]yright varjQuery
documen("<" +uery objec+ ">").appendTo("body"),b 23ust the =jQuer.css("ust the" {

		
	},
remove( jQuer//jqutjQuery )undanone * Re	_jQuery = wi"yright 2tjQuery );"block" MIT Query inust the init constru=ery,

	/sele

opy of jQuerust the init constrctor,


enhartable = /^t(?: A s|d|h)$/i,
	rrootimple(?:onte|htmlk fo{

// Us"getBoundingClientRect" in document.
	quickEEleickE with window fn.offsestriocument = op*
 *y with 'enhanced'
	this[0], boxoverwrite
// Check if a opy of ja no.each(ocument = i//sizzlej011, Jo$|#([\.setO|#([\( = /\,acter in,or teb 23 e MIT verwrite
lly j* Relly j.ownerD	quickE it
	rnotwhite ttp:/,

	// Check Query
var
	rdigit = /\d/,

.onte it
	rnotwhite  whitespace
	tonteLeft = /window/,

	// Ctryt
	rnobox );
	},
 of which we optimizef ov23 1catch(e) {	// Cenhadoc );
	},
git = /\d/,

, rootoc?:[^tralocxpr = /^(?:[^<]*jQuer// Make sure we're not dealing with aery,connec
varDOMuery / Check fape gits011, Jocontains((?:\?:[^, window.it
	rnotwhite ape ? { top:)(?:.top, leftn)?[ \w.]+ } :version)0[\w.]+)/0 }/,

	// Cenha/\1>)+(?:\.onte, roowin = getWindow(doct, rooc optiTop la)(?:?:[^.rAgent stri||mozile with jQuery.b0a UserAgentLsie ng for use with serAgy.browser
	usetching t navigscroll string(win.pageYLeft =ng t011, JohupporlidcxModelse
  for usethe browsery.browsethe browset, roothe brserAgenbrowserMaXch,

	// Has the ready events already been bound?
	tching the enMethods = t, rootstring?[ \/](  + the browser- rAgent st, roomsie ejectemsie mise".spserAg" " ),

serAjQuerment;
version)/]([\w.]+)/msie =select
 13:55:29 W]+>)[^>]*$|#([\w\-]+)$)/,

	// Check if a string has a non-wpace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	 whitespace
	tinitializof overwenhacomputedSn Re, roo$|#([\Par,

	 /^<(\w+ndle $(""),, rooprevLeft =$(""), $(nulllse|null"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\, rooozilla)(?:.*? rv:([\ipt LibViewd+(?:\.\t = this[0ined)
		iCret, doc;

	gentt = this[0]?n this;
		}
?:["h = 1;
			ret^[\],:,http://s:;
	},

ur""),c;

		// Hd pr$(null), or $	// The ready enull), or $,

	// Sawhile ( (nced'
	
	rdip(""),Node)se
 or di!=ejecdyis[0] = documull|-?\d* http://jqu whitespace
	tready esFixedPositext && ength = 1;
			ret.pn this;
 = wifretuover the 	breakow, und User = 1;
			return this;
		}

		// The body element only exiss once, opimize finding it
		ifeb 23d pro- = docuthe browseb 23msie rify a match, ,

	// Sa	rsingleTag = /, or $(undefof selectd promor === "body" &&eb 23t no cext) ) {

				cified forody";
			this.lengthdoesNotAddBordeect d! (functi{
					cont = contexForT A sAndCells
		}// A s.testch = .ery obje)opera = /| !contextparseFloat(, ret, doc;

	.bontexTopWion
  )ersioHANDLEE: $(html : document);

					// If a singserAstringis passed inring" )
		if ( !selector ), or $(undefHANDLEandle $(""), $(null), or $(undef= "string" dy";
			this.length =btractsxt[0] : cOverflowNotVisiA si&&);

					// If olector docum"vdocumeeof select context : document);

					// If a single string is passed inand it's a single tag
					// just do a createElement and skiring" ength = 1;
			return) {
			// Are/,

	// Check 

		// Handle HTML strings
		if relativw.jQue

		// Handle HTML strings
		if staticover the !contextrowse

				// HANDL: $(html			}

					,

	//

	// Check 			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selec!contextSD, and Gy been bound?
	reahite = false,

	//urn jQuery.meck parentNode to catch wserA Blackberry 4serAg}\s]*$/,
	ve a reference to some core methods
	}

anceof jQuery = is a{
		var mn 2 license if a striozilla)(?:>(?:<\/\1>, ebkit)[er/ by name increate?:[^<]*/ Mav"), int = iv, check	retu/ A s, td BlackMargin str's a single tat = /(wess(stead "mor );
		"operrsion of strise o<div hn Re=' strings:absolute;sion0;w.]+)0;ect th:0;a sing:5px solid #000;padch w:0;tion
:1px;the MI docu'>he j></s.selector / A siuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					t cell	this.c='0
				rsquer (cont><tr><td></d( selr sel A s>"jQuere the cortendt);
 ID
			ohn Re, { ject
				 "		this.l",sie) ([\w.]+)/,
, 			thisnd(e] = elend(eext =  "1px", ment;
	this.con					ilry.co"hidden" }63
	
" ) t)
			//					HTML = strictorlackbinsertBeforentext)
			/ BlackbfirstChild63
									reuildFt)
			//e if ( jQuctorrn rootj =							re ) {
			return tar dready( senextSib:^|: ) {
			ret ) {
			retur	}

 /\Scontext = context= (rn rootj

					retdocum5eturnlector = ntext[0] : context;
					d= (tdis.context  = wlectrn rootjQueohn ReL strings
	f ( typeurn rootjQuetart wilector"20px HANDL// safari ext ) ) {s a matca singreturn healidhich is 5pxtor.cont = 1;
			return this;
ctor;
			this.context  = w20nt ds 0
	length: 0,

	// Th1lector,

	// Start with an emptyselector: "",

	// The HANDLready( seart wiret[1] ) er tector y.isFunctiontart with an empty acheable is.selectoext ) ) {
							selector = [ document is 0
	length: 0,

	// Th-s );
	}lector = selIncludetor );InBchars = /t se			}

					retdocument.tor );
		 );
	}lackbcase o( jQuntext)
			/63
			ozilla)of ID
						Function( seootjQuery./ A simp
		ifndalone , rootjQuery ) {
		var m'
		retur.no/ HAN.5.1
dchars = /n 2 licenses/\1>)?$/,

enhalector			}

					ret The ready evee( this, selectext, rootjQuery ) {
		var match, e match[1] ) {
					contextas a clean array
	get: fun);

					// Che	}

						// Otherwise, we inject the element diurn jQuery.me	}

						// Otherwise, we inject thserA	if ( jQuery.		if ( elem && elem.parentNode ) {
					5.1
 imLeft =n 2 licenses* Dual
	trimRight  and pushth an empty Otherwise, the st" strings"
			}

ersiet
		ret.pree if 
			-caseh it/msie areontexeven on ragmen the 1] ], [ dment) : ret.fragment).childN.org/licen.call( this, 0 );
	},

	zilla = /(mcur|-?\d+(	return[\],:{}a Useruret: funct = this

					(+ name + CSS
					bject = this;

		retop" + name + CSSserAgenbject = this;

		rew.]+set
		retalculateery object iis.selector ? valent toct documentinArray('auto', [/ Return ,lectn ret;
]) > -1+ namele.jkeAr{}args,ery object nternalof args,,

	// Sa// need to be  A sito ery elemehis.selectif eithesh it orore meis with ands, callbacks 		this.lion( eleery element in theright 2nally.)
	each:ector + is.selecfA-F]{4;
	},tion(ringery element in the?rnally.)
	eaed pro: elemsInnt);rray of ar 10ment and skallback

		return this;
	},

	eq: functionmsie  {
		return i === r in t		this.slicion( elems, namisF+)$)/,

	// Check iright 2// Check=tack (as.callis;

		riargs,jQuery mctor );

				

	sliced pr* http:right 2y use
	// Th( slice.apply-
		return applDate( fn )	ret.sStack( slice.amsie ( this, arguments ),ready eap: function( call(argumenw.]+.join("selector );

				/"using for)cter in it
	rno

	sliceurn ce: function()y usedA-F]{4}3:55:29 20ector +  thisd: function(ned );
 Handle t jQur, con{
	s just equra return itemsheck fa non-w	// Match a standalone tag
	string has a non-wh args )Get *real*gleTag.exec( ://j ( !selector )lectoice: [].spli	}

push: pushcorrectgleTag.ssplice: [ later e
};

// Give	}

		ng useet: functTML stext ?ice: [].spli[0]text.owner.*version)[\w.]+)/,
	r :gleTag.exec( iation
jQ, args )Sxt ) )  the matcect thotyps ) ote: when a jQuermatchasexpr)
			unctithegleTag.serAgon( , elems );e,
		t	retlengsbjecin Son of caurn cgleTag.rn thito inhe jQuelyturn0splice: [ed pro-( elems ) ) {
			push.app* Dual tor();

		if ( jQuery. situation
	 {
		deep = target;
		target = arguments );

		} else e,
		tAddmatch && (matca singotyp.fn.init.proed prom( elems ) ) {
			push.appy.fn;

jQuery.e, "a single strin	if ( jQuery.(possible in sArray( elems ) ) {
			push.app!== "object" && !jQuery.createElee case when targe copy, colengtwory prototypve a ref
					/: y situatan" ) ing useble in dee The readon() {
	k( jQuer{
		target = {};
ret.;
	},

	ice: [].splirnal use only.
	/twhite = /\Smap	// Used fright 2enhaice: [].splice
};

// Give the ijQuer name insteaeb 23		this.cice: [].splic&& (!ype = jQuery.fn;

jQuerxtend = jQut documenttself if only on	ret.context) ret.fragmentDocument |ice: [].splice
() {
	var options, 					if ( jQurnotwhite  ) {
						if ( +$/,
d ) {


// Cid !=er
	DOMConteon( the browsemethodsHandle t/,

	 ["s );
, "e el]

// Define i, nbject is enharay(co: futhe brew jQameen ttor(null)[alse;
		tion(/
 *
 * va, argumstring has a non-whiwin );
	},

	for di// Match a standalone tag
	rsingvaldocumundefinedinObject== ie	targethe bropy && 	rnotwhite = /\S/,

	// Used fcument |w.]+))?/,

	// K
};


			}

	// Behw.]+cument ||rowsthe brow(ed in 	!i ?

			:elector win)ne fail isR	}

		/ Don if ( copy !== undefined ) Top()target			// Do 13:55:29 201 elemray(src) ? srva		// f ( dee+$/,

	) {
		retureep, clone, copy \],:{}\sriginalRwhite = ts, clone them
					targetw.]+? ("OM ready
	r for)ndef ?
		r[  nam = _jtch,

	" :;
	},
Query;
		] :mming whitesready events alreadyrows
	quickExpr = /^(?:[^<]*ray(src) ? || undefined name ];
				ray(src) ?  used?0500
 y(src) ? this.co; ) {

 context unction( deep ) {
	foment;
var jQueisit: 1,

	// Han?uery inre
	/ context.Type// Th9 funcit ) { this;
		}

||= document;


	// re
	//falseotjQuerycopy) || (E: $(fhe MI
						strin, outy.readyWy = j// Mastringray(copy)) ) ) {
			[ "readyWcopyssed
	 ray ) {
						copyIsArrayy = fat A thsrc &.toLowerCasof over//Query.readyWy = jt--;
		}

jQuery.isArr"					 = src &? src : [];

 {
			// Extend tlikearty 	}

						// Otherwise, a non-whiery.	retthis.cover)re
	//ndalonestrusure// Make sure that the DOM  case IE gets// Mattle overzealous (tic.lengthow.document;
v		if ( !document.body ) {
				return setTimeout( jQumal DOM?argument the a singy, 1 );
			}

			// Remuery.isArraery.i			// If a nors] : eferenh: pushwrds
		y: "1.ornstructect.prototype.hasOwnProjQuery.isPlainObject(src) ?ions = http:/?http:/: firector );

				// HANDLunction() {
ions boit
	rnotwhite = /\S/,

	// Used for trimmingenhaself.selector +);

				;

j	}
	// If thuery( e: func^\s+/,i,		}
	n() {
		iocum = /\s+$/,

	// Check he DOM is ready
	ready: e originalEveryone) {
		use)
	quickExpr = /^(?:[^<]*(os = />(?:<\/\1>)deectocopy n Quirks vs Standards magent , to3rdray(dthis;
allows Nokia  = 1;
	, as itsynchrons$;

	ull|-?\dle.jsbutes = CSS1h = a
				ens = /?:[^Ped un= docusReady: false,

	// A coun"rAgent = src &ent fiopy of jQueruery.ready) {
ats al
		if delay readn seeurn setTimeoack howhtlies current wait Mozilla, Opera anget[ na setTimeen targepushas alrea		readyList.resolved({
	norsingleTa{
		// A third-pcument).reargs );the br[strin/readyW]nt hice: [ow.onload, tha,,

	//ever	// gid !=r webkit nigSD, and GtListener ) {
			/// A couMozilla, Opera ]	targetLoad wait		clone = src &]+)/,
	);

		// If IE eveocument.attachEv
		} else if ( dice: [t.attachEvent ) {
			// ensure filate but safe a webame, src,pusho			}r( "DOMContentLoaif (;

	nts[0] ded", DOMConteny bound// Never move origi ( narig	},

	// Execute a caery.i		targerfunct : document)
			w{
		win when the DOM isNaN( ery.etur
			w:ntingth === iobjectsOMContentLoaded);

			// A fal ( this;
	if pixelsContvalue	// ed Fless}

	d({
	noConfltwhite = /\Sturn s( jQue) {ofw.onload, "stready,?w.onlo:w.onlo+ "pxt = tfires. SObject(cute
	.011, J =ecute
	.$	},

	//  Seeundedow);