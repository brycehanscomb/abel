# Abel - the declarative DOM manipulator

> "I need to show and hide parts of this webpage when the user interacts with 
> these form controls. And I don't want to load jQuery, Angular or Vue to do it!"
> — *People who should use Abel*

---

Abel is micro-library that lets you easily show and hide elements on a page 
based on the values of form controls and user interactions elsewhere. 

And at just 4KB gzipped, it can provide a lightweight solution that keeps your 
site fast and performant.

## A Simple Example: Signup Forms

Let's say the user shouldn't be able to submit until they agree to your terms 
and conditions. Using the `data-abel` attribute, it's easy:

```html
<label>
    <input type="checkbox" id="terms_agreement_checkbox">
    I agree to the terms and conditions
</label>

<button 
	id="submit_button"
    data-abel="show when #terms_agreement_checkbox is checked"
    type="submit">
    Submit
</button>
```

The code here will add a listener to `<input id="terms_agreement_checkbox">`.
Then whenever the user checks it, the submit button will show.

**Note: the submit button does not hide when the user unchecks the checkbox.** 

To make the button hide if the user unchecks the checkbox as well, add another 
line to the code:

```html
<button 
	id="submit_button"
    data-abel="
        show when #terms_agreement_checkbox is checked.
        hide when #terms_agreement_checkbox is not checked."
    type="submit">
    Submit
</button>
```

## Statement Syntax

### For Checkboxes and Radio Buttons

**Basic syntax:**

> *[show | hide]* when *[some id]* is *[not]* checked

**Examples:**

* `"show when #some_checkbox is checked"`
* `"hide when #some_checkbox is not checked"`

### For Other Inputs

**Basic syntax:**

> *[show | hide]* when *[some id]*'s value is *[not]* *[some value]*

Where *[some value]* is one of the following:

1. A number
2. A string (in 'single quotes')
3. The word `empty`
4. `less than`, followed by a number
5. `more than`, followed by a number
6. `matching`, followed by a Regular Expression

**Examples:**

* `"show when #some_input is 'hello'"`
* `"hide when #some_input is not 'hello'"`
* `"show when #some_input is less than 10"`
* `"hide when #some_input is more than 10"`
* `"hide when #some_input is empty"`
* `"hide when #some_input is not empty"`
* `"show when #some_input is matching /[0-9]/`
* `"show when #some_input is not matching /[A-Za-z]/`

## Installation

### Easy-Mode: In-Browser Automatic Usage

Add the following code to your page (just before `</body>`):

```html
<script src="path/to/abel.js"></script>
```

This will load Abel and do everything automatically. 

Note that if you have a very slow website, elements that Abel will hide (when 
loaded) might be visible for a short time until the page actually gets to the 
`Abel.go()` block. If this happens, you basically just need to 
[make your web pages load faster](https://developers.google.com/speed/).

### Advanced Usage: In ES6 Scripts

You can have more control over when Abel executes by using it via a module 
syntax:

```js
/* ES6 Usage */
import Abel from 'abel';

/* CommonJS Usage */
const Abel = require('abel');

/* Initialize and run! */
Abel.go();
```

## Notes On Usage

* The code is not case-sensitive -- but your `#css_selectors` are.
* Periods between multiple statements are optional. 
* `empty` for input boxes means either no content or just whitespace.
* This project is MIT Licensed.