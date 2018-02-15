import './common.less';

import EventEmitter from 'events';
import merge from 'merge';
import utils from 'cg-component-utils';
import uniqid from 'uniqid';

const FOCUSABLE_ELEMENTS = `a[href],area[href],input:not([disabled]),
select:not([disabled]),textarea:not([disabled]),
button:not([disabled]),
iframe, object, embed,
[contenteditable], [tabindex="0"]`;

const DIALOG_CLASS = 'cg-dialog';

const CLASS = {
  DIALOG: DIALOG_CLASS,
  IS_OPEN: `${DIALOG_CLASS}-is-open`,
  BEFORE_DIALOG: `${DIALOG_CLASS}-before`,
  CONTAINER: `${DIALOG_CLASS}-wrap`,
  TITLE: `${DIALOG_CLASS}-title`,
  CONTENT: `${DIALOG_CLASS}-content`,
  BUTTONS: `${DIALOG_CLASS}-buttons`,
  BUTTON: `${DIALOG_CLASS}-button`,
  CLOSE_BUTTON: `${DIALOG_CLASS}-button-close`,
  OK_BUTTON: `${DIALOG_CLASS}-button-ok`,
  CANCEL_BUTTON: `${DIALOG_CLASS}-button-cancel`,
  TRAP: `${DIALOG_CLASS}-trap`,
};

const CLOSE_BUTTON_ARIA_LABEL = 'Close dialog';

const KEY_CODE = {
  ESC: 27,
  TAB: 9
};

/**
 * Accessible Dialog Component
 */
class CgDialog extends EventEmitter {

  /**
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

  /**
   *
   * @property {string} OPEN - emit when user open the dialog
   * @property {string} CLOSE - emit when user close the dialog
   * @return {Object} - events
   * @constructor
   */
  static get EVENTS() {
    if (!this._EVENTS) {
      this._EVENTS = {
        OPEN: 'open',
        CLOSE: 'close'
      };
    }

    return this._EVENTS;
  }

  /**
   *
   * @property {string} OK - type of the dialog with Ok button
   * @property {string} OK_CANCEL - type of the dialog with Ok and Cancel button
   * @constructor
   */
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

  /**
   * Add event listeners
   * @private
   */
  _addListeners() {
    this.okButton.addEventListener('click', () => {
      this.close(true);
    });

    this.cancelButton.addEventListener('click', () => {
      this.close(false);
    });

    this.closeButton.addEventListener('click', () => {
      this.close(true);
    });

    // Close when escape is pressed
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === KEY_CODE.ESC) {
        if (this.isOpen) {
          this.close(false);
        }
      }
    });

    /**
     * If the user is tabbing forward from the last focusable element,
     * then we need to move them to the first focusable element.
     * @param {Object} e - event
     */
    const handleBackwardTab = (e) => {
      e.preventDefault();
      this.lastFocusable.focus();
    };

    /**
     * If the user is tabbing forward from the last focusable element,
     * then we need to move them to the first focusable element.
     * @param {Object} e - event
     */
    const handleForwardTab = (e) => {
      e.preventDefault();
      this.firstFocusable.focus();
    };

    const trapBeforeElement = utils.createHTML(`<div tabindex="0" class="${CLASS.TRAP}">`);
    const trapAfterElement = utils.createHTML(`<div tabindex="0" class="${CLASS.TRAP}">`);

    this.wrapElement.insertBefore(trapBeforeElement, this.rootElement);
    this.wrapElement.appendChild(trapAfterElement);

    trapBeforeElement.addEventListener('focus', handleBackwardTab);
    trapAfterElement.addEventListener('focus', handleForwardTab);
  }

  /**
   * Merge user settings with default settings
   * @param {DialogSettings} settings
   * @private
   */
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

  /**
   * Create DOM elements
   * @private
   */
  _render() {
    const titleId = uniqid();
    const contentId = uniqid();

    const dialogClasses = `${CLASS.DIALOG} ${this.settings.classes.join(' ')}`;
    const elementHTML
      = `<div class="${CLASS.CONTAINER}">
        <div class="${CLASS.BEFORE_DIALOG}"></div>
        <div class="${dialogClasses.trim()}" role="dialog" aria-labelledby="${titleId}" aria-modal="${this.settings.modal}">
          <div id="${titleId}" class="${CLASS.TITLE}">${this.settings.title}</div>
          <div id="${contentId}" class="${CLASS.CONTENT}"></div>
          <div class="${CLASS.BUTTONS}">
            <button class="${CLASS.BUTTON} ${CLASS.OK_BUTTON}">${this.settings.buttonTexts.ok}</button>
            <button class="${CLASS.BUTTON} ${CLASS.CANCEL_BUTTON}">${this.settings.buttonTexts.cancel}</button>
          </div>
          <button class="${CLASS.CLOSE_BUTTON}" aria-label="${CLOSE_BUTTON_ARIA_LABEL}"></button>
        </div>
      </div>`;

    this.wrapElement = utils.createHTML(elementHTML);
    document.body.appendChild(this.wrapElement);

    this.rootElement = this.wrapElement.querySelector(`.${CLASS.DIALOG}`);
    this.titleElement = this.rootElement.querySelector(`.${CLASS.TITLE}`);
    this.contentElement = this.rootElement.querySelector(`.${CLASS.CONTENT}`);
    this.closeButton = this.rootElement.querySelector(`.${CLASS.CLOSE_BUTTON}`);
    this.okButton = this.rootElement.querySelector(`.${CLASS.OK_BUTTON}`);
    this.cancelButton = this.rootElement.querySelector(`.${CLASS.CANCEL_BUTTON}`);

    if (this.settings.type === this.constructor.TYPES.OK) {
      utils.removeNode(this.cancelButton);
    }

    if (typeof this.settings.content === 'string') {
      this.contentElement.innerHTML = this.settings.content;
    } else if (this.settings.content instanceof Element) {
      this.contentElement.appendChild(this.settings.content);
    }

    this.focusableElements = this.rootElement.querySelectorAll(FOCUSABLE_ELEMENTS);

    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

    const focusableContent = this.contentElement.querySelectorAll(FOCUSABLE_ELEMENTS);

    if (!focusableContent.length) {
      this.rootElement.setAttribute('aria-describedby', contentId);
    }
  }

  /**
   * Close dialog
   * @param {boolean} [result = false]
   * @param {boolean} [emitEvent = true] - if true, dialog instance will emit CLOSE event with result argument
   */
  close(result = false, emitEvent = true) {
    // Hide the dialog element
    this.isOpen = false;
    this.wrapElement.style.display = 'none';

    // Remove class from the body element
    utils.removeClass(document.body, CLASS.IS_OPEN);

    // Return focus to the focused element before opening
    if (this.focusedBeforeOpened) {
      this.focusedBeforeOpened.focus();
    }

    // Emit CLOSE event
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
    // Save the focused element before we open the dialog to return focus after closing
    this.focusedBeforeOpened = document.activeElement;

    // Set up class to the body element
    utils.addClass(document.body, CLASS.IS_OPEN);

    // Show the dialog element
    this.wrapElement.style.display = '';
    this.isOpen = true;

    // Focus the first focusable element
    this.firstFocusable.focus();

    // Emit OPEN event
    if (emitEvent) {
      this.settings.onopen();
      this.emit(this.constructor.EVENTS.OPEN);
    }
  }
}

export default CgDialog;
