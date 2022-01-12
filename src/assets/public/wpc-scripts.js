/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/source/molecules/header.ts":
/*!***********************************************!*\
  !*** ./src/assets/source/molecules/header.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/utils */ "./src/assets/source/other/utils.ts");

var Header = {
    headers: document.getElementsByClassName('molecule-header'),
    carts: document.querySelectorAll('.molecule-header .atom-cart-icon'),
    position: window.scrollY,
    init: function () {
        for (var key in this.headers) {
            var header = this.headers[key];
            this.cssHandler(header);
            this.scrollHandler(header);
        }
        for (var key in this.carts) {
            var cart = this.carts[key];
            this.cartHandler(cart);
        }
    },
    /**
     * Set-up necessary css adjustments
     *
     * @param header HTML Element The passed header
     */
    cssHandler: function (header) {
        /**
         * Adapts the top-padding for the main section that follows the header, so it won't overlap
         */
        if (header.classList.contains('molecule-header-fixed')) {
            var height = header.clientHeight;
            var mainElement = header.nextElementSibling;
            if (mainElement.tagName === 'main') {
                mainElement.style.paddingTop = height + 'px';
            }
        }
    },
    /**
     * Handles any scroll-related events to the selected header
     * @param header HTMLElement The given header
     */
    scrollHandler: function (header) {
        var _this = this;
        var up = false;
        window.addEventListener('scroll', function () {
            var positionFromTop = window.scrollY;
            if (header.classList.contains('molecule-header-fixed')) {
                if (positionFromTop > 5) {
                    header.classList.add('molecule-header-scrolled');
                    header.classList.remove('molecule-header-top');
                }
                else {
                    header.classList.remove('molecule-header-scrolled');
                    header.classList.add('molecule-header-top');
                }
            }
            if (header.classList.contains('molecule-header-headroom')) {
                if (positionFromTop > _this.position && !up) {
                    up = !up;
                    (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.SlideToggle)(header);
                }
                else if (positionFromTop < _this.position && up) {
                    up = !up;
                    (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.SlideToggle)(header);
                }
                _this.position = positionFromTop;
            }
        });
    },
    /**
     * Handles any cart related actions
     *
     * @param cart HTMLElement The passed cart element
     */
    cartHandler: function (cart) {
        cart.addEventListener('click', function (event) {
            event.preventDefault();
            var cartContent = cart.nextElementSibling;
            (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeToggle)(cartContent);
        });
    }
};
/* harmony default export */ __webpack_exports__["default"] = (Header);


/***/ }),

/***/ "./src/assets/source/molecules/slider.ts":
/*!***********************************************!*\
  !*** ./src/assets/source/molecules/slider.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
var Slider = {
    elements: document.getElementsByClassName('molecule-slider'),
    instances: {},
    init: function () {
        for (var key in this.elements) {
            this.createInstance(this.elements[key]);
        }
    },
    /**
     * Creates a slider instance from a HTMLElemenmt
     * @param slider The slider wrapper
     */
    createInstance: function (slider) {
        if (typeof globalThis.tns === "undefined") {
            return;
        }
        var id = slider.dataset.id;
        var options = globalThis['slider' + id];
        if (typeof options === "undefined") {
            return;
        }
        this.instances[id] = tns(options);
    }
};
/* harmony default export */ __webpack_exports__["default"] = (Slider);


/***/ }),

/***/ "./src/assets/source/other/utils.ts":
/*!******************************************!*\
  !*** ./src/assets/source/other/utils.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AjaxApi": function() { return /* binding */ AjaxApi; },
/* harmony export */   "SlideToggle": function() { return /* binding */ SlideToggle; },
/* harmony export */   "FadeToggle": function() { return /* binding */ FadeToggle; }
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Sends a post request to the default WordPress Ajax API endpoint
 *
 * @param data The data that needs to passed to the ajax endpoint
 * @returns Promise The json response for the fetched resource
 */
