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
  debugger;
  /**
   * Find all the elements with a [data-abel] attribute on them and calls `init` on each.
   */
  Array.prototype.forEach.call(document.querySelectorAll("[data-abel]"), Abel);
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
        if (element.value == value) {
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

},{"./token-utils.js":10,"is-it-set":2,"is-not-set":3,"is-string":4}],8:[function(require,module,exports){


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

var replaceAll = require("./string-utils").replaceAll;

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

    /**
     * the rest of the array's values are anything that contained a space, so we need to put them
     * back together eg: "some required value" got split to ["some", "required", "value"].
     *
     * We also unquote the values because they are interpreted as strings anyway ('value' -> value)
     */
    var conditionValue = replaceAll(substatement.slice(3).join(" "), "'", "");

    switch (targetCondition) {
        case IS_CHECKED:
            listenForCheck(targetElement, callback);
            break;
        case IS_NOT_CHECKED:
            listenForUncheck(targetElement, callback);
            break;
        case VALUE_EQUALS:
            listenForMatchedValue(targetElement, conditionValue, callback);
            break;
        case VALUE_DOES_NOT_EQUAL:
            listenForUnmatchedValue(targetElement, conditionValue, callback);
            break;
        case VALUE_IS_LESS_THAN:
            listenForLessThan(targetElement, conditionValue, callback);
            break;
        case VALUE_IS_MORE_THAN:
            listenForGreaterThan(targetElement, conditionValue, callback);
            break;
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

},{"./action-utils.js":5,"./element-utils.js":6,"./string-utils":9,"./tokens":11}],9:[function(require,module,exports){
"use strict";

exports.replaceAll = replaceAll;
Object.defineProperty(exports, "__esModule", {
    value: true
});

function replaceAll(input, replaceThis, withThis) {
    var res = input;

    while (res.indexOf(replaceThis) > -1) {
        res = res.replace(replaceThis, withThis);
    }

    return res;
}

},{}],10:[function(require,module,exports){
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

var replaceAll = require("./string-utils").replaceAll;

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

},{"./string-utils":9,"./tokens.js":11,"is-not-set":3,"is-string":4}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtaXQtc2V0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLW5vdC1zZXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtc3RyaW5nL2luZGV4LmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL2FjdGlvbi11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy9lbGVtZW50LXV0aWxzLmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL2xleGVyLmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL3N0YXRlbWVudC11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy9zdHJpbmctdXRpbHMuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvdG9rZW4tdXRpbHMuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvdG9rZW5zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOztJQUVKLFdBQVcsV0FBUSxTQUFTLEVBQTVCLFdBQVc7O0lBQ1gsZ0JBQWdCLFdBQVEsc0JBQXNCLEVBQTlDLGdCQUFnQjs7QUFFekIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV2QyxJQUFNLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNQLDhCQUEwQixFQUFFLDhIQUE4SDtHQUMxSjtDQUNELENBQUM7O0FBRUYsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXLEVBQUU7QUFDcEMsUUFBTSxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUM7Q0FDcEU7Ozs7O0FBS0QsU0FBUyxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUVu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SSxHQUFHLE1BQU0sQ0FBQztRQUFkLElBQUksR0FBSixJQUFJO0FBQ1YsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQVYsRUFBRSxHQUFGLEVBQUU7QUFDUixJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUM7UUFBMUIsVUFBVSxHQUFWLFVBQVU7QUFDaEIsSUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDO1FBQTlCLFlBQVksR0FBWixZQUFZO0FBQ2xCLElBQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUM7UUFBOUMsb0JBQW9CLEdBQXBCLG9CQUFvQjtBQUMxQixJQUFNLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO1FBQTFDLGtCQUFrQixHQUFsQixrQkFBa0I7QUFDeEIsSUFBTSxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztRQUExQyxrQkFBa0IsR0FBbEIsa0JBQWtCO0FBQ3hCLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQzs7UUFBeEIsU0FBUyxHQUFULFNBQVM7QUFFZixJQUFNLE1BQU0sR0FBRyxDQUNsQixDQUFDLEVBQ0QsUUFBUSxFQUNSLFVBQVUsRUFDVixjQUFjLEVBQ2QsTUFBTSxFQUNOLE9BQU8sRUFDUCxJQUFJLEVBQ0osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osSUFBSSxFQUNKLElBQUksRUFDSixFQUFFLEVBQ0YsVUFBVSxFQUNWLFlBQVksRUFDWixvQkFBb0IsRUFDcEIsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixTQUFTLENBQ1osQ0FBQzs7UUFwQlcsTUFBTSxHQUFOLE1BQU07cUJBc0JKLE1BQU0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBwYXJzZURlY3JlZSB9IGZyb20gJy4vbGV4ZXInO1xuaW1wb3J0IHsgZXhlY3V0ZVN0YXRlbWVudCB9IGZyb20gJy4vc3RhdGVtZW50LXV0aWxzLmpzJztcblxuY29uc3QgaXNOb3RTZXQgPSByZXF1aXJlKCdpcy1ub3Qtc2V0Jyk7XG5cbmNvbnN0IFNUUklOR1MgPSB7XG5cdEVSUk9SUzoge1xuXHRcdE1JU1NJTkdfRE9DVU1FTlRfUkVGRVJFTkNFOiAnQWJlbCBjb3VsZCBub3QgYmUgaW5pdGlhbGlzZWQ6IHRoZSBkb2N1bWVudCBvYmplY3Qgd2FzIHVuZGVmaW5lZC4gUGxlYXNlIGVuc3VyZSB5b3UgYXJlIHJ1bm5pbmcgQWJlbCBmcm9tIGEgYnJvd3NlciBjb250ZXh0Lidcblx0fVxufTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFNUUklOR1MuRVJST1JTLk1JU1NJTkdfRE9DVU1FTlRfUkVGRVJFTkNFKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIEFiZWwoZWxlbWVudCkge1xuXG4gICAgZnVuY3Rpb24gaXNFbGVtZW50KG8pe1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiID8gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IDogLy9ET00yXG4gICAgICAgICAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIG8gIT09IG51bGwgJiYgby5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygby5ub2RlTmFtZT09PVwic3RyaW5nXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbml0aWFsRXJyb3IgPSAnQWJlbCByZXF1aXJlcyBhIHJlZmVyZW5jZSB0byBhIERPTSBlbGVtZW50IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb25zdHJ1Y3RvciwgYnV0IFwiJyArIGVsZW1lbnQgKyAnXCIgd2FzIHBhc3NlZCBpbnN0ZWFkJztcblxuICAgIGlmIChpc05vdFNldChlbGVtZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoaW5pdGlhbEVycm9yKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGluaXRpYWxFcnJvcik7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3RGVjcmVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWJlbCcpO1xuXG4gICAgaWYgKGlzTm90U2V0KHJhd0RlY3JlZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdDYW5ub3QgcnVuIEFiZWwgb24gZWxlbWVudCAnICsgZWxlbWVudCArICcgYmVjYXVzZSBpdCBpcyBtaXNzaW5nIHRoZSByZXF1aXJlZCBcImRhdGEtYWJlbFwiIGF0dHJpYnV0ZS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNyZWUgPSBwYXJzZURlY3JlZShyYXdEZWNyZWUpO1xuXG4gICAgZGVjcmVlLmZvckVhY2goZnVuY3Rpb24oc3RhdGVtZW50KSB7XG4gICAgICAgIGV4ZWN1dGVTdGF0ZW1lbnQoc3RhdGVtZW50LCBlbGVtZW50KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kT2Yge0FiZWx9XG4gKi9cbmZ1bmN0aW9uIGdvKCkge1xuICAgIGRlYnVnZ2VyO1xuICAgIC8qKlxuICAgICAqIEZpbmQgYWxsIHRoZSBlbGVtZW50cyB3aXRoIGEgW2RhdGEtYWJlbF0gYXR0cmlidXRlIG9uIHRoZW0gYW5kIGNhbGxzIGBpbml0YCBvbiBlYWNoLlxuICAgICAqL1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hYmVsXScpLFxuICAgIFx0QWJlbFxuICAgICk7XG59XG5cbkFiZWwuZ28gPSBnbztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSBiZWhhdmlvdXIgb2YgQWJlbCBiYXNlZCBvbiB3aGV0aGVyIHdlIGFyZSBpbiBhIE5vZGUtaXNoIGVudmlyb25tZW50IG9yIG5vdC5cbiAqIEBzZWUge0BsaW5rIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExOTE4MzY4LzEwNjMwMzV9XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNOb2RlID0gKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLm1vZHVsZSAhPT0gbW9kdWxlKTtcblxuaWYgKGlzTm9kZSkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IEFiZWw7XG59IGVsc2Uge1xuXHR3aW5kb3cuQWJlbCA9IEFiZWw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFiZWw7IiwidmFyIGlzTm90U2V0ID0gcmVxdWlyZSgnaXMtbm90LXNldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgcmV0dXJuICFpc05vdFNldChpbnB1dCk7XG59O1xuXG4iLCJmdW5jdGlvbiBpc05vdFNldCh2YWwpIHtcbiAgICByZXR1cm4gKHZhbCA9PT0gdW5kZWZpbmVkKSB8fCAodmFsID09PSAnJykgfHwgKHZhbCA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOb3RTZXQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyVmFsdWUgPSBTdHJpbmcucHJvdG90eXBlLnZhbHVlT2Y7XG52YXIgdHJ5U3RyaW5nT2JqZWN0ID0gZnVuY3Rpb24gdHJ5U3RyaW5nT2JqZWN0KHZhbHVlKSB7XG5cdHRyeSB7XG5cdFx0c3RyVmFsdWUuY2FsbCh2YWx1ZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHN0ckNsYXNzID0gJ1tvYmplY3QgU3RyaW5nXSc7XG52YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7IHJldHVybiB0cnVlOyB9XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuXHRyZXR1cm4gaGFzVG9TdHJpbmdUYWcgPyB0cnlTdHJpbmdPYmplY3QodmFsdWUpIDogdG9TdHIuY2FsbCh2YWx1ZSkgPT09IHN0ckNsYXNzO1xufTtcbiIsIi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFRoZSBjaGVja2JveCBET00gbm9kZSB0byB3YXRjaFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckNoZWNrKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgY2hlY2tib3ggRE9NIG5vZGUgdG8gd2F0Y2hcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JVbmNoZWNrKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JNYXRjaGVkVmFsdWUoZWxlbWVudCwgdmFsdWUsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAoZWxlbWVudC52YWx1ZSA9PSB2YWx1ZSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvclVubWF0Y2hlZFZhbHVlKGVsZW1lbnQsIHZhbHVlLCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQudmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuRm9yR3JlYXRlclRoYW4oZWxlbWVudCwgdmFsdWUsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAocGFyc2VGbG9hdChlbGVtZW50LnZhbHVlKSA+IHBhcnNlRmxvYXQodmFsdWUpKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuRm9yTGVzc1RoYW4oZWxlbWVudCwgdmFsdWUsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAocGFyc2VGbG9hdChlbGVtZW50LnZhbHVlKSA8IHBhcnNlRmxvYXQodmFsdWUpKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEhpZGVzIHRoZSBgZWxlbWVudGAgdXNpbmcgaW5saW5lIENTUy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoaWRlKGVsZW1lbnQpIHtcblx0ZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufVxuXG4vKipcbiAqIFNob3dzIHRoZSBgZWxlbWVudGAgdXNpbmcgaW5saW5lIENTUy4gV2FybmluZzogdGhpcyB3aWxsIHNldCB0aGUgZWxlbWVudCdzIHN0eWxlIHRvIGl0J3MgZGVmYXVsdCBkaXNwbGF5LCBlZzpcbiAqIGA8ZGl2PmAgd2lsbCBiZSBgYmxvY2tgLCBhbmQgYDxzcGFuPmAgd2lsbCBiZSBgaW5saW5lYC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvdyhlbGVtZW50KSB7XG5cblx0dmFyIGVsZW1lbnRTdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG5cdHZhciBOT05FID0gJ25vbmUnO1xuXHR2YXIgRElTUExBWSA9ICdkaXNwbGF5JztcblxuXHQvKipcblx0ICogR2V0IHRoZSBkZWZhdWx0IENTUyBkaXNwbGF5IHZhbHVlIG9mIGBub2RlTmFtZWAgZWxlbWVudHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7IXN0cmluZ30gbm9kZU5hbWUgLSBhIHRhZyBuYW1lIGxpa2UgJ2Rpdicgb3IgJ3NwYW4nIG9yICdpbnB1dCdcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdGZ1bmN0aW9uIGdldERlZmF1bHREaXNwbGF5KG5vZGVOYW1lKSB7XG5cblx0XHR2YXIgdGVtcEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblx0XHR2YXIgZGlzcGxheTtcblxuXHRcdC8vIGNyZWF0ZSBhIHRlbXBvcmFyeSBET00gbm9kZSBhbmQgc2VlIHdoYXQgaXQncyBkaXNwbGF5IHZhbHVlIGlzXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZW1wRWxlbWVudCk7XG5cdFx0ZGlzcGxheSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRlbXBFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKERJU1BMQVkpO1xuXHRcdHRlbXBFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGVtcEVsZW1lbnQpO1xuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRpZihkaXNwbGF5ID09IE5PTkUpIHtcblx0XHRcdGRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdH1cblxuXHRcdHJldHVybiBkaXNwbGF5O1xuXHR9XG5cblx0aWYgKGVsZW1lbnRTdHlsZVtESVNQTEFZXSA9PT0gTk9ORSkge1xuXHRcdGVsZW1lbnRTdHlsZVtESVNQTEFZXSA9ICcnO1xuXHR9XG5cblx0aWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ2Rpc3BsYXknKSA9PT0gTk9ORSkge1xuXHRcdGVsZW1lbnRTdHlsZVtESVNQTEFZXSA9IGdldERlZmF1bHREaXNwbGF5KGVsZW1lbnQubm9kZU5hbWUpO1xuXHR9XG59XG5cbi8qKlxuICogRmluZHMgYW55IGAjc2VsZWN0b3JgcyBpbiBhIHN0YXRlbWVudCBhbmQgcmVwbGFjZXMgdGhlbSB3aXRoIGFjdHVhbCBET00gcmVmZXJlbmNlc1xuICogQHBhcmFtIGlucHV0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50RnJvbVNlbGVjdG9yKGlucHV0KSB7XG4gICAgaWYgKGlucHV0LnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpbnB1dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBUYWtlcyBhIHF1ZXJ5U2VsZWN0b3Igc3RyaW5nIHRoYXQgc3RhcnRzIHdpdGggYCcjJ2AgYW5kIHJldHVybnMgYW4gZWxlbWVudCBieSBpdCdzIGlkLlxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmF0aXZlIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yYCBvciBldmVuIGBkb2N1bWVudC5nZXRFbGVtZW50QnlJZGAgaW5zdGVhZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB9IGhhc2hTZWxlY3RvclxuICogQHJldHVybnMge0VsZW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlIYXNoU2VsZWN0b3IoaGFzaFNlbGVjdG9yKSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGhhc2hTZWxlY3Rvcik7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBpc05vdFNldCA9IHJlcXVpcmUoJ2lzLW5vdC1zZXQnKTtcbmNvbnN0IGlzU3RyaW5nID0gcmVxdWlyZSgnaXMtc3RyaW5nJyk7XG5jb25zdCBpc1NldCA9IHJlcXVpcmUoJ2lzLWl0LXNldCcpO1xuXG5pbXBvcnQgeyBwYXJzZVRva2VucyB9IGZyb20gJy4vdG9rZW4tdXRpbHMuanMnO1xuXG5jb25zdCBTVFJJTkdTID0ge1xuXHRFUlJPUlM6IHtcblx0XHRNSVNTSU5HX1JFUVVJUkVEX0lOUFVUOiBgUmVxdWlyZWQgYXJndW1lbnQgJ2lucHV0JyB3YXMgbm90IHByb3ZpZGVkLmAsXG5cdFx0RVhQRUNURURfVFlQRV9TVFJJTkc6IGBBcmd1bWVudCAnaW5wdXQnIHdhcyBub3Qgb2YgcmVxdWlyZWQgdHlwZSAnc3RyaW5nJy5gXG5cdH1cbn07XG5cbi8qKlxuICogU2VwYXJhdGVzIGEgZGVjcmVlIGludG8gaXRzIGluZGl2aWR1YWwgc3RhdGVtZW50cyAoc3RpbGwgcmF3LCB1bi1wYXJzZWQgYW5kIHVuLWZvcm1hdHRlZClcbiAqXG4gKiBAcGFyYW0geyFzdHJpbmd9IGlucHV0XG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn1cbiAqL1xuZnVuY3Rpb24gZ2V0U3RhdGVtZW50U3RyaW5ncyhpbnB1dCkge1xuXHRpZiAoaXNOb3RTZXQoaW5wdXQpKSB7XG5cdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFNUUklOR1MuRVJST1JTLk1JU1NJTkdfUkVRVUlSRURfSU5QVVQpO1xuXHR9XG5cblx0aWYgKCFpc1N0cmluZyhpbnB1dCkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFNUUklOR1MuRVJST1JTLkVYUEVDVEVEX1RZUEVfU1RSSU5HKTtcblx0fVxuXG5cdHJldHVybiBlbGltaW5hdGVVc2VsZXNzSXRlbXMoaW5wdXQuc3BsaXQoJy4nKSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlbWVudFxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiBwYXJzZVN0YXRlbWVudChzdGF0ZW1lbnQpIHtcbiAgICByZXR1cm4gZWxpbWluYXRlVXNlbGVzc0l0ZW1zKFxuICAgICAgICBzdGF0ZW1lbnQuc3BsaXQoJywnKVxuICAgICkubWFwKHBhcnNlVG9rZW5zKTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIHdoaXRlc3BhY2UsIGFuZCBsaW5lIGJyZWFrcyBmcm9tIGVhY2ggaXRlbSwgYW5kIHJldHVybnMgb25seSB0aG9zZSB3aG8gc3RpbGwgaGF2ZSBhIHZhbHVlXG4gKlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gaW5wdXRzXG4gKiBAcmV0dXJucyB7QXJyYXkuPHN0cmluZz59XG4gKi9cbmZ1bmN0aW9uIGVsaW1pbmF0ZVVzZWxlc3NJdGVtcyhpbnB1dHMpIHtcblx0cmV0dXJuIGlucHV0cy5tYXAodHJpbSkuZmlsdGVyKGlzU2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyFzdHJpbmd9IGlucHV0XG4gKiBAcmV0dXJuIHshc3RyaW5nfVxuICogQHRocm93cyB7UmVmZXJlbmNlRXJyb3J9XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIHRyaW0oaW5wdXQpIHtcblx0aWYgKGlzTm90U2V0KGlucHV0KSkge1xuXHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihTVFJJTkdTLkVSUk9SUy5NSVNTSU5HX1JFUVVJUkVEX0lOUFVUKTtcblx0fVxuXG5cdGlmICghaXNTdHJpbmcoaW5wdXQpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihTVFJJTkdTLkVSUk9SUy5FWFBFQ1RFRF9UWVBFX1NUUklORyk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQudHJpbSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEZWNyZWUoaW5wdXQpIHtcblx0Y29uc3QgcmF3U3RhdGVtZW50cyA9IGdldFN0YXRlbWVudFN0cmluZ3MoaW5wdXQpO1xuXHRjb25zdCBwYXJzZWRTdGF0ZW1lbnRzID0gcmF3U3RhdGVtZW50cy5tYXAocGFyc2VTdGF0ZW1lbnQpO1xuXG5cdHJldHVybiBwYXJzZWRTdGF0ZW1lbnRzO1xufSIsImltcG9ydCB7IHNob3csIGhpZGUgfSBmcm9tICcuL2VsZW1lbnQtdXRpbHMuanMnO1xuaW1wb3J0IHsgcmVwbGFjZUFsbCB9IGZyb20gJy4vc3RyaW5nLXV0aWxzJztcbmltcG9ydCB7XG4gICAgbGlzdGVuRm9yQ2hlY2ssXG4gICAgbGlzdGVuRm9yVW5jaGVjayxcbiAgICBsaXN0ZW5Gb3JNYXRjaGVkVmFsdWUsXG4gICAgbGlzdGVuRm9yVW5tYXRjaGVkVmFsdWUsXG4gICAgbGlzdGVuRm9yR3JlYXRlclRoYW4sXG4gICAgbGlzdGVuRm9yTGVzc1RoYW5cbn0gZnJvbSAnLi9hY3Rpb24tdXRpbHMuanMnO1xuaW1wb3J0IHtcbiAgICBET19BQ1RJT04sXG4gICAgU0hPVyxcbiAgICBISURFLFxuICAgIExJU1RFTl9GT1IsXG4gICAgVkFMVUVfRVFVQUxTLFxuICAgIFZBTFVFX0RPRVNfTk9UX0VRVUFMLFxuICAgIFZBTFVFX0lTX0xFU1NfVEhBTixcbiAgICBWQUxVRV9JU19NT1JFX1RIQU4sXG4gICAgSVNfQ0hFQ0tFRCxcbiAgICBJU19OT1RfQ0hFQ0tFRFxufSBmcm9tICcuL3Rva2Vucyc7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbkZyYWdtZW50XG4gKiBAcmV0dXJucyB7KHNob3d8aGlkZSl9XG4gKi9cbmZ1bmN0aW9uIGdldEFjdGlvbkZyb21BY3Rpb25GcmFnbWVudChhY3Rpb25GcmFnbWVudCkge1xuICAgIGNvbnN0IGFjdGlvbiA9IGFjdGlvbkZyYWdtZW50LnJlcGxhY2UoRE9fQUNUSU9OLCAnJykudHJpbSgpO1xuXG4gICAgc3dpdGNoKGFjdGlvbikge1xuICAgICAgICBjYXNlIFNIT1c6XG4gICAgICAgICAgICByZXR1cm4gc2hvdztcbiAgICAgICAgY2FzZSBISURFOlxuICAgICAgICAgICAgcmV0dXJuIGhpZGU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQ2Fubm90IGV4ZWN1dGUgdW5rbm93biBhY3Rpb24gc3RhdGVtZW50IFwiJyArIGFjdGlvbkZyYWdtZW50ICsgJ1wiJyk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQWN0aW9uRnJhZ21lbnQoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQuc3RhcnRzV2l0aChET19BQ1RJT04pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzTGlzdGVuZXJGcmFnbWVudChpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dC5zdGFydHNXaXRoKExJU1RFTl9GT1IpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0ZW5lckZyYWdtZW50IC1cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIG1ldGhvZCB0byBjYWxsIHdoZW4gdGhlIGxpc3RlbmVyIGZpcmVzXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVMaXN0ZW5lcihsaXN0ZW5lckZyYWdtZW50LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHN1YnN0YXRlbWVudCA9IGxpc3RlbmVyRnJhZ21lbnQuc3BsaXQoJyAnKTtcblxuICAgIC8vIHdlIGlnbm9yZSBzdWJzdGF0ZW1lbnRbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdWJzdGF0ZW1lbnRbMV0pO1xuICAgIGNvbnN0IHRhcmdldENvbmRpdGlvbiA9IHN1YnN0YXRlbWVudFsyXTtcblxuICAgIC8qKlxuICAgICAqIHRoZSByZXN0IG9mIHRoZSBhcnJheSdzIHZhbHVlcyBhcmUgYW55dGhpbmcgdGhhdCBjb250YWluZWQgYSBzcGFjZSwgc28gd2UgbmVlZCB0byBwdXQgdGhlbVxuICAgICAqIGJhY2sgdG9nZXRoZXIgZWc6IFwic29tZSByZXF1aXJlZCB2YWx1ZVwiIGdvdCBzcGxpdCB0byBbXCJzb21lXCIsIFwicmVxdWlyZWRcIiwgXCJ2YWx1ZVwiXS5cbiAgICAgKlxuICAgICAqIFdlIGFsc28gdW5xdW90ZSB0aGUgdmFsdWVzIGJlY2F1c2UgdGhleSBhcmUgaW50ZXJwcmV0ZWQgYXMgc3RyaW5ncyBhbnl3YXkgKCd2YWx1ZScgLT4gdmFsdWUpXG4gICAgICovXG4gICAgY29uc3QgY29uZGl0aW9uVmFsdWUgPSByZXBsYWNlQWxsKHN1YnN0YXRlbWVudC5zbGljZSgzKS5qb2luKCcgJyksICdcXCcnLCAnJyk7XG5cbiAgICBzd2l0Y2godGFyZ2V0Q29uZGl0aW9uKSB7XG4gICAgICAgIGNhc2UgSVNfQ0hFQ0tFRDpcbiAgICAgICAgICAgIGxpc3RlbkZvckNoZWNrKHRhcmdldEVsZW1lbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIElTX05PVF9DSEVDS0VEOlxuICAgICAgICAgICAgbGlzdGVuRm9yVW5jaGVjayh0YXJnZXRFbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWQUxVRV9FUVVBTFM6XG4gICAgICAgICAgICBsaXN0ZW5Gb3JNYXRjaGVkVmFsdWUodGFyZ2V0RWxlbWVudCwgY29uZGl0aW9uVmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZBTFVFX0RPRVNfTk9UX0VRVUFMOlxuICAgICAgICAgICAgbGlzdGVuRm9yVW5tYXRjaGVkVmFsdWUodGFyZ2V0RWxlbWVudCwgY29uZGl0aW9uVmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZBTFVFX0lTX0xFU1NfVEhBTjpcbiAgICAgICAgICAgIGxpc3RlbkZvckxlc3NUaGFuKHRhcmdldEVsZW1lbnQsIGNvbmRpdGlvblZhbHVlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWQUxVRV9JU19NT1JFX1RIQU46XG4gICAgICAgICAgICBsaXN0ZW5Gb3JHcmVhdGVyVGhhbih0YXJnZXRFbGVtZW50LCBjb25kaXRpb25WYWx1ZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVW5rbm93biBjb25kaXRpb24gJyArIHRhcmdldENvbmRpdGlvbik7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHN0YXRlbWVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZVN0YXRlbWVudChzdGF0ZW1lbnQsIGVsZW1lbnQpIHtcblxuICAgIGlmIChzdGF0ZW1lbnQubGVuZ3RoID09PSAxKSB7XG5cbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBzdGF0ZW1lbnRbMF07XG5cbiAgICAgICAgaWYgKGlzQWN0aW9uRnJhZ21lbnQoZnJhZ21lbnQpKSB7XG4gICAgICAgICAgICBnZXRBY3Rpb25Gcm9tQWN0aW9uRnJhZ21lbnQoZnJhZ21lbnQpKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGV4ZWN1dGUgdW5rbm93biBmcmFnbWVudCBcIicgKyBzdGF0ZW1lbnQgKyAnXCInKTtcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChzdGF0ZW1lbnQubGVuZ3RoID09PSAyKSB7XG5cbiAgICAgICAgY29uc3QgbGlzdGVuZXJGcmFnbWVudCA9IHN0YXRlbWVudFswXTtcbiAgICAgICAgY29uc3QgYWN0aW9uRnJhZ21lbnQgPSBzdGF0ZW1lbnRbMV07XG5cbiAgICAgICAgaWYgKCFpc0xpc3RlbmVyRnJhZ21lbnQobGlzdGVuZXJGcmFnbWVudCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VuZXhwZWN0ZWQgZnJhZ21lbnQgXCInICsgbGlzdGVuZXJGcmFnbWVudCArICdcIi4gRXhwZWN0ZWQgYSBsaXN0ZW5lciAvIGNvbmRpdGlvbmFsJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQWN0aW9uRnJhZ21lbnQoYWN0aW9uRnJhZ21lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmV4cGVjdGVkIGZyYWdtZW50IFwiJyArIGFjdGlvbkZyYWdtZW50ICsgJ1wiLiBFeHBlY3RlZCBhbiBhY3Rpb24gZnJhZ21lbnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4ZWN1dGVMaXN0ZW5lcihcbiAgICAgICAgICAgIGxpc3RlbmVyRnJhZ21lbnQsXG4gICAgICAgICAgICBnZXRBY3Rpb25Gcm9tQWN0aW9uRnJhZ21lbnQoYWN0aW9uRnJhZ21lbnQpLmJpbmQodGhpcywgZWxlbWVudClcbiAgICAgICAgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdVbmV4cGVjdGVkIG51bWJlciBvZiBmcmFnbWVudHMgaW4gc3RhdGVtZW50LiBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4nKTtcbiAgICB9XG5cbn0iLCJleHBvcnQgZnVuY3Rpb24gcmVwbGFjZUFsbChpbnB1dCwgcmVwbGFjZVRoaXMsIHdpdGhUaGlzKSB7XG4gICAgbGV0IHJlcyA9IGlucHV0O1xuXG4gICAgd2hpbGUocmVzLmluZGV4T2YocmVwbGFjZVRoaXMpID4gLTEpIHtcbiAgICAgICAgcmVzID0gcmVzLnJlcGxhY2UocmVwbGFjZVRoaXMsIHdpdGhUaGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xufSIsImltcG9ydCB7XG4gICAgVE9LRU5TLFxuICAgIFNUQVJUX0FTLFxuICAgIElTX0NIRUNLRUQsXG4gICAgSVNfTk9UX0NIRUNLRUQsXG4gICAgTElTVEVOX0ZPUixcbiAgICBWQUxVRV9ET0VTX05PVF9FUVVBTCxcbiAgICBWQUxVRV9FUVVBTFMsXG4gICAgVkFMVUVfSVNfTEVTU19USEFOLFxuICAgIFZBTFVFX0lTX01PUkVfVEhBTixcbiAgICBET19BQ1RJT04sXG4gICAgSElEREVOLFxuICAgIEhJREUsXG4gICAgU0hPV0lORyxcbiAgICBTSE9XXG59IGZyb20gJy4vdG9rZW5zLmpzJztcbmltcG9ydCB7IHJlcGxhY2VBbGwgfSBmcm9tICcuL3N0cmluZy11dGlscyc7XG5cbmNvbnN0IGlzU3RyaW5nID0gcmVxdWlyZSgnaXMtc3RyaW5nJyk7XG5jb25zdCBpc05vdFNldCA9IHJlcXVpcmUoJ2lzLW5vdC1zZXQnKTtcblxuY29uc3QgU1RSSU5HUyA9IHtcbiAgICBFUlJPUlM6IHtcbiAgICAgICAgTUlTU0lOR19SRVFVSVJFRF9JTlBVVDogYFJlcXVpcmVkIGFyZ3VtZW50ICdpbnB1dCcgd2FzIG5vdCBzZXRgLFxuICAgICAgICBJTlBVVF9OT1RfU1RSSU5HX1RZUEU6IGBBcmd1bWVudCAnaW5wdXQnIHdhcyBub3Qgb2YgcmVxdWlyZWQgdHlwZSBTdHJpbmdgXG4gICAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gVE9LRU5TLmluY2x1ZGVzKGlucHV0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyFzdHJpbmd9IHN0YXRlbWVudFxuICogQHJldHVybnMgeyFzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRva2VucyhzdGF0ZW1lbnQpIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBvcmRlciBvZiB0aGVzZSBrZXlzIG1hdHRlcnMgZ3JlYXRseSFcbiAgICAgKi9cbiAgICBjb25zdCBmcmFnbWVudFJlcGxhY2VtZW50cyA9IHtcbiAgICAgICAgJ0kgJzogICAgICAgICAgICAgICAgICAgICAgICdpICcsXG4gICAgICAgICdzdGFydCBhcyc6ICAgICAgICAgICAgICAgICBTVEFSVF9BUyxcbiAgICAgICAgJ2lzIGNoZWNrZWQnOiAgICAgICAgICAgICAgIElTX0NIRUNLRUQsXG4gICAgICAgICdpcyBub3QgY2hlY2tlZCc6ICAgICAgICAgICBJU19OT1RfQ0hFQ0tFRCxcbiAgICAgICAgJ3doZW4nOiAgICAgICAgICAgICAgICAgICAgIExJU1RFTl9GT1IsXG4gICAgICAgICdcXCdzIHZhbHVlIGlzIGxlc3MgdGhhbic6ICAgJyAnICsgVkFMVUVfSVNfTEVTU19USEFOLFxuICAgICAgICAnXFwncyB2YWx1ZSBpcyBtb3JlIHRoYW4nOiAgICcgJyArIFZBTFVFX0lTX01PUkVfVEhBTixcbiAgICAgICAgJ1xcJ3MgdmFsdWUgaXMgbm90JzogICAgICAgICAnICcgKyBWQUxVRV9ET0VTX05PVF9FUVVBTCxcbiAgICAgICAgJ1xcJ3MgdmFsdWUgaXMnOiAgICAgICAgICAgICAnICcgKyBWQUxVRV9FUVVBTFMsXG4gICAgICAgICdpIHdpbGwnOiAgICAgICAgICAgICAgICAgICAnICcgKyBET19BQ1RJT05cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTW9yZSBjb21wbGljYXRlZCBub3JtYWxpc2F0aW9uIGhlcmUuLi5cbiAgICAgKi9cbiAgICBmcmFnbWVudFJlcGxhY2VtZW50c1tgaSAke1NUQVJUX0FTfSAke0hJRERFTn1gXSA9IGAke0RPX0FDVElPTn0gJHtISURFfWA7XG4gICAgZnJhZ21lbnRSZXBsYWNlbWVudHNbYGkgJHtTVEFSVF9BU30gJHtTSE9XSU5HfWBdID0gYCR7RE9fQUNUSU9OfSAke1NIT1d9YDtcblxuICAgIGxldCByZXN1bHQgPSBzdGF0ZW1lbnQ7XG5cbiAgICBPYmplY3Qua2V5cyhmcmFnbWVudFJlcGxhY2VtZW50cykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlcGxhY2VBbGwoXG4gICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICBwcm9wLFxuICAgICAgICAgICAgZnJhZ21lbnRSZXBsYWNlbWVudHNbcHJvcF1cbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQudHJpbSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIYXNoU2VsZWN0b3IoaW5wdXQpIHtcblxuICAgIGZ1bmN0aW9uIGhhc1doaXRlU3BhY2UoaW5wdXQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzY2MjMyNTIvMTA2MzAzNX1cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBpbnB1dCA9PT0gaW5wdXQucmVwbGFjZSgvXFxzL2csJycpO1xuICAgIH1cblxuICAgIGlmIChpc05vdFNldChpbnB1dCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFNUUklOR1MuRVJST1JTLk1JU1NJTkdfUkVRVUlSRURfSU5QVVQpO1xuICAgIH1cblxuICAgIGlmICghaXNTdHJpbmcoaW5wdXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoU1RSSU5HUy5FUlJPUlMuSU5QVVRfTk9UX1NUUklOR19UWVBFKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5wdXQuY2hhckF0KDApID09PSAnIycgJiYgIWhhc1doaXRlU3BhY2UoaW5wdXQpO1xufSIsImV4cG9ydCBjb25zdCBJID0gJ2knO1xuZXhwb3J0IGNvbnN0IFNUQVJUX0FTID0gJ3N0YXJ0X2FzJztcbmV4cG9ydCBjb25zdCBJU19DSEVDS0VEID0gJ2lzX2NoZWNrZWQnO1xuZXhwb3J0IGNvbnN0IElTX05PVF9DSEVDS0VEID0gJ2lzX25vdF9jaGVja2VkJztcbmV4cG9ydCBjb25zdCBISURERU4gPSAnaGlkZGVuJztcbmV4cG9ydCBjb25zdCBTSE9XSU5HID0gJ3Nob3dpbmcnO1xuZXhwb3J0IGNvbnN0IFdIRU4gPSAnd2hlbic7XG5leHBvcnQgY29uc3QgQ0hFQ0tFRCA9ICdjaGVja2VkJztcbmV4cG9ydCBjb25zdCBTRUxFQ1RFRCA9ICdzZWxlY3RlZCc7XG5leHBvcnQgY29uc3QgV0lMTCA9ICd3aWxsJztcbmV4cG9ydCBjb25zdCBTSE9XID0gJ3Nob3cnO1xuZXhwb3J0IGNvbnN0IEhJREUgPSAnaGlkZSc7XG5leHBvcnQgY29uc3QgSVMgPSAnaXMnO1xuZXhwb3J0IGNvbnN0IExJU1RFTl9GT1IgPSAnbGlzdGVuX2Zvcic7XG5leHBvcnQgY29uc3QgVkFMVUVfRVFVQUxTID0gJ3ZhbHVlX2VxdWFscyc7XG5leHBvcnQgY29uc3QgVkFMVUVfRE9FU19OT1RfRVFVQUwgPSAndmFsdWVfZG9lc19ub3RfZXF1YWwnO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0lTX0xFU1NfVEhBTiA9ICd2YWx1ZV9pc19sZXNzX3RoYW4nO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0lTX01PUkVfVEhBTiA9ICd2YWx1ZV9pc19tb3JlX3RoYW4nO1xuZXhwb3J0IGNvbnN0IERPX0FDVElPTiA9ICdkb19hY3Rpb24nO1xuXG5leHBvcnQgY29uc3QgVE9LRU5TID0gW1xuICAgIEksXG4gICAgU1RBUlRfQVMsXG4gICAgSVNfQ0hFQ0tFRCxcbiAgICBJU19OT1RfQ0hFQ0tFRCxcbiAgICBISURERU4sXG4gICAgU0hPV0lORyxcbiAgICBXSEVOLFxuICAgIENIRUNLRUQsXG4gICAgU0VMRUNURUQsXG4gICAgV0lMTCxcbiAgICBTSE9XLFxuICAgIEhJREUsXG4gICAgSVMsXG4gICAgTElTVEVOX0ZPUixcbiAgICBWQUxVRV9FUVVBTFMsXG4gICAgVkFMVUVfRE9FU19OT1RfRVFVQUwsXG4gICAgVkFMVUVfSVNfTEVTU19USEFOLFxuICAgIFZBTFVFX0lTX01PUkVfVEhBTixcbiAgICBET19BQ1RJT05cbl07XG5cbmV4cG9ydCBkZWZhdWx0IFRPS0VOUzsiXX0=
