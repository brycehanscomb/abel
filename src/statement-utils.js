import { show, hide } from './element-utils.js';
import {
    listenForCheck,
    listenForUncheck,
    listenForMatchedValue,
    listenForUnmatchedValue,
    listenForGreaterThan,
    listenForLessThan
} from './action-utils.js';
import {
    DO_ACTION,
    SHOW,
    HIDE,
    LISTEN_FOR,
    VALUE_EQUALS,
    VALUE_DOES_NOT_EQUAL,
    VALUE_IS_LESS_THAN,
    VALUE_IS_MORE_THAN,
    IS_CHECKED,
    IS_NOT_CHECKED
} from './tokens';

/**
 * @param {string} actionFragment
 * @returns {(show|hide)}
 */
function getActionFromActionFragment(actionFragment) {
    const action = actionFragment.replace(DO_ACTION, '').trim();

    switch(action) {
        case SHOW:
            return show;
        case HIDE:
            return hide;
        default:
            throw new RangeError('Cannot execute unknown action statement "' + actionFragment + '"');
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
    const substatement = listenerFragment.split(' ');

    // we ignore substatement[0]
    const targetElement = document.querySelector(substatement[1]);
    const targetCondition = substatement[2];

    switch(targetCondition) {
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
            throw new Error('Condition ' + targetCondition + ' has not been implemented yet');
        default:
            throw new RangeError('Unknown condition ' + targetCondition);
    }
}

/**
 * @param {Array.<string>} statement
 * @param {HTMLElement} element
 */
export function executeStatement(statement, element) {

    if (statement.length === 1) {

        const fragment = statement[0];

        if (isActionFragment(fragment)) {
            getActionFromActionFragment(fragment)(element);
        } else {
            throw new TypeError('Cannot execute unknown fragment "' + statement + '"');
        }

    } else if (statement.length === 2) {

        const listenerFragment = statement[0];
        const actionFragment = statement[1];

        if (!isListenerFragment(listenerFragment)) {
            throw new TypeError('Unexpected fragment "' + listenerFragment + '". Expected a listener / conditional');
        }

        if (!isActionFragment(actionFragment)) {
            throw new TypeError('Unexpected fragment "' + actionFragment + '". Expected an action fragment');
        }

        executeListener(
            listenerFragment,
            getActionFromActionFragment(actionFragment).bind(this, element)
        );

    } else {
        throw new RangeError('Unexpected number of fragments in statement. This should never happen');
    }

}