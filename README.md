# Abel - the declarative DOM manipulator

A micro-library that lets you easily show and hide elements based on the values 
of form controls and user interactions elsewhere on the page.

** Abel is great when you want to make things happen in the DOM but don't want
to load a view library (like React or Angular) or templating framework (like 
Handlebars or Knockout).**

## How To Use

The API exists entirely within the HTML markup, and Abel will automatically 
parse it and convert your decrees into actions. 

Using ordinary strings with specific keywords in the `data-abel` attribute of an 
element, Abel will invisibly do what you ask and your page will react to the 
interactions you specify.

### A Simple Example

Let's say you've got a signup form and the user shouldn't be able to submit 
until they agree to your terms and conditions. 

Using the `data-abel` attribute, it's easy:

```html
<label>
    <input type="checkbox" id="terms_agreement_checkbox">
    I agree to the terms and conditions
</label>

<input 
    id="submit_button"
    type="submit"
    data-abel="
        i start as hidden. 
        when #terms_agreement_checkbox is checked, i will show."
>
```

The Abel parser reads the sentences as an instruction called a *decree* and uses
JavaScript to execute each *statement*. 

The first statement will hide the `<input id="submit_button">` button as soon as 
the script is run. 

The second statement adds a listener to `<input id="terms_agreement_checkbox">`.
Then whenever the user checks it, the submit button will show.

**Note: the submit button does not hide when the user unchecks the checkbox.** 
This is because Abel does exactly what you decree and does not execute any other
implied actions. To make the button hide if the user unchecks the checkbox, just
add another statement to the decree:

```html
<input 
    id="submit_button"
    type="submit"
    data-abel="
        i start as hidden. 
        when #terms_agreement_checkbox is checked, i will show.
        when #terms_agreement_checkbox is not checked, i will hide."
>
```

## Example statements

For a decree to be valid, the following rules apply:

1. All statements are lowercase (use `i` instead of `I`)
2. All statements must end with a period / full stop (`.`)
3. If a statement starts with `when`, there must be a comma (`,`) and a space 
   before the `i will show` or `i will hide`.

### Show / Hide When Run

* `"i start as hidden"`
* `"i start as showing"`
* `"#some_element start as hidden"`
* `"#some_element start as showing"`

### Reacting To Input

#### Checkboxes

* `"when #some_checkbox is checked, i will show."`
* `"when #some_checkbox is not checked, i will hide."`

#### Other Inputs

* `"when #some_input's value is 'hello', i will show."`
* `"when #some_input's value is not 'hello', i will hide."`
* `"when #some_input's value is less than '10', i will show."`
* `"when #some_input's value is more than '10', i will hide."`

** Note that all value comparisons must be in single quotes, 
eg: `'10'`, not `10`. Valid number-strings will be converted to numbers 
internally. **