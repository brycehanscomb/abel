/**
 * @param {HTMLElement} element - The checkbox DOM node to watch
 * @param {function} callback
 */
export function listenForCheck(element, callback) {
    element.addEventListener('change', function(evt) {
        if (element.checked) {
            callback();
        }
    });
}

/**
 * @param {HTMLElement} element - The checkbox DOM node to watch
 * @param {function} callback
 */
export function listenForUncheck(element, callback) {
    element.addEventListener('change', function(evt) {
        if (element.checked === false) {
            callback();
        }
    });
}

/**
 * @param {HTMLElement} element
 * @param {(number|string)} value
 * @param {function} callback
 */
export function listenForMatchedValue(element, value, callback) {
    element.addEventListener('input', function(evt) {
        if (element.value == value) {
            callback();
        }
    });
}

/**
 * @param {HTMLElement} element
 * @param {(number|string)} value
 * @param {function} callback
 */
export function listenForUnmatchedValue(element, value, callback) {
    element.addEventListener('input', function(evt) {
        if (element.value !== value) {
            callback();
        }
    });
}

/**
 * @param {HTMLElement} element
 * @param {(number|string)} value
 * @param {function} callback
 */
export function listenForGreaterThan(element, value, callback) {
    element.addEventListener('input', function(evt) {
        if (parseFloat(element.value) > parseFloat(value)) {
            callback();
        }
    });
}

/**
 * @param {HTMLElement} element
 * @param {(number|string)} value
 * @param {function} callback
 */
export function listenForLessThan(element, value, callback) {
    element.addEventListener('input', function(evt) {
        if (parseFloat(element.value) < parseFloat(value)) {
            callback();
        }
    });
}