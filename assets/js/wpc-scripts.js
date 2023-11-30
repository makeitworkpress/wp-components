/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/atoms/cart.ts":
/*!**********************************!*\
  !*** ./src/assets/atoms/cart.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/utils */ "./src/assets/other/utils.ts");

/**
 * Defines a social share element
 */
const Cart = {
  elements: document.getElementsByClassName('atom-cart-icon'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const cartElement of this.elements) {
      this.cartHandler(cartElement);
    }
  },
  /**
   * Handles any cart related actions
   *
   * @param cart HTMLElement The passed cart element
   */
  cartHandler(cart) {
    cart.addEventListener('click', event => {
      event.preventDefault();
      const cartContent = cart.nextElementSibling;
      (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeToggle)(cartContent);
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Cart);

/***/ }),

/***/ "./src/assets/atoms/map.ts":
/*!*********************************!*\
  !*** ./src/assets/atoms/map.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/**
 * Creates a Google Map
 */
const CustomMap = {
  elements: document.getElementsByClassName('atom-map'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const mapElement of this.elements) {
      this.setupMap(mapElement);
    }
  },
  /**
   * Setup a map
   * @param map The element for the map container
   */
  setupMap(mapElement) {
    if (typeof window.google === 'undefined') {
      return;
    }
    const canvas = mapElement.querySelector('.components-maps-canvas');
    if (!canvas) {
      return;
    }
    const attributes = window[canvas.dataset.id];
    const center = new google.maps.LatLng(parseFloat(attributes.center.lat), parseFloat(attributes.center.lng));
    const mapInstance = new google.maps.Map(canvas, {
      center,
      scrollwheel: false,
      styles: typeof attributes.styles !== 'undefined' ? attributes.styles : '',
      zoom: parseInt(attributes.zoom)
    });
    // The map instance is accessible through the global scope
    window[canvas.dataset.id].map = mapInstance;
    if (attributes.markers) {
      this.setupMapMarkers(mapInstance, attributes.markers, attributes.fit, center);
    }
  },
  /**
   * Setup markers in a map
   *
   * @param map The map instance
   * @param markers The unformatted marker input
   * @param fit Whether the markers should fit inside the map canvas
   * @param center The map center
   */
  setupMapMarkers(map, markers, fit, center) {
    const bounds = new google.maps.LatLngBounds();
    const markerInstances = [];
    markers.forEach((marker, index) => {
      let geocoder = null;
      let markerLatLng = null;
      markerInstances[index] = new google.maps.Marker({
        draggable: false,
        icon: typeof marker.icon !== 'undefined' ? marker.icon : '',
        map
      });
      // Geocode our marker when it has an address
      if (typeof marker.address !== 'undefined' && marker.address) {
        geocoder = geocoder !== null ? geocoder : new google.maps.Geocoder();
        geocoder.geocode({
          'address': marker.address
        }, (results, status) => {
          if (status === 'OK') {
            markerLatLng = results[0].geometry.location;
          } else if (status !== 'OK' && window.wpc.debug) {
            console.log('Geocoding of a map marker was not successfull: ' + status);
          }
        });
      } else if (marker.lat && marker.lng) {
        markerLatLng = new google.maps.LatLng(parseFloat(marker.lat), parseFloat(marker.lng));
      }
      if (markerLatLng !== null) {
        markerInstances[index].setPosition(markerLatLng);
        bounds.extend(markerLatLng);
      }
    });
    if (markerInstances.length < 1 || !fit) {
      return;
    }
    bounds.extend(center);
    map.fitBounds(bounds);
    // Define the minimum zoom to 15, even after bounds have changed
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      if (map.getZoom() > 15) {
        map.setZoom(15);
      }
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (CustomMap);

/***/ }),

/***/ "./src/assets/atoms/menu.ts":
/*!**********************************!*\
  !*** ./src/assets/atoms/menu.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/utils */ "./src/assets/other/utils.ts");

/**
 * Defines the custom menu scripts
 */
