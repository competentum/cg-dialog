'use strict';

require('./common.less');
require('mouse-focused');

var EventEmitter = require('events');
var inherits = require('inherits');
var merge = require('merge');
var utils = require('./utils');

var DIALOG_CLASS = 'cg-dialog';
var CONTAINER_CLASS = DIALOG_CLASS + '-wrap';
var TITLE_CLASS = DIALOG_CLASS + '-title';
var CONTENT_CLASS = DIALOG_CLASS + '-content';
var BUTTONS_CLASS = DIALOG_CLASS + '-buttons';
var BUTTON_CLASS = DIALOG_CLASS + '-button';
var CLOSE_BUTTON_CLASS = DIALOG_CLASS + '-button-close';
var OK_BUTTON_CLASS = DIALOG_CLASS + '-button-ok';
var CANCEL_BUTTON_CLASS = DIALOG_CLASS + '-button-cancel';
var FORCE_FOCUSED_CLASS = 'is-force-focused';

var CLOSE_BUTTON_ARIA_LABEL = 'Close dialog';

/**
 * Dialog's customizing settings
 * @typedef {Object} DialogSettings
 * @property {string} title - Dialog's title.
 * @property {string | Element} content - Content which will be added to dialog's DOM element.
 * @property {Function} onclose - Function which will be called when dialog closes right before CLOSE event will be emitted. Result (boolean) will be passed as function argument.
 * @property {Function} onopen - Function which will be called when dialog opens right before OPEN event will be emitted.
 * @property {string} type - Type of dialog. Can be on of the {@link CgDialog.TYPES}
 * @property {boolean} isModal - If it is true dialog can be closed using OK or CANCEL buttons only.
 * @property {Array.<string>} classes - Array of classes which will be added to dialog's DOM element.
 * @property {{ok: string, cancel: string}} buttonTexts - Throw this property OK and CANCEL buttons texts can be redefined.
 */

/**
 *
 * @param {DialogSettings} settings - Dialog's settings, all undefined settings will be taken from {@link CgDialog.DEFAULT_SETTINGS}
 * @constructor
 */
function CgDialog(settings) {
    EventEmitter.call(this);
    this._applySettings(settings);
    this._render();
    this._addListeners();
    this.close(false, false);
}
inherits(CgDialog, EventEmitter);

CgDialog.TYPES = {
    OK: 'ok',
    OK_CANCEL: 'ok_cancel'
};

/**
 *
 * @type DialogSettings
 */
CgDialog.DEFAULT_SETTINGS = {
    title: '',
    content: '',
    onclose: function () {
    },
    onopen: function () {
    },
    type: CgDialog.TYPES.OK,
    isModal: false,
    classes: [],
    buttonTexts: {
        ok: 'Ok',
        cancel: 'Cancel'
    }
};

CgDialog.EVENTS = {
    OPEN: 'open',
    CLOSE: 'close'
};

CgDialog.prototype._addListeners = function _addListeners() {
    var self = this;
    var isMouseDownOnWrap = false;
    this.domElement.addEventListener('blur', function () {
        utils.removeClass(self.domElement, FORCE_FOCUSED_CLASS);
    });

    this.okButton.addEventListener('click', function () {
        self.close(true);
    });

    this.cancelButton.addEventListener('click', function () {
        self.close(false);
    });

    if (!this.settings.isModal) {
        this.closeButton.addEventListener('click', function () {
            self.close(true);
        });
        this.wrapElement.addEventListener('mousedown', onWrapMouseDown);
        this.wrapElement.addEventListener('touchstart', onWrapMouseDown);
        this.wrapElement.addEventListener('click', function (e) {
            if (e.target == self.wrapElement && isMouseDownOnWrap) {
                self.close(false);
            }
        });
        this.domElement.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        document.addEventListener('keydown', function (e) {
            // close when escape is pressed
            if (self.isOpen && e.keyCode == 27) {
                self.close(false);
            }
        });
    }

    // trapping focus when dialog is opened
    document.addEventListener('focus', function (event) {
        if (self.isOpen && !self.domElement.contains(event.target)) {
            event.stopPropagation();
            self.domElement.focus();
        }
    }, true);

    function onWrapMouseDown(e) {
        if (this != e.target)
            return;
        isMouseDownOnWrap = true;
        document.addEventListener('mouseup', onWrapMouseUp);
        document.addEventListener('touchend', onWrapMouseUp);
    }

    function onWrapMouseUp() {
        document.removeEventListener('mouseup', onWrapMouseUp);
        document.removeEventListener('touchend', onWrapMouseUp);
        // wait while wrap click handler will executed
        setTimeout(function () {
            isMouseDownOnWrap = false;
        }, 0)
    }
};

