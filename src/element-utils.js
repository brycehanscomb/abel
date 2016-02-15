'use strict';

/**
 * Hides the `element` using inline CSS.
 *
 * @param {HTMLElement} element
 */
export function hide(element) {
	element.style.display = 'none';
}

/**
 * Shows the `element` using inline CSS. Warning: this will set the element's style to it's default display, eg:
 * `<div>` will be `block`, and `<span>` will be `inline`.
 *
 * @param element
 */
export function show(element) {

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
}

/**
 * Finds any `#selector`s in a statement and replaces them with actual DOM references
 * @param input
 */
export function getElementFromSelector(input) {
    if (input.startsWith('#')) {
        return document.querySelector(input);
    } else {
        return input;
    }
}

/**
 * Takes a querySelector string that starts with `'#'` and returns an element by it's id.
 *
 * @deprecated Use the native `document.querySelector` or even `document.getElementById` instead.
 *
 * @param {string } hashSelector
 * @returns {Element}
 */
export function getElementByHashSelector(hashSelector) {
	return document.querySelector(hashSelector);
}