const Menu = {
  elements: document.getElementsByClassName('atom-menu'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const menu of this.elements) {
      this.setupHamburgerMenu(menu);
      this.setupCollapsedMenu(menu);
    }
  },
  /**
   * Sets the click handler for the hamburger menu
   * @param menu The given menu element
   */
  setupHamburgerMenu(menu) {
    const hamburgerMenu = menu.querySelector('.atom-menu-hamburger');
    const menuWrapper = menu.querySelector('.menu');
    if (!hamburgerMenu) {
      return;
    }
    hamburgerMenu.addEventListener('click', event => {
      event.preventDefault();
      menu.classList.toggle('atom-menu-expanded');
      hamburgerMenu.classList.toggle('active');
      menuWrapper.classList.toggle('active');
    });
  },
  /**
   * Sets up the handlers for collapsed menus
   * @param menu The given menu element
   */
  setupCollapsedMenu(menu) {
    var _a;
    if (!menu.classList.contains('atom-menu-collapse')) {
      return;
    }
    const menuItemsWithChildren = menu.querySelectorAll('.menu-item-has-children > a');
    for (const menuItemAnchor of menuItemsWithChildren) {
      const subMenu = (_a = menuItemAnchor.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.sub-menu');
      menuItemAnchor.addEventListener('click', event => {
        event.preventDefault();
        (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.ToggleClass)(menuItemAnchor, 'active');
        (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.SlideToggle)(subMenu);
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Menu);

/***/ }),

/***/ "./src/assets/atoms/modal.ts":
/*!***********************************!*\
  !*** ./src/assets/atoms/modal.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/utils */ "./src/assets/other/utils.ts");

/**
 * Defines the custom header scripts
 */
const Modal = {
  elements: document.getElementsByClassName('atom-modal'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const modal of this.elements) {
      this.setupClickHandler(modal);
    }
  },
  /**
   * Setup the click handler for closing modal
   *
   * @param modal The modal element
   */
  setupClickHandler(modal) {
    const closeModal = modal.querySelector('.atom-modal-close');
    closeModal.addEventListener('click', event => {
      event.preventDefault();
      (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeOut)(modal);
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Modal);

/***/ }),

/***/ "./src/assets/atoms/rate.ts":
/*!**********************************!*\
  !*** ./src/assets/atoms/rate.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/utils */ "./src/assets/other/utils.ts");
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

/**
 * Defines the custom header scripts
 */
const Rate = {
  elements: document.getElementsByClassName("atom-rate"),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const element of this.elements) {
      this.setupClickHandler(element);
    }
  },
  /**
   * Setup the click handler for sending rating requests to the back-end
   * @param element The specific rating element
   */
  setupClickHandler(element) {
    let isRating = false;
    const ratingAnchor = element.querySelector(".atom-rate-can .atom-rate-anchor");
    ratingAnchor.addEventListener("click", event => __awaiter(this, void 0, void 0, function* () {
      event.preventDefault();
      if (isRating) {
        return;
      }
      const {
        id = "",
        max = 5,
        min = 1
      } = element.dataset;
      const starElements = ratingAnchor.querySelectorAll(".atom-rate-star");
      let rating = 0;
      for (const starElement of starElements) {
        if (getComputedStyle(starElement).fontWeight === "900") {
          rating++;
        }
      }
      const loadingSpinner = element.querySelector(".atom-rate-can .fa-circle-notch");
      (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeIn)(loadingSpinner, "inline-block");
      // Actual rating functions
      isRating = true;
      const response = yield (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.AjaxApi)({
        action: "public_rate",
        id: id,
        max: +max,
        min: +min,
        rating: rating
      });
      // Modify our stars according to the rating
      if (response.success && response.data.rating) {
        this.updateStarElementClasses(starElements, response.data.rating);
      }
      setTimeout(() => {
        (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeOut)(loadingSpinner);
        isRating = false;
      }, 1500);
    }));
  },
  /**
   * Updates the star element classes according to the new rating, without needing to replace the element
   */
  updateStarElementClasses(starElements, rating) {
    let starKey = 0;
    let ceiledRating = Math.ceil(rating);
    for (const starElement of starElements) {
      starKey++;
      if (starKey < ceiledRating) {
        starElement.classList.add("fas", "fa-star");
        starElement.classList.remove("far", "fa-star-half");
      } else if (starKey === ceiledRating) {
        const fraction = rating - Math.floor(rating);
        if (fraction > 0.25 && fraction < 0.75) {
          starElement.classList.add("fas", "fa-star-half");
          starElement.classList.remove("far", "fa-star");
        } else if (fraction > 0.75) {
          starElement.classList.remove("far", "fa-star-half");
          starElement.classList.add("fas", "fa-star");
        }
      } else {
        starElement.classList.add("far", "fa-star");
        starElement.classList.remove("fas", "fa-star-half");
      }
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Rate);

/***/ }),

