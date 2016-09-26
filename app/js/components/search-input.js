/**
 * Search Box
 * A simple component that provides a search input. It also emit's events to be
 * used in other modules.
 */

const EventEmitter = require('events')
const Dom = require('../utils/dom')

class SearchInput extends EventEmitter {

  constructor(options) {
    super()

    this.query
    this.input = document.querySelector(options.selector)

    this.init()
  }

  /**
   * Invoke functions/methods required at point of class instantiation.
   */
  init() {
    // Instantiate Input Events!
    this.input.addEventListener('keypress', (event) => this.keypress(event))
    this.input.addEventListener('blur', (event) => this.blur(event))
  }

  keypress(event) {
    const isEnterKey = (event.keyCode === 13)
    const hasQuery = this.input.value.length
    const query = this.input.value

    this.emit('keypress')

    if (isEnterKey && hasQuery) {
      this.query = query
      this.emit('submitQuery')
      this.input.blur()
    }

  }

   blur(event){
     this.emit('blur')
   }

}

module.exports = SearchInput
