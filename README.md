# cg-dialog

> JavaScript Accessible Dialog Component by [Competentum Group](http://competentum.com/).
  Exported as a [UMD](https://github.com/umdjs/umd) module.

[![NPM][npm-image]][npm-url]

## Contents
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
    - [Static properties](#static-properties)
    - [Constructor](#constructor)
    - [Instance properties](#instance-properties)
        - [DOM Elements](#dom-elements)
    - [Instance methods](#instance-methods)
        - [on](#method_on)
        - [open](#method_open)
        - [close](#method_close)

## Installation
Component can be installed with npm:
```
npm install --save cg-dialog
```

## Usage
Simple dialog example:

```javascript
var CgDialog = require('cg-dialog'); // this line can be omitted if component was added via script tag

var settings = {
    title: 'Dialog example',
    content: 'This is dummy copy. It is not meant to be read. ' +
             'It has been placed here solely to demonstrate the look and feel of finished, typeset text. ' +
             'Only for show. He who searches for meaning here will be sorely disappointed.',
    //content: document.getElementById('dialog_form'), // can be DOM Element
    type: CgDialog.TYPES.OK, // can be OK or OK_CANCEL
    // opening and closing of the dialog can be handled in callbacks
    onopen: function () {
        console.log('open');
    },
    onclose: function (result) {
        console.log('Close Callback with result', result);
    }
};

var dialog = new CgDialog(settings);

// also listeners on open and close events can be added
dialog.on(CgDialog.EVENTS.CLOSE, function (result) {
    console.log('Close Event with result', result);
});

dialog.open();
```


## API

### Static properties
- `TYPES` *{Object}* Available dialog types.
    - `OK` - Dialog with one confirmation button. By default dialog of this type is NOT modal (see [`isModal`](#constructor) setting).
    - `OK_CANCEL` - Dialog with denial and confirmation buttons. By default dialog of this type is modal (see [`isModal`](#constructor) setting).

```javascript
new CgDialog({
    type: CgDialog.TYPES.OK,
    isModal: true,
    ...
});
```

- `EVENTS` *{Object}* Events which dialog can emit.
    - `OPEN` - Emits when dialog is opened.
    - `CLOSE` - Emits when dialog is closed. Boolean `result` argument will be passed to callback function.

See [dialog.on](#method_on) method to know how to use events.


<a name="constructor"></a>
### `new CgDialog(settings)` - constructor

- `settings` *{Object}* Set of configurable options to set on the dialog. Can have the following fields:
    - `title` *{string}* Dialog's title. Default = `''`.
    - `content` *{string | Element}* Content which will be added to dialog's DOM element. Default = `''`.
    - `onclose` *{Function}* Function which will be called when dialog closes right before `CLOSE` event will be emitted. Result (boolean) will be passed as function argument.
    - `onopen` *{Function}* Function which will be called when dialog opens right before `OPEN` event will be emitted.
    - `type` *{string}* Type of dialog. Can be on of the `CgDialog.TYPES`. Default = `CgDialog.TYPES.OK`.
    - `isModal` *{boolean}* If it is true dialog can be closed using OK or CANCEL buttons only. Default `false` for `CgDialog.TYPES.OK` type and `true` for `CgDialog.TYPES.OK_CANCEL` type.
    - `classes` *{Array.\<string>}* Array of classes which will be added to dialog's DOM element. Default = `[]`.
    - `buttonTexts` *{Object}* Throw this property buttons texts can be redefined.
        - `ok` *{string}* Ok button text. Default = `'Ok'`.
        - `cancel` *{string}* Cancel button text. Default = `'Cancel'`.


### Instance properties

#### DOM Elements
- `.domElement` - Root element of the dialog instance.
- `.titleElement`
- `.contentElement` - Content container.
- `.closeButton` - Button element in top right corner of the dialog. It is visible if `isModal` property is `false`.
- `.okButton` - Confirmation button element.
- `.cancelButton` - Denial button element. It is visible in `OK_CANCEL` type of the dialog.

All of these elements are instances of the [Element](https://developer.mozilla.org/docs/Web/API/Element) class.

### Instance methods

<a name="method_on"></a>
#### `.on(eventName, listener)`
- `eventName` *{string}* The name of the event.
- `listener` *{Function}* The callback function.

Adds the `listener` function to the end of the listeners array for the event named `eventName`. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.

```javascript
dialog.on(CgDialog.EVENTS.CLOSE, function (result) {
    console.log('Close Event with result', result);
});
```
Callback `result` argument is `true` if dialog will be closed by clicking confirmation button. Otherwise result is `false`.
> Current class extends Node.js EventEmitter. More information about working with events you can get [here](https://nodejs.org/api/events.html).

<a name="method_open"></a>
#### `.open([emitEvent = true])`
- `emitEvent` *{boolean}* If true, dialog instance will emit CgDialog.EVENTS.OPEN event and onopen function will be called. Default = `true`

Opens dialog.

<a name="method_close"></a>
#### `.close([result = false], [emitEvent = true])`
- `result` *{boolean}* Parameter which will be passed to callback function. Default = `false`
- `emitEvent` *{boolean}* If true, dialog instance will emit CgDialog.EVENTS.OPEN event and onclose function will be called. Default = `true`

Closes dialog.


[npm-url]: https://www.npmjs.com/package/cg-dialog
[npm-image]: https://img.shields.io/npm/v/cg-dialog.svg?style=flat-square
