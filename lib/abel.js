(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var parseDecree = require("./lexer").parseDecree;

var executeStatement = require("./statement-utils.js").executeStatement;

var isNotSet = require("is-not-set");

var STRINGS = {
  ERRORS: {
    MISSING_DOCUMENT_REFERENCE: "Abel could not be initialised: the document object was undefined. Please ensure you are running Abel from a browser context."
  }
};

if (typeof document === "undefined") {
  throw new ReferenceError(STRINGS.ERRORS.MISSING_DOCUMENT_REFERENCE);
}

/**
 * @param {HTMLElement} element
 */
function Abel(element) {

  function isElement(o) {
    return typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
  }

  var initialError = "Abel requires a reference to a DOM element to be passed into the constructor, but \"" + element + "\" was passed instead";

  if (isNotSet(element)) {
    throw new ReferenceError(initialError);
  }

  if (!isElement(element)) {
    throw new TypeError(initialError);
  }

  var rawDecree = element.getAttribute("data-abel");

  if (isNotSet(rawDecree)) {
    throw new ReferenceError("Cannot run Abel on element " + element + " because it is missing the required \"data-abel\" attribute.");
  }

  var decree = parseDecree(rawDecree);

  decree.forEach(function (statement) {
    executeStatement(statement, element);
  });
}

/**
 * @static
 * @methodOf {Abel}
 */
function go() {
  /**
   * Find all the elements with a [data-abel] attribute on them and calls `init` on each.
   */
  Array.prototype.forEach.call(document.querySelectorAll("[data-abel]"), Abel);
  //Abel(document.querySelector('[data-abel]'))
}

Abel.go = go;

/**
 * Determines the behaviour of Abel based on whether we are in a Node-ish environment or not.
 * @see {@link http://stackoverflow.com/a/11918368/1063035}
 * @type {boolean}
 */
var isNode = typeof module !== "undefined" && typeof undefined !== "undefined" && undefined.module !== module;

if (isNode) {
  module.exports = Abel;
} else {
  window.Abel = Abel;
}

module.exports = Abel;

},{"./lexer":7,"./statement-utils.js":8,"is-not-set":3}],2:[function(require,module,exports){
var isNotSet = require('is-not-set');

module.exports = function(input) {
    return !isNotSet(input);
};


},{"is-not-set":3}],3:[function(require,module,exports){
function isNotSet(val) {
    return (val === undefined) || (val === '') || (val === null);
}

module.exports = isNotSet;
},{}],4:[function(require,module,exports){
'use strict';

var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
	try {
		strValue.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isString(value) {
	if (typeof value === 'string') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
};

},{}],5:[function(require,module,exports){
/**
 * @param {HTMLElement} element - The checkbox DOM node to watch
 * @param {function} callback
 */
"use strict";

exports.listenForCheck = listenForCheck;

/**
 * @param {HTMLElement} element - The checkbox DOM node to watch
 * @param {function} callback
 */
exports.listenForUncheck = listenForUncheck;

/**
 * @param {HTMLElement} element
 * @param {(number|string)} value
 * @param {function} callback
 */
exports.listenForMatchedValue = listenForMatchedValue;

/**
 * @param {HTMLElement} element
 * @param {(number|string)} value
 * @param {function} callback
 */
exports.listenForUnmatchedValue = listenForUnmatchedValue;

/**
 * @param {HTMLElement} element
 * @param {(number|string)} value
 * @param {function} callback
 */
exports.listenForGreaterThan = listenForGreaterThan;

/**
 * @param {HTMLElement} element
 * @param {(number|string)} value
 * @param {function} callback
 */
exports.listenForLessThan = listenForLessThan;
Object.defineProperty(exports, "__esModule", {
    value: true
});

function listenForCheck(element, callback) {
    element.addEventListener("change", function (evt) {
        if (element.checked) {
            callback();
        }
    });
}

function listenForUncheck(element, callback) {
    element.addEventListener("change", function (evt) {
        if (element.checked === false) {
            callback();
        }
    });
}

function listenForMatchedValue(element, value, callback) {
    element.addEventListener("input", function (evt) {
        if (element.value === value) {
            callback();
        }
    });
}

function listenForUnmatchedValue(element, value, callback) {
    element.addEventListener("input", function (evt) {
        if (element.value !== value) {
            callback();
        }
    });
}

function listenForGreaterThan(element, value, callback) {
    element.addEventListener("input", function (evt) {
        if (parseFloat(element.value) > parseFloat(value)) {
            callback();
        }
    });
}

function listenForLessThan(element, value, callback) {
    element.addEventListener("input", function (evt) {
        if (parseFloat(element.value) < parseFloat(value)) {
            callback();
        }
    });
}

},{}],6:[function(require,module,exports){


/**
 * Hides the `element` using inline CSS.
 *
 * @param {HTMLElement} element
 */
"use strict";

exports.hide = hide;

/**
 * Shows the `element` using inline CSS. Warning: this will set the element's style to it's default display, eg:
 * `<div>` will be `block`, and `<span>` will be `inline`.
 *
 * @param element
 */
exports.show = show;

/**
 * Finds any `#selector`s in a statement and replaces them with actual DOM references
 * @param input
 */
exports.getElementFromSelector = getElementFromSelector;

/**
 * Takes a querySelector string that starts with `'#'` and returns an element by it's id.
 *
 * @deprecated Use the native `document.querySelector` or even `document.getElementById` instead.
 *
 * @param {string } hashSelector
 * @returns {Element}
 */
exports.getElementByHashSelector = getElementByHashSelector;
Object.defineProperty(exports, "__esModule", {
	value: true
});
"use strict";
function hide(element) {
	element.style.display = "none";
}

function show(element) {

	var elementStyle = element.style;
	var NONE = "none";
	var DISPLAY = "display";

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

		if (display == NONE) {
			display = "block";
		}

		return display;
	}

	if (elementStyle[DISPLAY] === NONE) {
		elementStyle[DISPLAY] = "";
	}

	if (window.getComputedStyle(element).getPropertyValue("display") === NONE) {
		elementStyle[DISPLAY] = getDefaultDisplay(element.nodeName);
	}
}

function getElementFromSelector(input) {
	if (input.startsWith("#")) {
		return document.querySelector(input);
	} else {
		return input;
	}
}

function getElementByHashSelector(hashSelector) {
	return document.querySelector(hashSelector);
}

},{}],7:[function(require,module,exports){
"use strict";

exports.parseDecree = parseDecree;
Object.defineProperty(exports, "__esModule", {
	value: true
});
"use strict";

var isNotSet = require("is-not-set");
var isString = require("is-string");
var isSet = require("is-it-set");

var parseTokens = require("./token-utils.js").parseTokens;

var STRINGS = {
	ERRORS: {
		MISSING_REQUIRED_INPUT: "Required argument 'input' was not provided.",
		EXPECTED_TYPE_STRING: "Argument 'input' was not of required type 'string'."
	}
};

/**
 * Separates a decree into its individual statements (still raw, un-parsed and un-formatted)
 *
 * @param {!string} input
 * @return {Array.<string>}
 */
function getStatementStrings(input) {
	if (isNotSet(input)) {
		throw new ReferenceError(STRINGS.ERRORS.MISSING_REQUIRED_INPUT);
	}

	if (!isString(input)) {
		throw new TypeError(STRINGS.ERRORS.EXPECTED_TYPE_STRING);
	}

	return eliminateUselessItems(input.split("."));
}

/**
 * @param {string} statement
 * @returns {Array}
 */
function parseStatement(statement) {
	return eliminateUselessItems(statement.split(",")).map(parseTokens);
}

/**
 * Removes whitespace, and line breaks from each item, and returns only those who still have a value
 *
 * @param {Array.<string>} inputs
 * @returns {Array.<string>}
 */
function eliminateUselessItems(inputs) {
	return inputs.map(trim).filter(isSet);
}

/**
 * @param {!string} input
 * @return {!string}
 * @throws {ReferenceError}
 * @throws {TypeError}
 */
function trim(input) {
	if (isNotSet(input)) {
		throw new ReferenceError(STRINGS.ERRORS.MISSING_REQUIRED_INPUT);
	}

	if (!isString(input)) {
		throw new TypeError(STRINGS.ERRORS.EXPECTED_TYPE_STRING);
	}

	return input.trim();
}

function parseDecree(input) {
	var rawStatements = getStatementStrings(input);
	var parsedStatements = rawStatements.map(parseStatement);

	return parsedStatements;
}

},{"./token-utils.js":9,"is-it-set":2,"is-not-set":3,"is-string":4}],8:[function(require,module,exports){


/**
 * @param {Array.<string>} statement
 * @param {HTMLElement} element
 */
"use strict";

exports.executeStatement = executeStatement;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var _elementUtilsJs = require("./element-utils.js");

var show = _elementUtilsJs.show;
var hide = _elementUtilsJs.hide;

var _actionUtilsJs = require("./action-utils.js");

var listenForCheck = _actionUtilsJs.listenForCheck;
var listenForUncheck = _actionUtilsJs.listenForUncheck;
var listenForMatchedValue = _actionUtilsJs.listenForMatchedValue;
var listenForUnmatchedValue = _actionUtilsJs.listenForUnmatchedValue;
var listenForGreaterThan = _actionUtilsJs.listenForGreaterThan;
var listenForLessThan = _actionUtilsJs.listenForLessThan;

var _tokens = require("./tokens");

var DO_ACTION = _tokens.DO_ACTION;
var SHOW = _tokens.SHOW;
var HIDE = _tokens.HIDE;
var LISTEN_FOR = _tokens.LISTEN_FOR;
var VALUE_EQUALS = _tokens.VALUE_EQUALS;
var VALUE_DOES_NOT_EQUAL = _tokens.VALUE_DOES_NOT_EQUAL;
var VALUE_IS_LESS_THAN = _tokens.VALUE_IS_LESS_THAN;
var VALUE_IS_MORE_THAN = _tokens.VALUE_IS_MORE_THAN;
var IS_CHECKED = _tokens.IS_CHECKED;
var IS_NOT_CHECKED = _tokens.IS_NOT_CHECKED;

/**
 * @param {string} actionFragment
 * @returns {(show|hide)}
 */
function getActionFromActionFragment(actionFragment) {
    var action = actionFragment.replace(DO_ACTION, "").trim();

    switch (action) {
        case SHOW:
            return show;
        case HIDE:
            return hide;
        default:
            throw new RangeError("Cannot execute unknown action statement \"" + actionFragment + "\"");
    }
}

/**
 * @param {string} input
 * @returns {boolean}
 */
function isActionFragment(input) {
    return input.startsWith(DO_ACTION);
}

/**
 * @param {string} input
 * @returns {boolean}
 */
function isListenerFragment(input) {
    return input.startsWith(LISTEN_FOR);
}

/**
 * @param {string} listenerFragment -
 * @param {function} callback - The method to call when the listener fires
 */
function executeListener(listenerFragment, callback) {
    var substatement = listenerFragment.split(" ");

    // we ignore substatement[0]
    var targetElement = document.querySelector(substatement[1]);
    var targetCondition = substatement[2];

    switch (targetCondition) {
        case IS_CHECKED:
            listenForCheck(targetElement, callback);
            break;
        case IS_NOT_CHECKED:
            listenForUncheck(targetElement, callback);
            break;
        case VALUE_EQUALS:
        case VALUE_DOES_NOT_EQUAL:
        case VALUE_IS_LESS_THAN:
        case VALUE_IS_MORE_THAN:
            throw new Error("Condition " + targetCondition + " has not been implemented yet");
        default:
            throw new RangeError("Unknown condition " + targetCondition);
    }
}
function executeStatement(statement, element) {

    if (statement.length === 1) {

        var fragment = statement[0];

        if (isActionFragment(fragment)) {
            getActionFromActionFragment(fragment)(element);
        } else {
            throw new TypeError("Cannot execute unknown fragment \"" + statement + "\"");
        }
    } else if (statement.length === 2) {

        var listenerFragment = statement[0];
        var actionFragment = statement[1];

        if (!isListenerFragment(listenerFragment)) {
            throw new TypeError("Unexpected fragment \"" + listenerFragment + "\". Expected a listener / conditional");
        }

        if (!isActionFragment(actionFragment)) {
            throw new TypeError("Unexpected fragment \"" + actionFragment + "\". Expected an action fragment");
        }

        executeListener(listenerFragment, getActionFromActionFragment(actionFragment).bind(this, element));
    } else {
        throw new RangeError("Unexpected number of fragments in statement. This should never happen");
    }
}

},{"./action-utils.js":5,"./element-utils.js":6,"./tokens":10}],9:[function(require,module,exports){
"use strict";

exports.isToken = isToken;

/**
 * @param {!string} statement
 * @returns {!string}
 */
exports.parseTokens = parseTokens;
exports.isHashSelector = isHashSelector;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tokensJs = require("./tokens.js");

var TOKENS = _tokensJs.TOKENS;
var START_AS = _tokensJs.START_AS;
var IS_CHECKED = _tokensJs.IS_CHECKED;
var IS_NOT_CHECKED = _tokensJs.IS_NOT_CHECKED;
var LISTEN_FOR = _tokensJs.LISTEN_FOR;
var VALUE_DOES_NOT_EQUAL = _tokensJs.VALUE_DOES_NOT_EQUAL;
var VALUE_EQUALS = _tokensJs.VALUE_EQUALS;
var VALUE_IS_LESS_THAN = _tokensJs.VALUE_IS_LESS_THAN;
var VALUE_IS_MORE_THAN = _tokensJs.VALUE_IS_MORE_THAN;
var DO_ACTION = _tokensJs.DO_ACTION;
var HIDDEN = _tokensJs.HIDDEN;
var HIDE = _tokensJs.HIDE;
var SHOWING = _tokensJs.SHOWING;
var SHOW = _tokensJs.SHOW;

var isString = require("is-string");
var isNotSet = require("is-not-set");

var STRINGS = {
    ERRORS: {
        MISSING_REQUIRED_INPUT: "Required argument 'input' was not set",
        INPUT_NOT_STRING_TYPE: "Argument 'input' was not of required type String"
    }
};

function isToken(input) {
    return TOKENS.includes(input);
}

function parseTokens(statement) {

    /**
     * The order of these keys matters greatly!
     */
    var fragmentReplacements = {
        "I ": "i ",
        "start as": START_AS,
        "is checked": IS_CHECKED,
        "is not checked": IS_NOT_CHECKED,
        when: LISTEN_FOR,
        "'s value is less than": " " + VALUE_IS_LESS_THAN,
        "'s value is more than": " " + VALUE_IS_MORE_THAN,
        "'s value is not": " " + VALUE_DOES_NOT_EQUAL,
        "'s value is": " " + VALUE_EQUALS,
        "i will": " " + DO_ACTION
    };

    /**
     * More complicated normalisation here...
     */
    fragmentReplacements["i " + START_AS + " " + HIDDEN] = "" + DO_ACTION + " " + HIDE;
    fragmentReplacements["i " + START_AS + " " + SHOWING] = "" + DO_ACTION + " " + SHOW;

    function replaceAll(input, replaceThis, withThis) {
        var res = input;

        while (res.indexOf(replaceThis) > -1) {
            res = res.replace(replaceThis, withThis);
        }

        return res;
    }

    var result = statement;

    Object.keys(fragmentReplacements).forEach(function (prop) {
        result = replaceAll(result, prop, fragmentReplacements[prop]);
    });

    return result.trim();
}

function isHashSelector(input) {

    function hasWhiteSpace(input) {
        /**
         * @see {@link http://stackoverflow.com/a/6623252/1063035}
         */
        return input === input.replace(/\s/g, "");
    }

    if (isNotSet(input)) {
        throw new ReferenceError(STRINGS.ERRORS.MISSING_REQUIRED_INPUT);
    }

    if (!isString(input)) {
        throw new TypeError(STRINGS.ERRORS.INPUT_NOT_STRING_TYPE);
    }

    return input.charAt(0) === "#" && !hasWhiteSpace(input);
}

},{"./tokens.js":10,"is-not-set":3,"is-string":4}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var I = "i";
exports.I = I;
var START_AS = "start_as";
exports.START_AS = START_AS;
var IS_CHECKED = "is_checked";
exports.IS_CHECKED = IS_CHECKED;
var IS_NOT_CHECKED = "is_not_checked";
exports.IS_NOT_CHECKED = IS_NOT_CHECKED;
var HIDDEN = "hidden";
exports.HIDDEN = HIDDEN;
var SHOWING = "showing";
exports.SHOWING = SHOWING;
var WHEN = "when";
exports.WHEN = WHEN;
var CHECKED = "checked";
exports.CHECKED = CHECKED;
var SELECTED = "selected";
exports.SELECTED = SELECTED;
var WILL = "will";
exports.WILL = WILL;
var SHOW = "show";
exports.SHOW = SHOW;
var HIDE = "hide";
exports.HIDE = HIDE;
var IS = "is";
exports.IS = IS;
var LISTEN_FOR = "listen_for";
exports.LISTEN_FOR = LISTEN_FOR;
var VALUE_EQUALS = "value_equals";
exports.VALUE_EQUALS = VALUE_EQUALS;
var VALUE_DOES_NOT_EQUAL = "value_does_not_equal";
exports.VALUE_DOES_NOT_EQUAL = VALUE_DOES_NOT_EQUAL;
var VALUE_IS_LESS_THAN = "value_is_less_than";
exports.VALUE_IS_LESS_THAN = VALUE_IS_LESS_THAN;
var VALUE_IS_MORE_THAN = "value_is_more_than";
exports.VALUE_IS_MORE_THAN = VALUE_IS_MORE_THAN;
var DO_ACTION = "do_action";

exports.DO_ACTION = DO_ACTION;
var TOKENS = [I, START_AS, IS_CHECKED, IS_NOT_CHECKED, HIDDEN, SHOWING, WHEN, CHECKED, SELECTED, WILL, SHOW, HIDE, IS, LISTEN_FOR, VALUE_EQUALS, VALUE_DOES_NOT_EQUAL, VALUE_IS_LESS_THAN, VALUE_IS_MORE_THAN, DO_ACTION];

exports.TOKENS = TOKENS;
exports["default"] = TOKENS;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtaXQtc2V0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLW5vdC1zZXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtc3RyaW5nL2luZGV4LmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL2FjdGlvbi11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy9lbGVtZW50LXV0aWxzLmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL2xleGVyLmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL3N0YXRlbWVudC11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy90b2tlbi11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy90b2tlbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7O0lBRUosV0FBVyxXQUFRLFNBQVMsRUFBNUIsV0FBVzs7SUFDWCxnQkFBZ0IsV0FBUSxzQkFBc0IsRUFBOUMsZ0JBQWdCOztBQUV6QixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXZDLElBQU0sT0FBTyxHQUFHO0FBQ2YsUUFBTSxFQUFFO0FBQ1AsOEJBQTBCLEVBQUUsOEhBQThIO0dBQzFKO0NBQ0QsQ0FBQzs7QUFFRixJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsRUFBRTtBQUNwQyxRQUFNLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQztDQUNwRTs7Ozs7QUFLRCxTQUFTLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRW5CLFdBQVMsU0FBUyxDQUFDLENBQUMsRUFBQztBQUNqQixXQUNJLE9BQU8sV0FB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QUNSLFVBQVUsRUFDVixjQUFjLEVBQ2QsTUFBTSxFQUNOLE9BQU8sRUFDUCxJQUFJLEVBQ0osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osSUFBSSxFQUNKLElBQUksRUFDSixFQUFFLEVBQ0YsVUFBVSxFQUNWLFlBQVksRUFDWixvQkFBb0IsRUFDcEIsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixTQUFTLENBQ1osQ0FBQzs7UUFwQlcsTUFBTSxHQUFOLE1BQU07cUJBc0JKLE1BQU0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBwYXJzZURlY3JlZSB9IGZyb20gJy4vbGV4ZXInO1xuaW1wb3J0IHsgZXhlY3V0ZVN0YXRlbWVudCB9IGZyb20gJy4vc3RhdGVtZW50LXV0aWxzLmpzJztcblxuY29uc3QgaXNOb3RTZXQgPSByZXF1aXJlKCdpcy1ub3Qtc2V0Jyk7XG5cbmNvbnN0IFNUUklOR1MgPSB7XG5cdEVSUk9SUzoge1xuXHRcdE1JU1NJTkdfRE9DVU1FTlRfUkVGRVJFTkNFOiAnQWJlbCBjb3VsZCBub3QgYmUgaW5pdGlhbGlzZWQ6IHRoZSBkb2N1bWVudCBvYmplY3Qgd2FzIHVuZGVmaW5lZC4gUGxlYXNlIGVuc3VyZSB5b3UgYXJlIHJ1bm5pbmcgQWJlbCBmcm9tIGEgYnJvd3NlciBjb250ZXh0Lidcblx0fVxufTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFNUUklOR1MuRVJST1JTLk1JU1NJTkdfRE9DVU1FTlRfUkVGRVJFTkNFKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIEFiZWwoZWxlbWVudCkge1xuXG4gICAgZnVuY3Rpb24gaXNFbGVtZW50KG8pe1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiID8gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IDogLy9ET00yXG4gICAgICAgICAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIG8gIT09IG51bGwgJiYgby5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygby5ub2RlTmFtZT09PVwic3RyaW5nXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbml0aWFsRXJyb3IgPSAnQWJlbCByZXF1aXJlcyBhIHJlZmVyZW5jZSB0byBhIERPTSBlbGVtZW50IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb25zdHJ1Y3RvciwgYnV0IFwiJyArIGVsZW1lbnQgKyAnXCIgd2FzIHBhc3NlZCBpbnN0ZWFkJztcblxuICAgIGlmIChpc05vdFNldChlbGVtZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoaW5pdGlhbEVycm9yKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGluaXRpYWxFcnJvcik7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3RGVjcmVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWJlbCcpO1xuXG4gICAgaWYgKGlzTm90U2V0KHJhd0RlY3JlZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdDYW5ub3QgcnVuIEFiZWwgb24gZWxlbWVudCAnICsgZWxlbWVudCArICcgYmVjYXVzZSBpdCBpcyBtaXNzaW5nIHRoZSByZXF1aXJlZCBcImRhdGEtYWJlbFwiIGF0dHJpYnV0ZS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNyZWUgPSBwYXJzZURlY3JlZShyYXdEZWNyZWUpO1xuXG4gICAgZGVjcmVlLmZvckVhY2goZnVuY3Rpb24oc3RhdGVtZW50KSB7XG4gICAgICAgIGV4ZWN1dGVTdGF0ZW1lbnQoc3RhdGVtZW50LCBlbGVtZW50KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kT2Yge0FiZWx9XG4gKi9cbmZ1bmN0aW9uIGdvKCkge1xuICAgIC8qKlxuICAgICAqIEZpbmQgYWxsIHRoZSBlbGVtZW50cyB3aXRoIGEgW2RhdGEtYWJlbF0gYXR0cmlidXRlIG9uIHRoZW0gYW5kIGNhbGxzIGBpbml0YCBvbiBlYWNoLlxuICAgICAqL1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hYmVsXScpLFxuICAgIFx0QWJlbFxuICAgICk7XG4gICAgLy9BYmVsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFiZWxdJykpXG59XG5cbkFiZWwuZ28gPSBnbztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSBiZWhhdmlvdXIgb2YgQWJlbCBiYXNlZCBvbiB3aGV0aGVyIHdlIGFyZSBpbiBhIE5vZGUtaXNoIGVudmlyb25tZW50IG9yIG5vdC5cbiAqIEBzZWUge0BsaW5rIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExOTE4MzY4LzEwNjMwMzV9XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNOb2RlID0gKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLm1vZHVsZSAhPT0gbW9kdWxlKTtcblxuaWYgKGlzTm9kZSkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IEFiZWw7XG59IGVsc2Uge1xuXHR3aW5kb3cuQWJlbCA9IEFiZWw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFiZWw7IiwidmFyIGlzTm90U2V0ID0gcmVxdWlyZSgnaXMtbm90LXNldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgcmV0dXJuICFpc05vdFNldChpbnB1dCk7XG59O1xuXG4iLCJmdW5jdGlvbiBpc05vdFNldCh2YWwpIHtcbiAgICByZXR1cm4gKHZhbCA9PT0gdW5kZWZpbmVkKSB8fCAodmFsID09PSAnJykgfHwgKHZhbCA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOb3RTZXQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyVmFsdWUgPSBTdHJpbmcucHJvdG90eXBlLnZhbHVlT2Y7XG52YXIgdHJ5U3RyaW5nT2JqZWN0ID0gZnVuY3Rpb24gdHJ5U3RyaW5nT2JqZWN0KHZhbHVlKSB7XG5cdHRyeSB7XG5cdFx0c3RyVmFsdWUuY2FsbCh2YWx1ZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHN0ckNsYXNzID0gJ1tvYmplY3QgU3RyaW5nXSc7XG52YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7IHJldHVybiB0cnVlOyB9XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuXHRyZXR1cm4gaGFzVG9TdHJpbmdUYWcgPyB0cnlTdHJpbmdPYmplY3QodmFsdWUpIDogdG9TdHIuY2FsbCh2YWx1ZSkgPT09IHN0ckNsYXNzO1xufTtcbiIsIi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFRoZSBjaGVja2JveCBET00gbm9kZSB0byB3YXRjaFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckNoZWNrKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgY2hlY2tib3ggRE9NIG5vZGUgdG8gd2F0Y2hcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JVbmNoZWNrKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JNYXRjaGVkVmFsdWUoZWxlbWVudCwgdmFsdWUsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAoZWxlbWVudC52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JVbm1hdGNoZWRWYWx1ZShlbGVtZW50LCB2YWx1ZSwgY2FsbGJhY2spIHtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckdyZWF0ZXJUaGFuKGVsZW1lbnQsIHZhbHVlLCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKHBhcnNlRmxvYXQoZWxlbWVudC52YWx1ZSkgPiBwYXJzZUZsb2F0KHZhbHVlKSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckxlc3NUaGFuKGVsZW1lbnQsIHZhbHVlLCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKHBhcnNlRmxvYXQoZWxlbWVudC52YWx1ZSkgPCBwYXJzZUZsb2F0KHZhbHVlKSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBIaWRlcyB0aGUgYGVsZW1lbnRgIHVzaW5nIGlubGluZSBDU1MuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGlkZShlbGVtZW50KSB7XG5cdGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbn1cblxuLyoqXG4gKiBTaG93cyB0aGUgYGVsZW1lbnRgIHVzaW5nIGlubGluZSBDU1MuIFdhcm5pbmc6IHRoaXMgd2lsbCBzZXQgdGhlIGVsZW1lbnQncyBzdHlsZSB0byBpdCdzIGRlZmF1bHQgZGlzcGxheSwgZWc6XG4gKiBgPGRpdj5gIHdpbGwgYmUgYGJsb2NrYCwgYW5kIGA8c3Bhbj5gIHdpbGwgYmUgYGlubGluZWAuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3coZWxlbWVudCkge1xuXG5cdHZhciBlbGVtZW50U3R5bGUgPSBlbGVtZW50LnN0eWxlO1xuXHR2YXIgTk9ORSA9ICdub25lJztcblx0dmFyIERJU1BMQVkgPSAnZGlzcGxheSc7XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgZGVmYXVsdCBDU1MgZGlzcGxheSB2YWx1ZSBvZiBgbm9kZU5hbWVgIGVsZW1lbnRzLlxuXHQgKlxuXHQgKiBAcGFyYW0geyFzdHJpbmd9IG5vZGVOYW1lIC0gYSB0YWcgbmFtZSBsaWtlICdkaXYnIG9yICdzcGFuJyBvciAnaW5wdXQnXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXREZWZhdWx0RGlzcGxheShub2RlTmFtZSkge1xuXG5cdFx0dmFyIHRlbXBFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cdFx0dmFyIGRpc3BsYXk7XG5cblx0XHQvLyBjcmVhdGUgYSB0ZW1wb3JhcnkgRE9NIG5vZGUgYW5kIHNlZSB3aGF0IGl0J3MgZGlzcGxheSB2YWx1ZSBpc1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcEVsZW1lbnQpO1xuXHRcdGRpc3BsYXkgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0ZW1wRWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShESVNQTEFZKTtcblx0XHR0ZW1wRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRlbXBFbGVtZW50KTtcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0aWYoZGlzcGxheSA9PSBOT05FKSB7XG5cdFx0XHRkaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHR9XG5cblx0XHRyZXR1cm4gZGlzcGxheTtcblx0fVxuXG5cdGlmIChlbGVtZW50U3R5bGVbRElTUExBWV0gPT09IE5PTkUpIHtcblx0XHRlbGVtZW50U3R5bGVbRElTUExBWV0gPSAnJztcblx0fVxuXG5cdGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXNwbGF5JykgPT09IE5PTkUpIHtcblx0XHRlbGVtZW50U3R5bGVbRElTUExBWV0gPSBnZXREZWZhdWx0RGlzcGxheShlbGVtZW50Lm5vZGVOYW1lKTtcblx0fVxufVxuXG4vKipcbiAqIEZpbmRzIGFueSBgI3NlbGVjdG9yYHMgaW4gYSBzdGF0ZW1lbnQgYW5kIHJlcGxhY2VzIHRoZW0gd2l0aCBhY3R1YWwgRE9NIHJlZmVyZW5jZXNcbiAqIEBwYXJhbSBpbnB1dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEZyb21TZWxlY3RvcihpbnB1dCkge1xuICAgIGlmIChpbnB1dC5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaW5wdXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG59XG5cbi8qKlxuICogVGFrZXMgYSBxdWVyeVNlbGVjdG9yIHN0cmluZyB0aGF0IHN0YXJ0cyB3aXRoIGAnIydgIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgYnkgaXQncyBpZC5cbiAqXG4gKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5hdGl2ZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcmAgb3IgZXZlbiBgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWRgIGluc3RlYWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfSBoYXNoU2VsZWN0b3JcbiAqIEByZXR1cm5zIHtFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEJ5SGFzaFNlbGVjdG9yKGhhc2hTZWxlY3Rvcikge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihoYXNoU2VsZWN0b3IpO1xufSIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNOb3RTZXQgPSByZXF1aXJlKCdpcy1ub3Qtc2V0Jyk7XG5jb25zdCBpc1N0cmluZyA9IHJlcXVpcmUoJ2lzLXN0cmluZycpO1xuY29uc3QgaXNTZXQgPSByZXF1aXJlKCdpcy1pdC1zZXQnKTtcblxuaW1wb3J0IHsgcGFyc2VUb2tlbnMgfSBmcm9tICcuL3Rva2VuLXV0aWxzLmpzJztcblxuY29uc3QgU1RSSU5HUyA9IHtcblx0RVJST1JTOiB7XG5cdFx0TUlTU0lOR19SRVFVSVJFRF9JTlBVVDogYFJlcXVpcmVkIGFyZ3VtZW50ICdpbnB1dCcgd2FzIG5vdCBwcm92aWRlZC5gLFxuXHRcdEVYUEVDVEVEX1RZUEVfU1RSSU5HOiBgQXJndW1lbnQgJ2lucHV0JyB3YXMgbm90IG9mIHJlcXVpcmVkIHR5cGUgJ3N0cmluZycuYFxuXHR9XG59O1xuXG4vKipcbiAqIFNlcGFyYXRlcyBhIGRlY3JlZSBpbnRvIGl0cyBpbmRpdmlkdWFsIHN0YXRlbWVudHMgKHN0aWxsIHJhdywgdW4tcGFyc2VkIGFuZCB1bi1mb3JtYXR0ZWQpXG4gKlxuICogQHBhcmFtIHshc3RyaW5nfSBpbnB1dFxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59XG4gKi9cbmZ1bmN0aW9uIGdldFN0YXRlbWVudFN0cmluZ3MoaW5wdXQpIHtcblx0aWYgKGlzTm90U2V0KGlucHV0KSkge1xuXHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihTVFJJTkdTLkVSUk9SUy5NSVNTSU5HX1JFUVVJUkVEX0lOUFVUKTtcblx0fVxuXG5cdGlmICghaXNTdHJpbmcoaW5wdXQpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihTVFJJTkdTLkVSUk9SUy5FWFBFQ1RFRF9UWVBFX1NUUklORyk7XG5cdH1cblxuXHRyZXR1cm4gZWxpbWluYXRlVXNlbGVzc0l0ZW1zKGlucHV0LnNwbGl0KCcuJykpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZW1lbnRcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gcGFyc2VTdGF0ZW1lbnQoc3RhdGVtZW50KSB7XG4gICAgcmV0dXJuIGVsaW1pbmF0ZVVzZWxlc3NJdGVtcyhcbiAgICAgICAgc3RhdGVtZW50LnNwbGl0KCcsJylcbiAgICApLm1hcChwYXJzZVRva2Vucyk7XG59XG5cbi8qKlxuICogUmVtb3ZlcyB3aGl0ZXNwYWNlLCBhbmQgbGluZSBicmVha3MgZnJvbSBlYWNoIGl0ZW0sIGFuZCByZXR1cm5zIG9ubHkgdGhvc2Ugd2hvIHN0aWxsIGhhdmUgYSB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGlucHV0c1xuICogQHJldHVybnMge0FycmF5LjxzdHJpbmc+fVxuICovXG5mdW5jdGlvbiBlbGltaW5hdGVVc2VsZXNzSXRlbXMoaW5wdXRzKSB7XG5cdHJldHVybiBpbnB1dHMubWFwKHRyaW0pLmZpbHRlcihpc1NldCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHshc3RyaW5nfSBpbnB1dFxuICogQHJldHVybiB7IXN0cmluZ31cbiAqIEB0aHJvd3Mge1JlZmVyZW5jZUVycm9yfVxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICovXG5mdW5jdGlvbiB0cmltKGlucHV0KSB7XG5cdGlmIChpc05vdFNldChpbnB1dCkpIHtcblx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoU1RSSU5HUy5FUlJPUlMuTUlTU0lOR19SRVFVSVJFRF9JTlBVVCk7XG5cdH1cblxuXHRpZiAoIWlzU3RyaW5nKGlucHV0KSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoU1RSSU5HUy5FUlJPUlMuRVhQRUNURURfVFlQRV9TVFJJTkcpO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0LnRyaW0oKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRGVjcmVlKGlucHV0KSB7XG5cdGNvbnN0IHJhd1N0YXRlbWVudHMgPSBnZXRTdGF0ZW1lbnRTdHJpbmdzKGlucHV0KTtcblx0Y29uc3QgcGFyc2VkU3RhdGVtZW50cyA9IHJhd1N0YXRlbWVudHMubWFwKHBhcnNlU3RhdGVtZW50KTtcblxuXHRyZXR1cm4gcGFyc2VkU3RhdGVtZW50cztcbn0iLCJpbXBvcnQgeyBzaG93LCBoaWRlIH0gZnJvbSAnLi9lbGVtZW50LXV0aWxzLmpzJztcbmltcG9ydCB7XG4gICAgbGlzdGVuRm9yQ2hlY2ssXG4gICAgbGlzdGVuRm9yVW5jaGVjayxcbiAgICBsaXN0ZW5Gb3JNYXRjaGVkVmFsdWUsXG4gICAgbGlzdGVuRm9yVW5tYXRjaGVkVmFsdWUsXG4gICAgbGlzdGVuRm9yR3JlYXRlclRoYW4sXG4gICAgbGlzdGVuRm9yTGVzc1RoYW5cbn0gZnJvbSAnLi9hY3Rpb24tdXRpbHMuanMnO1xuaW1wb3J0IHtcbiAgICBET19BQ1RJT04sXG4gICAgU0hPVyxcbiAgICBISURFLFxuICAgIExJU1RFTl9GT1IsXG4gICAgVkFMVUVfRVFVQUxTLFxuICAgIFZBTFVFX0RPRVNfTk9UX0VRVUFMLFxuICAgIFZBTFVFX0lTX0xFU1NfVEhBTixcbiAgICBWQUxVRV9JU19NT1JFX1RIQU4sXG4gICAgSVNfQ0hFQ0tFRCxcbiAgICBJU19OT1RfQ0hFQ0tFRFxufSBmcm9tICcuL3Rva2Vucyc7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbkZyYWdtZW50XG4gKiBAcmV0dXJucyB7KHNob3d8aGlkZSl9XG4gKi9cbmZ1bmN0aW9uIGdldEFjdGlvbkZyb21BY3Rpb25GcmFnbWVudChhY3Rpb25GcmFnbWVudCkge1xuICAgIGNvbnN0IGFjdGlvbiA9IGFjdGlvbkZyYWdtZW50LnJlcGxhY2UoRE9fQUNUSU9OLCAnJykudHJpbSgpO1xuXG4gICAgc3dpdGNoKGFjdGlvbikge1xuICAgICAgICBjYXNlIFNIT1c6XG4gICAgICAgICAgICByZXR1cm4gc2hvdztcbiAgICAgICAgY2FzZSBISURFOlxuICAgICAgICAgICAgcmV0dXJuIGhpZGU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQ2Fubm90IGV4ZWN1dGUgdW5rbm93biBhY3Rpb24gc3RhdGVtZW50IFwiJyArIGFjdGlvbkZyYWdtZW50ICsgJ1wiJyk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQWN0aW9uRnJhZ21lbnQoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQuc3RhcnRzV2l0aChET19BQ1RJT04pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzTGlzdGVuZXJGcmFnbWVudChpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dC5zdGFydHNXaXRoKExJU1RFTl9GT1IpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0ZW5lckZyYWdtZW50IC1cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIG1ldGhvZCB0byBjYWxsIHdoZW4gdGhlIGxpc3RlbmVyIGZpcmVzXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVMaXN0ZW5lcihsaXN0ZW5lckZyYWdtZW50LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHN1YnN0YXRlbWVudCA9IGxpc3RlbmVyRnJhZ21lbnQuc3BsaXQoJyAnKTtcblxuICAgIC8vIHdlIGlnbm9yZSBzdWJzdGF0ZW1lbnRbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdWJzdGF0ZW1lbnRbMV0pO1xuICAgIGNvbnN0IHRhcmdldENvbmRpdGlvbiA9IHN1YnN0YXRlbWVudFsyXTtcblxuICAgIHN3aXRjaCh0YXJnZXRDb25kaXRpb24pIHtcbiAgICAgICAgY2FzZSBJU19DSEVDS0VEOlxuICAgICAgICAgICAgbGlzdGVuRm9yQ2hlY2sodGFyZ2V0RWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgSVNfTk9UX0NIRUNLRUQ6XG4gICAgICAgICAgICBsaXN0ZW5Gb3JVbmNoZWNrKHRhcmdldEVsZW1lbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZBTFVFX0VRVUFMUzpcbiAgICAgICAgY2FzZSBWQUxVRV9ET0VTX05PVF9FUVVBTDpcbiAgICAgICAgY2FzZSBWQUxVRV9JU19MRVNTX1RIQU46XG4gICAgICAgIGNhc2UgVkFMVUVfSVNfTU9SRV9USEFOOlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb25kaXRpb24gJyArIHRhcmdldENvbmRpdGlvbiArICcgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkIHlldCcpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1Vua25vd24gY29uZGl0aW9uICcgKyB0YXJnZXRDb25kaXRpb24pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBzdGF0ZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGVTdGF0ZW1lbnQoc3RhdGVtZW50LCBlbGVtZW50KSB7XG5cbiAgICBpZiAoc3RhdGVtZW50Lmxlbmd0aCA9PT0gMSkge1xuXG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gc3RhdGVtZW50WzBdO1xuXG4gICAgICAgIGlmIChpc0FjdGlvbkZyYWdtZW50KGZyYWdtZW50KSkge1xuICAgICAgICAgICAgZ2V0QWN0aW9uRnJvbUFjdGlvbkZyYWdtZW50KGZyYWdtZW50KShlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBleGVjdXRlIHVua25vd24gZnJhZ21lbnQgXCInICsgc3RhdGVtZW50ICsgJ1wiJyk7XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoc3RhdGVtZW50Lmxlbmd0aCA9PT0gMikge1xuXG4gICAgICAgIGNvbnN0IGxpc3RlbmVyRnJhZ21lbnQgPSBzdGF0ZW1lbnRbMF07XG4gICAgICAgIGNvbnN0IGFjdGlvbkZyYWdtZW50ID0gc3RhdGVtZW50WzFdO1xuXG4gICAgICAgIGlmICghaXNMaXN0ZW5lckZyYWdtZW50KGxpc3RlbmVyRnJhZ21lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmV4cGVjdGVkIGZyYWdtZW50IFwiJyArIGxpc3RlbmVyRnJhZ21lbnQgKyAnXCIuIEV4cGVjdGVkIGEgbGlzdGVuZXIgLyBjb25kaXRpb25hbCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FjdGlvbkZyYWdtZW50KGFjdGlvbkZyYWdtZW50KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5leHBlY3RlZCBmcmFnbWVudCBcIicgKyBhY3Rpb25GcmFnbWVudCArICdcIi4gRXhwZWN0ZWQgYW4gYWN0aW9uIGZyYWdtZW50Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBleGVjdXRlTGlzdGVuZXIoXG4gICAgICAgICAgICBsaXN0ZW5lckZyYWdtZW50LFxuICAgICAgICAgICAgZ2V0QWN0aW9uRnJvbUFjdGlvbkZyYWdtZW50KGFjdGlvbkZyYWdtZW50KS5iaW5kKHRoaXMsIGVsZW1lbnQpXG4gICAgICAgICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVW5leHBlY3RlZCBudW1iZXIgb2YgZnJhZ21lbnRzIGluIHN0YXRlbWVudC4gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuJyk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtcbiAgICBUT0tFTlMsXG4gICAgU1RBUlRfQVMsXG4gICAgSVNfQ0hFQ0tFRCxcbiAgICBJU19OT1RfQ0hFQ0tFRCxcbiAgICBMSVNURU5fRk9SLFxuICAgIFZBTFVFX0RPRVNfTk9UX0VRVUFMLFxuICAgIFZBTFVFX0VRVUFMUyxcbiAgICBWQUxVRV9JU19MRVNTX1RIQU4sXG4gICAgVkFMVUVfSVNfTU9SRV9USEFOLFxuICAgIERPX0FDVElPTixcbiAgICBISURERU4sXG4gICAgSElERSxcbiAgICBTSE9XSU5HLFxuICAgIFNIT1dcbn0gZnJvbSAnLi90b2tlbnMuanMnO1xuXG5jb25zdCBpc1N0cmluZyA9IHJlcXVpcmUoJ2lzLXN0cmluZycpO1xuY29uc3QgaXNOb3RTZXQgPSByZXF1aXJlKCdpcy1ub3Qtc2V0Jyk7XG5cbmNvbnN0IFNUUklOR1MgPSB7XG4gICAgRVJST1JTOiB7XG4gICAgICAgIE1JU1NJTkdfUkVRVUlSRURfSU5QVVQ6IGBSZXF1aXJlZCBhcmd1bWVudCAnaW5wdXQnIHdhcyBub3Qgc2V0YCxcbiAgICAgICAgSU5QVVRfTk9UX1NUUklOR19UWVBFOiBgQXJndW1lbnQgJ2lucHV0JyB3YXMgbm90IG9mIHJlcXVpcmVkIHR5cGUgU3RyaW5nYFxuICAgIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Rva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIFRPS0VOUy5pbmNsdWRlcyhpbnB1dCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHshc3RyaW5nfSBzdGF0ZW1lbnRcbiAqIEByZXR1cm5zIHshc3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUb2tlbnMoc3RhdGVtZW50KSB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3JkZXIgb2YgdGhlc2Uga2V5cyBtYXR0ZXJzIGdyZWF0bHkhXG4gICAgICovXG4gICAgY29uc3QgZnJhZ21lbnRSZXBsYWNlbWVudHMgPSB7XG4gICAgICAgICdJICc6ICAgICAgICAgICAgICAgICAgICAgICAnaSAnLFxuICAgICAgICAnc3RhcnQgYXMnOiAgICAgICAgICAgICAgICAgU1RBUlRfQVMsXG4gICAgICAgICdpcyBjaGVja2VkJzogICAgICAgICAgICAgICBJU19DSEVDS0VELFxuICAgICAgICAnaXMgbm90IGNoZWNrZWQnOiAgICAgICAgICAgSVNfTk9UX0NIRUNLRUQsXG4gICAgICAgICd3aGVuJzogICAgICAgICAgICAgICAgICAgICBMSVNURU5fRk9SLFxuICAgICAgICAnXFwncyB2YWx1ZSBpcyBsZXNzIHRoYW4nOiAgICcgJyArIFZBTFVFX0lTX0xFU1NfVEhBTixcbiAgICAgICAgJ1xcJ3MgdmFsdWUgaXMgbW9yZSB0aGFuJzogICAnICcgKyBWQUxVRV9JU19NT1JFX1RIQU4sXG4gICAgICAgICdcXCdzIHZhbHVlIGlzIG5vdCc6ICAgICAgICAgJyAnICsgVkFMVUVfRE9FU19OT1RfRVFVQUwsXG4gICAgICAgICdcXCdzIHZhbHVlIGlzJzogICAgICAgICAgICAgJyAnICsgVkFMVUVfRVFVQUxTLFxuICAgICAgICAnaSB3aWxsJzogICAgICAgICAgICAgICAgICAgJyAnICsgRE9fQUNUSU9OXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1vcmUgY29tcGxpY2F0ZWQgbm9ybWFsaXNhdGlvbiBoZXJlLi4uXG4gICAgICovXG4gICAgZnJhZ21lbnRSZXBsYWNlbWVudHNbYGkgJHtTVEFSVF9BU30gJHtISURERU59YF0gPSBgJHtET19BQ1RJT059ICR7SElERX1gO1xuICAgIGZyYWdtZW50UmVwbGFjZW1lbnRzW2BpICR7U1RBUlRfQVN9ICR7U0hPV0lOR31gXSA9IGAke0RPX0FDVElPTn0gJHtTSE9XfWA7XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlQWxsKGlucHV0LCByZXBsYWNlVGhpcywgd2l0aFRoaXMpIHtcbiAgICAgICAgbGV0IHJlcyA9IGlucHV0O1xuXG4gICAgICAgIHdoaWxlKHJlcy5pbmRleE9mKHJlcGxhY2VUaGlzKSA+IC0xKSB7XG4gICAgICAgICAgICByZXMgPSByZXMucmVwbGFjZShyZXBsYWNlVGhpcywgd2l0aFRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0gc3RhdGVtZW50O1xuXG4gICAgT2JqZWN0LmtleXMoZnJhZ21lbnRSZXBsYWNlbWVudHMpLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICByZXN1bHQgPSByZXBsYWNlQWxsKFxuICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgcHJvcCxcbiAgICAgICAgICAgIGZyYWdtZW50UmVwbGFjZW1lbnRzW3Byb3BdXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0LnRyaW0oKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSGFzaFNlbGVjdG9yKGlucHV0KSB7XG5cbiAgICBmdW5jdGlvbiBoYXNXaGl0ZVNwYWNlKGlucHV0KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2VlIHtAbGluayBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82NjIzMjUyLzEwNjMwMzV9XG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gaW5wdXQgPT09IGlucHV0LnJlcGxhY2UoL1xccy9nLCcnKTtcbiAgICB9XG5cbiAgICBpZiAoaXNOb3RTZXQoaW5wdXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihTVFJJTkdTLkVSUk9SUy5NSVNTSU5HX1JFUVVJUkVEX0lOUFVUKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzU3RyaW5nKGlucHV0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFNUUklOR1MuRVJST1JTLklOUFVUX05PVF9TVFJJTkdfVFlQRSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlucHV0LmNoYXJBdCgwKSA9PT0gJyMnICYmICFoYXNXaGl0ZVNwYWNlKGlucHV0KTtcbn0iLCJleHBvcnQgY29uc3QgSSA9ICdpJztcbmV4cG9ydCBjb25zdCBTVEFSVF9BUyA9ICdzdGFydF9hcyc7XG5leHBvcnQgY29uc3QgSVNfQ0hFQ0tFRCA9ICdpc19jaGVja2VkJztcbmV4cG9ydCBjb25zdCBJU19OT1RfQ0hFQ0tFRCA9ICdpc19ub3RfY2hlY2tlZCc7XG5leHBvcnQgY29uc3QgSElEREVOID0gJ2hpZGRlbic7XG5leHBvcnQgY29uc3QgU0hPV0lORyA9ICdzaG93aW5nJztcbmV4cG9ydCBjb25zdCBXSEVOID0gJ3doZW4nO1xuZXhwb3J0IGNvbnN0IENIRUNLRUQgPSAnY2hlY2tlZCc7XG5leHBvcnQgY29uc3QgU0VMRUNURUQgPSAnc2VsZWN0ZWQnO1xuZXhwb3J0IGNvbnN0IFdJTEwgPSAnd2lsbCc7XG5leHBvcnQgY29uc3QgU0hPVyA9ICdzaG93JztcbmV4cG9ydCBjb25zdCBISURFID0gJ2hpZGUnO1xuZXhwb3J0IGNvbnN0IElTID0gJ2lzJztcbmV4cG9ydCBjb25zdCBMSVNURU5fRk9SID0gJ2xpc3Rlbl9mb3InO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0VRVUFMUyA9ICd2YWx1ZV9lcXVhbHMnO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0RPRVNfTk9UX0VRVUFMID0gJ3ZhbHVlX2RvZXNfbm90X2VxdWFsJztcbmV4cG9ydCBjb25zdCBWQUxVRV9JU19MRVNTX1RIQU4gPSAndmFsdWVfaXNfbGVzc190aGFuJztcbmV4cG9ydCBjb25zdCBWQUxVRV9JU19NT1JFX1RIQU4gPSAndmFsdWVfaXNfbW9yZV90aGFuJztcbmV4cG9ydCBjb25zdCBET19BQ1RJT04gPSAnZG9fYWN0aW9uJztcblxuZXhwb3J0IGNvbnN0IFRPS0VOUyA9IFtcbiAgICBJLFxuICAgIFNUQVJUX0FTLFxuICAgIElTX0NIRUNLRUQsXG4gICAgSVNfTk9UX0NIRUNLRUQsXG4gICAgSElEREVOLFxuICAgIFNIT1dJTkcsXG4gICAgV0hFTixcbiAgICBDSEVDS0VELFxuICAgIFNFTEVDVEVELFxuICAgIFdJTEwsXG4gICAgU0hPVyxcbiAgICBISURFLFxuICAgIElTLFxuICAgIExJU1RFTl9GT1IsXG4gICAgVkFMVUVfRVFVQUxTLFxuICAgIFZBTFVFX0RPRVNfTk9UX0VRVUFMLFxuICAgIFZBTFVFX0lTX0xFU1NfVEhBTixcbiAgICBWQUxVRV9JU19NT1JFX1RIQU4sXG4gICAgRE9fQUNUSU9OXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBUT0tFTlM7Il19
