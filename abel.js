(function(
	DoublyLinkedList,
	window
) {

	'use strict';

	if (!DoublyLinkedList) {
		throw new ReferenceError('Abel requires https://github.com/adriano-di-giovanni/doubly-linked-list-js to be available as a dependency. Please make sure you include it before this script.');
	}

	var ABEL_KEYWORDS = {
		I:                      'i',
		START_AS:               'start_as',
		IS_CHECKED:             'is_checked',
		IS_NOT_CHECKED:         'is_not_checked',
		HIDDEN:                 'hidden',
		SHOWING:                'showing',
		WHEN:                   'when',
		CHECKED:                'checked',
		SELECTED:               'selected',
		WILL:                   'will',
		SHOW:                   'show',
		HIDE:                   'hide',
		IS:                     'is',
		PERIOD:                 '%_PERIOD_%',
		COMMA:                  '%_COMMA_%',
		LISTEN_FOR:             'listen_for',
		VALUE_EQUALS:           'value_equals',
		VALUE_DOES_NOT_EQUAL:   'value_does_not_equal',
		VALUE_IS_LESS_THAN:     'value_is_less_than',
		VALUE_IS_MORE_THAN:     'value_is_more_than'
	};

	/**
	 * The order of these keys matters greatly!
	 */
	var fragmentReplacements = {
		'.':                        ' ' + ABEL_KEYWORDS.PERIOD,
		',':                        ' ' + ABEL_KEYWORDS.COMMA,
		'start as':                 ABEL_KEYWORDS.START_AS,
		'is checked':               ABEL_KEYWORDS.IS_CHECKED,
		'is not checked':           ABEL_KEYWORDS.IS_NOT_CHECKED,
		'when':                     ABEL_KEYWORDS.LISTEN_FOR,
		'\'s value is less than':   ' ' + ABEL_KEYWORDS.VALUE_IS_LESS_THAN,
		'\'s value is more than':   ' ' + ABEL_KEYWORDS.VALUE_IS_MORE_THAN,
		'\'s value is not':         ' ' + ABEL_KEYWORDS.VALUE_DOES_NOT_EQUAL,
		'\'s value is':             ' ' + ABEL_KEYWORDS.VALUE_EQUALS
	};

	function init(decreedElement) {

		var abelDecree = decreedElement
			.getAttribute('data-abel')
			.replace(/\s+/g, ' '); // squeeze all whitespace (@see http://stackoverflow.com/a/6163180/1063035)
		var rawDecreeKeywords = replaceFragments(abelDecree);
		var validRawDecree = rawDecreeKeywords
			.split(' ')
			.filter(isValidDecreeFragment);

		var directivesList = DoublyLinkedList.forge();

		var statements = splitOnAnyOf(
			[ ABEL_KEYWORDS.PERIOD ].concat(validRawDecree), // Have to add one split item to the front for the algorithm to work
			[ ABEL_KEYWORDS.PERIOD, ABEL_KEYWORDS.COMMA ]
		);

		statements
			.map(function(statement) {
				return directiveUtils.getDirectiveFromStatement(statement, decreedElement);
			})
			.forEach(directivesList.add, directivesList);

		directivesList.forEach(function(directive) {
			if (directiveUtils.shouldDirectiveBeRunStraightAway(directive)) {
				directiveUtils.runDirective(directive, directivesList);
			}
		});

	}

	var elementUtils = {

		/**
		 * Hides the `element` using inline CSS.
		 *
		 * @param {HTMLElement} element
		 */
		hide: function(element) {
			element.style.display = 'none';
		},

		/**
		 * Shows the `element` using inline CSS. Warning: this will set the element's style to it's default display, eg:
		 * `<div>` will be `block`, and `<span>` will be `inline`.
		 *
		 * @param element
		 */
		show: function(element) {

			var elementStyle = element.style;
			var NONE = 'none';
			var DISPLAY = 'display';

			/**
			 * Get the default CSS display value of `nodeName` elements.
			 *
			 * @param {!string} nodeName - a tag name like 'div' or 'span' or 'input'
			 * @returns {string}
			 */
			function getDefaultDisplay(nodeName) {

				var tempElement = document.createElement(nodeName);
				var display;

				// create a temporary DOM node and see what it's display value is
				document.body.appendChild(tempElement);
				display = window.getComputedStyle(tempElement).getPropertyValue(DISPLAY);
				tempElement.parentNode.removeChild(tempElement);
				// --------------------------------------------------------------------

				if(display == NONE) {
					display = 'block';
				}

				return display;
			}

			if (elementStyle[DISPLAY] === NONE) {
				elementStyle[DISPLAY] = '';
			}

			if (window.getComputedStyle(element).getPropertyValue('display') === NONE) {
				elementStyle[DISPLAY] = getDefaultDisplay(element.nodeName);
			}
		},

		/**
		 * Takes a querySelector string that starts with `'#'` and returns an element by it's id.
		 *
		 * @deprecated Use the native `document.querySelector` or even `document.getElementById` instead.
		 *
		 * @param {string } hashSelector
		 * @returns {Element}
		 */
		getElementByHashSelector: function(hashSelector) {
			return document.querySelector(hashSelector);
		}
	};

	var stringUtils = {
		unquote: function(quotedString) {
			return quotedString.slice(1, quotedString.length - 1);
		},
		replaceAll: function (input, replaceThis, withThis) {
			var result = String(input);

			while(result.indexOf(replaceThis) > -1) {
				result = result.replace(replaceThis, withThis);
			}

			return result;
		}
	};

	var directiveUtils = {
		shouldDirectiveBeRunStraightAway: function (directive) {
			var action = directive[1];
			return action !== ABEL_KEYWORDS.WILL;
		},
		getDirectiveFromStatement: function(statement, abelElement) {

			var result = statement.slice(); // copy the array of strings to mutably work on

			// the selector needs to be at the start, not second!
			if (isSelector(result[0]) === false && isSelector(result[1]) === true) {

				// put the second item into first place
				result.splice(
					1, 0,
					result.shift() // removes the first item from the array and returns it for use in `splice()`
				);
			}

			result = result.map(function(keyword) {
				if (isSelector(keyword)) {
					return elementUtils.getElementByHashSelector(keyword);
				} else {
					switch(keyword) {
						case ABEL_KEYWORDS.I:
							return abelElement;
						default:
							return keyword;
					}
				}
			});

			return result;
		},
		runDirective: function(directive, directivesList) {

			var action = directive[1];

			switch(action) {
				case ABEL_KEYWORDS.START_AS:
				case ABEL_KEYWORDS.WILL:
					doSimpleActionDirective(directive);
					break;
				case ABEL_KEYWORDS.LISTEN_FOR:
					doCreateListenerDirective(
						directive,
						directivesList.getNext(
							directive
						),
						directivesList
					);
					break;
			}
		}
	};

	function splitOnAnyOf(collection, splitItems) {

		var delimitIndices = [];
		var startIndex = 0;

		var haystack = collection.slice();

		/**
		 * Have to add a split item to the beginning for the algorithm to work
		 */
		if (splitItems.includes(collection[0]) === false) {
			haystack = [ splitItems[0] ].concat(haystack);
		}

		haystack.forEach(function(el, index) {
			if (splitItems.includes(haystack[index])) {
				delimitIndices.push([startIndex + 1, index]);
				startIndex = index;
			}
		});

		var results = [];

		delimitIndices.forEach(function(indicesBounds) {
			if (indicesBounds[1] - indicesBounds[0] > 1) {
				results.push( haystack.slice(indicesBounds[0], indicesBounds[1]) );
			}
		});

		var lastResult = results[results.length - 1];
		var lastItemInLastResult = lastResult[lastResult.length - 1];

		if (splitItems.includes(lastItemInLastResult)) {
			// kill the extraneous item hanging on the end
			lastResult.pop();
		}

		return results;
	}

	function replaceFragments(rawDecree) {
		var result = rawDecree;

		Object.keys(fragmentReplacements).forEach(function(prop) {
			result = stringUtils.replaceAll(
				result,
				prop,
				fragmentReplacements[prop]
			);
		});

		return result;
	}

	function doSimpleActionDirective(directive) {
		var target = directive[0];
		var command = directive[2];

		switch(command) {
			case ABEL_KEYWORDS.HIDDEN:
			case ABEL_KEYWORDS.HIDE:
				elementUtils.hide(target);
				break;
			case ABEL_KEYWORDS.SHOWING:
			case ABEL_KEYWORDS.SHOW:
				elementUtils.show(target);
				break;
		}
	}

	function doCreateListenerDirective(directive, nextDirective, directivesList) {

		var target = directive[0];
		var eventType = directive[2];

		var eventListener = eventListenerFactory(
			target,
			eventType,
			directive[3],
			nextDirective,
			directivesList
		);

		target.addEventListener.apply(
			target,
			eventListener
		);
	}

	function eventListenerFactory(target, eventType, valueToTestFor, nextDirective, directivesList) {

		var eventName = 'change';
		var callback;

		function invokeMethod() {
			directiveUtils.runDirective(nextDirective, directivesList);
		}

		switch(eventType) {
			case ABEL_KEYWORDS.IS_CHECKED:
				callback = function() {
					if (target.checked === true) {
						invokeMethod();
					}
				};
				break;
			case ABEL_KEYWORDS.IS_NOT_CHECKED:
				callback = function() {
					if (target.checked === false) {
						invokeMethod();
					}
				};
				break;
			case ABEL_KEYWORDS.VALUE_EQUALS:
				callback = function() {
					if (String(target.value) === String(stringUtils.unquote(valueToTestFor))) {
						invokeMethod();
					}
				};
				break;
			case ABEL_KEYWORDS.VALUE_DOES_NOT_EQUAL:
				callback = function() {
					if (String(target.value) !== String(stringUtils.unquote(valueToTestFor))) {
						invokeMethod();
					}
				};
				break;
			case ABEL_KEYWORDS.VALUE_IS_LESS_THAN:
				callback = function() {
					if (parseInt(target.value, 10) < parseInt(String(stringUtils.unquote(valueToTestFor)), 10)) {
						invokeMethod();
					}
				};
				break;
			case ABEL_KEYWORDS.VALUE_IS_MORE_THAN:
				callback = function() {
					if (parseInt(target.value, 10) > parseInt(String(stringUtils.unquote(valueToTestFor)), 10)) {
						invokeMethod();
					}
				};
				break;
			default:
				throw new RangeError('Unsupported eventType "' + eventType + '"');

		}

		return [ eventName, callback ];
	}

	/* Assertions */

	/**
	 * Determines whether `fragment` is a valid value for `document.getQuerySelector` when querying for an element by ID
	 *
	 * @param {!string} fragment
	 * @returns {boolean}
	 */
	function isSelector(fragment) {

		if ((typeof fragment) !== 'string') {
			throw new TypeError('Argument fragment (' + fragment + ') was not of required type String');
		}

		return (
			fragment.indexOf('#') === 0 && // must start with a `#`
			fragment.indexOf(' ') === -1 // not allowed to have spaces
		);
	}

	function isValidDecreeFragment(fragment) {
		return (
		isValidRawKeyword(fragment, ABEL_KEYWORDS) ||
		isSelector(fragment) ||
		isStringValue(fragment)
		);
	}

	/**
	 * Determines whether `input` is a string-within-a-string. That is, a string that includes quotes around it inside
	 * the string itself.
	 *
	 * @example
	 * // returns `true`
	 * isStringValue("'hello world'")
	 *
	 * @example
	 * // returns true
	 * isStringValue('\'hello world\'')
	 *
	 * @example
	 * // returns false
	 * isStringValue('hello world')
	 *
	 * @example
	 * // returns false
	 * isStringValue('5')
	 *
	 * @param {!string} input - a string that may or may not be surrounded with single-quotes inside the string.
	 * @returns {boolean}
	 */
	function isStringValue(input) {

		if ((typeof input) !== 'string') {
			throw new TypeError('argument ' + input + ' was not of required type String');
		}

		return (
			input[0] === '\'' &&
			input[input.length - 1] === '\''
		);
	}

	/**
	 * Determines whether `allegedlyValidKeyword` can be found as a value in the keys of `dictionary`.
	 *
	 * @param {!string} allegedlyValidKeyword
	 * @param {!Object<string, string>} dictionary
	 */
	function isValidRawKeyword(allegedlyValidKeyword, dictionary) {

		if (allegedlyValidKeyword === null || dictionary === null) {
			throw new ReferenceError('No arguments in this function can be null. Passed arguments = ' + allegedlyValidKeyword + ' and ' + dictionary);
		}

		if ((typeof allegedlyValidKeyword) !== 'string') {
			throw new TypeError('Argument allegedlyValidKeyword (' + allegedlyValidKeyword + ') was not of required type String');
		}

		if ((typeof dictionary) !== 'object') {
			throw new TypeError('Argument dictionary (' + dictionary + ') was not of required type Object');
		}

		var validRawKeywords = Object.keys(dictionary).map(function(key) {
			return dictionary[key];
		});

		return validRawKeywords.includes(allegedlyValidKeyword);
	}

	/* End Assertions */



	/* Kickoff */

	/**
	 * Find all the elements with a [data-abel] attribute on them and calls `init` on each.
	 */
	Array.prototype.forEach.call(
		document.querySelectorAll('[data-abel]'),
		init
	);

	/* End Kickoff */

}(
	DoublyLinkedList,
	window
));