CgDialog.prototype._applySettings = function (settings) {
    /**
     * @type DialogSettings
     */
    this.settings = merge({}, this.constructor.DEFAULT_SETTINGS, settings);
    this.settings.isModal = typeof settings.isModal !== 'undefined' ? settings.isModal : this.settings.type != this.constructor.TYPES.OK;
    if (!Array.isArray(this.settings.classes)) {
        this.settings.classes = [this.settings.classes];
    }
};

CgDialog.prototype._render = function () {
    var dialogClasses = DIALOG_CLASS + ' ' + this.settings.classes.join(' ');
    var elementHTML =
        '<div class="' + CONTAINER_CLASS + '">' +
        '    <div class="' + dialogClasses.trim() + '" role="dialog" aria-label="' + this.settings.title + '" tabindex="-1">' +
        '        <div class="' + TITLE_CLASS + '">' + this.settings.title + '</div>' +
        '        <button class="' + CLOSE_BUTTON_CLASS + '" aria-label="' + CLOSE_BUTTON_ARIA_LABEL + '"></button>' +
        '        <div class="' + CONTENT_CLASS + '"></div>' +
        '        <div class="' + BUTTONS_CLASS + '">' +
        '            <button class="' + BUTTON_CLASS + ' ' + OK_BUTTON_CLASS + '">' + this.settings.buttonTexts.ok + '</button>' +
        '            <button class="' + BUTTON_CLASS + ' ' + CANCEL_BUTTON_CLASS + '">' + this.settings.buttonTexts.cancel + '</button>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    this.wrapElement = utils.createHTML(elementHTML);
    document.body.appendChild(this.wrapElement);

    this.domElement = this.wrapElement.querySelector('.' + DIALOG_CLASS);
    this.titleElement = this.domElement.querySelector('.' + TITLE_CLASS);
    this.contentElement = this.domElement.querySelector('.' + CONTENT_CLASS);
    this.closeButton = this.domElement.querySelector('.' + CLOSE_BUTTON_CLASS);
    this.okButton = this.domElement.querySelector('.' + OK_BUTTON_CLASS);
    this.cancelButton = this.domElement.querySelector('.' + CANCEL_BUTTON_CLASS);

    if (this.settings.isModal) {
        utils.removeNode(this.closeButton);
    }
    if (this.settings.type == this.constructor.TYPES.OK) {
        utils.removeNode(this.cancelButton);
    }

    if (typeof this.settings.content === 'string') {
        this.contentElement.setAttribute('tabindex', '0');
        this.contentElement.innerHTML = this.settings.content;
    }
    else if (this.settings.content instanceof Element) {
        this.contentElement.appendChild(this.settings.content);
    }
};

/**
 * Close dialog.
 * @param {boolean} [result = false]
 * @param {boolean} [emitEvent=true] - if true, dialog instance will emit CLOSE event with result argument
 */
CgDialog.prototype.close = function (result, emitEvent) {
    if (typeof result === 'undefined')
        result = false;
    if (typeof emitEvent === 'undefined')
        emitEvent = true;

    this.isOpen = false;
    this.wrapElement.style.display = 'none';
    if (emitEvent) {
        this.settings.onclose(result);
        this.emit(this.constructor.EVENTS.CLOSE, result);
    }
};

/**
 * Open dialog.
 * @param {boolean} [emitEvent = true] - if true, dialog instance will emit OPEN event
 */
CgDialog.prototype.open = function (emitEvent) {
    if (typeof emitEvent === 'undefined')
        emitEvent = true;

    this.wrapElement.style.display = '';
    this.domElement.focus();
    this.isOpen = true;
    utils.addClass(this.domElement, FORCE_FOCUSED_CLASS);
    if (emitEvent) {
        this.settings.onopen();
        this.emit(this.constructor.EVENTS.OPEN);
    }
};


if (typeof jQuery !== 'undefined') {
    //todo: add plugin
}

module.exports = CgDialog;