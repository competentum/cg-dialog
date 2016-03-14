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

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            __webpack_require__(1);

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

                _applySettings: function _applySettings(settings) {
                    this.title = settings.title || '';
                    this.content = settings.content || '';
                    this.onclose = settings.onclose || function () {
                        };
                    this.onopen = settings.onclose || function () {
                        };
                    this.type = settings.type || this.constructor.TYPES.OK;
                    this.isModal = settings.isModal || this.type != this.constructor.TYPES.OK;
                },

                _render: function _render(settings) {
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
                    } else if (this.content instanceof Element) {
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

                close: function close(result) {
                    if (typeof result === 'undefined') {
                        result = false;
                    }
                    this.wrapElement.style.display = 'none';
                    this.onclose(result);
                },

                open: function open() {
                    this.wrapElement.style.display = 'block';
                    this.onopen();
                }

            };

            if (typeof jQuery !== 'undefined') {
                //todo: add plugin
            }

            exports.default = CgDialog;
            module.exports = exports['default'];

            /***/
        },
        /* 1 */
        /***/ function (module, exports, __webpack_require__) {

            // style-loader: Adds some css to the DOM by adding a <style> tag

            // load the styles
            var content = __webpack_require__(2);
            if (typeof content === 'string') content = [[module.id, content, '']];
            // add the styles to the DOM
            var update = __webpack_require__(4)(content, {});
            if (content.locals) module.exports = content.locals;
            // Hot Module Replacement
            if (false) {
                // When the styles change, update the <style> tags
                if (!content.locals) {
                    module.hot.accept("!!./../node_modules/css-loader/index.js!./common.css", function () {
                        var newContent = require("!!./../node_modules/css-loader/index.js!./common.css");
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
        /* 2 */
        /***/ function (module, exports, __webpack_require__) {

            exports = module.exports = __webpack_require__(3)();
            // imports


            // module
            exports.push([module.id, "\r\n.cg-dialog-wrap {\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100%;\r\n    left: 0;\r\n    top: 0;\r\n    text-align: center;\r\n    z-index: 9999;\r\n    -webkit-box-sizing: border-box;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n    background-color: #0b0b0b;\r\n    opacity: 0.8;\r\n}\r\n\r\n.cg-dialog-wrap:before {\r\n    content: '';\r\n    display: inline-block;\r\n    height: 100%;\r\n    vertical-align: middle;\r\n}\r\n\r\n.cg-dialog {\r\n    padding: 20px 30px;\r\n    text-align: left;\r\n    max-width: 400px;\r\n    margin: 40px auto;\r\n    position: relative;\r\n    display: inline-block;\r\n    background-color: white;\r\n    vertical-align: middle;\r\n}\r\n\r\n.cg-dialog-title {\r\n    font-weight: 400;\r\n    font-size: 2em;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.cg-dialog-buttons {\r\n    margin-top: 10px;\r\n    text-align: center;\r\n}\r\n\r\n.cg-dialog-buttons button + button {\r\n    margin-left: 1em;\r\n}", ""]);

            // exports


            /***/
        },
        /* 3 */
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
        /* 4 */
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
        }
        /******/])
});
;