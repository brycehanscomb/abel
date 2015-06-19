(function() {

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

	function doAbelStuff(decreedElement) {

		var abelElement = decreedElement;
		var abelDecree = abelElement.getAttribute('data-abel');
		abelDecree = abelDecree.replace(/\s+/g, ' '); // squeeze all whitespace (@see http://stackoverflow.com/a/6163180/1063035)
		var rawDecreeKeywords = replaceFragments(abelDecree).split(' ');
		var validRawDecree = rawDecreeKeywords.filter(isValidDecreeFragment);

		var statements = splitOnAnyOf(
			[ ABEL_KEYWORDS.PERIOD ].concat(validRawDecree), // Have to add one split item to the front for the algorithm to work
			[ ABEL_KEYWORDS.PERIOD, ABEL_KEYWORDS.COMMA ]
		);

		var directives = statements.map(function(directive) {
			return getDirectiveFromStatement(directive, abelElement)
		});

		var directivesList = DoublyLinkedList.forge();
		directives.forEach(directivesList.add, directivesList);

		directivesList.forEach(function(directive) {
			if (shouldDirectiveBeRunStraightAway(directive)) {
				runDirective(directive, directivesList);
			}
		});

	}







	var elementUtils = {
		hide: function(element) {
			element.style.display = 'none';
		},
		show: function(element) {
			/**
			 * From Zepto.js source code
			 */
			element.style.display == "none" && (element.style.display = '')
			if (getComputedStyle(element, '').getPropertyValue("display") == "none")
				element.style.display = defaultDisplay(element.nodeName)
		},
		getElementByHashSelector: function (hashSelector) {
			/**
			 * '#hello' -> <div id="hello"></div>
			 */
			return document.getElementById(
				hashSelector.slice(1)
			);
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





	function shouldDirectiveBeRunStraightAway(directive) {

		var target = directive[0];
		var action = directive[1];
		var command = directive[2];

		return action !== 'will';
	}

	function splitOnAnyOf(collection, splitItems) {

		var delimitIndices = [];
		var startIndex = 0;

		var haystack = collection.slice();

		/**
		 * Have to add a split item to the beginning for the algorithm to work
		 */
		if (splitItems.includes(collection[0]) === false) {
			haystack = [ splitItems[0]].concat(haystack);
		}

		for (var ii = 0; ii < haystack.length; ii++) {
			if (splitItems.includes(haystack[ii])) {
				delimitIndices.push([startIndex + 1, ii]);
				startIndex = ii;
			}
		}

		var results = [];

		delimitIndices.forEach(function(indicesBounds) {
			if (indicesBounds[1] - indicesBounds[0] > 1) {
				results.push( haystack.slice(indicesBounds[0], indicesBounds[1]) )
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

	function getDirectiveFromStatement(statement, abelElement) {

		var result = statement.map(function(keyword) {
			// todo: fix this
			return keyword;
		});

		// the selector needs to be at the start, not second!
		if (isSelector(result[0]) === false && isSelector(result[1]) === true) {
			var temp = result[0];
			result[0] = result[1];
			result[1] = temp;
		}

		result = result.map(function(keyword) {
			if (isSelector(keyword)) {
				return elementUtils.getElementByHashSelector(keyword);
			}

			switch(keyword) {
				case ABEL_KEYWORDS.I:
					return abelElement;
				default:
					return keyword;
			}
		});

		return result;
	}

	function replaceFragments(rawDecree) {
		var result = rawDecree;

		for (var prop in fragmentReplacements) {
			if (fragmentReplacements.hasOwnProperty(prop)) {
				result = stringUtils.replaceAll(
					result,
					prop,
					fragmentReplacements[prop]
				);
			}
		}

		return result;
	}

	function isSelector(fragment) {
		return (
		String(fragment).startsWith('#') && fragment.indexOf(' ') === -1
		);
	}

	function isValidDecreeFragment(fragment) {
		return (
		isValidRawKeyword(fragment, ABEL_KEYWORDS) || isSelector(fragment) || isStringValue(fragment)
		);
	}

	function isStringValue(input) {
		return input.startsWith('\'') && input.endsWith('\'');
	}

	function isValidRawKeyword(allegedlyValidKeyword, dictionary) {

		var validRawKeywords = Object.keys(dictionary).map(function(key) {
			return dictionary[key];
		});

		return validRawKeywords.includes(allegedlyValidKeyword);
	}

	function runDirective(directive, directivesList) {

		var target = directive[0];
		var action = directive[1];
		var command = directive[2];
		var valueToTestFor = directive[3];

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
		var action = directive[1]; // should always be 'listen_for' in this function
		var eventType = directive[2];
		var valueToTestFor = directive[3];

		var eventListener = eventListenerFactory(
			target,
			eventType,
			valueToTestFor,
			nextDirective,
			directivesList
		);

		target.addEventListener.apply(
			target,
			eventListener
		);
	}

	function eventListenerFactory(target, eventType, valueToTestFor, nextDirective, directivesList) {

		var eventName;
		var callback;

		switch(eventType) {
			case ABEL_KEYWORDS.IS_CHECKED:
				eventName = 'change';
				callback = function(evt) {
					if (target.checked === true) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case ABEL_KEYWORDS.IS_NOT_CHECKED:
				eventName = 'change';
				callback = function(evt) {
					if (target.checked === false) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case ABEL_KEYWORDS.VALUE_EQUALS:
				eventName = 'change';
				callback = function(evt) {
					if (String(target.value) === String(stringUtils.unquote(valueToTestFor))) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case ABEL_KEYWORDS.VALUE_DOES_NOT_EQUAL:
				eventName = 'change';
				callback = function(evt) {
					if (String(target.value) !== String(stringUtils.unquote(valueToTestFor))) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case ABEL_KEYWORDS.VALUE_IS_LESS_THAN:
				eventName = 'change';
				callback = function(evt) {
					if (parseInt(target.value, 10) < parseInt(String(stringUtils.unquote(valueToTestFor)), 10)) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case ABEL_KEYWORDS.VALUE_IS_MORE_THAN:
				eventName = 'change';
				callback = function(evt) {
					if (parseInt(target.value, 10) > parseInt(String(stringUtils.unquote(valueToTestFor)), 10)) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			default:
				throw new RangeError('Unsupported eventType "' + eventType + '"');

		}

		return [
			eventName,
			callback
		];
	}

	Array.prototype.forEach.call(
		document.querySelectorAll('[data-abel]'),
		doAbelStuff
	);

})();