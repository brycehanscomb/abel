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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtaXQtc2V0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLW5vdC1zZXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtc3RyaW5nL2luZGV4LmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL2FjdGlvbi11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy9lbGVtZW50LXV0aWxzLmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL2xleGVyLmpzIiwiL1VzZXJzL0JyeWNlL1NpdGVzL2FiZWwvc3JjL3N0YXRlbWVudC11dGlscy5qcyIsIi9Vc2Vycy9CcnljZS9TaXRlcy9hYmVsL3NyYy9zdHJpbmctdXRpbHMuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvdG9rZW4tdXRpbHMuanMiLCIvVXNlcnMvQnJ5Y2UvU2l0ZXMvYWJlbC9zcmMvdG9rZW5zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOztBQUViLElBQVMsV0FBVyxHQUFBLE9BQUEsQ0FBUSxTQUFTLENBQUEsQ0FBNUIsV0FBVyxDQUFBOztBQUVwQixJQURTLGdCQUFnQixHQUFBLE9BQUEsQ0FBUSxzQkFBc0IsQ0FBQSxDQUE5QyxnQkFBZ0IsQ0FBQTs7QUFFekIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV2QyxJQUFNLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNQLDhCQUEwQixFQUFFLDhIQUE4SDtHQUMxSjtDQUNELENBQUM7O0FBRUYsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXLEVBQUU7QUFDcEMsUUFBTSxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFD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LElBQUksQ0FBQztRQUFWLEVBQUUsR0FBRixFQUFFO0FBQ1IsSUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDO1FBQTFCLFVBQVUsR0FBVixVQUFVO0FBQ2hCLElBQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQztRQUE5QixZQUFZLEdBQVosWUFBWTtBQUNsQixJQUFNLG9CQUFvQixHQUFHLHNCQUFzQixDQUFDO1FBQTlDLG9CQUFvQixHQUFwQixvQkFBb0I7QUFDMUIsSUFBTSxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztRQUExQyxrQkFBa0IsR0FBbEIsa0JBQWtCO0FBQ3hCLElBQU0sa0JBQWtCLEdBQUcsb0JBQW9CLENBQUM7UUFBMUMsa0JBQWtCLEdBQWxCLGtCQUFrQjtBQUN4QixJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7O1FBQXhCLFNBQVMsR0FBVCxTQUFTO0FBRWYsSUFBTSxNQUFNLEdBQUcsQ0FDbEIsQ0FBQyxFQUNELFFBQVEsRUFDUixVQUFVLEVBQ1YsY0FBYyxFQUNkLE1BQU0sRUFDTixPQUFPLEVBQ1AsSUFBSSxFQUNKLE9BQU8sRUFDUCxRQUFRLEVBQ1IsSUFBSSxFQUNKLElBQUksRUFDSixJQUFJLEVBQ0osRUFBRSxFQUNGLFVBQVUsRUFDVixZQUFZLEVBQ1osb0JBQW9CLEVBQ3BCLGtCQUFrQixFQUNsQixrQkFBa0IsRUFDbEIsU0FBUyxDQUNaLENBQUM7O1FBcEJXLE1BQU0sR0FBTixNQUFNO3FCQXNCSixNQUFNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgcGFyc2VEZWNyZWUgfSBmcm9tICcuL2xleGVyJztcbmltcG9ydCB7IGV4ZWN1dGVTdGF0ZW1lbnQgfSBmcm9tICcuL3N0YXRlbWVudC11dGlscy5qcyc7XG5cbmNvbnN0IGlzTm90U2V0ID0gcmVxdWlyZSgnaXMtbm90LXNldCcpO1xuXG5jb25zdCBTVFJJTkdTID0ge1xuXHRFUlJPUlM6IHtcblx0XHRNSVNTSU5HX0RPQ1VNRU5UX1JFRkVSRU5DRTogJ0FiZWwgY291bGQgbm90IGJlIGluaXRpYWxpc2VkOiB0aGUgZG9jdW1lbnQgb2JqZWN0IHdhcyB1bmRlZmluZWQuIFBsZWFzZSBlbnN1cmUgeW91IGFyZSBydW5uaW5nIEFiZWwgZnJvbSBhIGJyb3dzZXIgY29udGV4dC4nXG5cdH1cbn07XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihTVFJJTkdTLkVSUk9SUy5NSVNTSU5HX0RPQ1VNRU5UX1JFRkVSRU5DRSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICovXG5mdW5jdGlvbiBBYmVsKGVsZW1lbnQpIHtcblxuICAgIGZ1bmN0aW9uIGlzRWxlbWVudChvKXtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIiA/IG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA6IC8vRE9NMlxuICAgICAgICAgICAgbyAmJiB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJiBvICE9PSBudWxsICYmIG8ubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG8ubm9kZU5hbWU9PT1cInN0cmluZ1wiXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgaW5pdGlhbEVycm9yID0gJ0FiZWwgcmVxdWlyZXMgYSByZWZlcmVuY2UgdG8gYSBET00gZWxlbWVudCB0byBiZSBwYXNzZWQgaW50byB0aGUgY29uc3RydWN0b3IsIGJ1dCBcIicgKyBlbGVtZW50ICsgJ1wiIHdhcyBwYXNzZWQgaW5zdGVhZCc7XG5cbiAgICBpZiAoaXNOb3RTZXQoZWxlbWVudCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGluaXRpYWxFcnJvcik7XG4gICAgfVxuXG4gICAgaWYgKCFpc0VsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihpbml0aWFsRXJyb3IpO1xuICAgIH1cblxuICAgIGNvbnN0IHJhd0RlY3JlZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWFiZWwnKTtcblxuICAgIGlmIChpc05vdFNldChyYXdEZWNyZWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQ2Fubm90IHJ1biBBYmVsIG9uIGVsZW1lbnQgJyArIGVsZW1lbnQgKyAnIGJlY2F1c2UgaXQgaXMgbWlzc2luZyB0aGUgcmVxdWlyZWQgXCJkYXRhLWFiZWxcIiBhdHRyaWJ1dGUuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVjcmVlID0gcGFyc2VEZWNyZWUocmF3RGVjcmVlKTtcblxuICAgIGRlY3JlZS5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlbWVudCkge1xuICAgICAgICBleGVjdXRlU3RhdGVtZW50KHN0YXRlbWVudCwgZWxlbWVudCk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogQHN0YXRpY1xuICogQG1ldGhvZE9mIHtBYmVsfVxuICovXG5mdW5jdGlvbiBnbygpIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIGFsbCB0aGUgZWxlbWVudHMgd2l0aCBhIFtkYXRhLWFiZWxdIGF0dHJpYnV0ZSBvbiB0aGVtIGFuZCBjYWxscyBgaW5pdGAgb24gZWFjaC5cbiAgICAgKi9cbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKFxuICAgIFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtYWJlbF0nKSxcbiAgICBcdEFiZWxcbiAgICApO1xufVxuXG5BYmVsLmdvID0gZ287XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB0aGUgYmVoYXZpb3VyIG9mIEFiZWwgYmFzZWQgb24gd2hldGhlciB3ZSBhcmUgaW4gYSBOb2RlLWlzaCBlbnZpcm9ubWVudCBvciBub3QuXG4gKiBAc2VlIHtAbGluayBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMTkxODM2OC8xMDYzMDM1fVxuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzTm9kZSA9ICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgdGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5tb2R1bGUgIT09IG1vZHVsZSk7XG5cbmlmIChpc05vZGUpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBBYmVsO1xufSBlbHNlIHtcblx0d2luZG93LkFiZWwgPSBBYmVsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBBYmVsOyIsInZhciBpc05vdFNldCA9IHJlcXVpcmUoJ2lzLW5vdC1zZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgIHJldHVybiAhaXNOb3RTZXQoaW5wdXQpO1xufTtcblxuIiwiZnVuY3Rpb24gaXNOb3RTZXQodmFsKSB7XG4gICAgcmV0dXJuICh2YWwgPT09IHVuZGVmaW5lZCkgfHwgKHZhbCA9PT0gJycpIHx8ICh2YWwgPT09IG51bGwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTm90U2V0OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN0clZhbHVlID0gU3RyaW5nLnByb3RvdHlwZS52YWx1ZU9mO1xudmFyIHRyeVN0cmluZ09iamVjdCA9IGZ1bmN0aW9uIHRyeVN0cmluZ09iamVjdCh2YWx1ZSkge1xuXHR0cnkge1xuXHRcdHN0clZhbHVlLmNhbGwodmFsdWUpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBzdHJDbGFzcyA9ICdbb2JqZWN0IFN0cmluZ10nO1xudmFyIGhhc1RvU3RyaW5nVGFnID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgeyByZXR1cm4gdHJ1ZTsgfVxuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH1cblx0cmV0dXJuIGhhc1RvU3RyaW5nVGFnID8gdHJ5U3RyaW5nT2JqZWN0KHZhbHVlKSA6IHRvU3RyLmNhbGwodmFsdWUpID09PSBzdHJDbGFzcztcbn07XG4iLCIvKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgY2hlY2tib3ggRE9NIG5vZGUgdG8gd2F0Y2hcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JDaGVjayhlbGVtZW50LCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gVGhlIGNoZWNrYm94IERPTSBub2RlIHRvIHdhdGNoXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuRm9yVW5jaGVjayhlbGVtZW50LCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmNoZWNrZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuRm9yTWF0Y2hlZFZhbHVlKGVsZW1lbnQsIHZhbHVlLCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQudmFsdWUgPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JVbm1hdGNoZWRWYWx1ZShlbGVtZW50LCB2YWx1ZSwgY2FsbGJhY2spIHtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckdyZWF0ZXJUaGFuKGVsZW1lbnQsIHZhbHVlLCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKHBhcnNlRmxvYXQoZWxlbWVudC52YWx1ZSkgPiBwYXJzZUZsb2F0KHZhbHVlKSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckxlc3NUaGFuKGVsZW1lbnQsIHZhbHVlLCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKHBhcnNlRmxvYXQoZWxlbWVudC52YWx1ZSkgPCBwYXJzZUZsb2F0KHZhbHVlKSkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBIaWRlcyB0aGUgYGVsZW1lbnRgIHVzaW5nIGlubGluZSBDU1MuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGlkZShlbGVtZW50KSB7XG5cdGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbn1cblxuLyoqXG4gKiBTaG93cyB0aGUgYGVsZW1lbnRgIHVzaW5nIGlubGluZSBDU1MuIFdhcm5pbmc6IHRoaXMgd2lsbCBzZXQgdGhlIGVsZW1lbnQncyBzdHlsZSB0byBpdCdzIGRlZmF1bHQgZGlzcGxheSwgZWc6XG4gKiBgPGRpdj5gIHdpbGwgYmUgYGJsb2NrYCwgYW5kIGA8c3Bhbj5gIHdpbGwgYmUgYGlubGluZWAuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3coZWxlbWVudCkge1xuXG5cdHZhciBlbGVtZW50U3R5bGUgPSBlbGVtZW50LnN0eWxlO1xuXHR2YXIgTk9ORSA9ICdub25lJztcblx0dmFyIERJU1BMQVkgPSAnZGlzcGxheSc7XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgZGVmYXVsdCBDU1MgZGlzcGxheSB2YWx1ZSBvZiBgbm9kZU5hbWVgIGVsZW1lbnRzLlxuXHQgKlxuXHQgKiBAcGFyYW0geyFzdHJpbmd9IG5vZGVOYW1lIC0gYSB0YWcgbmFtZSBsaWtlICdkaXYnIG9yICdzcGFuJyBvciAnaW5wdXQnXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXREZWZhdWx0RGlzcGxheShub2RlTmFtZSkge1xuXG5cdFx0dmFyIHRlbXBFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cdFx0dmFyIGRpc3BsYXk7XG5cblx0XHQvLyBjcmVhdGUgYSB0ZW1wb3JhcnkgRE9NIG5vZGUgYW5kIHNlZSB3aGF0IGl0J3MgZGlzcGxheSB2YWx1ZSBpc1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcEVsZW1lbnQpO1xuXHRcdGRpc3BsYXkgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0ZW1wRWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShESVNQTEFZKTtcblx0XHR0ZW1wRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRlbXBFbGVtZW50KTtcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0aWYoZGlzcGxheSA9PSBOT05FKSB7XG5cdFx0XHRkaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHR9XG5cblx0XHRyZXR1cm4gZGlzcGxheTtcblx0fVxuXG5cdGlmIChlbGVtZW50U3R5bGVbRElTUExBWV0gPT09IE5PTkUpIHtcblx0XHRlbGVtZW50U3R5bGVbRElTUExBWV0gPSAnJztcblx0fVxuXG5cdGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXNwbGF5JykgPT09IE5PTkUpIHtcblx0XHRlbGVtZW50U3R5bGVbRElTUExBWV0gPSBnZXREZWZhdWx0RGlzcGxheShlbGVtZW50Lm5vZGVOYW1lKTtcblx0fVxufVxuXG4vKipcbiAqIEZpbmRzIGFueSBgI3NlbGVjdG9yYHMgaW4gYSBzdGF0ZW1lbnQgYW5kIHJlcGxhY2VzIHRoZW0gd2l0aCBhY3R1YWwgRE9NIHJlZmVyZW5jZXNcbiAqIEBwYXJhbSBpbnB1dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEZyb21TZWxlY3RvcihpbnB1dCkge1xuICAgIGlmIChpbnB1dC5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaW5wdXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG59XG5cbi8qKlxuICogVGFrZXMgYSBxdWVyeVNlbGVjdG9yIHN0cmluZyB0aGF0IHN0YXJ0cyB3aXRoIGAnIydgIGFuZCByZXR1cm5zIGFuIGVsZW1lbnQgYnkgaXQncyBpZC5cbiAqXG4gKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5hdGl2ZSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcmAgb3IgZXZlbiBgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWRgIGluc3RlYWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmcgfSBoYXNoU2VsZWN0b3JcbiAqIEByZXR1cm5zIHtFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEJ5SGFzaFNlbGVjdG9yKGhhc2hTZWxlY3Rvcikge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihoYXNoU2VsZWN0b3IpO1xufSIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNOb3RTZXQgPSByZXF1aXJlKCdpcy1ub3Qtc2V0Jyk7XG5jb25zdCBpc1N0cmluZyA9IHJlcXVpcmUoJ2lzLXN0cmluZycpO1xuY29uc3QgaXNTZXQgPSByZXF1aXJlKCdpcy1pdC1zZXQnKTtcblxuaW1wb3J0IHsgcGFyc2VUb2tlbnMgfSBmcm9tICcuL3Rva2VuLXV0aWxzLmpzJztcblxuY29uc3QgU1RSSU5HUyA9IHtcblx0RVJST1JTOiB7XG5cdFx0TUlTU0lOR19SRVFVSVJFRF9JTlBVVDogYFJlcXVpcmVkIGFyZ3VtZW50ICdpbnB1dCcgd2FzIG5vdCBwcm92aWRlZC5gLFxuXHRcdEVYUEVDVEVEX1RZUEVfU1RSSU5HOiBgQXJndW1lbnQgJ2lucHV0JyB3YXMgbm90IG9mIHJlcXVpcmVkIHR5cGUgJ3N0cmluZycuYFxuXHR9XG59O1xuXG4vKipcbiAqIFNlcGFyYXRlcyBhIGRlY3JlZSBpbnRvIGl0cyBpbmRpdmlkdWFsIHN0YXRlbWVudHMgKHN0aWxsIHJhdywgdW4tcGFyc2VkIGFuZCB1bi1mb3JtYXR0ZWQpXG4gKlxuICogQHBhcmFtIHshc3RyaW5nfSBpbnB1dFxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59XG4gKi9cbmZ1bmN0aW9uIGdldFN0YXRlbWVudFN0cmluZ3MoaW5wdXQpIHtcblx0aWYgKGlzTm90U2V0KGlucHV0KSkge1xuXHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihTVFJJTkdTLkVSUk9SUy5NSVNTSU5HX1JFUVVJUkVEX0lOUFVUKTtcblx0fVxuXG5cdGlmICghaXNTdHJpbmcoaW5wdXQpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihTVFJJTkdTLkVSUk9SUy5FWFBFQ1RFRF9UWVBFX1NUUklORyk7XG5cdH1cblxuXHRyZXR1cm4gZWxpbWluYXRlVXNlbGVzc0l0ZW1zKGlucHV0LnNwbGl0KCcuJykpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZW1lbnRcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gcGFyc2VTdGF0ZW1lbnQoc3RhdGVtZW50KSB7XG4gICAgcmV0dXJuIGVsaW1pbmF0ZVVzZWxlc3NJdGVtcyhcbiAgICAgICAgc3RhdGVtZW50LnNwbGl0KCcsJylcbiAgICApLm1hcChwYXJzZVRva2Vucyk7XG59XG5cbi8qKlxuICogUmVtb3ZlcyB3aGl0ZXNwYWNlLCBhbmQgbGluZSBicmVha3MgZnJvbSBlYWNoIGl0ZW0sIGFuZCByZXR1cm5zIG9ubHkgdGhvc2Ugd2hvIHN0aWxsIGhhdmUgYSB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGlucHV0c1xuICogQHJldHVybnMge0FycmF5LjxzdHJpbmc+fVxuICovXG5mdW5jdGlvbiBlbGltaW5hdGVVc2VsZXNzSXRlbXMoaW5wdXRzKSB7XG5cdHJldHVybiBpbnB1dHMubWFwKHRyaW0pLmZpbHRlcihpc1NldCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHshc3RyaW5nfSBpbnB1dFxuICogQHJldHVybiB7IXN0cmluZ31cbiAqIEB0aHJvd3Mge1JlZmVyZW5jZUVycm9yfVxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICovXG5mdW5jdGlvbiB0cmltKGlucHV0KSB7XG5cdGlmIChpc05vdFNldChpbnB1dCkpIHtcblx0XHR0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoU1RSSU5HUy5FUlJPUlMuTUlTU0lOR19SRVFVSVJFRF9JTlBVVCk7XG5cdH1cblxuXHRpZiAoIWlzU3RyaW5nKGlucHV0KSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoU1RSSU5HUy5FUlJPUlMuRVhQRUNURURfVFlQRV9TVFJJTkcpO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0LnRyaW0oKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRGVjcmVlKGlucHV0KSB7XG5cdGNvbnN0IHJhd1N0YXRlbWVudHMgPSBnZXRTdGF0ZW1lbnRTdHJpbmdzKGlucHV0KTtcblx0Y29uc3QgcGFyc2VkU3RhdGVtZW50cyA9IHJhd1N0YXRlbWVudHMubWFwKHBhcnNlU3RhdGVtZW50KTtcblxuXHRyZXR1cm4gcGFyc2VkU3RhdGVtZW50cztcbn0iLCJpbXBvcnQgeyBzaG93LCBoaWRlIH0gZnJvbSAnLi9lbGVtZW50LXV0aWxzLmpzJztcbmltcG9ydCB7IHJlcGxhY2VBbGwgfSBmcm9tICcuL3N0cmluZy11dGlscyc7XG5pbXBvcnQge1xuICAgIGxpc3RlbkZvckNoZWNrLFxuICAgIGxpc3RlbkZvclVuY2hlY2ssXG4gICAgbGlzdGVuRm9yTWF0Y2hlZFZhbHVlLFxuICAgIGxpc3RlbkZvclVubWF0Y2hlZFZhbHVlLFxuICAgIGxpc3RlbkZvckdyZWF0ZXJUaGFuLFxuICAgIGxpc3RlbkZvckxlc3NUaGFuXG59IGZyb20gJy4vYWN0aW9uLXV0aWxzLmpzJztcbmltcG9ydCB7XG4gICAgRE9fQUNUSU9OLFxuICAgIFNIT1csXG4gICAgSElERSxcbiAgICBMSVNURU5fRk9SLFxuICAgIFZBTFVFX0VRVUFMUyxcbiAgICBWQUxVRV9ET0VTX05PVF9FUVVBTCxcbiAgICBWQUxVRV9JU19MRVNTX1RIQU4sXG4gICAgVkFMVUVfSVNfTU9SRV9USEFOLFxuICAgIElTX0NIRUNLRUQsXG4gICAgSVNfTk9UX0NIRUNLRURcbn0gZnJvbSAnLi90b2tlbnMnO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25GcmFnbWVudFxuICogQHJldHVybnMgeyhzaG93fGhpZGUpfVxuICovXG5mdW5jdGlvbiBnZXRBY3Rpb25Gcm9tQWN0aW9uRnJhZ21lbnQoYWN0aW9uRnJhZ21lbnQpIHtcbiAgICBjb25zdCBhY3Rpb24gPSBhY3Rpb25GcmFnbWVudC5yZXBsYWNlKERPX0FDVElPTiwgJycpLnRyaW0oKTtcblxuICAgIHN3aXRjaChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSBTSE9XOlxuICAgICAgICAgICAgcmV0dXJuIHNob3c7XG4gICAgICAgIGNhc2UgSElERTpcbiAgICAgICAgICAgIHJldHVybiBoaWRlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0Nhbm5vdCBleGVjdXRlIHVua25vd24gYWN0aW9uIHN0YXRlbWVudCBcIicgKyBhY3Rpb25GcmFnbWVudCArICdcIicpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0FjdGlvbkZyYWdtZW50KGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0LnN0YXJ0c1dpdGgoRE9fQUNUSU9OKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0xpc3RlbmVyRnJhZ21lbnQoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQuc3RhcnRzV2l0aChMSVNURU5fRk9SKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGlzdGVuZXJGcmFnbWVudCAtXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBtZXRob2QgdG8gY2FsbCB3aGVuIHRoZSBsaXN0ZW5lciBmaXJlc1xuICovXG5mdW5jdGlvbiBleGVjdXRlTGlzdGVuZXIobGlzdGVuZXJGcmFnbWVudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzdWJzdGF0ZW1lbnQgPSBsaXN0ZW5lckZyYWdtZW50LnNwbGl0KCcgJyk7XG5cbiAgICAvLyB3ZSBpZ25vcmUgc3Vic3RhdGVtZW50WzBdXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3Vic3RhdGVtZW50WzFdKTtcbiAgICBjb25zdCB0YXJnZXRDb25kaXRpb24gPSBzdWJzdGF0ZW1lbnRbMl07XG5cbiAgICAvKipcbiAgICAgKiB0aGUgcmVzdCBvZiB0aGUgYXJyYXkncyB2YWx1ZXMgYXJlIGFueXRoaW5nIHRoYXQgY29udGFpbmVkIGEgc3BhY2UsIHNvIHdlIG5lZWQgdG8gcHV0IHRoZW1cbiAgICAgKiBiYWNrIHRvZ2V0aGVyIGVnOiBcInNvbWUgcmVxdWlyZWQgdmFsdWVcIiBnb3Qgc3BsaXQgdG8gW1wic29tZVwiLCBcInJlcXVpcmVkXCIsIFwidmFsdWVcIl0uXG4gICAgICpcbiAgICAgKiBXZSBhbHNvIHVucXVvdGUgdGhlIHZhbHVlcyBiZWNhdXNlIHRoZXkgYXJlIGludGVycHJldGVkIGFzIHN0cmluZ3MgYW55d2F5ICgndmFsdWUnIC0+IHZhbHVlKVxuICAgICAqL1xuICAgIGNvbnN0IGNvbmRpdGlvblZhbHVlID0gcmVwbGFjZUFsbChzdWJzdGF0ZW1lbnQuc2xpY2UoMykuam9pbignICcpLCAnXFwnJywgJycpO1xuXG4gICAgc3dpdGNoKHRhcmdldENvbmRpdGlvbikge1xuICAgICAgICBjYXNlIElTX0NIRUNLRUQ6XG4gICAgICAgICAgICBsaXN0ZW5Gb3JDaGVjayh0YXJnZXRFbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBJU19OT1RfQ0hFQ0tFRDpcbiAgICAgICAgICAgIGxpc3RlbkZvclVuY2hlY2sodGFyZ2V0RWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVkFMVUVfRVFVQUxTOlxuICAgICAgICAgICAgbGlzdGVuRm9yTWF0Y2hlZFZhbHVlKHRhcmdldEVsZW1lbnQsIGNvbmRpdGlvblZhbHVlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWQUxVRV9ET0VTX05PVF9FUVVBTDpcbiAgICAgICAgICAgIGxpc3RlbkZvclVubWF0Y2hlZFZhbHVlKHRhcmdldEVsZW1lbnQsIGNvbmRpdGlvblZhbHVlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBWQUxVRV9JU19MRVNTX1RIQU46XG4gICAgICAgICAgICBsaXN0ZW5Gb3JMZXNzVGhhbih0YXJnZXRFbGVtZW50LCBjb25kaXRpb25WYWx1ZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVkFMVUVfSVNfTU9SRV9USEFOOlxuICAgICAgICAgICAgbGlzdGVuRm9yR3JlYXRlclRoYW4odGFyZ2V0RWxlbWVudCwgY29uZGl0aW9uVmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1Vua25vd24gY29uZGl0aW9uICcgKyB0YXJnZXRDb25kaXRpb24pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBzdGF0ZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGVTdGF0ZW1lbnQoc3RhdGVtZW50LCBlbGVtZW50KSB7XG5cbiAgICBpZiAoc3RhdGVtZW50Lmxlbmd0aCA9PT0gMSkge1xuXG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gc3RhdGVtZW50WzBdO1xuXG4gICAgICAgIGlmIChpc0FjdGlvbkZyYWdtZW50KGZyYWdtZW50KSkge1xuICAgICAgICAgICAgZ2V0QWN0aW9uRnJvbUFjdGlvbkZyYWdtZW50KGZyYWdtZW50KShlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBleGVjdXRlIHVua25vd24gZnJhZ21lbnQgXCInICsgc3RhdGVtZW50ICsgJ1wiJyk7XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoc3RhdGVtZW50Lmxlbmd0aCA9PT0gMikge1xuXG4gICAgICAgIGNvbnN0IGxpc3RlbmVyRnJhZ21lbnQgPSBzdGF0ZW1lbnRbMF07XG4gICAgICAgIGNvbnN0IGFjdGlvbkZyYWdtZW50ID0gc3RhdGVtZW50WzFdO1xuXG4gICAgICAgIGlmICghaXNMaXN0ZW5lckZyYWdtZW50KGxpc3RlbmVyRnJhZ21lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmV4cGVjdGVkIGZyYWdtZW50IFwiJyArIGxpc3RlbmVyRnJhZ21lbnQgKyAnXCIuIEV4cGVjdGVkIGEgbGlzdGVuZXIgLyBjb25kaXRpb25hbCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FjdGlvbkZyYWdtZW50KGFjdGlvbkZyYWdtZW50KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5leHBlY3RlZCBmcmFnbWVudCBcIicgKyBhY3Rpb25GcmFnbWVudCArICdcIi4gRXhwZWN0ZWQgYW4gYWN0aW9uIGZyYWdtZW50Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBleGVjdXRlTGlzdGVuZXIoXG4gICAgICAgICAgICBsaXN0ZW5lckZyYWdtZW50LFxuICAgICAgICAgICAgZ2V0QWN0aW9uRnJvbUFjdGlvbkZyYWdtZW50KGFjdGlvbkZyYWdtZW50KS5iaW5kKHRoaXMsIGVsZW1lbnQpXG4gICAgICAgICk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVW5leHBlY3RlZCBudW1iZXIgb2YgZnJhZ21lbnRzIGluIHN0YXRlbWVudC4gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuJyk7XG4gICAgfVxuXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VBbGwoaW5wdXQsIHJlcGxhY2VUaGlzLCB3aXRoVGhpcykge1xuICAgIGxldCByZXMgPSBpbnB1dDtcblxuICAgIHdoaWxlKHJlcy5pbmRleE9mKHJlcGxhY2VUaGlzKSA+IC0xKSB7XG4gICAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKHJlcGxhY2VUaGlzLCB3aXRoVGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbn0iLCJpbXBvcnQge1xuICAgIFRPS0VOUyxcbiAgICBTVEFSVF9BUyxcbiAgICBJU19DSEVDS0VELFxuICAgIElTX05PVF9DSEVDS0VELFxuICAgIExJU1RFTl9GT1IsXG4gICAgVkFMVUVfRE9FU19OT1RfRVFVQUwsXG4gICAgVkFMVUVfRVFVQUxTLFxuICAgIFZBTFVFX0lTX0xFU1NfVEhBTixcbiAgICBWQUxVRV9JU19NT1JFX1RIQU4sXG4gICAgRE9fQUNUSU9OLFxuICAgIEhJRERFTixcbiAgICBISURFLFxuICAgIFNIT1dJTkcsXG4gICAgU0hPV1xufSBmcm9tICcuL3Rva2Vucy5qcyc7XG5pbXBvcnQgeyByZXBsYWNlQWxsIH0gZnJvbSAnLi9zdHJpbmctdXRpbHMnO1xuXG5jb25zdCBpc1N0cmluZyA9IHJlcXVpcmUoJ2lzLXN0cmluZycpO1xuY29uc3QgaXNOb3RTZXQgPSByZXF1aXJlKCdpcy1ub3Qtc2V0Jyk7XG5cbmNvbnN0IFNUUklOR1MgPSB7XG4gICAgRVJST1JTOiB7XG4gICAgICAgIE1JU1NJTkdfUkVRVUlSRURfSU5QVVQ6IGBSZXF1aXJlZCBhcmd1bWVudCAnaW5wdXQnIHdhcyBub3Qgc2V0YCxcbiAgICAgICAgSU5QVVRfTk9UX1NUUklOR19UWVBFOiBgQXJndW1lbnQgJ2lucHV0JyB3YXMgbm90IG9mIHJlcXVpcmVkIHR5cGUgU3RyaW5nYFxuICAgIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Rva2VuKGlucHV0KSB7XG4gICAgcmV0dXJuIFRPS0VOUy5pbmNsdWRlcyhpbnB1dCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHshc3RyaW5nfSBzdGF0ZW1lbnRcbiAqIEByZXR1cm5zIHshc3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUb2tlbnMoc3RhdGVtZW50KSB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3JkZXIgb2YgdGhlc2Uga2V5cyBtYXR0ZXJzIGdyZWF0bHkhXG4gICAgICovXG4gICAgY29uc3QgZnJhZ21lbnRSZXBsYWNlbWVudHMgPSB7XG4gICAgICAgICdJICc6ICAgICAgICAgICAgICAgICAgICAgICAnaSAnLFxuICAgICAgICAnc3RhcnQgYXMnOiAgICAgICAgICAgICAgICAgU1RBUlRfQVMsXG4gICAgICAgICdpcyBjaGVja2VkJzogICAgICAgICAgICAgICBJU19DSEVDS0VELFxuICAgICAgICAnaXMgbm90IGNoZWNrZWQnOiAgICAgICAgICAgSVNfTk9UX0NIRUNLRUQsXG4gICAgICAgICd3aGVuJzogICAgICAgICAgICAgICAgICAgICBMSVNURU5fRk9SLFxuICAgICAgICAnXFwncyB2YWx1ZSBpcyBsZXNzIHRoYW4nOiAgICcgJyArIFZBTFVFX0lTX0xFU1NfVEhBTixcbiAgICAgICAgJ1xcJ3MgdmFsdWUgaXMgbW9yZSB0aGFuJzogICAnICcgKyBWQUxVRV9JU19NT1JFX1RIQU4sXG4gICAgICAgICdcXCdzIHZhbHVlIGlzIG5vdCc6ICAgICAgICAgJyAnICsgVkFMVUVfRE9FU19OT1RfRVFVQUwsXG4gICAgICAgICdcXCdzIHZhbHVlIGlzJzogICAgICAgICAgICAgJyAnICsgVkFMVUVfRVFVQUxTLFxuICAgICAgICAnaSB3aWxsJzogICAgICAgICAgICAgICAgICAgJyAnICsgRE9fQUNUSU9OXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1vcmUgY29tcGxpY2F0ZWQgbm9ybWFsaXNhdGlvbiBoZXJlLi4uXG4gICAgICovXG4gICAgZnJhZ21lbnRSZXBsYWNlbWVudHNbYGkgJHtTVEFSVF9BU30gJHtISURERU59YF0gPSBgJHtET19BQ1RJT059ICR7SElERX1gO1xuICAgIGZyYWdtZW50UmVwbGFjZW1lbnRzW2BpICR7U1RBUlRfQVN9ICR7U0hPV0lOR31gXSA9IGAke0RPX0FDVElPTn0gJHtTSE9XfWA7XG5cbiAgICBsZXQgcmVzdWx0ID0gc3RhdGVtZW50O1xuXG4gICAgT2JqZWN0LmtleXMoZnJhZ21lbnRSZXBsYWNlbWVudHMpLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICByZXN1bHQgPSByZXBsYWNlQWxsKFxuICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgcHJvcCxcbiAgICAgICAgICAgIGZyYWdtZW50UmVwbGFjZW1lbnRzW3Byb3BdXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0LnRyaW0oKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSGFzaFNlbGVjdG9yKGlucHV0KSB7XG5cbiAgICBmdW5jdGlvbiBoYXNXaGl0ZVNwYWNlKGlucHV0KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAc2VlIHtAbGluayBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82NjIzMjUyLzEwNjMwMzV9XG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gaW5wdXQgPT09IGlucHV0LnJlcGxhY2UoL1xccy9nLCcnKTtcbiAgICB9XG5cbiAgICBpZiAoaXNOb3RTZXQoaW5wdXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihTVFJJTkdTLkVSUk9SUy5NSVNTSU5HX1JFUVVJUkVEX0lOUFVUKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzU3RyaW5nKGlucHV0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFNUUklOR1MuRVJST1JTLklOUFVUX05PVF9TVFJJTkdfVFlQRSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlucHV0LmNoYXJBdCgwKSA9PT0gJyMnICYmICFoYXNXaGl0ZVNwYWNlKGlucHV0KTtcbn0iLCJleHBvcnQgY29uc3QgSSA9ICdpJztcbmV4cG9ydCBjb25zdCBTVEFSVF9BUyA9ICdzdGFydF9hcyc7XG5leHBvcnQgY29uc3QgSVNfQ0hFQ0tFRCA9ICdpc19jaGVja2VkJztcbmV4cG9ydCBjb25zdCBJU19OT1RfQ0hFQ0tFRCA9ICdpc19ub3RfY2hlY2tlZCc7XG5leHBvcnQgY29uc3QgSElEREVOID0gJ2hpZGRlbic7XG5leHBvcnQgY29uc3QgU0hPV0lORyA9ICdzaG93aW5nJztcbmV4cG9ydCBjb25zdCBXSEVOID0gJ3doZW4nO1xuZXhwb3J0IGNvbnN0IENIRUNLRUQgPSAnY2hlY2tlZCc7XG5leHBvcnQgY29uc3QgU0VMRUNURUQgPSAnc2VsZWN0ZWQnO1xuZXhwb3J0IGNvbnN0IFdJTEwgPSAnd2lsbCc7XG5leHBvcnQgY29uc3QgU0hPVyA9ICdzaG93JztcbmV4cG9ydCBjb25zdCBISURFID0gJ2hpZGUnO1xuZXhwb3J0IGNvbnN0IElTID0gJ2lzJztcbmV4cG9ydCBjb25zdCBMSVNURU5fRk9SID0gJ2xpc3Rlbl9mb3InO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0VRVUFMUyA9ICd2YWx1ZV9lcXVhbHMnO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0RPRVNfTk9UX0VRVUFMID0gJ3ZhbHVlX2RvZXNfbm90X2VxdWFsJztcbmV4cG9ydCBjb25zdCBWQUxVRV9JU19MRVNTX1RIQU4gPSAndmFsdWVfaXNfbGVzc190aGFuJztcbmV4cG9ydCBjb25zdCBWQUxVRV9JU19NT1JFX1RIQU4gPSAndmFsdWVfaXNfbW9yZV90aGFuJztcbmV4cG9ydCBjb25zdCBET19BQ1RJT04gPSAnZG9fYWN0aW9uJztcblxuZXhwb3J0IGNvbnN0IFRPS0VOUyA9IFtcbiAgICBJLFxuICAgIFNUQVJUX0FTLFxuICAgIElTX0NIRUNLRUQsXG4gICAgSVNfTk9UX0NIRUNLRUQsXG4gICAgSElEREVOLFxuICAgIFNIT1dJTkcsXG4gICAgV0hFTixcbiAgICBDSEVDS0VELFxuICAgIFNFTEVDVEVELFxuICAgIFdJTEwsXG4gICAgU0hPVyxcbiAgICBISURFLFxuICAgIElTLFxuICAgIExJU1RFTl9GT1IsXG4gICAgVkFMVUVfRVFVQUxTLFxuICAgIFZBTFVFX0RPRVNfTk9UX0VRVUFMLFxuICAgIFZBTFVFX0lTX0xFU1NfVEhBTixcbiAgICBWQUxVRV9JU19NT1JFX1RIQU4sXG4gICAgRE9fQUNUSU9OXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBUT0tFTlM7Il19
