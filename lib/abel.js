(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var parseDecree = require("./lexer").parseDecree;

var executeStatement = require("./statement-utils.js").executeStatement;

var isNotSet = require("is-not-set");

/**
 * @param {HTMLElement} element
 */
function Abel(element) {

    if (typeof document === "undefined") {
        throw new ReferenceError("Abel could not be initialised: the document object was undefined. Please ensure you are running Abel from a browser context.");
    }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtaXQtc2V0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLW5vdC1zZXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtc3RyaW5nL2luZGV4LmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL2FjdGlvbi11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy9lbGVtZW50LXV0aWxzLmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL2xleGVyLmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL3N0YXRlbWVudC11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy9zdHJpbmctdXRpbHMuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvdG9rZW4tdXRpbHMuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvdG9rZW5zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOztJQUVKLFdBQVcsV0FBUSxTQUFTLEVBQTVCLFdBQVc7O0lBQ1gsZ0JBQWdCLFdBQVEsc0JBQXNCLEVBQTlDLGdCQUFnQjs7QUFFekIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7OztBQUt2QyxTQUFTLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRW5CLFFBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxFQUFFO0FBQ2pDLGNBQU0sSUFBSSxjQUFjLENBQUMsOEhBQThILENBQUMsQ0FBQztLQUM1Sjs7QUFFRCxhQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUM7QUFDakIsZUFDSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEdBQUcsQ0FBQyxZQUFZLFdBQVc7QUFDMUQsU0FBQyxJQUFJLE9B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LFlBQVksQ0FBQztRQUExQixVQUFVLEdBQVYsVUFBVTtBQUNoQixJQUFNLFlBQVksR0FBRyxjQUFjLENBQUM7UUFBOUIsWUFBWSxHQUFaLFlBQVk7QUFDbEIsSUFBTSxvQkFBb0IsR0FBRyxzQkFBc0IsQ0FBQztRQUE5QyxvQkFBb0IsR0FBcEIsb0JBQW9CO0FBQzFCLElBQU0sa0JBQWtCLEdBQUcsb0JBQW9CLENBQUM7UUFBMUMsa0JBQWtCLEdBQWxCLGtCQUFrQjtBQUN4QixJQUFNLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO1FBQTFDLGtCQUFrQixHQUFsQixrQkFBa0I7QUFDeEIsSUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDOztRQUF4QixTQUFTLEdBQVQsU0FBUztBQUVmLElBQU0sTUFBTSxHQUFHLENBQ2xCLENBQUMsRUFDRCxRQUFRLEVBQ1IsVUFBVSxFQUNWLGNBQWMsRUFDZCxNQUFNLEVBQ04sT0FBTyxFQUNQLElBQUksRUFDSixPQUFPLEVBQ1AsUUFBUSxFQUNSLElBQUksRUFDSixJQUFJLEVBQ0osSUFBSSxFQUNKLEVBQUUsRUFDRixVQUFVLEVBQ1YsWUFBWSxFQUNaLG9CQUFvQixFQUNwQixrQkFBa0IsRUFDbEIsa0JBQWtCLEVBQ2xCLFNBQVMsQ0FDWixDQUFDOztRQXBCVyxNQUFNLEdBQU4sTUFBTTtxQkFzQkosTUFBTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7IHBhcnNlRGVjcmVlIH0gZnJvbSAnLi9sZXhlcic7XG5pbXBvcnQgeyBleGVjdXRlU3RhdGVtZW50IH0gZnJvbSAnLi9zdGF0ZW1lbnQtdXRpbHMuanMnO1xuXG5jb25zdCBpc05vdFNldCA9IHJlcXVpcmUoJ2lzLW5vdC1zZXQnKTtcblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIEFiZWwoZWxlbWVudCkge1xuXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdBYmVsIGNvdWxkIG5vdCBiZSBpbml0aWFsaXNlZDogdGhlIGRvY3VtZW50IG9iamVjdCB3YXMgdW5kZWZpbmVkLiBQbGVhc2UgZW5zdXJlIHlvdSBhcmUgcnVubmluZyBBYmVsIGZyb20gYSBicm93c2VyIGNvbnRleHQuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNFbGVtZW50KG8pe1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiID8gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IDogLy9ET00yXG4gICAgICAgICAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIG8gIT09IG51bGwgJiYgby5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygby5ub2RlTmFtZT09PVwic3RyaW5nXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbml0aWFsRXJyb3IgPSAnQWJlbCByZXF1aXJlcyBhIHJlZmVyZW5jZSB0byBhIERPTSBlbGVtZW50IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb25zdHJ1Y3RvciwgYnV0IFwiJyArIGVsZW1lbnQgKyAnXCIgd2FzIHBhc3NlZCBpbnN0ZWFkJztcblxuICAgIGlmIChpc05vdFNldChlbGVtZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoaW5pdGlhbEVycm9yKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGluaXRpYWxFcnJvcik7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3RGVjcmVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWJlbCcpO1xuXG4gICAgaWYgKGlzTm90U2V0KHJhd0RlY3JlZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdDYW5ub3QgcnVuIEFiZWwgb24gZWxlbWVudCAnICsgZWxlbWVudCArICcgYmVjYXVzZSBpdCBpcyBtaXNzaW5nIHRoZSByZXF1aXJlZCBcImRhdGEtYWJlbFwiIGF0dHJpYnV0ZS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNyZWUgPSBwYXJzZURlY3JlZShyYXdEZWNyZWUpO1xuXG4gICAgZGVjcmVlLmZvckVhY2goZnVuY3Rpb24oc3RhdGVtZW50KSB7XG4gICAgICAgIGV4ZWN1dGVTdGF0ZW1lbnQoc3RhdGVtZW50LCBlbGVtZW50KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kT2Yge0FiZWx9XG4gKi9cbmZ1bmN0aW9uIGdvKCkge1xuICAgIC8qKlxuICAgICAqIEZpbmQgYWxsIHRoZSBlbGVtZW50cyB3aXRoIGEgW2RhdGEtYWJlbF0gYXR0cmlidXRlIG9uIHRoZW0gYW5kIGNhbGxzIGBpbml0YCBvbiBlYWNoLlxuICAgICAqL1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoXG4gICAgXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hYmVsXScpLFxuICAgIFx0QWJlbFxuICAgICk7XG59XG5cbkFiZWwuZ28gPSBnbztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSBiZWhhdmlvdXIgb2YgQWJlbCBiYXNlZCBvbiB3aGV0aGVyIHdlIGFyZSBpbiBhIE5vZGUtaXNoIGVudmlyb25tZW50IG9yIG5vdC5cbiAqIEBzZWUge0BsaW5rIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExOTE4MzY4LzEwNjMwMzV9XG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNOb2RlID0gKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLm1vZHVsZSAhPT0gbW9kdWxlKTtcblxuaWYgKGlzTm9kZSkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IEFiZWw7XG59IGVsc2Uge1xuXHR3aW5kb3cuQWJlbCA9IEFiZWw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFiZWw7IiwidmFyIGlzTm90U2V0ID0gcmVxdWlyZSgnaXMtbm90LXNldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgcmV0dXJuICFpc05vdFNldChpbnB1dCk7XG59O1xuXG4iLCJmdW5jdGlvbiBpc05vdFNldCh2YWwpIHtcbiAgICByZXR1cm4gKHZhbCA9PT0gdW5kZWZpbmVkKSB8fCAodmFsID09PSAnJykgfHwgKHZhbCA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOb3RTZXQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyVmFsdWUgPSBTdHJpbmcucHJvdG90eXBlLnZhbHVlT2Y7XG52YXIgdHJ5U3RyaW5nT2JqZWN0ID0gZnVuY3Rpb24gdHJ5U3RyaW5nT2JqZWN0KHZhbHVlKSB7XG5cdHRyeSB7XG5cdFx0c3RyVmFsdWUuY2FsbCh2YWx1ZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHN0ckNsYXNzID0gJ1tvYmplY3QgU3RyaW5nXSc7XG52YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7IHJldHVybiB0cnVlOyB9XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuXHRyZXR1cm4gaGFzVG9TdHJpbmdUYWcgPyB0cnlTdHJpbmdPYmplY3QodmFsdWUpIDogdG9TdHIuY2FsbCh2YWx1ZSkgPT09IHN0ckNsYXNzO1xufTtcbiIsIi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFRoZSBjaGVja2JveCBET00gbm9kZSB0byB3YXRjaFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckNoZWNrKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgY2hlY2tib3ggRE9NIG5vZGUgdG8gd2F0Y2hcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JVbmNoZWNrKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JNYXRjaGVkVmFsdWUoZWxlbWVudCwgdmFsdWUsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAoZWxlbWVudC52YWx1ZSA9PSB2YWx1ZSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvclVubWF0Y2hlZFZhbHVlKGVsZW1lbnQsIHZhbHVlLCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQudmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuRm9yR3JlYXRlclRoYW4oZWxlbWVudCwgdmFsdWUsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAocGFyc2VGbG9hdChlbGVtZW50LnZhbHVlKSA+IHBhcnNlRmxvYXQodmFsdWUpKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuRm9yTGVzc1RoYW4oZWxlbWVudCwgdmFsdWUsIGNhbGxiYWNrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAocGFyc2VGbG9hdChlbGVtZW50LnZhbHVlKSA8IHBhcnNlRmxvYXQodmFsdWUpKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEhpZGVzIHRoZSBgZWxlbWVudGAgdXNpbmcgaW5saW5lIENTUy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoaWRlKGVsZW1lbnQpIHtcblx0ZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufVxuXG4vKipcbiAqIFNob3dzIHRoZSBgZWxlbWVudGAgdXNpbmcgaW5saW5lIENTUy4gV2FybmluZzogdGhpcyB3aWxsIHNldCB0aGUgZWxlbWVudCdzIHN0eWxlIHRvIGl0J3MgZGVmYXVsdCBkaXNwbGF5LCBlZzpcbiAqIGA8ZGl2PmAgd2lsbCBiZSBgYmxvY2tgLCBhbmQgYDxzcGFuPmAgd2lsbCBiZSBgaW5saW5lYC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvdyhlbGVtZW50KSB7XG5cblx0dmFyIGVsZW1lbnRTdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG5cdHZhciBOT05FID0gJ25vbmUnO1xuXHR2YXIgRElTUExBWSA9ICdkaXNwbGF5JztcblxuXHQvKipcblx0ICogR2V0IHRoZSBkZWZhdWx0IENTUyBkaXNwbGF5IHZhbHVlIG9mIGBub2RlTmFtZWAgZWxlbWVudHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7IXN0cmluZ30gbm9kZU5hbWUgLSBhIHRhZyBuYW1lIGxpa2UgJ2Rpdicgb3IgJ3NwYW4nIG9yICdpbnB1dCdcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdGZ1bmN0aW9uIGdldERlZmF1bHREaXNwbGF5KG5vZGVOYW1lKSB7XG5cblx0XHR2YXIgdGVtcEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblx0XHR2YXIgZGlzcGxheTtcblxuXHRcdC8vIGNyZWF0ZSBhIHRlbXBvcmFyeSBET00gbm9kZSBhbmQgc2VlIHdoYXQgaXQncyBkaXNwbGF5IHZhbHVlIGlzXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZW1wRWxlbWVudCk7XG5cdFx0ZGlzcGxheSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRlbXBFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKERJU1BMQVkpO1xuXHRcdHRlbXBFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGVtcEVsZW1lbnQpO1xuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRpZihkaXNwbGF5ID09IE5PTkUpIHtcblx0XHRcdGRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdH1cblxuXHRcdHJldHVybiBkaXNwbGF5O1xuXHR9XG5cblx0aWYgKGVsZW1lbnRTdHlsZVtESVNQTEFZXSA9PT0gTk9ORSkge1xuXHRcdGVsZW1lbnRTdHlsZVtESVNQTEFZXSA9ICcnO1xuXHR9XG5cblx0aWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ2Rpc3BsYXknKSA9PT0gTk9ORSkge1xuXHRcdGVsZW1lbnRTdHlsZVtESVNQTEFZXSA9IGdldERlZmF1bHREaXNwbGF5KGVsZW1lbnQubm9kZU5hbWUpO1xuXHR9XG59XG5cbi8qKlxuICogRmluZHMgYW55IGAjc2VsZWN0b3JgcyBpbiBhIHN0YXRlbWVudCBhbmQgcmVwbGFjZXMgdGhlbSB3aXRoIGFjdHVhbCBET00gcmVmZXJlbmNlc1xuICogQHBhcmFtIGlucHV0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50RnJvbVNlbGVjdG9yKGlucHV0KSB7XG4gICAgaWYgKGlucHV0LnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpbnB1dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBUYWtlcyBhIHF1ZXJ5U2VsZWN0b3Igc3RyaW5nIHRoYXQgc3RhcnRzIHdpdGggYCcjJ2AgYW5kIHJldHVybnMgYW4gZWxlbWVudCBieSBpdCdzIGlkLlxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmF0aXZlIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yYCBvciBldmVuIGBkb2N1bWVudC5nZXRFbGVtZW50QnlJZGAgaW5zdGVhZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB9IGhhc2hTZWxlY3RvclxuICogQHJldHVybnMge0VsZW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlIYXNoU2VsZWN0b3IoaGFzaFNlbGVjdG9yKSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGhhc2hTZWxlY3Rvcik7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBpc05vdFNldCA9IHJlcXVpcmUoJ2lzLW5vdC1zZXQnKTtcbmNvbnN0IGlzU3RyaW5nID0gcmVxdWlyZSgnaXMtc3RyaW5nJyk7XG5jb25zdCBpc1NldCA9IHJlcXVpcmUoJ2lzLWl0LXNldCcpO1xuXG5pbXBvcnQgeyBwYXJzZVRva2VucyB9IGZyb20gJy4vdG9rZW4tdXRpbHMuanMnO1xuXG5jb25zdCBTVFJJTkdTID0ge1xuXHRFUlJPUlM6IHtcblx0XHRNSVNTSU5HX1JFUVVJUkVEX0lOUFVUOiBgUmVxdWlyZWQgYXJndW1lbnQgJ2lucHV0JyB3YXMgbm90IHByb3ZpZGVkLmAsXG5cdFx0RVhQRUNURURfVFlQRV9TVFJJTkc6IGBBcmd1bWVudCAnaW5wdXQnIHdhcyBub3Qgb2YgcmVxdWlyZWQgdHlwZSAnc3RyaW5nJy5gXG5cdH1cbn07XG5cbi8qKlxuICogU2VwYXJhdGVzIGEgZGVjcmVlIGludG8gaXRzIGluZGl2aWR1YWwgc3RhdGVtZW50cyAoc3RpbGwgcmF3LCB1bi1wYXJzZWQgYW5kIHVuLWZvcm1hdHRlZClcbiAqXG4gKiBAcGFyYW0geyFzdHJpbmd9IGlucHV0XG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn1cbiAqL1xuZnVuY3Rpb24gZ2V0U3RhdGVtZW50U3RyaW5ncyhpbnB1dCkge1xuXHRpZiAoaXNOb3RTZXQoaW5wdXQpKSB7XG5cdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFNUUklOR1MuRVJST1JTLk1JU1NJTkdfUkVRVUlSRURfSU5QVVQpO1xuXHR9XG5cblx0aWYgKCFpc1N0cmluZyhpbnB1dCkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFNUUklOR1MuRVJST1JTLkVYUEVDVEVEX1RZUEVfU1RSSU5HKTtcblx0fVxuXG5cdHJldHVybiBlbGltaW5hdGVVc2VsZXNzSXRlbXMoaW5wdXQuc3BsaXQoJy4nKSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlbWVudFxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiBwYXJzZVN0YXRlbWVudChzdGF0ZW1lbnQpIHtcbiAgICByZXR1cm4gZWxpbWluYXRlVXNlbGVzc0l0ZW1zKFxuICAgICAgICBzdGF0ZW1lbnQuc3BsaXQoJywnKVxuICAgICkubWFwKHBhcnNlVG9rZW5zKTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIHdoaXRlc3BhY2UsIGFuZCBsaW5lIGJyZWFrcyBmcm9tIGVhY2ggaXRlbSwgYW5kIHJldHVybnMgb25seSB0aG9zZSB3aG8gc3RpbGwgaGF2ZSBhIHZhbHVlXG4gKlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gaW5wdXRzXG4gKiBAcmV0dXJucyB7QXJyYXkuPHN0cmluZz59XG4gKi9cbmZ1bmN0aW9uIGVsaW1pbmF0ZVVzZWxlc3NJdGVtcyhpbnB1dHMpIHtcblx0cmV0dXJuIGlucHV0cy5tYXAodHJpbSkuZmlsdGVyKGlzU2V0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyFzdHJpbmd9IGlucHV0XG4gKiBAcmV0dXJuIHshc3RyaW5nfVxuICogQHRocm93cyB7UmVmZXJlbmNlRXJyb3J9XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKi9cbmZ1bmN0aW9uIHRyaW0oaW5wdXQpIHtcblx0aWYgKGlzTm90U2V0KGlucHV0KSkge1xuXHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihTVFJJTkdTLkVSUk9SUy5NSVNTSU5HX1JFUVVJUkVEX0lOUFVUKTtcblx0fVxuXG5cdGlmICghaXNTdHJpbmcoaW5wdXQpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihTVFJJTkdTLkVSUk9SUy5FWFBFQ1RFRF9UWVBFX1NUUklORyk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQudHJpbSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEZWNyZWUoaW5wdXQpIHtcblx0Y29uc3QgcmF3U3RhdGVtZW50cyA9IGdldFN0YXRlbWVudFN0cmluZ3MoaW5wdXQpO1xuXHRjb25zdCBwYXJzZWRTdGF0ZW1lbnRzID0gcmF3U3RhdGVtZW50cy5tYXAocGFyc2VTdGF0ZW1lbnQpO1xuXG5cdHJldHVybiBwYXJzZWRTdGF0ZW1lbnRzO1xufSIsImltcG9ydCB7IHNob3csIGhpZGUgfSBmcm9tICcuL2VsZW1lbnQtdXRpbHMuanMnO1xuaW1wb3J0IHsgcmVwbGFjZUFsbCB9IGZyb20gJy4vc3RyaW5nLXV0aWxzJztcbmltcG9ydCB7XG4gICAgbGlzdGVuRm9yQ2hlY2ssXG4gICAgbGlzdGVuRm9yVW5jaGVjayxcbiAgICBsaXN0ZW5Gb3JNYXRjaGVkVmFsdWUsXG4gICAgbGlzdGVuRm9yVW5tYXRjaGVkVmFsdWUsXG4gICAgbGlzdGVuRm9yR3JlYXRlclRoYW4sXG4gICAgbGlzdGVuRm9yTGVzc1RoYW5cbn0gZnJvbSAnLi9hY3Rpb24tdXRpbHMuanMnO1xuaW1wb3J0IHtcbiAgICBET19BQ1RJT04sXG4gICAgU0hPVyxcbiAgICBISURFLFxuICAgIExJU1RFTl9GT1IsXG4gICAgVkFMVUVfRVFVQUxTLFxuICAgIFZBTFVFX0RPRVNfTk9UX0VRVUFMLFxuICAgIFZBTFVFX0lTX0xFU1NfVEhBTixcbiAgICBWQUxVRV9JU19NT1JFX1RIQU4sXG4gICAgSVNfQ0hFQ0tFRCxcbiAgICBJU19OT1RfQ0hFQ0tFRFxufSBmcm9tICcuL3Rva2Vucyc7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbkZyYWdtZW50XG4gKiBAcmV0dXJucyB7KHNob3d8aGlkZSl9XG4gKi9cbmZ1bmN0aW9uIGdldEFjdGlvbkZyb21BY3Rpb25GcmFnbWVudChhY3Rpb25GcmFnbWVudCkge1xuICAgIGNvbnN0IGFjdGlvbiA9IGFjdGlvbkZyYWdtZW50LnJlcGxhY2UoRE9fQUNUSU9OLCAnJykudHJpbSgpO1xuXG4gICAgc3dpdGNoKGFjdGlvbikge1xuICAgICAgICBjYXNlIFNIT1c6XG4gICAgICAgICAgICByZXR1cm4gc2hvdztcbiAgICAgICAgY2FzZSBISURFOlxuICAgICAgICAgICAgcmV0dXJuIGhpZGU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQ2Fubm90IGV4ZWN1dGUgdW5rbm93biBhY3Rpb24gc3RhdGVtZW50IFwiJyArIGFjdGlvbkZyYWdtZW50ICsgJ1wiJyk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQWN0aW9uRnJhZ21lbnQoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQuc3RhcnRzV2l0aChET19BQ1RJT04pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzTGlzdGVuZXJGcmFnbWVudChpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dC5zdGFydHNXaXRoKExJU1RFTl9GT1IpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0ZW5lckZyYWdtZW50IC1cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIG1ldGhvZCB0byBjYWxsIHdoZW4gdGhlIGxpc3RlbmVyIGZpcmVzXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVMaXN0ZW5lcihsaXN0ZW5lckZyYWdtZW50LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHN1YnN0YXRlbWVudCA9IGxpc3RlbmVyRnJhZ21lbnQuc3BsaXQoJyAnKTtcblxuICAgIC8vIHdlIGlnbm9yZSBzdWJzdGF0ZW1lbnRbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdWJzdGF0ZW1lbnRbMV0pO1xuICAgIGNvbnN0IHRhcmdldENvbmRpdGlvbiA9IHN1YnN0YXRlbWVudFsyXTtcblxuICAgIC8qKlxuICAgICAqIHRoZSByZXN0IG9mIHRoZSBhcnJheSdzIHZhbHVlcyBhcmUgYW55dGhpbmcgdGhhdCBjb250YWluZWQgYSBzcGFjZSwgc28gd2UgbmVlZCB0byBwdXQgdGhlbVxuICAgICAqIGJhY2sgdG9nZXRoZXIgZWc6IFwic29tZSByZXF1aXJlZCB2YWx1ZVwiIGdvdCBzcGxpdCB0byBbXCJzb21lXCIsIFwicmVxdWlyZWRcIiwgXCJ2YWx1ZVwiXS5cbiAgICAgKlxuICAgICAqIFdlIGFsc28gdW5xdW90ZSB0aGUgdmFsdWVzIGJlY2F1c2UgdGhleSBhcmUgaW50ZXJwcmV0ZWQgYXMgc3RyaW5ncyBhbnl3YXkgKCd2YWx1ZScgLT4gdmFsdWUpXG4gICAgICovXG4gICAgY29uc3QgY29uZGl0aW9uVmFsdWUgPSByZXBsYWNlQWxsKHN1YnN0YXRlbWVudC5zbGljZSgzKS5qb2luKCcgJyksICdcXCcnLCAnJyk7XG5cbiAgICBzd2l0Y2godGFyZ2V0Q29uZGl0aW9uKSB7XG4gICAgICAgIGNhc2UgSVNfQ0hFQ0tFRDpcbiAgICAgICAgICAgIGxpc3RlbkZvckNoZWNrKHRhcmdldEVsZW1lbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIElTX05PVF9DSEVDS0VEOlxuICAgICAgICAgICAgbGlzdGVuRm9yVW5jaGVjayh0YXJnZXRFbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWQUxVRV9FUVVBTFM6XG4gICAgICAgICAgICBsaXN0ZW5Gb3JNYXRjaGVkVmFsdWUodGFyZ2V0RWxlbWVudCwgY29uZGl0aW9uVmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZBTFVFX0RPRVNfTk9UX0VRVUFMOlxuICAgICAgICAgICAgbGlzdGVuRm9yVW5tYXRjaGVkVmFsdWUodGFyZ2V0RWxlbWVudCwgY29uZGl0aW9uVmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFZBTFVFX0lTX0xFU1NfVEhBTjpcbiAgICAgICAgICAgIGxpc3RlbkZvckxlc3NUaGFuKHRhcmdldEVsZW1lbnQsIGNvbmRpdGlvblZhbHVlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWQUxVRV9JU19NT1JFX1RIQU46XG4gICAgICAgICAgICBsaXN0ZW5Gb3JHcmVhdGVyVGhhbih0YXJnZXRFbGVtZW50LCBjb25kaXRpb25WYWx1ZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVW5rbm93biBjb25kaXRpb24gJyArIHRhcmdldENvbmRpdGlvbik7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHN0YXRlbWVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZVN0YXRlbWVudChzdGF0ZW1lbnQsIGVsZW1lbnQpIHtcblxuICAgIGlmIChzdGF0ZW1lbnQubGVuZ3RoID09PSAxKSB7XG5cbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBzdGF0ZW1lbnRbMF07XG5cbiAgICAgICAgaWYgKGlzQWN0aW9uRnJhZ21lbnQoZnJhZ21lbnQpKSB7XG4gICAgICAgICAgICBnZXRBY3Rpb25Gcm9tQWN0aW9uRnJhZ21lbnQoZnJhZ21lbnQpKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGV4ZWN1dGUgdW5rbm93biBmcmFnbWVudCBcIicgKyBzdGF0ZW1lbnQgKyAnXCInKTtcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChzdGF0ZW1lbnQubGVuZ3RoID09PSAyKSB7XG5cbiAgICAgICAgY29uc3QgbGlzdGVuZXJGcmFnbWVudCA9IHN0YXRlbWVudFswXTtcbiAgICAgICAgY29uc3QgYWN0aW9uRnJhZ21lbnQgPSBzdGF0ZW1lbnRbMV07XG5cbiAgICAgICAgaWYgKCFpc0xpc3RlbmVyRnJhZ21lbnQobGlzdGVuZXJGcmFnbWVudCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VuZXhwZWN0ZWQgZnJhZ21lbnQgXCInICsgbGlzdGVuZXJGcmFnbWVudCArICdcIi4gRXhwZWN0ZWQgYSBsaXN0ZW5lciAvIGNvbmRpdGlvbmFsJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQWN0aW9uRnJhZ21lbnQoYWN0aW9uRnJhZ21lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmV4cGVjdGVkIGZyYWdtZW50IFwiJyArIGFjdGlvbkZyYWdtZW50ICsgJ1wiLiBFeHBlY3RlZCBhbiBhY3Rpb24gZnJhZ21lbnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4ZWN1dGVMaXN0ZW5lcihcbiAgICAgICAgICAgIGxpc3RlbmVyRnJhZ21lbnQsXG4gICAgICAgICAgICBnZXRBY3Rpb25Gcm9tQWN0aW9uRnJhZ21lbnQoYWN0aW9uRnJhZ21lbnQpLmJpbmQodGhpcywgZWxlbWVudClcbiAgICAgICAgKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdVbmV4cGVjdGVkIG51bWJlciBvZiBmcmFnbWVudHMgaW4gc3RhdGVtZW50LiBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4nKTtcbiAgICB9XG5cbn0iLCJleHBvcnQgZnVuY3Rpb24gcmVwbGFjZUFsbChpbnB1dCwgcmVwbGFjZVRoaXMsIHdpdGhUaGlzKSB7XG4gICAgbGV0IHJlcyA9IGlucHV0O1xuXG4gICAgd2hpbGUocmVzLmluZGV4T2YocmVwbGFjZVRoaXMpID4gLTEpIHtcbiAgICAgICAgcmVzID0gcmVzLnJlcGxhY2UocmVwbGFjZVRoaXMsIHdpdGhUaGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xufSIsImltcG9ydCB7XG4gICAgVE9LRU5TLFxuICAgIFNUQVJUX0FTLFxuICAgIElTX0NIRUNLRUQsXG4gICAgSVNfTk9UX0NIRUNLRUQsXG4gICAgTElTVEVOX0ZPUixcbiAgICBWQUxVRV9ET0VTX05PVF9FUVVBTCxcbiAgICBWQUxVRV9FUVVBTFMsXG4gICAgVkFMVUVfSVNfTEVTU19USEFOLFxuICAgIFZBTFVFX0lTX01PUkVfVEhBTixcbiAgICBET19BQ1RJT04sXG4gICAgSElEREVOLFxuICAgIEhJREUsXG4gICAgU0hPV0lORyxcbiAgICBTSE9XXG59IGZyb20gJy4vdG9rZW5zLmpzJztcbmltcG9ydCB7IHJlcGxhY2VBbGwgfSBmcm9tICcuL3N0cmluZy11dGlscyc7XG5cbmNvbnN0IGlzU3RyaW5nID0gcmVxdWlyZSgnaXMtc3RyaW5nJyk7XG5jb25zdCBpc05vdFNldCA9IHJlcXVpcmUoJ2lzLW5vdC1zZXQnKTtcblxuY29uc3QgU1RSSU5HUyA9IHtcbiAgICBFUlJPUlM6IHtcbiAgICAgICAgTUlTU0lOR19SRVFVSVJFRF9JTlBVVDogYFJlcXVpcmVkIGFyZ3VtZW50ICdpbnB1dCcgd2FzIG5vdCBzZXRgLFxuICAgICAgICBJTlBVVF9OT1RfU1RSSU5HX1RZUEU6IGBBcmd1bWVudCAnaW5wdXQnIHdhcyBub3Qgb2YgcmVxdWlyZWQgdHlwZSBTdHJpbmdgXG4gICAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVG9rZW4oaW5wdXQpIHtcbiAgICByZXR1cm4gVE9LRU5TLmluY2x1ZGVzKGlucHV0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyFzdHJpbmd9IHN0YXRlbWVudFxuICogQHJldHVybnMgeyFzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRva2VucyhzdGF0ZW1lbnQpIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBvcmRlciBvZiB0aGVzZSBrZXlzIG1hdHRlcnMgZ3JlYXRseSFcbiAgICAgKi9cbiAgICBjb25zdCBmcmFnbWVudFJlcGxhY2VtZW50cyA9IHtcbiAgICAgICAgJ0kgJzogICAgICAgICAgICAgICAgICAgICAgICdpICcsXG4gICAgICAgICdzdGFydCBhcyc6ICAgICAgICAgICAgICAgICBTVEFSVF9BUyxcbiAgICAgICAgJ2lzIGNoZWNrZWQnOiAgICAgICAgICAgICAgIElTX0NIRUNLRUQsXG4gICAgICAgICdpcyBub3QgY2hlY2tlZCc6ICAgICAgICAgICBJU19OT1RfQ0hFQ0tFRCxcbiAgICAgICAgJ3doZW4nOiAgICAgICAgICAgICAgICAgICAgIExJU1RFTl9GT1IsXG4gICAgICAgICdcXCdzIHZhbHVlIGlzIGxlc3MgdGhhbic6ICAgJyAnICsgVkFMVUVfSVNfTEVTU19USEFOLFxuICAgICAgICAnXFwncyB2YWx1ZSBpcyBtb3JlIHRoYW4nOiAgICcgJyArIFZBTFVFX0lTX01PUkVfVEhBTixcbiAgICAgICAgJ1xcJ3MgdmFsdWUgaXMgbm90JzogICAgICAgICAnICcgKyBWQUxVRV9ET0VTX05PVF9FUVVBTCxcbiAgICAgICAgJ1xcJ3MgdmFsdWUgaXMnOiAgICAgICAgICAgICAnICcgKyBWQUxVRV9FUVVBTFMsXG4gICAgICAgICdpIHdpbGwnOiAgICAgICAgICAgICAgICAgICAnICcgKyBET19BQ1RJT05cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTW9yZSBjb21wbGljYXRlZCBub3JtYWxpc2F0aW9uIGhlcmUuLi5cbiAgICAgKi9cbiAgICBmcmFnbWVudFJlcGxhY2VtZW50c1tgaSAke1NUQVJUX0FTfSAke0hJRERFTn1gXSA9IGAke0RPX0FDVElPTn0gJHtISURFfWA7XG4gICAgZnJhZ21lbnRSZXBsYWNlbWVudHNbYGkgJHtTVEFSVF9BU30gJHtTSE9XSU5HfWBdID0gYCR7RE9fQUNUSU9OfSAke1NIT1d9YDtcblxuICAgIGxldCByZXN1bHQgPSBzdGF0ZW1lbnQ7XG5cbiAgICBPYmplY3Qua2V5cyhmcmFnbWVudFJlcGxhY2VtZW50cykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlcGxhY2VBbGwoXG4gICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICBwcm9wLFxuICAgICAgICAgICAgZnJhZ21lbnRSZXBsYWNlbWVudHNbcHJvcF1cbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQudHJpbSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIYXNoU2VsZWN0b3IoaW5wdXQpIHtcblxuICAgIGZ1bmN0aW9uIGhhc1doaXRlU3BhY2UoaW5wdXQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzY2MjMyNTIvMTA2MzAzNX1cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBpbnB1dCA9PT0gaW5wdXQucmVwbGFjZSgvXFxzL2csJycpO1xuICAgIH1cblxuICAgIGlmIChpc05vdFNldChpbnB1dCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFNUUklOR1MuRVJST1JTLk1JU1NJTkdfUkVRVUlSRURfSU5QVVQpO1xuICAgIH1cblxuICAgIGlmICghaXNTdHJpbmcoaW5wdXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoU1RSSU5HUy5FUlJPUlMuSU5QVVRfTk9UX1NUUklOR19UWVBFKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5wdXQuY2hhckF0KDApID09PSAnIycgJiYgIWhhc1doaXRlU3BhY2UoaW5wdXQpO1xufSIsImV4cG9ydCBjb25zdCBJID0gJ2knO1xuZXhwb3J0IGNvbnN0IFNUQVJUX0FTID0gJ3N0YXJ0X2FzJztcbmV4cG9ydCBjb25zdCBJU19DSEVDS0VEID0gJ2lzX2NoZWNrZWQnO1xuZXhwb3J0IGNvbnN0IElTX05PVF9DSEVDS0VEID0gJ2lzX25vdF9jaGVja2VkJztcbmV4cG9ydCBjb25zdCBISURERU4gPSAnaGlkZGVuJztcbmV4cG9ydCBjb25zdCBTSE9XSU5HID0gJ3Nob3dpbmcnO1xuZXhwb3J0IGNvbnN0IFdIRU4gPSAnd2hlbic7XG5leHBvcnQgY29uc3QgQ0hFQ0tFRCA9ICdjaGVja2VkJztcbmV4cG9ydCBjb25zdCBTRUxFQ1RFRCA9ICdzZWxlY3RlZCc7XG5leHBvcnQgY29uc3QgV0lMTCA9ICd3aWxsJztcbmV4cG9ydCBjb25zdCBTSE9XID0gJ3Nob3cnO1xuZXhwb3J0IGNvbnN0IEhJREUgPSAnaGlkZSc7XG5leHBvcnQgY29uc3QgSVMgPSAnaXMnO1xuZXhwb3J0IGNvbnN0IExJU1RFTl9GT1IgPSAnbGlzdGVuX2Zvcic7XG5leHBvcnQgY29uc3QgVkFMVUVfRVFVQUxTID0gJ3ZhbHVlX2VxdWFscyc7XG5leHBvcnQgY29uc3QgVkFMVUVfRE9FU19OT1RfRVFVQUwgPSAndmFsdWVfZG9lc19ub3RfZXF1YWwnO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0lTX0xFU1NfVEhBTiA9ICd2YWx1ZV9pc19sZXNzX3RoYW4nO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0lTX01PUkVfVEhBTiA9ICd2YWx1ZV9pc19tb3JlX3RoYW4nO1xuZXhwb3J0IGNvbnN0IERPX0FDVElPTiA9ICdkb19hY3Rpb24nO1xuXG5leHBvcnQgY29uc3QgVE9LRU5TID0gW1xuICAgIEksXG4gICAgU1RBUlRfQVMsXG4gICAgSVNfQ0hFQ0tFRCxcbiAgICBJU19OT1RfQ0hFQ0tFRCxcbiAgICBISURERU4sXG4gICAgU0hPV0lORyxcbiAgICBXSEVOLFxuICAgIENIRUNLRUQsXG4gICAgU0VMRUNURUQsXG4gICAgV0lMTCxcbiAgICBTSE9XLFxuICAgIEhJREUsXG4gICAgSVMsXG4gICAgTElTVEVOX0ZPUixcbiAgICBWQUxVRV9FUVVBTFMsXG4gICAgVkFMVUVfRE9FU19OT1RfRVFVQUwsXG4gICAgVkFMVUVfSVNfTEVTU19USEFOLFxuICAgIFZBTFVFX0lTX01PUkVfVEhBTixcbiAgICBET19BQ1RJT05cbl07XG5cbmV4cG9ydCBkZWZhdWx0IFRPS0VOUzsiXX0=
