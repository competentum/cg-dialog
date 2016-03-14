#cg-dialog
 > Accessible Dialog Component (JavaScript) by Competentum Group.
  Exported as a [UMD](https://github.com/umdjs/umd) module.

## Installation
Component can be installed with npm:
```bash
npm install --save git+http://heimdallr/gitbucket/git/DVR_GPR/cg-dialog.git
```

## Usage
```javascript
var CgDialog = require(cg-dialog); // this line can be omitted if component was added via script tag

var settings = {
    content: 'This is dummy copy. It is not meant to be read. It has been placed here solely to demonstrate the look and feel of finished, typeset text. Only for show. He who searches for meaning here will be sorely disappointed.',
    title: 'Dialog example',
    type: CgDialog.TYPES.OK
};

var dialog = new CgDialog(settings);
```

## Settings
TBD