function AjaxApi(data) {
    return __awaiter(this, void 0, Promise, function () {
        var body, key, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof data.nonce === 'undefined') {
                        data.nonce = globalThis.wpc.nonce;
                    }
                    body = new FormData();
                    for (key in data) {
                        body.append(key, data[key]);
                    }
                    return [4 /*yield*/, fetch(globalThis.wpc.ajaxUrl, {
                            method: 'POST',
                            credentials: 'same-origin',
                            body: body
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
/**
 * Toggles the display of an HTML Element by sliding its height
 *
 * @param element An HTML Element that needs to slide
 */
function SlideToggle(element) {
    var defaultHeight = element.clientHeight;
    if (!element.classList.contains('wpc-slide-toggle-hidden')) {
        element.classList.add('wpc-slide-toggle-hidden');
        element.style.height = '0px';
    }
    else {
        element.style.height = defaultHeight + 'px';
        setTimeout(function () {
            element.classList.remove('wpc-slide-toggle-hidden');
        }, 250);
    }
}
/**
 * Toggles the display of an HTML Element by adjusting it's opacity
 *
 * @param element An HTML Element that needs to slide
 */
function FadeToggle(element) {
    var defaultHeight = element.clientHeight;
    if (!element.classList.contains('wpc-fade-toggle-hidden')) {
        element.classList.add('wpc-fade-toggle-hidden');
        element.style.opacity = "0";
        setTimeout(function () {
            element.style.display = "none";
        });
    }
    else {
        element.style.opacity = "1";
        element.style.display = "block";
        setTimeout(function () {
            element.classList.remove('wpc-fade-toggle-hidden');
        }, 250);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**************************************!*\
  !*** ./src/assets/source/scripts.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _molecules_header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./molecules/header */ "./src/assets/source/molecules/header.ts");
/* harmony import */ var _molecules_slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./molecules/slider */ "./src/assets/source/molecules/slider.ts");
/**
 * All front-end modules are bundled into one application
 */


var WPC_App = /** @class */ (function () {
    function WPC_App() {
        this.modules = [
            _molecules_header__WEBPACK_IMPORTED_MODULE_0__["default"], _molecules_slider__WEBPACK_IMPORTED_MODULE_1__["default"]
        ];
        this.initialize();
    }
    /**
     * Executes all code after the DOM has loaded
     */
    WPC_App.prototype.initialize = function () {
        var _this = this;
        document.addEventListener('DOMContentLoaded', function () {
            for (var key in _this.modules) {
                _this.modules[key].init();
            }
            _this.initScrollReveal();
            _this.initParallax();
        });
    };
    /**
     * Initializes our scroll-reveal functionality
     */
    WPC_App.prototype.initScrollReveal = function () {
        if (typeof globalThis.ScrollReveal !== "undefined") {
            globalThis.sr = ScrollReveal();
            globalThis.sr.reveal('.components-bottom-appear', { origin: 'bottom' }, 50);
            globalThis.sr.reveal('.components-left-appear', { origin: 'left' }, 50);
            globalThis.sr.reveal('.components-right-appear', { origin: 'right' }, 50);
            globalThis.sr.reveal('.components-top-appear', { origin: 'top' }, 50);
        }
    };
    /**
     * Initializes the parallax functionality
     */
    WPC_App.prototype.initParallax = function () {
        window.addEventListener('scroll', function () {
            var scrollPosition = window.scrollY;
            var parallaxSections = document.getElementsByClassName('components-parallax');
            if (parallaxSections.length > 0) {
                for (var key in parallaxSections) {
                    parallaxSections[key].style.backgroundPosition = 'calc(50%) ' + 'calc(50% + ' + (scrollPosition / 5) + "px" + ')';
                }
            }
        });
    };
    return WPC_App;
}());
;
new WPC_App();

}();
/******/ })()
;
//# sourceMappingURL=wpc-scripts.js.map