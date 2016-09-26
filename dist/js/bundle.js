(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Known Issues
// https://discuss.dev.twitch.tv/t/is-the-search-streams-part-of-the-api-broken/2385/6

var Pagination = require('./components/pagination');
var SearchInput = require('./components/search-input');
var Data = require('./utils/data');
var Dom = require('./utils/dom');

var Search = function () {
  function Search(options) {
    _classCallCheck(this, Search);

    this.featureSelector = options.featureSelector;
    this.fetch = new Data();
    this.pagination = new Pagination(options.pagination);
    this.searchInput = new SearchInput({
      selector: '#query'
    });

    this.apiSettings = {
      baseUrl: 'https://api.twitch.tv/kraken',
      endpoint: '/search/streams',
      params: {
        limit: this.pagination.limit,
        client_id: options.clientId,
        q: this.searchInput.query,
        offset: this.pagination.offset
      }
    };
    this.url = this.generateApiUrl(this.apiSettings);

    this.init(); // Let's get this show on the road!
  }

  /**
   * Invoke functions/methods required at point of class instantiation.
   */


  _createClass(Search, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var self = this;

      // Instantiate Pagination event listeners
      this.pagination.on('changePage', function () {
        return _this.onPageChange();
      });
      // this.pagination.on('lastPage', () => this.onLastPage())
      // this.pagination.on('firstPage', () => this.onFirstPage())

      // Instantiate Search Input event listeners
      this.searchInput.on('submitQuery', function () {
        return _this.onQuerySubmit();
      });
    }

    /**
     * onPageChange
     */

  }, {
    key: 'onPageChange',
    value: function onPageChange() {

      var pagination = this.pagination;

      // Update offset attribute
      this.apiSettings.params.offset = pagination.offset;

      // Update the API URL to include the updated offset attribute
      this.url = this.generateApiUrl(this.apiSettings);

      // Fetch our data!
      this.fetchResults();

      Dom.replaceClass(this.featureSelector, 'page-' + pagination.prevPage, 'page-' + pagination.currentPage);
    }

    // /**
    //  * onLastPage
    //  */
    // onLastPage() {
    //   Dom.addClass(this.featureSelector, 'is-last-page')
    // }
    //
    // /**
    //  * onPageonFirstPage
    //  */
    // onFirstPage() {
    //   Dom.addClass(this.featureSelector, 'is-first-page')
    // }

    /**
     *
     */

  }, {
    key: 'onQuerySubmit',
    value: function onQuerySubmit() {

      // Set the new query
      this.apiSettings.params.q = this.searchInput.query;

      // Generate the API URL
      this.url = this.generateApiUrl(this.apiSettings);

      // Reset pagination counter
      this.pagination.reset();

      // Get the new results!
      this.fetchResults();
    }

    /**
     * generateApiUrl
     * Creates our URL used to call the API by concatenating the base path,
     * specified endpoint and query parameters (with encoded values)
     *
     * @param {String} obj.baseUrl The base path we will use.
     * @param {String} obj.endpoint The API resource that we use.
     * @param {String} obj.params.client_id Unique Client ID required by the API.
     * @param {String} obj.params.query Search query.
     * @param {Number} obj.params.offset Object offset for pagination.
     *
     * @return {String} url to be used as you desire.
     */

  }, {
    key: 'generateApiUrl',
    value: function generateApiUrl(obj) {

      var params = Object.keys(obj.params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(obj.params[key]);
      }).join('&');

      var url = [obj.baseUrl + obj.endpoint, params].join('?');

      return url;
    }

    /**
     * templateResult
     * Template used for each search result.
     *
     * NOTE: Pardon the SVG in here, ideally id put it in an SVG map, but due to
     *       expediency's sake I put it in here.
     *
     * TODO: Implement SVG Maps, move SVG in viewers element to apropriate place.
     *
     * @return {String} template string for an individual search result
     */

  }, {
    key: 'templateResult',
    value: function templateResult(data) {
      return '\n      <div class="col-sm-6 col-md-4 col-lg-3">\n        <a href="' + data.channel.url + '"\n           class="card theme-' + data.activity + '"\n           target="_blank"\n        >\n          <div class="image">\n            <img src="' + data.preview.large + '"/>\n          </div>\n\n          <div class="info">\n            <h6 class="viewers">\n              <svg xmlns="http://www.w3.org/2000/svg"\n                   xmlns:xlink="http://www.w3.org/1999/xlink"\n                   x="0px"\n                   y="0px"\n                   width="16px"\n                   height="16px"\n                   viewBox="0 0 16 16">\n                <g  transform="translate(0, 0)">\n                <path d="\n                  M8,14c4.707,0,7.744-5.284,7.871-5.508c0.171-0.304,0.172-0.676,\n                  0.001-0.98C15.746,7.287,12.731,2,8,2&#10;&#9;C3.245,2,0.251,\n                  7.289,0.126,7.514c-0.169,0.303-0.168,0.672,0.002,0.975C0.254,\n                  8.713,3.269,14,8,14z M8,4&#10;&#9;c2.839,0,5.036,2.835,5.818,\n                  4C13.034,9.166,10.837,12,8,12c-2.841,\n                  0-5.038-2.838-5.819-4.001C2.958,6.835,5.146,4,8,4z"/>\n                <circle data-color="color-2" cx="8" cy="8" r="2"/>\n                </g>\n              </svg>\n            ' + data.viewers + '</h6>\n            <h2 class="h5 title">' + data.channel.display_name + '</h2>\n            <ul class="metadata">\n              <li>' + data.game + '</li>\n            </ul>\n            <div class="description">\n              <p>' + data.channel.status + '</p>\n            </div>\n          </div>\n        </a>\n      </div>\n    ';
    }

    /**
     * Determines stream activity based on how many viewers it has
     *
     * NOTE: This is ued to set an "activity" key, to be used for design
     * purposes. I consider this to be business logic, which would be apart of
     * the API, however this should do fine for now.
     */

  }, {
    key: 'getStreamActivity',
    value: function getStreamActivity(viewers) {

      if (viewers > 500 && viewers < 999) {
        return 'medium';
      } else if (viewers > 1000) {
        return 'hot';
      }

      return 'cold';
    }

    /**
     * fetchResults
     * Retrieves data from a specified URL
     */

  }, {
    key: 'fetchResults',
    value: function fetchResults() {
      var _this2 = this;

      var self = this;
      var fetch = this.fetch;

      fetch.jsonp(this.url).then(function (response) {
        return response.json();
      }).then(function (json) {
        return _this2.displayResults(json);
      });
    }

    /**
     * displayResults
     *
     * @param {Object} json data object which is used to
     *
     */

  }, {
    key: 'displayResults',
    value: function displayResults(json) {

      var self = this;
      var pagination = this.pagination;

      pagination.update(json._total);

      // resultsObj is an array that is used in each response to gather all
      // of our result template strings.
      var resultsObj = [];

      json.streams.forEach(function (data, index) {
        // Set activity key/value
        data.activity = self.getStreamActivity(data.viewers);

        // Push template data-populated template string to an array.
        resultsObj.push(self.templateResult(data));
      });

      // Concatenate all template strings in resultsObj and append them to
      // the results container
      Dom.replace('#results', resultsObj.join(''));
    }
  }]);

  return Search;
}();

