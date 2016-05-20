'use strict';

require('./common.less');
require('mouse-focused');

import util from 'util';

var EventEmitter = require('events');
var inherits = require('inherits');
var merge = require('merge');
var utils = require('./utils');

var DIALOG_CLASS = 'cg-dialog';
var CONTAINER_CLASS = DIALOG_CLASS + '-wrap';
var TITLE_CLASS = DIALOG_CLASS + '-title';
var CONTENT_CLASS = DIALOG_CLASS + '-content';
var BUTTONS_CLASS = DIALOG_CLASS + '-buttons';
var CLOSE_BUTTON_CLASS = DIALOG_CLASS + '-button-close';
var OK_BUTTON_CLASS = DIALOG_CLASS + '-button-ok';
var CANCEL_BUTTON_CLASS = DIALOG_CLASS + '-button-cancel';
var FORCE_FOCUSED_CLASS = 'is-force-focused';

var CLOSE_BUTTON_ARIA_LABEL = 'Close dialog';

/**
 * Dialog's customizing settings
 * @typedef {Object} DialogSettings
 * @property {string} title
 * @property {string|Node} content
 * @property {Function} onclose
 * @property {Function} onopen
 * @property {string} type
 * @property {boolean} isModal
 * @property {Array} classes
 * @property {{ok: string, cancel: string}} buttonTexts
 */

/**
 *
 * @param {DialogSettings} settings
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
        '            <button class="' + OK_BUTTON_CLASS + '">' + this.settings.buttonTexts.ok + '</button>' +
        '            <button class="' + CANCEL_BUTTON_CLASS + '">' + this.settings.buttonTexts.cancel + '</button>' +
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
};

/**
 * Close dialog.
 * @param {boolean} [result]
 * @param {boolean} [emitEvent=true] - if true, dialog instance emits CLOSE event with result argument
 */
CgDialog.prototype.close = function (result = false, emitEvent = true) {
    this.isOpen = false;
    this.wrapElement.style.display = 'none';
    if (emitEvent) {
        this.settings.onclose(result);
        this.emit(this.constructor.EVENTS.CLOSE, result);
    }
};

/**
 * Open dialog.
 * @param {boolean} [emitEvent=true] - if true, dialog instance emits OPEN event
 */
CgDialog.prototype.open = function (emitEvent = true) {
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