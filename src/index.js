'use strict';

import './common.css';

var DIALOG_CLASS = 'cg-dialog';
var CONTAINER_CLASS = 'cg-dialog-wrap';
var TITLE_CLASS = 'cg-dialog-title';
var CONTENT_CLASS = 'cg-dialog-content';
var BUTTONS_CLASS = 'cg-dialog-buttons';

function CgDialog(settings) {
    this._applySettings(settings);
    this._render();
}

CgDialog.TYPES = {
    OK: 'ok',
    OK_CANCEL: 'ok_cancel',
    YES_NO: 'yes_no'
};

CgDialog.prototype = {

    constructor: CgDialog,

    _applySettings: function (settings) {
        this.title = settings.title || '';
        this.content = settings.content || '';
        this.onclose = settings.onclose || function () {
            };
        this.onopen = settings.onclose || function () {
            };
        this.type = settings.type || this.constructor.TYPES.OK;
        this.isModal = settings.isModal || this.type != this.constructor.TYPES.OK;
    },

    _render: function (settings) {
        var self = this;
        this.wrapElement = document.createElement('div');
        this.wrapElement.className = CONTAINER_CLASS;
        document.body.appendChild(this.wrapElement);

        this.domElement = document.createElement('div');
        this.domElement.className = DIALOG_CLASS;
        this.wrapElement.appendChild(this.domElement);

        if (!this.isModal) {
            this.wrapElement.addEventListener('click', function () {
                self.close(false);
            });
            this.domElement.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        this.titleElement = document.createElement('div');
        this.titleElement.className = TITLE_CLASS;
        this.titleElement.innerHTML = this.title;
        this.domElement.appendChild(this.titleElement);

        this.contentElement = document.createElement('div');
        this.contentElement.className = CONTENT_CLASS;
        this.domElement.appendChild(this.contentElement);

        if (typeof this.content === 'string') {
            this.contentElement.innerHTML = this.content;
        }
        else if (this.content instanceof Element) {
            this.contentElement.appendChild(this.content);
        }

        this.buttonsElement = document.createElement('div');
        this.buttonsElement.className = BUTTONS_CLASS;
        this.domElement.appendChild(this.buttonsElement);

        this.okButton = document.createElement('button');
        this.buttonsElement.appendChild(this.okButton);
        this.okButton.addEventListener('click', function () {
            self.close(true);
        });

        this.cancelButton = document.createElement('button');
        this.buttonsElement.appendChild(this.cancelButton);
        this.cancelButton.addEventListener('click', function () {
            self.close(false);
        });

        switch (this.type) {
            case this.constructor.TYPES.OK:
                this.okButton.innerHTML = 'Ok';
                this.cancelButton.style.display = 'none';
                break;
            case this.constructor.TYPES.OK_CANCEL:
                this.okButton.innerHTML = 'Ok';
                this.cancelButton.innerHTML = 'Cancel';
                break;
            case this.constructor.TYPES.YES_NO:
                this.okButton.innerHTML = 'Yes';
                this.cancelButton.innerHTML = 'No';
                break;
            default:
                throw new Error(this.constructor.name + '._render: unknown type:"' + this.type + '"');
        }

        this.close();
    },

    close: function (result) {
        if (typeof result === 'undefined') {
            result = false;
        }
        this.wrapElement.style.display = 'none';
        this.onclose(result)
    },

    open: function () {
        this.wrapElement.style.display = 'block';
        this.onopen();
    }

};

if (typeof jQuery !== 'undefined') {
    //todo: add plugin
}

export default CgDialog;