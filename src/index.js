'use strict';

import { parseDecree } from './lexer';
import { executeStatement } from './statement-utils.js';

const isNotSet = require('is-not-set');

/**
 * @param {HTMLElement} element
 */
function Abel(element) {

    if (typeof document === 'undefined') {
        throw new ReferenceError('Abel could not be initialised: the document object was undefined. Please ensure you are running Abel from a browser context.');
    }

    function isElement(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }

    const initialError = 'Abel requires a reference to a DOM element to be passed into the constructor, but "' + element + '" was passed instead';

    if (isNotSet(element)) {
        throw new ReferenceError(initialError);
    }

    if (!isElement(element)) {
        throw new TypeError(initialError);
    }

    const rawDecree = element.getAttribute('data-abel');

    if (isNotSet(rawDecree)) {
        throw new ReferenceError('Cannot run Abel on element ' + element + ' because it is missing the required "data-abel" attribute.');
    }

    const decree = parseDecree(rawDecree);

    decree.forEach(function(statement) {
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
    Array.prototype.forEach.call(
    	document.querySelectorAll('[data-abel]'),
    	Abel
    );
}

Abel.go = go;

/**
 * Determines the behaviour of Abel based on whether we are in a Node-ish environment or not.
 * @see {@link http://stackoverflow.com/a/11918368/1063035}
 * @type {boolean}
 */
const isNode = (typeof module !== 'undefined' && typeof this !== 'undefined' && this.module !== module);

if (isNode) {
	module.exports = Abel;
} else {
	window.Abel = Abel;
}

export default Abel;