/***/ "./src/assets/atoms/scroll.ts":
/*!************************************!*\
  !*** ./src/assets/atoms/scroll.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/utils */ "./src/assets/other/utils.ts");

const Scroll = {
  elements: document.getElementsByClassName('atom-scroll'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const element of this.elements) {
      this.setupScrollHandler(element);
    }
    this.setupwindowHandler();
  },
  /**
   * Setup our scroll button
   * @param element The scroll element
   */
  setupScrollHandler(element) {
    const parent = element.parentElement;
    let destination;
    element.addEventListener('click', event => {
      event.preventDefault();
      if (element.classList.contains('atom-scroll-top')) {
        destination = 0;
      } else {
        destination = (parent === null || parent === void 0 ? void 0 : parent.clientHeight) + parent.getBoundingClientRect().top + window.scrollY;
      }
      window.scrollTo({
        top: destination,
        behavior: 'smooth'
      });
    });
  },
  /**
   * Setup the handler for the window functions
   */
  setupwindowHandler() {
    let scrolled = false;
    window.addEventListener('scroll', () => {
      let scrollPosition = window.scrollY;
      for (const element of this.elements) {
        if (element.classList.contains('atom-scroll-top')) {
          if (scrollPosition > window.innerHeight) {
            (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeIn)(element);
            scrolled = true;
          } else if (scrolled && scrollPosition < window.innerHeight) {
            (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeOut)(element);
            scrolled = false;
          }
        }
      }
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Scroll);

/***/ }),

/***/ "./src/assets/atoms/search.ts":
/*!************************************!*\
  !*** ./src/assets/atoms/search.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/modules */ "./src/assets/other/modules.ts");
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../other/utils */ "./src/assets/other/utils.ts");
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};


/**
 * Custom scripts for a search element
 * If enabled, the script will loads results through ajax
 */
const Search = {
  elements: document.getElementsByClassName('atom-search'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const element of this.elements) {
      this.setupSearch(element);
    }
  },
  /**
   * Setups the tabs for each element existing on a page
   * @param element The search element
   */
  setupSearch(element) {
    if (element.classList.contains('atom-search-ajax')) {
      this.setupAjaxSearch(element);
    }
    this.setupToggleSearch(element);
  },
  /**
   * Setups the ajax search functionality for the given element
   * @param element The search element
   */
  setupAjaxSearch(element) {
    const {
      appear = 'bottom',
      delay = 300,
      length = 3,
      none = '',
      number = 5,
      types = ''
    } = element.dataset;
    const searchForm = element.querySelector('.search-form');
    const searchField = element.querySelector('.search-field');
    const moreAnchor = element.querySelector('.atom-search-all');
    const results = element.querySelector('.atom-search-results');
    const loadingIcon = element.querySelector('.fa-circle-notch');
    let timer;
    let value;
    if (!element.classList.contains('atom-search-ajax')) {
      (0,_other_utils__WEBPACK_IMPORTED_MODULE_1__.FadeOut)(results);
      return;
    }
    searchField.addEventListener('keyup', event => {
      clearTimeout(timer);
      const currentSearchField = event.currentTarget;
      if (currentSearchField.value.length <= length || value === currentSearchField.value) {
        return;
      }
      timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        var _a;
        value = currentSearchField.value;
        moreAnchor.href = moreAnchor.href + encodeURI(value);
        results.classList.add('components-loading');
        (_a = results.querySelector('.atom-search-all')) === null || _a === void 0 ? void 0 : _a.remove();
        const response = yield (0,_other_utils__WEBPACK_IMPORTED_MODULE_1__.AjaxApi)({
          action: 'public_search',
          appear: appear,
          none: none,
          number: number,
          search: value,
          types: types
        });
        if (response.success) {
          (0,_other_utils__WEBPACK_IMPORTED_MODULE_1__.FadeIn)(results);
          results.innerHTML = response.data;
          results.append(moreAnchor);
          if (typeof sr !== 'undefined') {
            if (sr.initialized === false) {
              (0,_other_modules__WEBPACK_IMPORTED_MODULE_0__.InitScrollReveal)();
            }
            sr.sync();
          }
        }
        setTimeout(() => {
          (0,_other_utils__WEBPACK_IMPORTED_MODULE_1__.FadeOut)(loadingIcon);
          results.classList.remove('components-loading');
        }, 500);
      }), +delay);
    });
  },
  /**
   * Allows the search-form to be toggled from a single icon
   * @param element The search element
   */
  setupToggleSearch(element) {
    const searchExpandElement = element.querySelector('.atom-search-expand');
    if (!searchExpandElement) {
      return;
    }
    const searchForm = element.querySelector('.atom-search-form');
    const searchField = searchForm.querySelector('.search-field');
    searchExpandElement.addEventListener('click', event => {
      event.preventDefault();
      (0,_other_utils__WEBPACK_IMPORTED_MODULE_1__.ToggleClass)(element, 'atom-search-expanded');
      (0,_other_utils__WEBPACK_IMPORTED_MODULE_1__.ToggleClass)(searchExpandElement.querySelector('.fas'), ['fa-search', 'fa-times']);
      (0,_other_utils__WEBPACK_IMPORTED_MODULE_1__.FadeToggle)(searchForm);
      const searchResults = element.querySelector('.atom-search-results');
      if (searchResults.style.display === 'block') {
        searchForm.querySelector('.search-field').value = '';
        (0,_other_utils__WEBPACK_IMPORTED_MODULE_1__.FadeOut)(searchResults);
      }
      // Close search results when not expanding
      searchField.focus();
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Search);

/***/ }),

