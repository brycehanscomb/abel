import {
    TOKENS,
    START_AS,
    IS_CHECKED,
    IS_NOT_CHECKED,
    LISTEN_FOR,
    VALUE_DOES_NOT_EQUAL,
    VALUE_EQUALS,
    VALUE_IS_LESS_THAN,
    VALUE_IS_MORE_THAN,
    DO_ACTION,
    HIDDEN,
    HIDE,
    SHOWING,
    SHOW
} from './tokens.js';

const isString = require('is-string');
const isNotSet = require('is-not-set');

const STRINGS = {
    ERRORS: {
        MISSING_REQUIRED_INPUT: `Required argument 'input' was not set`,
        INPUT_NOT_STRING_TYPE: `Argument 'input' was not of required type String`
    }
};

export function isToken(input) {
    return TOKENS.includes(input);
}

/**
 * @param {!string} statement
 * @returns {!string}
 */
export function parseTokens(statement) {

    /**
     * The order of these keys matters greatly!
     */
    const fragmentReplacements = {
        'I ':                       'i ',
        'start as':                 START_AS,
        'is checked':               IS_CHECKED,
        'is not checked':           IS_NOT_CHECKED,
        'when':                     LISTEN_FOR,
        '\'s value is less than':   ' ' + VALUE_IS_LESS_THAN,
        '\'s value is more than':   ' ' + VALUE_IS_MORE_THAN,
        '\'s value is not':         ' ' + VALUE_DOES_NOT_EQUAL,
        '\'s value is':             ' ' + VALUE_EQUALS,
        'i will':                   ' ' + DO_ACTION
    };

    /**
     * More complicated normalisation here...
     */
    fragmentReplacements[`i ${START_AS} ${HIDDEN}`] = `${DO_ACTION} ${HIDE}`;
    fragmentReplacements[`i ${START_AS} ${SHOWING}`] = `${DO_ACTION} ${SHOW}`;

    function replaceAll(input, replaceThis, withThis) {
        let res = input;

        while(res.indexOf(replaceThis) > -1) {
            res = res.replace(replaceThis, withThis);
        }

        return res;
    }

    let result = statement;

    Object.keys(fragmentReplacements).forEach(function(prop) {
        result = replaceAll(
            result,
            prop,
            fragmentReplacements[prop]
        );
    });

    return result.trim();
}

export function isHashSelector(input) {

    function hasWhiteSpace(input) {
        /**
         * @see {@link http://stackoverflow.com/a/6623252/1063035}
         */
        return input === input.replace(/\s/g,'');
    }

    if (isNotSet(input)) {
        throw new ReferenceError(STRINGS.ERRORS.MISSING_REQUIRED_INPUT);
    }

    if (!isString(input)) {
        throw new TypeError(STRINGS.ERRORS.INPUT_NOT_STRING_TYPE);
    }

    return input.charAt(0) === '#' && !hasWhiteSpace(input);
}