'use strict';

const isNotSet = require('is-not-set');
const isString = require('is-string');
const isSet = require('is-it-set');

import { parseTokens } from './token-utils.js';

const STRINGS = {
	ERRORS: {
		MISSING_REQUIRED_INPUT: `Required argument 'input' was not provided.`,
		EXPECTED_TYPE_STRING: `Argument 'input' was not of required type 'string'.`
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

	return eliminateUselessItems(input.split('.'));
}

/**
 * @param {string} statement
 * @returns {Array}
 */
function parseStatement(statement) {
    return eliminateUselessItems(
        statement.split(',')
    ).map(parseTokens);
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

export function parseDecree(input) {
	const rawStatements = getStatementStrings(input);
	const parsedStatements = rawStatements.map(parseStatement);

	return parsedStatements;
}