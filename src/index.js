'use strict';

import { parseDecree } from './lexer';

const STRINGS = {
	ERRORS: {
		MISSING_DOCUMENT_REFERENCE: 'Abel could not be initialised: the document object was undefined. Please ensure you are running Abel from a browser context.'
	}
};

if (typeof document === 'undefined') {
	throw new ReferenceError(STRINGS.ERRORS.MISSING_DOCUMENT_REFERENCE);
}

function go() {
	///**
	// * Find all the elements with a [data-abel] attribute on them and calls `init` on each.
	// */
	//Array.prototype.forEach.call(
	//	document.querySelectorAll('[data-abel]'),
	//	Abel
	//);
	Abel(document.querySelector('[data-abel]'))
}

/**
 * @param {HTMLElement} element
 */
function Abel(element) {
	//console.log(element);
	console.log(parseDecree(element.getAttribute('data-abel')));
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