// Instantiate Search


var search = new Search({
  featureSelector: '.feature-search',
  clientId: '6f3i7gv5k3ilwanimypyrlr24ku4n79',
  pagination: {
    limit: 12,
    selectors: {
      prev: '#prev',
      next: '#next',
      count: '#count',
      total: '#result-total'
    }
  }
});

},{"./components/pagination":2,"./components/search-input":3,"./utils/data":4,"./utils/dom":5}],2:[function(require,module,exports){
'use strict';

var _typeof5 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _typeof4 = typeof Symbol === "function" && _typeof5(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof5(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof5(obj);
};

var _typeof3 = typeof Symbol === "function" && _typeof4(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof4(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof4(obj);
};

var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof3(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
};

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * Pagination
 * A simple utility/component that keeps track of pagination state. Additionally
 * it offers event listeners/emiters for previous/next buttons.
 */

var EventEmitter = require('events');
var Dom = require('../utils/dom');

var Pagination = function (_EventEmitter) {
  _inherits(Pagination, _EventEmitter);

  /**
   * @param {Number} settings.count Count of how many are being shown at one time
   * @param {Number} settings.countTotal Count of total items to display
   * @param {Number} settings.limit amount of items to return up to
   * @param {Number} settings.offset Object offset based on pages and offset increment
   * @param {Number} settings.offsetIncrement Increment to offset objects by
   * @param {Number} settings.pagesTotal Total amount of pages based on countTotal and offsetIncrement
   */
  function Pagination(settings) {
    _classCallCheck(this, Pagination);

    var _this = _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this));

    var self = _this;

    _this.prevPage;
    _this.pagesTotal;
    _this.settings = settings || {};
    _this.countTotal = _this.settings.totalCount || 0;
    _this.limit = _this.settings.limit || 16;
    _this.currentPage = _this.settings.pages || 0;
    _this.offsetIncrement = _this.settings.offsetIncrement || _this.settings.limit;
    _this.offset = _this.settings.offset || 0;

    _this.init(); // Let's paginate some stuff!

    return _this;
  }

  /**
   * Init
   */

  _createClass(Pagination, [{
    key: 'init',
    value: function init() {

      // Instantiate Custom Events!
      this.on('nextPage', this.nextPage);
      this.on('prevPage', this.prevPage);
      this.on('changePage', this.changePage);
    }

    /**
     * templateResultTotal
     * Displays total result count.
     *
     */

  }, {
    key: 'templateResultTotal',
    value: function templateResultTotal() {
      return '<span>' + this.countTotal + '</span> streams found';
    }

    /**
     * templatePaginationNav
     * Displays total result count as well as next and previous triggers.
     *
     */

  }, {
    key: 'templatePaginationNav',
    value: function templatePaginationNav() {
      var isFirstPage = this.isFirstPage();
      var isLastPage = this.isLastPage();
      var prevClass = isFirstPage ? 'next hidden' : 'next';
      var nextClass = isLastPage ? 'next hidden' : 'next';

      return '\n        <ul class="pagination">\n          <li class="' + prevClass + '"><a id="trigger-prev" href="#">Prev</a></li>\n          <li id="count"><span>' + this.currentPage + '</span> / <span>' + this.pagesTotal + '</span></li>\n          <li class="' + nextClass + '"><a id="trigger-next" href="#">Next</a></li>\n        </ul>\n      ';
    }

    /**
     * nextPage
     * increments the page count value and updates offsets accordingly.
     */

  }, {
    key: 'nextPage',
    value: function nextPage() {
      this.prevPage = this.currentPage;
      this.currentPage++;
      this.setPageOffset();
      this.emit('changePage');
    }

    /**
     * prevPage
     * decrements the page count value and updates offsets accordingly.
     */

  }, {
    key: 'prevPage',
    value: function prevPage() {
      this.prevPage = this.currentPage;
      this.currentPage--;
      this.setPageOffset();
      this.emit('changePage');
    }

    /**
     * [pages description]
     * @type {[type]}
     */

  }, {
    key: 'isFirstPage',
    value: function isFirstPage() {
      return this.currentPage === 1;
    }

    /**
     * [pages description]
     * @type {[type]}
     */

  }, {
    key: 'isLastPage',
    value: function isLastPage() {
      return this.currentPage === this.pagesTotal;
    }

    /**
     * changePage
     * Contains checks for first and last page and emits their events if
     * conditions met.
     */

  }, {
    key: 'changePage',
    value: function changePage() {
      var lastPage = this.isLastPage();
      var firstPage = this.isFirstPage();

      if (lastPage) {
        this.emit('lastPage');
      } else if (firstPage) {
        this.emit('firstPage');
      }
      console.log(this.pageData());
    }

    /**
     * setTotalPages
     *
     */

  }, {
    key: 'setTotalPages',
    value: function setTotalPages() {
      this.pagesTotal = Math.ceil(this.countTotal / this.offsetIncrement);
      return this.pagesTotal;
    }

    /**
     * setPageOffset
     * increments the page count value
     */

  }, {
    key: 'setPageOffset',
    value: function setPageOffset() {
      this.offset = this.currentPage * this.offsetIncrement - this.offsetIncrement;
    }

    /**
     * reset
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.countTotal = this.settings.totalCount || 0;
      this.limit = this.settings.limit || 16;
      this.currentPage = this.settings.pages || 0;
      this.offsetIncrement = this.settings.offsetIncrement || this.settings.limit;
      this.offset = this.settings.offset || 0;
      this.pagesTotal;
      this.nextPage();
    }

    /**
     * update
     */

  }, {
    key: 'update',
    value: function update(total) {
      var _this2 = this;

      // Set the Total Item Count
      this.countTotal = total;
      this.pagesTotal = this.setTotalPages();

      // Update Pagination Components
      Dom.replace('#count', this.templatePaginationNav());
      Dom.replace('#result-total', this.templateResultTotal());

      // Selectors
      this.selectorPrev = document.querySelector('#trigger-prev');
      this.selectorNext = document.querySelector('#trigger-next');

      // Instantiate Click Events!
      this.selectorPrev.addEventListener('click', function () {
        return _this2.emit('prevPage');
      });
      this.selectorNext.addEventListener('click', function () {
        return _this2.emit('nextPage');
      });
    }

    /**
     * pageData
     */

  }, {
    key: 'pageData',
    value: function pageData() {
      return {
        currentPage: this.currentPage,
        previousPage: this.prevPage,
        offset: this.offset,
        offsetIncrement: this.offsetIncrement,
        countTotal: this.countTotal,
        limit: this.limit,
        pagesTotal: this.pagesTotal
      };
    }
  }]);

  return Pagination;
}(EventEmitter);

module.exports = Pagination;

},{"../utils/dom":5,"events":6}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Search Box
 * A simple component that provides a search input. It also emit's events to be
 * used in other modules.
 */

var EventEmitter = require('events');
var Dom = require('../utils/dom');

var SearchInput = function (_EventEmitter) {
  _inherits(SearchInput, _EventEmitter);

  function SearchInput(options) {
    _classCallCheck(this, SearchInput);

    var _this = _possibleConstructorReturn(this, (SearchInput.__proto__ || Object.getPrototypeOf(SearchInput)).call(this));

    _this.query;
    _this.input = document.querySelector(options.selector);

    _this.init();
    return _this;
  }

  /**
   * Init
   */


  _createClass(SearchInput, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      // Instantiate Input Events!
      this.input.addEventListener('keypress', function (event) {
        return _this2.keypress(event);
      });
      this.input.addEventListener('blur', function (event) {
        return _this2.blur(event);
      });
    }
  }, {
    key: 'keypress',
    value: function keypress(event) {
      var isEnterKey = event.keyCode === 13;
      var hasQuery = this.input.value.length;
      var query = this.input.value;

      this.emit('keypress');

      if (isEnterKey && hasQuery) {
        this.query = query;
        this.emit('submitQuery');
        this.input.blur();
      }
    }
  }, {
    key: 'blur',
    value: function blur(event) {
      this.emit('blur');
      //  const isNewQuery = !(this.apiSettings.params.q === this.inputElement.value)
      //
      //  if (isNewQuery) {
      //    this.inputElement.value = this.apiSettings.params.q;
      //  }
    }
  }]);

  return SearchInput;
}(EventEmitter);

