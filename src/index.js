'use strict';

import './common.less';

var DIALOG_CLASS = 'cg-dialog';
var CONTAINER_CLASS = 'cg-dialog-wrap';
var TITLE_CLASS = 'cg-dialog-title';
var CONTENT_CLASS = 'cg-dialog-content';
var BUTTONS_CLASS = 'cg-dialog-buttons';
var OK_BUTTON_CLASS = 'cg-dialog-button-ok';
var CANCEL_BUTTON_CLASS = 'cg-dialog-button-cancel';

class CgDialog {

    static get TYPES() {
        if (!this._TYPES) {
            this._TYPES = {
                OK: 'ok',
                OK_CANCEL: 'ok_cancel',
                YES_NO: 'yes_no'
            };
        }
        return this._TYPES;
    }

    constructor(settings) {
        this._applySettings(settings);
        this._render();
    }

    _applySettings(settings) {
        this.title = settings.title || '';
        this.content = settings.content || '';
        this.onclose = settings.onclose || function () {
            };
        this.onopen = settings.onopen || function () {
            };
        this.type = settings.type || this.constructor.TYPES.OK;
        this.isModal = settings.isModal || this.type != this.constructor.TYPES.OK;
    }

    _render() {
        var elementHTML = `
            <div class="${CONTAINER_CLASS}">
                <div class="${DIALOG_CLASS}">
                    <div class="${TITLE_CLASS}">${this.title}</div>
                    <div class="${CONTENT_CLASS}"></div>
                    <div class="${BUTTONS_CLASS}">
                        <button class="${OK_BUTTON_CLASS}"></button>
                        <button class="${CANCEL_BUTTON_CLASS}"></button>
                    </div>
                </div>
            </div>
        `;

        var parser = new DOMParser();
        this.wrapElement = parser.parseFromString(elementHTML, 'text/html').body.firstChild;
        document.body.appendChild(this.wrapElement);

        this.domElement = this.wrapElement.querySelector(`.${DIALOG_CLASS}`);
        this.titleElement = this.domElement.querySelector(`.${TITLE_CLASS}`);
        this.contentElement = this.domElement.querySelector(`.${CONTENT_CLASS}`);
        this.okButton = this.domElement.querySelector(`.${OK_BUTTON_CLASS}`);
        this.cancelButton = this.domElement.querySelector(`.${CANCEL_BUTTON_CLASS}`);

        this.okButton.addEventListener('click', () => {
            this.close(true);
        });

        this.cancelButton.addEventListener('click', () => {
            this.close(false);
        });

        if (!this.isModal) {
            this.wrapElement.addEventListener('click', () => {
                this.close(false);
            });
            this.domElement.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        if (typeof this.content === 'string') {
            this.contentElement.innerHTML = this.content;
        }
        else if (this.content instanceof Element) {
            this.contentElement.appendChild(this.content);
        }

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
    }

    close(result) {
        if (typeof result === 'undefined') {
            result = false;
        }
        this.wrapElement.style.display = 'none';
        this.onclose(result)
    }

    open() {
        this.wrapElement.style.display = '';
        this.onopen();
    }

}

if (typeof jQuery !== 'undefined') {
    //todo: add plugin
}

export default CgDialog;