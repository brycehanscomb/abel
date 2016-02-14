'use strict';

const isNotSet = require('is-not-set');
const isString = require('is-string');
const isSet = require('is-it-set');

const STRINGS = {
	ERRORS: {
		MISSING_REQUIRED_INPUT: `Required argument 'input' was not provided.`,
		EXPECTED_TYPE_STRING: `Argument 'input' was not of required type 'string'.`
	}
};

/**
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
 * Finds any `#selector`s in a statement and replaces them with actual DOM references
 * @param input
 */
function getElementFromSelector(input) {
	if (input.startsWith('#')) {
		return document.querySelector(input);
	} else {
		return input;
	}
}

function parseStatement(statement) {
	return eliminateUselessItems(statement.split(','));
}

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