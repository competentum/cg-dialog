#cg-dialog
 > Accessible Dialog Component (JavaScript) by Competentum Group.
  Exported as a [UMD](https://github.com/umdjs/umd) module.

## Installation
Component can be installed with npm:
```
npm install --save git+http://heimdallr/gitbucket/git/DVR_GPR/cg-dialog.git
```

## Usage
```javascript
var CgDialog = require(cg-dialog); // this line can be omitted if component was added via script tag

var settings = {
    title: 'Dialog example',
    content: 'This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. Only for show. He who searches for meaning here will be sorely disappointed.',
    //content: document.getElementById('dialog_form'), // can be DOM Element
    type: CgDialog.TYPES.OK, // can be OK or OK_CANCEL or YES_NO
    onopen: function() {},
    onclose: function() {}
};

var dialog = new CgDialog(settings);

dialog.open();
dialog.close();

```

## Settings
TBD