module.exports = SearchInput;

},{"../utils/dom":5,"events":6}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Data Class (JSONP)
 * A class that allows the user to access data via JSONP.
 *
 * I re-wrote a significant portion to better fit my use case(s) and commented
 * what this class does, but id be remiss if I didn't give credit to Cam Song's
 * solid implementation: https://github.com/camsong/fetch-jsonp
 *
 */

var Data = function () {
  function Data() {
    _classCallCheck(this, Data);

    this.timeout = 5000;
    this.jsonpCallback = 'callback';
    this.jsonpCallbackFunction = null;
  }

  /**
   * Generate callback function name.
   * @return {String} the callback identifier
   */


  _createClass(Data, [{
    key: 'generateCallbackFunction',
    value: function generateCallbackFunction() {
      return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random());
    }

    /**
     * Clear the function
     * @param {string} the name of the function to discard
     */

  }, {
    key: 'deleteFunction',
    value: function deleteFunction(functionName) {
      try {
        delete window[functionName];
      } catch (e) {
        window[functionName] = undefined;
      }
    }

    /**
     * Removes the script from the DOM
     *
     * NOTE: This could use DOM.removeChild, but trying to keep with the single
     * responsibility principle im adding this here.
     *
     * @param {String} scriptId the ID attribute of the script to discard
     */

  }, {
    key: 'removeScript',
    value: function removeScript(scriptId) {
      var script = document.getElementById(scriptId);
      document.querySelector('head').removeChild(script);
    }

    /**
     * Method that returns our JSONP data
     *
     * @param {String} url which we wish to make a JSONP request to
     * @return {Object} promise containing data.
     */

  }, {
    key: 'jsonp',
    value: function jsonp(url) {
      var _this = this;

      var timeoutId = void 0;
      var timeout = this.timeout;
      var jsonpCallback = this.jsonpCallback;

      var promise = new Promise(function (resolve, reject) {

        var callbackFunction = _this.generateCallbackFunction();
        var scriptId = jsonpCallback + '_' + callbackFunction;

        window[callbackFunction] = function (response) {

          resolve({
            ok: true,
            json: function json() {
              return Promise.resolve(response);
            }
          });

          if (timeoutId) clearTimeout(timeoutId);

          _this.removeScript(scriptId);
          _this.deleteFunction(callbackFunction);
        };

        // Check if the url has params, if not add a ? to start a list of params
        url += url.indexOf('?') === -1 ? '?' : '&';

        // Script used to retrieve our data from the API
        var script = document.createElement('script');

        // Attributes for above script
        var scriptAttributes = {
          src: '' + url + jsonpCallback + '=' + callbackFunction,
          id: scriptId
        };

        // Set attrbutes on script
        // NOTE: This could use DOM.removeChild, but trying to keep with the
        // single responsibility principle im adding this here.

        for (var key in scriptAttributes) {
          script.setAttribute(key, scriptAttributes[key]);
        }

        // Append Script
        document.getElementsByTagName('head')[0].appendChild(script);

        // Instantiate our timeout so that our request doesnt silently fail
        timeoutId = setTimeout(function () {
          reject(new Error('JSONP request to ' + url + ' timed out'));

          _this.deleteFunction(callbackFunction);
          _this.removeScript(scriptId);
        }, timeout);
      });

      return promise;
    }
  }]);

  return Data;
}();

