/**
 * DOM Utility
 * A collection of methods that allow for quick DOM manipulation
 */

const DOM = {

  /**
   * Appends a template (string literal) to a specified DOM element.
   *
   * NOTE: This is not being used, but I left it in here as it might be useful.
   *
   * @param {String} selector  name for content to be appended to
   * @param {String} template content to be appended
   * @param {String} wrapperClass className to be used for the parent element
   */
  append: function(selector, template, wrapperClass) {

    const element = document.createElement("div")

    if (wrapperClass)
      element.className = wrapperClass;

    element.innerHTML = template
    document.querySelector(selector).appendChild(element)

  },

  /**
   * Replaces a specified selector with a template (string litteral);
   *
   * @param {String} selector name in of selector for content to be appended to
   * @param {String} template takes a string to be appended
   */
  replace: function(selector, template) {
    document.querySelector(selector).innerHTML = template
  },

  /**
   * Removes a DOM element
   *
   * @param {String} selector name in of selector for content to be appended to
   * @param {String} childSelectorToRemove selector to remove from parent
   */
  removeChild: function(parentSelector, childToRemove) {
    const element = document.querySelector(parentSelector);
    element.removeChild(childToRemove)
  },

  /**
   * Add a class to on a given element
   *
   * @param {String} selector to add a class to
   * @param {String} className to add to given selector element
   */
  addClass: function(selector, className) {
    const element = document.querySelector(selector);
    element.classList.add(className);
  },

  /**
   * Remove a class on a given element
   *
   * @param {String} selector to add a class to
   * @param {String} className to add to given selector element
   */
  removeClass: function(selector, className) {
    const element = document.querySelector(selector);
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
  replaceClass: function(selector, oldClassName, newClassName) {
    this.removeClass(selector, oldClassName)
    this.addClass(selector, newClassName)
  },

  /**
   * Sets a multiple attributes to a given element
   * @param {String} selector to add a class to
   * @param {Object} attributes key/value pair of attributes to be added element
   */
  setAttributes: function(selector, attributes) {
    const element = document.querySelector(selector);
    for(var key in attributes) {
      element.setAttribute(key, attributes[key])
    }
  }

}

module.exports = DOM;
