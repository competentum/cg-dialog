/*!
 * cg-dialog v0.0.5 - Accessible Dialog Component
 * (c) 2015-2016 Competentum Group | http://competentum.com
 */
(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
    else if (typeof define === 'function' && define.amd)
		define([], factory);
    else if (typeof exports === 'object')
		exports["CgDialog"] = factory();
	else
		root["CgDialog"] = factory();
})(this, function () {
    return /******/ (function (modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/
        var installedModules = {};

        /******/ 	// The require function
        /******/
        function __webpack_require__(moduleId) {

            /******/ 		// Check if module is in cache
            /******/
            if (installedModules[moduleId])
            /******/            return installedModules[moduleId].exports;

            /******/ 		// Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/            exports: {},
                /******/            id: moduleId,
                /******/            loaded: false
                /******/
            };

            /******/ 		// Execute the module function
            /******/
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

            /******/ 		// Flag the module as loaded
            /******/
            module.loaded = true;

            /******/ 		// Return the exports of the module
            /******/
            return module.exports;
            /******/
        }


        /******/ 	// expose the modules object (__webpack_modules__)
        /******/
        __webpack_require__.m = modules;

        /******/ 	// expose the module cache
        /******/
        __webpack_require__.c = installedModules;

        /******/ 	// __webpack_public_path__
        /******/
        __webpack_require__.p = "";

        /******/ 	// Load entry module and return exports
        /******/
        return __webpack_require__(0);
        /******/
    })
        /************************************************************************/
        /******/([
        /* 0 */
        /***/ function (module, exports, __webpack_require__) {

            module.exports = __webpack_require__(1);


            /***/
        },
        /* 1 */
        /***/ function (module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            __webpack_require__(2);

            var _events = __webpack_require__(6);

            var _events2 = _interopRequireDefault(_events);

            var _utils = __webpack_require__(7);

            var _utils2 = _interopRequireDefault(_utils);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {default: obj};
            }

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return call && (typeof call === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var DIALOG_CLASS = 'cg-dialog';
            var CONTAINER_CLASS = 'cg-dialog-wrap';
            var TITLE_CLASS = 'cg-dialog-title';
            var CONTENT_CLASS = 'cg-dialog-content';
            var BUTTONS_CLASS = 'cg-dialog-buttons';
            var OK_BUTTON_CLASS = 'cg-dialog-button-ok';
            var CANCEL_BUTTON_CLASS = 'cg-dialog-button-cancel';

            var CgDialog = function (_EventEmitter) {
                _inherits(CgDialog, _EventEmitter);

                _createClass(CgDialog, null, [{
                    key: 'EVENTS',
                    get: function get() {
                        if (!this._EVENTS) {
                            this._EVENTS = {
                                OPEN: 'open',
                                CLOSE: 'close'
                            };
                        }
                        return this._EVENTS;
                    }
                }, {
                    key: 'TYPES',
                    get: function get() {
                        if (!this._TYPES) {
                            this._TYPES = {
                                OK: 'ok',
                                OK_CANCEL: 'ok_cancel',
                                YES_NO: 'yes_no'
                            };
                        }
                        return this._TYPES;
                    }
                }]);

                function CgDialog(settings) {
                    _classCallCheck(this, CgDialog);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CgDialog).call(this));

                    _this._applySettings(settings);
                    _this._render();
                    return _this;
                }

                _createClass(CgDialog, [{
                    key: '_applySettings',
                    value: function _applySettings(settings) {
                        this.title = settings.title || '';
                        this.content = settings.content || '';
                        this.onclose = settings.onclose || function () {
                            };
                        this.onopen = settings.onopen || function () {
                            };
                        this.type = settings.type || this.constructor.TYPES.OK;
                        this.isModal = settings.isModal || this.type != this.constructor.TYPES.OK;
                    }
                }, {
                    key: '_render',
                    value: function _render() {
                        var _this2 = this;

                        var elementHTML = '\n            <div class="' + CONTAINER_CLASS + '">\n                <div class="' + DIALOG_CLASS + '">\n                    <div class="' + TITLE_CLASS + '">' + this.title + '</div>\n                    <div class="' + CONTENT_CLASS + '"></div>\n                    <div class="' + BUTTONS_CLASS + '">\n                        <button class="' + OK_BUTTON_CLASS + '"></button>\n                        <button class="' + CANCEL_BUTTON_CLASS + '"></button>\n                    </div>\n                </div>\n            </div>\n        ';

                        this.wrapElement = _utils2.default.createHTML(elementHTML);
                        document.body.appendChild(this.wrapElement);

                        this.domElement = this.wrapElement.querySelector('.' + DIALOG_CLASS);
                        this.titleElement = this.domElement.querySelector('.' + TITLE_CLASS);
                        this.contentElement = this.domElement.querySelector('.' + CONTENT_CLASS);
                        this.okButton = this.domElement.querySelector('.' + OK_BUTTON_CLASS);
                        this.cancelButton = this.domElement.querySelector('.' + CANCEL_BUTTON_CLASS);

                        this.okButton.addEventListener('click', function () {
                            _this2.close(true);
                        });

                        this.cancelButton.addEventListener('click', function () {
                            _this2.close(false);
                        });

                        if (!this.isModal) {
                            this.wrapElement.addEventListener('click', function () {
                                _this2.close(false);
                            });
                            this.domElement.addEventListener('click', function (e) {
                                e.stopPropagation();
                            });
                        }

                        if (typeof this.content === 'string') {
                            this.contentElement.innerHTML = this.content;
                        } else if (this.content instanceof Element) {
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

                        this.close(false, false);
                    }

                    /**
                     * Close dialog.
                     * @param result
                     * @param [emitEvent=true] - if true, dialog instance emits CLOSE event with result argument
                     */

                }, {
                    key: 'close',
                    value: function close(result) {
                        var emitEvent = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                        if (typeof result === 'undefined') {
                            result = false;
                        }
                        this.wrapElement.style.display = 'none';
                        if (emitEvent) {
                            this.emit(this.constructor.EVENTS.CLOSE, result);
                            this.onclose(result);
                        }
                    }

                    /**
                     * Open dialog.
                     * @param emitEvent - if true, dialog instance emits OPEN event
                     */

                }, {
                    key: 'open',
                    value: function open() {
                        var emitEvent = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

                        this.wrapElement.style.display = '';
                        if (emitEvent) {
                            this.onopen();
                            this.emit(this.constructor.EVENTS.OPEN);
                        }
                    }
                }]);

                return CgDialog;
            }(_events2.default);

            if (typeof jQuery !== 'undefined') {
                //todo: add plugin
            }

            exports.default = CgDialog;
            module.exports = exports['default'];

            /***/
        },
        /* 2 */
        /***/ function (module, exports, __webpack_require__) {

            // style-loader: Adds some css to the DOM by adding a <style> tag

            // load the styles
            var content = __webpack_require__(3);
            if (typeof content === 'string') content = [[module.id, content, '']];
            // add the styles to the DOM
            var update = __webpack_require__(5)(content, {});
            if (content.locals) module.exports = content.locals;
            // Hot Module Replacement
            if (false) {
                // When the styles change, update the <style> tags
                if (!content.locals) {
                    module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./common.less", function () {
                        var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./common.less");
                        if (typeof newContent === 'string') newContent = [[module.id, newContent, '']];
                        update(newContent);
                    });
                }
                // When the module is disposed, remove the <style> tags
                module.hot.dispose(function () {
                    update();
                });
            }

            /***/
        },
        /* 3 */
        /***/ function (module, exports, __webpack_require__) {

            exports = module.exports = __webpack_require__(4)();
            // imports


            // module
            exports.push([module.id, ".cg-dialog-wrap {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  text-align: center;\n  z-index: 9999;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-color: #0b0b0b;\n  opacity: 0.8;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.cg-dialog-wrap:before {\n  content: '';\n  display: inline-block;\n  height: 100%;\n  vertical-align: middle;\n}\n.cg-dialog {\n  padding: 20px 30px;\n  text-align: left;\n  max-width: 400px;\n  margin: 40px auto;\n  position: relative;\n  display: inline-block;\n  background-color: white;\n  vertical-align: middle;\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n  user-select: text;\n}\n.cg-dialog-title {\n  font-weight: 400;\n  font-size: 2em;\n  margin-bottom: 10px;\n}\n.cg-dialog-buttons {\n  margin-top: 10px;\n  text-align: center;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.cg-dialog-buttons button + button {\n  margin-left: 1em;\n}\n", ""]);

            // exports


            /***/
        },
        /* 4 */
        /***/ function (module, exports) {

            /*
             MIT License http://www.opensource.org/licenses/mit-license.php
             Author Tobias Koppers @sokra
             */
            // css base code, injected by the css-loader
            module.exports = function () {
                var list = [];

                // return the list of modules as css string
                list.toString = function toString() {
                    var result = [];
                    for (var i = 0; i < this.length; i++) {
                        var item = this[i];
                        if (item[2]) {
                            result.push("@media " + item[2] + "{" + item[1] + "}");
                        } else {
                            result.push(item[1]);
				}
			}
                    return result.join("");
                };

                // import a list of modules into the list
                list.i = function (modules, mediaQuery) {
                    if (typeof modules === "string")
                        modules = [[null, modules, ""]];
                    var alreadyImportedModules = {};
                    for (var i = 0; i < this.length; i++) {
                        var id = this[i][0];
                        if (typeof id === "number")
                            alreadyImportedModules[id] = true;
			}
                    for (i = 0; i < modules.length; i++) {
                        var item = modules[i];
                        // skip already imported module
                        // this implementation is not 100% perfect for weird media query combinations
                        //  when a module is imported multiple times with different media queries.
                        //  I hope this will never occur (Hey this way we have smaller bundles)
                        if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
                            if (mediaQuery && !item[2]) {
                                item[2] = mediaQuery;
                            } else if (mediaQuery) {
                                item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
                            }
                            list.push(item);
				}
			}
                };
                return list;
            };


            /***/
        },
        /* 5 */
        /***/ function (module, exports, __webpack_require__) {

            /*
             MIT License http://www.opensource.org/licenses/mit-license.php
             Author Tobias Koppers @sokra
             */
            var stylesInDom = {},
                memoize = function (fn) {
                    var memo;
                    return function () {
                        if (typeof memo === "undefined") memo = fn.apply(this, arguments);
                        return memo;
                    };
		},
                isOldIE = memoize(function () {
                    return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
                }),
                getHeadElement = memoize(function () {
                    return document.head || document.getElementsByTagName("head")[0];
                }),
                singletonElement = null,
                singletonCounter = 0,
                styleElementsInsertedAtTop = [];

            module.exports = function (list, options) {
                if (false) {
                    if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
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
                    for (var i = 0; i < styles.length; i++) {
                        var item = styles[i];
                        var domStyle = stylesInDom[item.id];
                        domStyle.refs--;
                        mayRemove.push(domStyle);
			}
                    if (newList) {
                        var newStyles = listToStyles(newList);
                        addStylesToDom(newStyles, options);
                    }
                    for (var i = 0; i < mayRemove.length; i++) {
                        var domStyle = mayRemove[i];
                        if (domStyle.refs === 0) {
                            for (var j = 0; j < domStyle.parts.length; j++)
                                domStyle.parts[j]();
                            delete stylesInDom[domStyle.id];
				}
			}
                };
            }

            function addStylesToDom(styles, options) {
                for (var i = 0; i < styles.length; i++) {
                    var item = styles[i];
                    var domStyle = stylesInDom[item.id];
                    if (domStyle) {
                        domStyle.refs++;
                        for (var j = 0; j < domStyle.parts.length; j++) {
                            domStyle.parts[j](item.parts[j]);
				}
                        for (; j < item.parts.length; j++) {
                            domStyle.parts.push(addStyle(item.parts[j], options));
				}
                    } else {
                        var parts = [];
                        for (var j = 0; j < item.parts.length; j++) {
                            parts.push(addStyle(item.parts[j], options));
				}
                        stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
                }
            }

            function listToStyles(list) {
                var styles = [];
                var newStyles = {};
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var id = item[0];
                    var css = item[1];
                    var media = item[2];
                    var sourceMap = item[3];
                    var part = {css: css, media: media, sourceMap: sourceMap};
                    if (!newStyles[id])
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
                    if (!lastStyleElementInsertedAtTop) {
                        head.insertBefore(styleElement, head.firstChild);
                    } else if (lastStyleElementInsertedAtTop.nextSibling) {
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
                if (idx >= 0) {
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
                } else if (obj.sourceMap &&
                    typeof URL === "function" &&
                    typeof URL.createObjectURL === "function" &&
                    typeof URL.revokeObjectURL === "function" &&
                    typeof Blob === "function" &&
                    typeof btoa === "function") {
                    styleElement = createLinkElement(options);
                    update = updateLink.bind(null, styleElement);
                    remove = function () {
                        removeStyleElement(styleElement);
                        if (styleElement.href)
                            URL.revokeObjectURL(styleElement.href);
                    };
                } else {
                    styleElement = createStyleElement(options);
                    update = applyToTag.bind(null, styleElement);
                    remove = function () {
                        removeStyleElement(styleElement);
                    };
                }

                update(obj);

                return function updateStyle(newObj) {
                    if (newObj) {
                        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
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
                var sourceMap = obj.sourceMap;

                if (media) {
                    styleElement.setAttribute("media", media)
                }

                if (styleElement.styleSheet) {
                    styleElement.styleSheet.cssText = css;
                } else {
                    while (styleElement.firstChild) {
                        styleElement.removeChild(styleElement.firstChild);
			}
                    styleElement.appendChild(document.createTextNode(css));
                }
            }

            function updateLink(linkElement, obj) {
                var css = obj.css;
                var media = obj.media;
                var sourceMap = obj.sourceMap;

                if (sourceMap) {
                    // http://stackoverflow.com/a/26603875
                    css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
                }

                var blob = new Blob([css], {type: "text/css"});

                var oldSrc = linkElement.href;

                linkElement.href = URL.createObjectURL(blob);

                if (oldSrc)
                    URL.revokeObjectURL(oldSrc);
            }


            /***/
        },
        /* 6 */
        /***/ function (module, exports) {

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
            EventEmitter.prototype.setMaxListeners = function (n) {
                if (!isNumber(n) || n < 0 || isNaN(n))
                    throw TypeError('n must be a positive number');
                this._maxListeners = n;
                return this;
            };

            EventEmitter.prototype.emit = function (type) {
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
                        }
                        throw TypeError('Uncaught, unspecified "error" event.');
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

            EventEmitter.prototype.addListener = function (type, listener) {
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

            EventEmitter.prototype.once = function (type, listener) {
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
            EventEmitter.prototype.removeListener = function (type, listener) {
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

            EventEmitter.prototype.removeAllListeners = function (type) {
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

            EventEmitter.prototype.listeners = function (type) {
                var ret;
                if (!this._events || !this._events[type])
                    ret = [];
                else if (isFunction(this._events[type]))
                    ret = [this._events[type]];
                else
                    ret = this._events[type].slice();
                return ret;
            };

            EventEmitter.prototype.listenerCount = function (type) {
                if (this._events) {
                    var evlistener = this._events[type];

                    if (isFunction(evlistener))
                        return 1;
                    else if (evlistener)
                        return evlistener.length;
                }
                return 0;
            };

            EventEmitter.listenerCount = function (emitter, type) {
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


            /***/
        },
        /* 7 */
        /***/ function (module, exports) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.default = {

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
            module.exports = exports['default'];

            /***/
        }
        /******/])
});
;