/***/ "./src/assets/atoms/share.ts":
/*!***********************************!*\
  !*** ./src/assets/atoms/share.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/utils */ "./src/assets/other/utils.ts");

/**
 * Defines a social share element
 */
const Share = {
  elements: document.getElementsByClassName('atom-share-fixed'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    this.setupShare();
  },
  /**
   * Setup our sharing functionalities
   */
  setupShare() {
    if (document.documentElement.scrollHeight < window.innerHeight) {
      return;
    }
    let scrolled = false;
    window.addEventListener('scroll', () => {
      let scrollPosition = window.scrollY;
      if (scrollPosition > 5 && !scrolled) {
        for (const element of this.elements) {
          (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeIn)(element);
        }
        scrolled = true;
      } else if (scrollPosition < 5 && scrolled) {
        scrolled = false;
        for (const element of this.elements) {
          (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.FadeOut)(element);
        }
      }
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Share);

/***/ }),

/***/ "./src/assets/atoms/tabs.ts":
/*!**********************************!*\
  !*** ./src/assets/atoms/tabs.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const Tabs = {
  elements: document.getElementsByClassName('atom-tabs'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const element of this.elements) {
      this.setupTabs(element);
    }
  },
  /**
   * Setups the tabs for each element existing on a page
   * @param element The tab element
   */
  setupTabs(element) {
    const buttons = element.querySelectorAll('.atom-tabs-navigation a');
    for (const button of buttons) {
      button.addEventListener('click', event => {
        this.clickHandler(event, buttons, element);
      });
    }
  },
  /**
   * Handles clicking a tab
   *
   * @param event The event for the click
   * @param buttons The list of all buttons
   * @param element The parent element
   */
  clickHandler(event, buttons, element) {
    const clickedButton = event.currentTarget;
    // The tab links to a regular url
    if (clickedButton.href.slice(-1) !== '#') {
      return;
    }
    event.preventDefault();
    const sections = element.querySelectorAll('.atom-tabs-content section');
    const targetSection = element.querySelector('.atom-tabs-content section[data-id="' + clickedButton.dataset.target + '"]');
    // Reset other buttons and classes
    for (const section of sections) {
      section.classList.remove('active');
    }
    for (const button of buttons) {
      button.classList.remove('active');
    }
    // Make our targets active
    clickedButton.classList.add('active');
    targetSection.classList.add('active');
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Tabs);

/***/ }),

/***/ "./src/assets/molecules/header.ts":
/*!****************************************!*\
  !*** ./src/assets/molecules/header.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _other_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../other/utils */ "./src/assets/other/utils.ts");

