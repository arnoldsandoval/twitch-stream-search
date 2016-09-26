/**
 * Pagination
 * A simple utility/component that keeps track of pagination state. Additionally
 * it offers event listeners/emiters for previous/next buttons.
 */

const EventEmitter = require('events')
const Dom = require('../utils/dom')

class Pagination extends EventEmitter {

  /**
   * @param {Number} settings.count Count of how many are being shown at one time
   * @param {Number} settings.countTotal Count of total items to display
   * @param {Number} settings.limit amount of items to return up to
   * @param {Number} settings.offset Object offset based on pages and offset increment
   * @param {Number} settings.offsetIncrement Increment to offset objects by
   * @param {Number} settings.pagesTotal Total amount of pages based on countTotal and offsetIncrement
   */
  constructor(settings) {

    super()

    const self = this

    this.prevPage
    this.pagesTotal
    this.settings = settings || {}
    this.countTotal = this.settings.totalCount || 0
    this.limit = this.settings.limit || 16
    this.currentPage = this.settings.pages || 0
    this.offsetIncrement = this.settings.offsetIncrement || this.settings.limit
    this.offset = this.settings.offset || 0

    this.init() // Let's paginate some stuff!

  }

  /**
   * Invoke functions/methods required at point of class instantiation.
   */
  init() {
    // Instantiate Custom Events!
    this.on('nextPage', this.nextPage)
    this.on('prevPage', this.prevPage)
    this.on('changePage', this.changePage)
  }

  /**
   * templateResultTotal
   * Displays total result count.
   *
   */
   templateResultTotal() {
     return `<span>${this.countTotal}</span> streams found`
   }

   /**
    * templatePaginationNav
    * Displays total result count as well as next and previous triggers
    * conditionally depending on wether or not its the first or last page.
    */
    templatePaginationNav() {
      const isFirstPage = this.isFirstPage()
      const isLastPage = this.isLastPage()
      const prevClass = (isFirstPage) ? 'prev hidden'  : 'prev'
      const nextClass = (isLastPage) ? 'next hidden'  : 'next'

      return `
        <ul class="pagination">
          <li class="${prevClass}"><a id="trigger-prev" href="#">Prev</a></li>
          <li id="count"><span>${this.currentPage}</span> / <span>${this.pagesTotal}</span></li>
          <li class="${nextClass}"><a id="trigger-next" href="#">Next</a></li>
        </ul>
      `
    }

  /**
   * nextPage
   * increments the page count value and updates offsets accordingly.
   */
  nextPage() {
    this.prevPage = this.currentPage
    this.currentPage++
    this.setPageOffset()
    this.emit('changePage')
  }

  /**
   * prevPage
   * decrements the page count value and updates offsets accordingly.
   */
  prevPage() {
    this.prevPage = this.currentPage
    this.currentPage--
    this.setPageOffset()
    this.emit('changePage')
  }

  /**
   * Checks to see if the current page is the first.
   * @type {[type]}
   */
  isFirstPage() { return this.currentPage === 1 }

  /**
   * Checks to see if the current page is the last.
   * @return {Boolean}
   */
  isLastPage() { return this.currentPage === this.pagesTotal }



  /**
   * Contains event actions for when a page is changed, Contains checks for
   * first and last page and emits their events if conditions met.
   */
  changePage() {
    const lastPage = this.isLastPage()
    const firstPage = this.isFirstPage()

    if (lastPage) {
      this.emit('lastPage')
    } else if (firstPage) {
      this.emit('firstPage')
    }
    console.log(this.pageData())
  }



  /**
   * setTotalPages
   *
   * return
   */
  setTotalPages() {
    this.pagesTotal = Math.ceil(this.countTotal/this.offsetIncrement)
    return this.pagesTotal
  }



  /**
   * setPageOffset
   * increments the page count value
   */
  setPageOffset() {
    this.offset = (this.currentPage * this.offsetIncrement) - this.offsetIncrement
  }



  /**
   * reset
   */
  reset(){
    this.countTotal = this.settings.totalCount || 0
    this.limit = this.settings.limit || 16
    this.currentPage = this.settings.pages || 0
    this.offsetIncrement = this.settings.offsetIncrement || this.settings.limit
    this.offset = this.settings.offset || 0
    this.pagesTotal
    this.nextPage()
  }



  /**
   * update
   */
  update(total){

    // Set the Total Item Count
    this.countTotal = total
    this.pagesTotal = this.setTotalPages()

    // Update Pagination Components
    Dom.replace('#count', this.templatePaginationNav())
    Dom.replace('#result-total', this.templateResultTotal())


    // Selectors
    this.selectorPrev = document.querySelector('#trigger-prev')
    this.selectorNext = document.querySelector('#trigger-next')

    // Instantiate Click Events!
    this.selectorPrev.addEventListener('click', () => this.emit('prevPage'))
    this.selectorNext.addEventListener('click', () => this.emit('nextPage'))

  }



  /**
   * pageData
   */
  pageData() {
    return {
      currentPage: this.currentPage,
      previousPage: this.prevPage,
      offset: this.offset,
      offsetIncrement: this.offsetIncrement,
      countTotal: this.countTotal,
      limit: this.limit,
      pagesTotal: this.pagesTotal
    }
  }

}

module.exports = Pagination