module.exports = Data;

},{}],5:[function(require,module,exports){
"use strict";

/**
 * DOM Utility
 * A collection of methods that allow for quick DOM manipulation
 */

var DOM = {

  /**
   * Appends a template (string literal) to a specified DOM element.
   *
   * NOTE: This is not being used, but I left it in here as it might be useful.
   *
   * @param {String} selector  name for content to be appended to
   * @param {String} template content to be appended
   * @param {String} wrapperClass className to be used for the parent element
   */
  append: function append(selector, template, wrapperClass) {

    var element = document.createElement("div");

    if (wrapperClass) element.className = wrapperClass;

    element.innerHTML = template;
    document.querySelector(selector).appendChild(element);
  },

  /**
   * Replaces a specified selector with a template (string litteral);
   *
   * @param {String} selector name in of selector for content to be appended to
   * @param {String} template takes a string to be appended
   */
  replace: function replace(selector, template) {
    document.querySelector(selector).innerHTML = template;
  },

  /**
   * Removes a DOM element
   *
   * @param {String} selector name in of selector for content to be appended to
   * @param {String} childSelectorToRemove selector to remove from parent
   */
  removeChild: function removeChild(parentSelector, childToRemove) {
    var element = document.querySelector(parentSelector);
    element.removeChild(childToRemove);
  },

  /**
   * Add a class to on a given element
   *
   * @param {String} selector to add a class to
   * @param {String} className to add to given selector element
   */
  addClass: function addClass(selector, className) {
    var element = document.querySelector(selector);
    element.classList.add(className);
  },

  /**
   * Remove a class on a given element
   *
   * @param {String} selector to add a class to
   * @param {String} className to add to given selector element
   */
  removeClass: function removeClass(selector, className) {
    var element = document.querySelector(selector);
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  },

  /**
   * Remove a class on a given element
   *
   * @param {String} selector to add a class to
   * @param {String} oldClassName to remove from given selector element
   * @param {String} newClassName to add to given selector element
   */
  replaceClass: function replaceClass(selector, oldClassName, newClassName) {
    this.removeClass(selector, oldClassName);
    this.addClass(selector, newClassName);
  },

  /**
   * Sets a multiple attributes to a given element
   * @param {String} selector to add a class to
   * @param {Object} attributes key/value pair of attributes to be added element
   */
  setAttributes: function setAttributes(selector, attributes) {
    var element = document.querySelector(selector);
    for (var key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }

};

module.exports = DOM;

},{}],6:[function(require,module,exports){
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

},{}]},{},[1]);
