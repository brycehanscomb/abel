# Abel - the declarative DOM manipulator

> "I need to show and hide parts of this webpage when the user interacts with 
> these form controls. And I don't want to load jQuery, Angular or Vue to do it!"

— *People who should use Abel*

---

Abel is micro-library that lets you easily show and hide elements on a page 
based on the values of form controls and user interactions elsewhere. 

And at  just 4KB gzipped, it can provide a lightweight solution that keeps your 
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

Basic syntax:

> **[show | hide]** when **[some id]**'s value **[is | is not]** checked

Examples:

* `"show when #some_checkbox is checked"`
* `"hide when #some_checkbox is not checked"`

### For Other Inputs

Basic syntax:

> **[show | hide]** when **[some id]**'s value **[is | is not]** **[some value]**

Examples:

* `"show when #some_input's value is 'hello'"`
* `"hide when #some_input's value is not 'hello'"`
* `"show when #some_input's value is less than 10"`
* `"hide when #some_input's value is more than 10"`
* `"hide when #some_input's value is empty"`
* `"hide when #some_input's value is not empty"`

## Installation

### Easy-Mode: In-Browser Automatic Usage

Add the following code to your page (just before `</body>`):

```html
<script src="path/to/abel.js"></script>
<script> Abel.go(); </script>
```

This will load Abel and do everything automatically. 

Note that if you have a very slow website, elements that Abel will hide (when 
loaded) might be visible for a short time until the page actually gets to the 
`Abel.go()` block. If this happens, you basically just need to [make your web pages load faster](https://developers.google.com/speed/).

### Advanced-Mode: As An npm Module

If you need more fine-grained control over the items that Abel controls, you can
pass in a reference to a DOM node manually:

```js
// Make Abel available for use
var Abel = require('abel');

// Call Abel on a single element (make sure it has a `[data-abel]` attribute with some statements)
Abel( document.getElementById('some-element') );
```

Of course, you can still call `Abel.go()` at any time to automagically 
initialise all Abel statements.

## Notes On Usage

Using ordinary strings with specific keywords in the `data-abel` attribute of an
element, your page will react to the interactions you specify.

The code is not case-sensitive, and the periods between multiple statements are 
optional. 