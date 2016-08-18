/*!
 * cg-dialog v0.0.10 - Accessible Dialog Component
 * 
 * (c) 2015-2016 Competentum Group | http://competentum.com
 * Released under the MIT license
 * https://opensource.org/licenses/mit-license.php
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CgDialog"] = factory();
	else
		root["CgDialog"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(2);
	__webpack_require__(7);

	var EventEmitter = __webpack_require__(9);
	var inherits = __webpack_require__(10);
	var merge = __webpack_require__(11);
	var utils = __webpack_require__(13);

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./common.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./common.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
		exports.push([module.id,
									".cg-dialog-wrap {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  text-align: center;\n  z-index: 9999;\n  background-color: rgba(11, 11, 11, 0.8);\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n}\n.cg-dialog-wrap .is-mouse-focused:focus {\n  outline: none;\n}\n.cg-dialog {\n  padding: 20px 30px;\n  text-align: left;\n  max-width: 460px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  background-color: white;\n  z-index: 1001;\n  vertical-align: middle;\n  -moz-transform: translate(-50%, -50%);\n  -ms-transform: translate(-50%, -50%);\n  -webkit-transform: translate(-50%, -50%);\n  -o-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%);\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n  user-select: text;\n}\n.cg-dialog:focus {\n  outline: 1px dotted white;\n  outline-offset: 2px;\n}\n.cg-dialog.is-mouse-focused:focus,\n.cg-dialog.is-force-focused:focus {\n  outline: none;\n}\n.cg-dialog button {\n  cursor: pointer;\n}\n.cg-dialog-title {\n  font-weight: 400;\n  font-size: 2em;\n  margin-bottom: 10px;\n}\n.cg-dialog-button-close {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 30px;\n  height: 30px;\n  border: none;\n  opacity: .5;\n  background: url("
									+ __webpack_require__(5)
									+ ") center no-repeat;\n}\n.cg-dialog-button-close:hover {\n  opacity: 0.7;\n}\n.cg-dialog-button-close:active {\n  opacity: 0.9;\n}\n.cg-dialog-button-close:focus {\n  outline: none;\n}\n.cg-dialog-button-close:focus:not(.is-mouse-focused):before {\n  content: \"\";\n  position: absolute;\n  z-index: 1000;\n  top: 3px;\n  bottom: 3px;\n  left: 3px;\n  right: 3px;\n  border: 1px dotted black;\n}\n.cg-dialog-content:focus {\n  outline: 1px dotted black;\n  outline-offset: 2px;\n}\n.cg-dialog-buttons {\n  margin-top: 10px;\n  text-align: center;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.cg-dialog-buttons button + button {\n  margin-left: 1em;\n}\n",
									""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iDQogICAgICAgICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCINCiAgICAgdmlld0JveD0iMCAwIDI0IDI0Ij4NCiAgICA8cGF0aCBkPSJNMTksNi40MUwxNy41OSw1TDEyLDEwLjU5TDYuNDEsNUw1LDYuNDFMMTAuNTksMTJMNSwxNy41OUw2LjQxLDE5TDEyLDEzLjQxTDE3LjU5LDE5TDE5LDE3LjU5TDEzLjQxLDEyTDE5LDYuNDFaIi8+DQo8L3N2Zz4="

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(8);

	(function () {
	    var MOUSE_FOCUSED_CLASS = 'is-mouse-focused';

	    if (window.mouseFocusingInitialized)
	        return;

	    window.mouseFocusingInitialized = true;

	    if (document.readyState == "interactive") {
				addListeners();
	    }
	    else {
				document.addEventListener('DOMContentLoaded', addListeners);
	    }

		function addListeners() {
			var justBlured;
			var wasMouseFocused;
	        document.body.addEventListener('mousedown', function (e) {
	            var el = e.target;
						var labeledElement;

	            // collect clicked element with it's parents before body-element (except svg elements)
	            var els = [];
	            while (el && el.tagName.toLowerCase() != 'body') {
	                if (!el.namespaceURI || el.namespaceURI.toLowerCase().indexOf('svg') == -1) {
	                    els.push(el);
	                    el.addEventListener('focus', onFocus);

										// if label element is clicked, bound element can be focused
										if (el.tagName.toLowerCase() === 'label') {
											// save element bound to label
											if (el.getAttribute('for')) {
												labeledElement = document.getElementById(el.getAttribute('for'));
											}
											else {
												labeledElement = el.querySelector('input');
											}
											if (labeledElement) {
												labeledElement.addEventListener('focus', onFocus);
												document.addEventListener('mouseup', onMouseUp);
											}
										}
	                }
	                el = el.parentNode;
	            }

	            // if clicked element has already focused by keyboard
	            // wait for `document.activeElement` to change
	            setTimeout(function () {
	                // find focused element
								onFocus.apply(document.activeElement);
	            }, 0);

						function onMouseUp() {
							document.removeEventListener('mouseup', onMouseUp);
							if (labeledElement) {
								// wait while labeled element will be focused
								// then remove focus listener
								setTimeout(function () {
									labeledElement.removeEventListener('focus', onFocus);
									labeledElement = undefined;
								}, 0);
							}
						}

	            function onFocus() {
	                setMouseFocused(this);
								removeFocusListeners();
	            }

						function removeFocusListeners() {
							for (var i = 0; i < els.length; i++) {
								el = els[i];
								el.removeEventListener('focus', onFocus);
							}
	            }
					});

			window.addEventListener('blur', function (e) {
				if (e.target != this) {
					return;
				}

				// save element to restore mouse-focused class when this tab will be focused again
				if (justBlured) {
					wasMouseFocused = justBlured;
	            }
			}, true);

			window.addEventListener('focus', function () {
				// restore mouse-focused
				if (wasMouseFocused) {
					if (document.activeElement == wasMouseFocused) {
						setMouseFocused(wasMouseFocused);
	                }
					wasMouseFocused = undefined;
	            }

	        });

			function onBlur() {
				// save element in case when element is blurred with current browser tab blur
				// to restore mouse-focused class when this tab will be focused again
				justBlured = this;
				this.removeEventListener('blur', onBlur);
				utils.removeClass(this, MOUSE_FOCUSED_CLASS);

				// clear justBlured, if this tab was blurred, element should be saved in wasMouseFocused variable
				setTimeout(function () {
					justBlured = undefined;
				}, 0);
			}

			function setMouseFocused(element) {
				// if found and it's not body
				if (element && element.tagName.toLowerCase() != 'body') {
					// add special class, remove it after `blur`
					utils.addClass(element, MOUSE_FOCUSED_CLASS);
					element.addEventListener('blur', onBlur);
				}
			}
	    }

	})();

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {

	    /**
	     *
	     * @param {Element} element
	     * @param {string} className
	     */
	    addClass: function addClass(element, className) {
	        var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
	        if (re.test(element.className)) return;
	        element.className = (element.className + " " + className).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	    },

	    /**
	     *
	     * @param {Element} element
	     * @param {string} className
	     */
	    removeClass: function removeClass(element, className) {
	        var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
	        element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	    }
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
				} else {
					// At least give some kind of context to the user
					var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
					err.context = er;
					throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * @name JavaScript/NodeJS Merge v1.2.0
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function(isNode) {

		/**
		 * Merge one or more objects 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		var Public = function(clone) {

			return merge(clone === true, false, arguments);

		}, publicName = 'merge';

		/**
		 * Merge two or more objects recursively 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		Public.recursive = function(clone) {

			return merge(clone === true, true, arguments);

		};

		/**
		 * Clone the input removing any reference
		 * @param mixed input
		 * @return mixed
		 */

		Public.clone = function(input) {

			var output = input,
				type = typeOf(input),
				index, size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index=0;index<size;++index)

					output[index] = Public.clone(input[index]);

			} else if (type === 'object') {

				output = {};

				for (index in input)

					output[index] = Public.clone(input[index]);

			}

			return output;

		};

		/**
		 * Merge two objects recursively
		 * @param mixed input
		 * @param mixed extend
		 * @return mixed
		 */

		function merge_recursive(base, extend) {

			if (typeOf(base) !== 'object')

				return extend;

			for (var key in extend) {

				if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

					base[key] = merge_recursive(base[key], extend[key]);

				} else {

					base[key] = extend[key];

				}

			}

			return base;

		}

		/**
		 * Merge two or more objects
		 * @param bool clone
		 * @param bool recursive
		 * @param array argv
		 * @return object
		 */

		function merge(clone, recursive, argv) {

			var result = argv[0],
				size = argv.length;

			if (clone || typeOf(result) !== 'object')

				result = {};

			for (var index=0;index<size;++index) {

				var item = argv[index],

					type = typeOf(item);

				if (type !== 'object') continue;

				for (var key in item) {

					var sitem = clone ? Public.clone(item[key]) : item[key];

					if (recursive) {

						result[key] = merge_recursive(result[key], sitem);

					} else {

						result[key] = sitem;

					}

				}

			}

			return result;

		}

		/**
		 * Get type of variable
		 * @param mixed input
		 * @return string
		 *
		 * @see http://jsperf.com/typeofvar
		 */

		function typeOf(input) {

			return ({}).toString.call(input).slice(8, -1).toLowerCase();

		}

		if (isNode) {

			module.exports = Public;

		} else {

			window[publicName] = Public;

		}

	})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)(module)))

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {

	    /**
	     *
	     * @param {Element} element
	     * @param {string} className
	     */
			addClass: function addClass(element, className) {
	        var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
	        if (re.test(element.className)) return;
	        element.className = (element.className + " " + className).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	    },

	    /**
	     *
	     * @param {Element} element
	     * @param {string} className
	     */
			removeClass: function removeClass(element, className) {
	        var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
	        element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	    },

		/**
		 * Removes current node from tree.
		 * @param {Node} node
		 */
		removeNode: function removeNode(node) {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		},

	    /**
	     *
	     * @param {string} html
	     * @returns {Node}
	     */
	    createHTML: function createHTML(html) {
	        var div = document.createElement('div');
	        div.innerHTML = html.trim();
	        return div.firstChild;
	    }
	};

/***/ }
/******/ ])
});
;