const Header = {
  elements: document.getElementsByClassName('molecule-header'),
  carts: document.querySelectorAll('.molecule-header .atom-cart-icon'),
  position: window.scrollY,
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const header of this.elements) {
      this.cssHandler(header);
      this.scrollHandler(header);
    }
  },
  /**
   * Set-up necessary css adjustments
   *
   * @param header HTML Element The passed header
   */
  cssHandler(header) {
    /**
     * Adapts the top-padding for the main section that follows the header, so it won't overlap
     */
    if (header.classList.contains('molecule-header-fixed')) {
      const height = header.clientHeight;
      const mainElement = header.nextElementSibling;
      if (mainElement.tagName === 'main' || mainElement.tagName === 'MAIN') {
        mainElement.style.paddingTop = height + 'px';
      }
    }
  },
  /**
   * Handles any scroll-related events to the selected header
   * @param header HTMLElement The given header
   */
  scrollHandler(header) {
    let up = false;
    window.addEventListener('scroll', () => {
      let positionFromTop = window.scrollY;
      if (header.classList.contains('molecule-header-fixed')) {
        if (positionFromTop > 5) {
          header.classList.add('molecule-header-scrolled');
          header.classList.remove('molecule-header-top');
        } else {
          header.classList.remove('molecule-header-scrolled');
          header.classList.add('molecule-header-top');
        }
      }
      if (header.classList.contains('molecule-header-headroom')) {
        if (positionFromTop > this.position && !up) {
          up = !up;
          (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.SlideToggle)(header);
        } else if (positionFromTop < this.position && up) {
          up = !up;
          (0,_other_utils__WEBPACK_IMPORTED_MODULE_0__.SlideToggle)(header);
        }
        this.position = positionFromTop;
      }
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Header);

/***/ }),

/***/ "./src/assets/molecules/posts.ts":
/*!***************************************!*\
  !*** ./src/assets/molecules/posts.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const Posts = {
  parser: new DOMParser(),
  elements: document.getElementsByClassName('molecule-posts'),
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const element of this.elements) {
      this.setupInfiniteScroll(element);
      this.setupPagination(element);
    }
  },
  /**
   * Setups infinite scroll for the posts element
   * @param element The post wrapper element
   */
  setupInfiniteScroll(element) {
    if (!element.classList.contains('molecule-posts-infinite')) {
      return;
    }
    const pagination = element.querySelector('.atom-pagination');
    if (pagination) {
      pagination.style.display = "none";
    }
    const paginationNumberElements = element.querySelectorAll('.atom-pagination .page-numbers');
    const containerId = element.dataset.id;
    const containerPosition = element.getBoundingClientRect().top;
    let pageNumber = 1;
    let loading = false; // Determines if we are loading or when all pages are load.
    window.addEventListener('scroll', () => {
      let url = '';
      if (loading) {
        return;
      }
      let windowPosition = window.innerHeight + window.scrollY;
      let postsPosition = element.clientHeight + containerPosition;
      if (windowPosition < postsPosition || paginationNumberElements.length < 1) {
        return;
      }
      pageNumber++;
      for (let key in paginationNumberElements) {
        if (!paginationNumberElements[key].textContent) {
          continue;
        }
        const paginationNumber = paginationNumberElements[key].textContent;
        if (parseInt(paginationNumber) === pageNumber) {
          url = paginationNumberElements[key].href;
          loading = true;
        }
      }
      if (!url.includes(window.location.origin)) {
        return;
      }
      // No more pages to load
      if (!url) {
        loading = true;
        return;
      }
      fetch(url, {}).then(response => {
        return response.text();
      }).then(response => {
        const posts = this.parser.parseFromString(response, 'text/html').querySelectorAll('.molecule-posts[data-id="' + containerId + '"] .molecule-post');
        const postsWrapper = element.querySelector('.molecule-posts-wrapper');
        for (let post of posts) {
          postsWrapper.appendChild(post);
        }
        loading = false;
        if (typeof sr !== 'undefined') {
          sr.sync();
        }
      });
    });
  },
  /**
   * Setup regular, dynamic pagination for the post wrapper element
   * @param element The post wrapper element
   */
  setupPagination(element) {
    if (!element.classList.contains('molecule-posts-ajax')) {
      return;
    }
    const paginationAnchors = element.querySelectorAll('.atom-pagination a');
    if (paginationAnchors.length < 1) {
      return;
    }
    for (let anchorElement of paginationAnchors) {
      anchorElement.addEventListener('click', event => {
        event.preventDefault();
        this.paginationClickHandler(element, anchorElement);
      });
    }
  },
  /**
   * Adds the click handler to any generated content
   * @param element The parent element to which the button belongs
   * @param anchor The button that is clicked
   */
  paginationClickHandler(element, anchor) {
    const target = anchor.href;
    if (!target.includes(window.location.origin)) {
      return;
    }
    element.classList.add('components-loading');
    // Fetch the target page
    fetch(target).then(response => {
      return response.text();
    }).then(response => {
      const responseDom = this.parser.parseFromString(response, 'text/html');
      const oldPagination = element.querySelector('.atom-pagination');
      const oldPosts = element.querySelector('.molecule-posts-wrapper');
      const newPagination = responseDom.querySelector('.molecule-posts[data-id="' + element.dataset.id + '"] .atom-pagination');
      const newPosts = responseDom.querySelector('.molecule-posts[data-id="' + element.dataset.id + '"] .molecule-posts-wrapper');
      element.classList.remove('components-loading');
      // Older Posts
      if (oldPosts && newPosts) {
        oldPosts.remove();
        element.append(newPosts);
      }
      if (oldPagination && newPagination) {
        oldPagination.remove();
        element.append(newPagination);
      }
      // Jquery animate alternative
      setTimeout(() => {
        window.scrollBy({
          top: element.getBoundingClientRect().top,
          behavior: 'smooth'
        });
      }, 500);
      // Sync our scroll-reveal from the global object
      if (typeof sr !== "undefined") {
        sr.sync();
      }
      // Because our dom is reconstructed, we need to setup pagination again for the given element
      this.setupPagination(element);
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Posts);

/***/ }),

