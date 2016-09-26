const Pagination = require('./components/pagination')
const SearchInput = require('./components/search-input')
const Data = require('./utils/data')
const Dom = require('./utils/dom')

class Search {

  constructor(options) {

    this.featureSelector = options.featureSelector
    this.fetch = new Data()
    this.pagination = new Pagination(options.pagination)
    this.searchInput = new SearchInput({
      selector: '#query'
    })

    this.apiSettings = {
      baseUrl: 'https://api.twitch.tv/kraken',
      endpoint: '/search/streams',
      params: {
        limit: this.pagination.limit,
        client_id: options.clientId,
        q: this.searchInput.query,
        offset: this.pagination.offset
      }
    }
    this.url = this.generateApiUrl(this.apiSettings)

    this.init() // Let's get this show on the road!

  }

  /**
   * Invoke functions/methods required at point of class instantiation.
   */
  init() {

    let self = this

    // Instantiate Pagination event listeners
    this.pagination.on('changePage', () => this.onPageChange())

    // Instantiate Search Input event listeners
    this.searchInput.on('submitQuery', () => this.onQuerySubmit())

  }

  /**
   * Fires when a page is changed
   */
  onPageChange() {

    const pagination = this.pagination

    // Update offset attribute
    this.apiSettings.params.offset = pagination.offset

    // Update the API URL to include the updated offset attribute
    this.url = this.generateApiUrl(this.apiSettings)

    // Fetch our data!
    this.fetchResults()

    Dom.replaceClass(
      this.featureSelector,
      `page-${pagination.prevPage}`,
      `page-${pagination.currentPage}`
    )

  }


  /**
   * Fires when a user submits a query
   */
  onQuerySubmit() {
    // Set the new query
    this.apiSettings.params.q = this.searchInput.query
    // Generate the API URL
    this.url = this.generateApiUrl(this.apiSettings)
    // Reset pagination counter
    this.pagination.reset()
    // Get the new results!
    this.fetchResults()
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
  generateApiUrl(obj) {

    let params = Object.keys(obj.params).map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj.params[key])}`
    ).join('&')

    let url = [obj.baseUrl + obj.endpoint, params].join('?')

    return url
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
   * @return {String} template string for an individual search result.
   */
  templateResult(data) {
    return `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <a href="${data.channel.url}"
           class="card theme-${data.activity}"
           target="_blank"
        >
          <div class="image">
            <img src="${data.preview.large}"/>
          </div>

          <div class="info">
            <h6 class="viewers">
              <svg xmlns="http://www.w3.org/2000/svg"
                   xmlns:xlink="http://www.w3.org/1999/xlink"
                   x="0px"
                   y="0px"
                   width="16px"
                   height="16px"
                   viewBox="0 0 16 16">
                <g  transform="translate(0, 0)">
                <path d="
                  M8,14c4.707,0,7.744-5.284,7.871-5.508c0.171-0.304,0.172-0.676,
                  0.001-0.98C15.746,7.287,12.731,2,8,2&#10;&#9;C3.245,2,0.251,
                  7.289,0.126,7.514c-0.169,0.303-0.168,0.672,0.002,0.975C0.254,
                  8.713,3.269,14,8,14z M8,4&#10;&#9;c2.839,0,5.036,2.835,5.818,
                  4C13.034,9.166,10.837,12,8,12c-2.841,
                  0-5.038-2.838-5.819-4.001C2.958,6.835,5.146,4,8,4z"/>
                <circle data-color="color-2" cx="8" cy="8" r="2"/>
                </g>
              </svg>
            ${data.viewers}</h6>
            <h2 class="h5 title">${data.channel.display_name}</h2>
            <ul class="metadata">
              <li>${data.game}</li>
            </ul>
            <div class="description">
              <p>${data.channel.status}</p>
            </div>
          </div>
        </a>
      </div>
    `
  }

  /**
   * Determines stream activity based on how many viewers it has
   *
   * NOTE: This is ued to set an "activity" key, to be used for design
   * purposes. I consider this to be business logic, which would be apart of
   * the API, however this should do fine for now.
   *
   * @param {Number} viewers number of viewers for a given stream.
   *
   * @return {String} activity returns a readable activity status based on.
   */
  getStreamActivity(viewers) {

    let activity = 'cold';

    if (viewers > 500 && viewers < 999){
      activity = 'medium'
    }
    else if (viewers > 1000) {
      activity = 'hot'
    }

    return activity

  }



    /**
     * Retrieves data from a specified URL.
     */
    fetchResults() {

      let self = this
      let fetch = this.fetch

      fetch.jsonp(this.url).then(
        response => response.json()
      ).then(
        (json) => this.displayResults(json)
      )

    }



    /**
     * Displays all search results and replaces old results in DOM.
     *
     * @param {Object} json data object which is used to.
     */
    displayResults(json) {

      const self = this;
      let pagination = this.pagination

      pagination.update(json._total);

      // resultsObj is an array that is used in each response to gather all
      // of our result template strings.
      let resultsObj = []

      json.streams.forEach(function (data, index){
        // Set activity key/value
        data.activity = self.getStreamActivity(data.viewers)

        // Push template data-populated template string to an array.
        resultsObj.push(self.templateResult(data));

      });

      // Concatenate all template strings in resultsObj and append them to
      // the results container
      Dom.replace('#results', resultsObj.join(''))
    }

}


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
})
