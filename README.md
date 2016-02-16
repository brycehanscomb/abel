# Abel - the declarative DOM manipulator

A micro-library that lets you easily show and hide elements based on the values of form controls and 
user interactions elsewhere on the page.

**Abel is great when you want to make things happen in the DOM but don't want
to load a view library (like React or Angular) or templating framework (like 
Handlebars or Knockout).**

### A Simple Example

Let's say you've got a signup form and the user shouldn't be able to submit  until they agree to 
your terms and conditions. 

Using the `data-abel` attribute, it's easy:

```html
<label>
    <input type="checkbox" id="terms_agreement_checkbox">
    I agree to the terms and conditions
</label>

<button id="submit_button"
    data-abel="
        i start as hidden. 
        when #terms_agreement_checkbox is checked, i will show."
    type="submit">
    Submit
</button>
```

The first statement will hide the `<input id="submit_button">` button as soon as 
the script is run. The second statement adds a listener to `<input id="terms_agreement_checkbox">`.
Then whenever the user checks it, the submit button will show.

**Note: the submit button does not hide when the user unchecks the checkbox.** 
This is because Abel does exactly what you decree and does not execute any other implied actions. To 
make the button hide if the user unchecks the checkbox, just add another statement to the decree:

```html
<button id="submit_button"
    type="submit"
    data-abel="
        i start as hidden. 
        when #terms_agreement_checkbox is checked, i will show.
        when #terms_agreement_checkbox is not checked, i will hide."
    type="submit">
    Submit
</button>
```

## How To Use

### Installation

#### Easy-Mode: In-Browser Automatic Usage

Add the following code to your page (just before `</body>`):

```html
<script src="path/to/abel.js"></script>
<script> Abel.go(); </script>
```

This will load Abel and do everything automatically. 

Note that if you have a very slow website, elements that Abel will hide (when it's loaded) might be 
visible for a short time until the page actually gets to the `Abel.go()` block. If this happens, you
basically just need to [make your web pages load faster](https://developers.google.com/speed/).

#### Advanced-Mode: As An npm Module

If you need more fine-grained control over the items that Abel controls, you can pass in a reference
to a DOM node manually:

```js
// Make Abel available for use
var Abel = require('abel');

// Call Abel on a single element (make sure it has a `[data-abel]` attribute with some statements)
Abel( document.getElementById('some-element') );
```

Of course, you can still call `Abel.go()` at any time to automagically initialise all Abel statements.

### Usage

Using ordinary strings with specific keywords in the `data-abel` attribute of an element, Abel will 
invisibly do what you ask and your page will react to the interactions you specify.

The API exists entirely within the HTML markup, and Abel will automatically parse it and follow your
instructions. The Abel parser reads the sentences as an instruction called a *decree* and uses 
JavaScript to execute each *statement*. 

For a decree to be valid, the following rules apply:

1. All statements are lowercase (however, you can use `I` as well as `i`)
2. All statements must end with a period / full stop (`.`)
3. If a statement starts with `when`, there must be a comma (`,`) and a space before the `i will show` or `i will hide`.
   
#### Statement Syntax

1. Show / Hide When Run

    * `"i start as hidden"`
    * `"i start as showing"`

2. Checkboxes

    * `"when #some_checkbox is checked, i will show."`
    * `"when #some_checkbox is not checked, i will hide."`

3. Other Inputs

    * `"when #some_input's value is 'hello', i will show."`
    * `"when #some_input's value is not 'hello', i will hide."`
    * `"when #some_input's value is less than 10, i will show."`
    * `"when #some_input's value is more than 10, i will hide."`