/***/ "./src/assets/molecules/slider.ts":
/*!****************************************!*\
  !*** ./src/assets/molecules/slider.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const Slider = {
  elements: document.getElementsByClassName('molecule-slider'),
  instances: {},
  init() {
    if (!this.elements || this.elements.length < 1) {
      return;
    }
    for (const elements of this.elements) {
      this.createInstance(elements);
    }
  },
  /**
   * Creates a slider instance from a HTMLElemenmt
   * @param slider The slider wrapper
   */
  createInstance(slider) {
    if (typeof window.tns === "undefined") {
      return;
    }
    const id = slider.dataset.id;
    if (!id) {
      return;
    }
    const options = window['slider' + id];
    if (typeof options === "undefined") {
      return;
    }
    this.instances[id] = tns(options);
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Slider);

/***/ }),

/***/ "./src/assets/other/modules.ts":
/*!*************************************!*\
  !*** ./src/assets/other/modules.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InitOverlays: function() { return /* binding */ InitOverlays; },
/* harmony export */   InitParallax: function() { return /* binding */ InitParallax; },
/* harmony export */   InitScrollReveal: function() { return /* binding */ InitScrollReveal; }
/* harmony export */ });
function InitScrollReveal() {
  if (typeof ScrollReveal !== "undefined") {
    window.sr = ScrollReveal();
    window.sr.reveal('.components-bottom-appear', {
      origin: 'bottom'
    }, 50);
    window.sr.reveal('.components-left-appear', {
      origin: 'left'
    }, 50);
    window.sr.reveal('.components-right-appear', {
      origin: 'right'
    }, 50);
    window.sr.reveal('.components-top-appear', {
      origin: 'top'
    }, 50);
  }
}
function InitParallax() {
  window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY;
    const parallaxSections = document.getElementsByClassName('components-parallax');
    if (parallaxSections.length > 0) {
      for (let section of parallaxSections) {
        section.style.backgroundPosition = 'calc(50%) ' + 'calc(50% + ' + scrollPosition / 5 + "px" + ')';
      }
    }
  });
}
/**
 * Adds custom overlays to any section that has one defined
 * This function deprecates once attr is sufficiently supported by CSS
 */
function InitOverlays() {
  const overlayedElements = document.getElementsByClassName('components-custom-overlay');
  if (overlayedElements.length < 1) {
    return;
  }
  for (let element of overlayedElements) {
    const {
      color = '#000',
      opacity = '0.5'
    } = element.dataset;
    const overlay = document.createElement('div');
    overlay.classList.add('components-overlay-background');
    overlay.style.backgroundColor = color;
    overlay.style.opacity = opacity;
    element.append(overlay);
  }
}

/***/ }),

/***/ "./src/assets/other/utils.ts":
/*!***********************************!*\
  !*** ./src/assets/other/utils.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AjaxApi: function() { return /* binding */ AjaxApi; },
