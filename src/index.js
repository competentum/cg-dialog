'use strict';

import './common.less';
import 'mouse-focused';

import EventEmitter from 'events';
import merge from 'merge';
import utils from './utils';

const DIALOG_CLASS = 'cg-dialog';
const CONTAINER_CLASS = `${DIALOG_CLASS}-wrap`;
const TITLE_CLASS = `${DIALOG_CLASS}-title`;
const CONTENT_CLASS = `${DIALOG_CLASS}-content`;
const BUTTONS_CLASS = `${DIALOG_CLASS}-buttons`;
const CLOSE_BUTTON_CLASS = `${DIALOG_CLASS}-button-close`;
const OK_BUTTON_CLASS = `${DIALOG_CLASS}-button-ok`;
const CANCEL_BUTTON_CLASS = `${DIALOG_CLASS}-button-cancel`;
const FORCE_FOCUSED_CLASS = `is-force-focused`;

const CLOSE_BUTTON_ARIA_LABEL = 'Close dialog';

class CgDialog extends EventEmitter {

    static get DEFAULT_SETTINGS() {
        var thisClass = this;
        return {
            title: '',
            content: '',
            onclose: ()=> {
            },
            onopen: ()=> {
            },
            type: thisClass.TYPES.OK,
            isModal: false,
            classes: [],
            buttonTexts: {
                ok: 'Ok',
                cancel: 'Cancel'
            }
        };
    }

    static get EVENTS() {
        if (!this._EVENTS) {
            this._EVENTS = {
                OPEN: 'open',
                CLOSE: 'close'
            };
        }
        return this._EVENTS;
    }

    static get TYPES() {
        if (!this._TYPES) {
            this._TYPES = {
                OK: 'ok',
                OK_CANCEL: 'ok_cancel'
            };
        }
        return this._TYPES;
    }

    constructor(settings) {
        super();
        this._applySettings(settings);
        this._render();
        this._addListeners();
        this.close(false, false);
    }

    _addListeners() {
        this.domElement.addEventListener('blur', () => {
            utils.removeClass(this.domElement, FORCE_FOCUSED_CLASS);
        });

        this.okButton.addEventListener('click', () => {
            this.close(true);
        });

        this.cancelButton.addEventListener('click', () => {
            this.close(false);
        });

        if (!this.settings.isModal) {
            this.closeButton.addEventListener('click', () => {
                this.close(true);
            });
            this.wrapElement.addEventListener('click', (e) => {
                this.close(false);
            });
            this.domElement.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        // trapping focus when dialog is opened
        document.addEventListener('focus', (event) => {
            if (this.isOpen && !this.domElement.contains(event.target)) {
                event.stopPropagation();
                this.domElement.focus();
            }
        }, true);

    }

    _applySettings(settings) {
        this.settings = merge({}, this.constructor.DEFAULT_SETTINGS, settings);
        this.settings.isModal = typeof settings.isModal !== 'undefined' ? settings.isModal : this.settings.type != this.constructor.TYPES.OK;
        if (!Array.isArray(this.settings.classes)) {
            this.settings.classes = [this.settings.classes];
        }
    }

    _render() {
        var dialogClasses = `${DIALOG_CLASS} ${this.settings.classes.join(' ')}`;
        var elementHTML = `
            <div class="${CONTAINER_CLASS}">
                <div class="${dialogClasses.trim()}" role="dialog" aria-label="${this.settings.title}" tabindex="-1">
                    <div class="${TITLE_CLASS}">${this.settings.title}</div>
                    <button class="${CLOSE_BUTTON_CLASS}" aria-label="${CLOSE_BUTTON_ARIA_LABEL}"></button>
                    <div class="${CONTENT_CLASS}"></div>
                    <div class="${BUTTONS_CLASS}">
                        <button class="${OK_BUTTON_CLASS}">${this.settings.buttonTexts.ok}</button>
                        <button class="${CANCEL_BUTTON_CLASS}">${this.settings.buttonTexts.cancel}</button>
                    </div>
                </div>
            </div>
        `;

        this.wrapElement = utils.createHTML(elementHTML);
        document.body.appendChild(this.wrapElement);

        this.domElement = this.wrapElement.querySelector(`.${DIALOG_CLASS}`);
        this.titleElement = this.domElement.querySelector(`.${TITLE_CLASS}`);
        this.contentElement = this.domElement.querySelector(`.${CONTENT_CLASS}`);
        this.closeButton = this.domElement.querySelector(`.${CLOSE_BUTTON_CLASS}`);
        this.okButton = this.domElement.querySelector(`.${OK_BUTTON_CLASS}`);
        this.cancelButton = this.domElement.querySelector(`.${CANCEL_BUTTON_CLASS}`);

        if (this.settings.isModal) {
            this.closeButton.remove();
        }
        if (this.settings.type == this.constructor.TYPES.OK) {
            this.cancelButton.remove();
        }

        if (typeof this.settings.content === 'string') {
            this.contentElement.setAttribute('tabindex', '0');
            this.contentElement.innerHTML = this.settings.content;
        }
        else if (this.settings.content instanceof Element) {
            this.contentElement.appendChild(this.settings.content);
        }
    }

    /**
     * Close dialog.
     * @param {boolean} [result]
     * @param {boolean} [emitEvent=true] - if true, dialog instance emits CLOSE event with result argument
     */
    close(result = false, emitEvent = true) {
        this.isOpen = false;
        this.wrapElement.style.display = 'none';
        if (emitEvent) {
            this.emit(this.constructor.EVENTS.CLOSE, result);
            this.settings.onclose(result)
        }
    }

    /**
     * Open dialog.
     * @param {boolean} [emitEvent=true] - if true, dialog instance emits OPEN event
     */
    open(emitEvent = true) {
        this.wrapElement.style.display = '';
        this.domElement.focus();
        this.isOpen = true;
        utils.addClass(this.domElement, FORCE_FOCUSED_CLASS);
        if (emitEvent) {
            this.settings.onopen();
            this.emit(this.constructor.EVENTS.OPEN);
        }
    }

}

if (typeof jQuery !== 'undefined') {
    //todo: add plugin
}

export default CgDialog;