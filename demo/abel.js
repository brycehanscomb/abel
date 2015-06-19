(function() {

	var validRawKeywords = [
		'i',
		'start_as',
		'is_checked',
		'is_not_checked',
		'hidden',
		'showing',
		'when',
		'checked',
		'selected',
		'will',
		'show',
		'hide',
		'is',
		'%_PERIOD_%',
		'%_COMMA_%',
		'listen_for',
		'value_equals',
		'value_does_not_equal',
		'value_is_less_than',
		'value_is_more_than'
	];

	var fragmentReplacements = {
		'.': ' %_PERIOD_%',
		',': ' %_COMMA_%',
		'start as': 'start_as',
		'is checked': 'is_checked',
		'is not checked': 'is_not_checked',
		'when': 'listen_for',
		'\'s value is less than': ' value_is_less_than',
		'\'s value is more than': ' value_is_more_than',
		'\'s value is not': ' value_does_not_equal',
		'\'s value is': ' value_equals'
	};

	Array.prototype.forEach.call(
		document.querySelectorAll('[data-abel]'),
		doAbelStuff
	);

	function doAbelStuff(decreedElement) {

		var abelElement = decreedElement;
		var abelDecree = abelElement.getAttribute('data-abel');
		abelDecree = abelDecree.replace(/\s+/g, ' '); // squeeze all whitespace (@see http://stackoverflow.com/a/6163180/1063035)
		var rawDecreeKeywords = replaceFragments(abelDecree).split(' ');
		var validRawDecree = rawDecreeKeywords.filter(isValidDecreeFragment);

		var statements = splitOnAnyOf(
			['%_PERIOD_%'].concat(validRawDecree),
			[
				'%_PERIOD_%',
				'%_COMMA_%'
			]
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









	function hideElement(element) {
		element.style.display = 'none';
	}

	function showElement(element) {
		element.style.display == "none" && (element.style.display = '')
		if (getComputedStyle(element, '').getPropertyValue("display") == "none")
			element.style.display = defaultDisplay(element.nodeName)
	}

	function unquote(quotedString) {
		return quotedString.slice(1, quotedString.length - 1);
	}

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

	/**
	 * '#hello' -> <div id="hello"></div>
	 */
	function getElementByHashSelector(hashSelector) {
		return document.getElementById(
			hashSelector.slice(1)
		);
	}

	function getDirectiveFromStatement(statement, abelElement) {

		var result = statement.map(function(keyword) {
			// todo: fix this
			return keyword;
		});

		// the selector needs to be at the start, not in the middle!
		if (isSelector(result[0]) === false && isSelector(result[1]) === true) {
			var temp = result[0];
			result[0] = result[1];
			result[1] = temp;
		}

		result = result.map(function(keyword) {
			if (isSelector(keyword)) {
				return getElementByHashSelector(keyword);
			}

			switch(keyword) {
				case 'i':
					return abelElement;
				default:
					return keyword;
			}
		});

		return result;
	}

	/**
	 * Creates an array of arrays that are split from any instance of `splitItem`, sort of like String.split()
	 * @param  {Array} collection
	 * @param  {*} splitItem
	 * @return {Array}
	 */
	function splitOn(collection, splitItem) {

		var result = [];
		var remainingItems = collection.slice(); // copies the array

		if (collection.indexOf(splitItem) === -1) {
			return remainingItems;
		}

		while(remainingItems.indexOf(splitItem) > -1) {
			result.push(
				remainingItems.splice(
					0,
					remainingItems.indexOf(splitItem)
				)
			);

			remainingItems.splice(0,1); // remove the splitItem
		}

		return result;
	}

	function replaceFragments(rawDecree) {
		var result = rawDecree;

		for (var prop in fragmentReplacements) {
			if (fragmentReplacements.hasOwnProperty(prop)) {
				result = replaceAllInString(
					result,
					prop,
					fragmentReplacements[prop]
				);
			}
		}

		return result;
	}

	function replaceAllInString(input, replaceThis, withThis) {
		var result = String(input);

		while(result.indexOf(replaceThis) > -1) {
			result = result.replace(replaceThis, withThis);
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
		isValidRawKeyword(fragment) || isSelector(fragment) || isStringValue(fragment)
		);
	}

	function isStringValue(input) {
		return input.startsWith('\'') && input.endsWith('\'');
	}

	function isValidRawKeyword(allegedlyValidKeyword) {
		return validRawKeywords.includes(allegedlyValidKeyword);
	}

	function runDirective(directive, directivesList) {

		var target = directive[0];
		var action = directive[1];
		var command = directive[2];
		var valueToTestFor = directive[3];

		switch(action) {
			case 'start_as':
			case 'will':
				doSimpleActionDirective(directive);
				break;
			case 'listen_for':
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
			case 'hidden':
			case 'hide':
				hideElement(target);
				break;
			case 'showing':
			case 'show':
				showElement(target);
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
			case 'is_checked':
				eventName = 'change';
				callback = function(evt) {
					if (target.checked === true) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case 'is_not_checked':
				eventName = 'change';
				callback = function(evt) {
					if (target.checked === false) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case 'value_equals':
				eventName = 'change';
				callback = function(evt) {
					if (String(target.value) === String(unquote(valueToTestFor))) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case 'value_does_not_equal':
				eventName = 'change';
				callback = function(evt) {
					if (String(target.value) !== String(unquote(valueToTestFor))) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case 'value_is_less_than':
				eventName = 'change';
				callback = function(evt) {
					if (parseInt(target.value, 10) < parseInt(String(unquote(valueToTestFor)), 10)) {
						runDirective(nextDirective, directivesList);
					}
				};
				break;
			case 'value_is_more_than':
				eventName = 'change';
				callback = function(evt) {
					if (parseInt(target.value, 10) > parseInt(String(unquote(valueToTestFor)), 10)) {
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

})();