/* harmony export */   FadeIn: function() { return /* binding */ FadeIn; },
/* harmony export */   FadeOut: function() { return /* binding */ FadeOut; },
/* harmony export */   FadeToggle: function() { return /* binding */ FadeToggle; },
/* harmony export */   GetElementSiblings: function() { return /* binding */ GetElementSiblings; },
/* harmony export */   SlideIn: function() { return /* binding */ SlideIn; },
/* harmony export */   SlideOut: function() { return /* binding */ SlideOut; },
/* harmony export */   SlideToggle: function() { return /* binding */ SlideToggle; },
/* harmony export */   ToggleClass: function() { return /* binding */ ToggleClass; }
/* harmony export */ });
/* harmony import */ var _types_sibling_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/sibling-types */ "./src/assets/types/sibling-types.ts");
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

/**
 * Sends a post request to the default WordPress Ajax API endpoint
 *
 * @param data The data that needs to passed to the ajax endpoint
 * @returns Promise The json response from the fetched resource
 */
function AjaxApi(data) {
  return __awaiter(this, void 0, void 0, function* () {
    if (typeof data.nonce === 'undefined') {
      data.nonce = wpc.nonce;
    }
    // Non-rest api calls using admin-ajax use FormData.
    const body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
    const response = yield fetch(wpc.ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      body
    });
    const jsonResponse = response.json();
    if (wpc.debug) {
      console.log(jsonResponse);
    }
    return jsonResponse;
  });
}
/**
 * Toggles the display of an HTML Element by sliding its height
 *
 * @param element An HTML Element that needs to slide
 * @param displayStyle The display value that needs to used for displaying the item
 */
function SlideToggle(element) {
  let displayStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
  if (!element) {
    return;
  }
  if (getComputedStyle(element).display === 'none') {
    SlideOut(element, displayStyle);
  } else {
    SlideIn(element);
  }
}
/**
 * Exposes the display of an HTML Element by sliding its height out
 *
 * @param element An HTML Element that needs to slide
 * @param displayStyle The display value that needs to used for displaying the item
 */
function SlideOut(element) {
  let displayStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
  if (!element) {
    return;
  }
  element.classList.add('components-transition');
  element.style.display = displayStyle;
  element.style.removeProperty('height');
  // Grab and reset the height and opacity
  let elementHeight = element.clientHeight;
  element.style.height = '0px';
  element.style.opacity = '0';
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.height = elementHeight + 'px';
  }, 0);
}
/**
 * Hides the display of an HTML Element by sliding its height in
 *
 * @param element An HTML Element that needs to slide
 */
function SlideIn(element) {
  if (!element) {
    return;
  }
  element.classList.add('components-transition');
  element.style.opacity = '1';
  setTimeout(() => {
    element.style.height = '0px';
    element.style.opacity = '0';
  }, 0);
  setTimeout(() => {
    element.style.display = 'none';
    element.classList.remove('components-transition');
  }, 350);
}
/**
 * Toggles the display of an HTML Element by adjusting it's opacity
 *
 * @param element An HTML Element that needs to slide
 * @param displayStyle The display value that needs to used for displaying the item
 */
function FadeToggle(element) {
  let displayStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
  if (!element) {
    return;
  }
  // FadeIn
  if (getComputedStyle(element).display === 'none') {
    FadeIn(element, displayStyle);
  } else {
    FadeOut(element);
  }
}
/**
 * Toggles the display of an HTML Element by fading out
 *
 * @param element An HTML Element that needs to slide
 */
function FadeOut(element) {
  if (!element) {
    return;
  }
  element.classList.add('components-transition');
  element.style.opacity = "0";
  setTimeout(() => {
    element.style.display = "none";
    element.classList.remove('components-transition');
  }, 350);
}
/**
 * Toggles the display of an HTML Element by fading in.
 * The element should previously be faded out.
 *
 * @param element An HTML Element that needs to slide
 * @param displayStyle The display value that needs to used for displaying the item
 */
function FadeIn(element) {
  let displayStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
  if (!element) {
    return;
  }
  element.style.display = displayStyle;
  element.style.opacity = "0";
  element.classList.add('components-transition');
  setTimeout(() => {
    element.style.opacity = "1";
  }, 0);
}
/**
 * Toggles the class(es) for a given HTML element
 * @param element The element for which the class should be toggled
 * @param className The name of the given class, or array of names
 */
function ToggleClass(element, className) {
  if (!element) {
    return;
  }
  if (Array.isArray(className)) {
    className.forEach(name => {
      element.classList.toggle(name);
    });
  } else {
    element.classList.toggle(className);
  }
}
/**
 * Get all siblings for a given element
 *
 * @param element The element to look for siblings
 * @param mode The type of siblings to look for (previous or next)
 */
