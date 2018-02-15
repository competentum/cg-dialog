import './common.less';
import 'mouse-focused';

import EventEmitter from 'events';
import merge from 'merge';
import utils from 'cg-component-utils';

const DIALOG_CLASS = 'cg-dialog';
const BEFORE_DIALOG_CLASS = DIALOG_CLASS + '-before';
const CONTAINER_CLASS = DIALOG_CLASS + '-wrap';
const TITLE_CLASS = DIALOG_CLASS + '-title';
const CONTENT_CLASS = DIALOG_CLASS + '-content';
const BUTTONS_CLASS = DIALOG_CLASS + '-buttons';
const BUTTON_CLASS = DIALOG_CLASS + '-button';
const CLOSE_BUTTON_CLASS = DIALOG_CLASS + '-button-close';
const OK_BUTTON_CLASS = DIALOG_CLASS + '-button-ok';
const CANCEL_BUTTON_CLASS = DIALOG_CLASS + '-button-cancel';

const CLOSE_BUTTON_ARIA_LABEL = 'Close dialog';

const KEY_CODE = {
  ESC: 27
};

/**
 * Accessible Dialog Component
 */
class CgDialog extends EventEmitter {

  /**
   *
   * Dialog's customizing settings
   * @typedef {Object} DialogSettings
   * @property {string} title - Dialog's title.
   * @property {string | Element} content - Content which will be added to dialog's DOM element.
   * @property {Function} onclose - Function which will be called when dialog closes right before CLOSE event
   *                                will be emitted. Result (boolean) will be passed as function argument.
   * @property {Function} onopen - Function which will be called when dialog opens right before OPEN event will be emitted.
   * @property {string} type - Type of dialog. Can be on of the {@link CgDialog.TYPES}
   * @property {boolean} modal - If it is true dialog can be closed using OK or CANCEL buttons only.
   * @property {Array.<string>} classes - Array of classes which will be added to dialog's DOM element.
   * @property {{ok: string, cancel: string}} buttonTexts - Throw this property OK and CANCEL buttons texts can be redefined.
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      this._DEFAULT_SETTINGS = {
        title: '',
        content: '',
        onclose() {
          /* No operations */
        },
        onopen() {
          /* No operations */
        },
        type: CgDialog.TYPES.OK,
        modal: true,
        classes: [],
        buttonTexts: {
          ok: 'Ok',
          cancel: 'Cancel'
        }
      };
    }

    return this._DEFAULT_SETTINGS;
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

  /**
   * @param {DialogSettings} settings - Dialog's settings, all undefined settings will be taken from {@link CgDialog.DEFAULT_SETTINGS}
   * @constructor
   */
  constructor(settings) {
    super();

    this._applySettings(settings);

    this._render();
    this._addListeners();

    this.close(false, false);
  }

  _addListeners() {
    let isMouseDownOnWrap = false;

    /**
     * Add description
     */
    const onWrapMouseUp = () => {
      document.removeEventListener('mouseup', onWrapMouseUp);
      document.removeEventListener('touchend', onWrapMouseUp);
      // Wait while wrap click handler will executed
      setTimeout(() => {
        isMouseDownOnWrap = false;
      }, 0);
    };

    /**
     * Add description
     * @param {object} e - event
     */
    const onWrapMouseDown = (e) => {
      if (this !== e.target) {
        return;
      }
      isMouseDownOnWrap = true;
      document.addEventListener('mouseup', onWrapMouseUp);
      document.addEventListener('touchend', onWrapMouseUp);
    };

    this.okButton.addEventListener('click', () => {
      this.close(true);
    });

    this.cancelButton.addEventListener('click', () => {
      this.close(false);
    });

    if (!this.settings.modal) {
      this.closeButton.addEventListener('click', () => {
        this.close(true);
      });
      this.wrapElement.addEventListener('mousedown', onWrapMouseDown);
      this.wrapElement.addEventListener('touchstart', onWrapMouseDown);
      this.wrapElement.addEventListener('click', (e) => {
        if (e.target === this.wrapElement && isMouseDownOnWrap) {
          this.close(false);
        }
      });
      this.domElement.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      document.addEventListener('keydown', (e) => {
        // Close when escape is pressed
        if (this.isOpen && e.keyCode === KEY_CODE.ESC) {
          this.close(false);
        }
      });
    }

    // Trapping focus when dialog is opened
    document.addEventListener('focus', (event) => {
      if (this.isOpen && !this.domElement.contains(event.target)) {
        event.stopPropagation();
        this.domElement.focus();
      }
    }, true);
  }

  _applySettings(settings) {
    /**
     * @type DialogSettings
     */
    this.settings = merge({}, this.constructor.DEFAULT_SETTINGS, settings);

    // At the moment we maintain only modal dialog
    this.settings.modal = true;

    if (!Array.isArray(this.settings.classes)) {
      this.settings.classes = [this.settings.classes];
    }
  }

  _render() {
    const dialogClasses = `${DIALOG_CLASS} ${this.settings.classes.join(' ')}`;
    const elementHTML
      = `<div class="${CONTAINER_CLASS}">
        <div class="${BEFORE_DIALOG_CLASS}"></div>
        <div class="${dialogClasses.trim()}" role="dialog" aria-label="${this.settings.title}" tabindex="-1">
          <div class="${TITLE_CLASS}">${this.settings.title}</div>
          <button class="${CLOSE_BUTTON_CLASS}" aria-label="${CLOSE_BUTTON_ARIA_LABEL}"></button>
          <div class="${CONTENT_CLASS}"></div>
          <div class="${BUTTONS_CLASS}">
            <button class="${BUTTON_CLASS} ${OK_BUTTON_CLASS}">${this.settings.buttonTexts.ok}</button>
            <button class="${BUTTON_CLASS} ${CANCEL_BUTTON_CLASS}">${this.settings.buttonTexts.cancel}</button>
          </div>
        </div>
      </div>`;

    this.wrapElement = utils.createHTML(elementHTML);
    document.body.appendChild(this.wrapElement);

    this.domElement = this.wrapElement.querySelector(`.${DIALOG_CLASS}`);
    this.titleElement = this.domElement.querySelector(`.${TITLE_CLASS}`);
    this.contentElement = this.domElement.querySelector(`.${CONTENT_CLASS}`);
    this.closeButton = this.domElement.querySelector(`.${CLOSE_BUTTON_CLASS}`);
    this.okButton = this.domElement.querySelector(`.${OK_BUTTON_CLASS}`);
    this.cancelButton = this.domElement.querySelector(`.${CANCEL_BUTTON_CLASS}`);

    if (this.settings.modal) {
      utils.removeNode(this.closeButton);
    }
    if (this.settings.type === this.constructor.TYPES.OK) {
      utils.removeNode(this.cancelButton);
    }

    if (typeof this.settings.content === 'string') {
      this.contentElement.innerHTML = this.settings.content;
    } else if (this.settings.content instanceof Element) {
      this.contentElement.appendChild(this.settings.content);
    }
  }

  /**
   * Close dialog
   * @param {boolean} [result = false]
   * @param {boolean} [emitEvent = true] - if true, dialog instance will emit CLOSE event with result argument
   */
  close(result = false, emitEvent = true) {
    this.isOpen = false;
    this.wrapElement.style.display = 'none';
    utils.removeClass(document.body, 'cg-dialog-is-open');

    if (emitEvent) {
      this.settings.onclose(result);
      this.emit(this.constructor.EVENTS.CLOSE, result);
    }
  }

  /**
   * Open dialog
   * @param {boolean} [emitEvent = true] - if true, dialog instance will emit OPEN event
   */
  open(emitEvent = true) {
    this.focusedElementBeforeOpened = document.activeElement;
    utils.addClass(document.body, 'cg-dialog-is-open');
    this.wrapElement.style.display = '';
    this.domElement.focus();
    this.isOpen = true;

    if (emitEvent) {
      this.settings.onopen();
      this.emit(this.constructor.EVENTS.OPEN);
    }
  }
}

module.exports = CgDialog;
