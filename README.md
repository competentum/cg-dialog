#cg-dialog
 > JavaScript Accessible Dialog Component by [Competentum Group](http://competentum.com/).
  Exported as a [UMD](https://github.com/umdjs/umd) module.

## Installation
Component can be installed with npm (works in Competentum VPN only):
```
npm install --save git+http://heimdallr/gitbucket/git/DVR_GPR/cg-dialog.git
```

## Usage
```javascript
var CgDialog = require('cg-dialog'); // this line can be omitted if component was added via script tag

var settings = {
    title: 'Dialog example',
    content: 'This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. Only for show. He who searches for meaning here will be sorely disappointed.',
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

## Settings
TBD