function GetElementSiblings(element) {
  let mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _types_sibling_types__WEBPACK_IMPORTED_MODULE_0__.SiblingTypes.Next;
  if (!element) {
    return [];
  }
  const siblings = [];
  if (mode === _types_sibling_types__WEBPACK_IMPORTED_MODULE_0__.SiblingTypes.Previous) {
    while (element = element.previousElementSibling) {
      siblings.push(element);
    }
  } else if (mode === _types_sibling_types__WEBPACK_IMPORTED_MODULE_0__.SiblingTypes.Next) {
    while (element = element.nextElementSibling) {
      siblings.push(element);
    }
  }
  return siblings;
}

/***/ }),

/***/ "./src/assets/types/sibling-types.ts":
/*!*******************************************!*\
  !*** ./src/assets/types/sibling-types.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SiblingTypes: function() { return /* binding */ SiblingTypes; }
/* harmony export */ });
var SiblingTypes;
(function (SiblingTypes) {
  SiblingTypes["Previous"] = "previous";
  SiblingTypes["Next"] = "next";
})(SiblingTypes || (SiblingTypes = {}));
;

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
/*!*******************************!*\
  !*** ./src/assets/scripts.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _atoms_cart__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./atoms/cart */ "./src/assets/atoms/cart.ts");
/* harmony import */ var _atoms_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./atoms/map */ "./src/assets/atoms/map.ts");
/* harmony import */ var _atoms_menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./atoms/menu */ "./src/assets/atoms/menu.ts");
/* harmony import */ var _atoms_modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./atoms/modal */ "./src/assets/atoms/modal.ts");
/* harmony import */ var _atoms_rate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./atoms/rate */ "./src/assets/atoms/rate.ts");
/* harmony import */ var _atoms_scroll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./atoms/scroll */ "./src/assets/atoms/scroll.ts");
/* harmony import */ var _atoms_search__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./atoms/search */ "./src/assets/atoms/search.ts");
/* harmony import */ var _atoms_share__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./atoms/share */ "./src/assets/atoms/share.ts");
/* harmony import */ var _atoms_tabs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./atoms/tabs */ "./src/assets/atoms/tabs.ts");
/* harmony import */ var _molecules_header__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./molecules/header */ "./src/assets/molecules/header.ts");
/* harmony import */ var _molecules_posts__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./molecules/posts */ "./src/assets/molecules/posts.ts");
/* harmony import */ var _molecules_slider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./molecules/slider */ "./src/assets/molecules/slider.ts");
/* harmony import */ var _other_modules__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./other/modules */ "./src/assets/other/modules.ts");
/**
 * All front-end modules are bundled into one application
 */













/**
 * Core class responsible for booting the application
 */
class WPC_App {
  constructor() {
    this.modules = [_molecules_header__WEBPACK_IMPORTED_MODULE_9__["default"], _molecules_slider__WEBPACK_IMPORTED_MODULE_11__["default"], _molecules_posts__WEBPACK_IMPORTED_MODULE_10__["default"], _atoms_tabs__WEBPACK_IMPORTED_MODULE_8__["default"], _atoms_search__WEBPACK_IMPORTED_MODULE_6__["default"], _atoms_scroll__WEBPACK_IMPORTED_MODULE_5__["default"], _atoms_rate__WEBPACK_IMPORTED_MODULE_4__["default"], _atoms_modal__WEBPACK_IMPORTED_MODULE_3__["default"], _atoms_menu__WEBPACK_IMPORTED_MODULE_2__["default"], _atoms_map__WEBPACK_IMPORTED_MODULE_1__["default"], _atoms_share__WEBPACK_IMPORTED_MODULE_7__["default"], _atoms_cart__WEBPACK_IMPORTED_MODULE_0__["default"]];
    this.initialize();
  }
  /**
   * Executes all code after the DOM has loaded
   */
  initialize() {
    document.addEventListener('DOMContentLoaded', () => {
      for (const key in this.modules) {
        this.modules[key].init();
      }
      (0,_other_modules__WEBPACK_IMPORTED_MODULE_12__.InitOverlays)();
      (0,_other_modules__WEBPACK_IMPORTED_MODULE_12__.InitParallax)();
      (0,_other_modules__WEBPACK_IMPORTED_MODULE_12__.InitScrollReveal)();
    });
  }
}
;
new WPC_App();
}();
/******/ })()
;
//# sourceMappingURL=wpc-scripts.js.map