/**
 * Data Class (JSONP)
 * A class that allows the user to access data via JSONP.
 *
 * I re-wrote a significant portion to better fit my use case(s) and commented
 * what this class does, but id be remiss if I didn't give credit to Cam Song's
 * solid implementation: https://github.com/camsong/fetch-jsonp
 *
 */

class Data {

  constructor() {
    this.timeout = 5000
    this.jsonpCallback = 'callback'
    this.jsonpCallbackFunction = null
  }



  /**
   * Generate callback function name.
   * @return {String} the callback identifier
   */
  generateCallbackFunction() {
    return `jsonp_${Date.now()}_${Math.ceil(Math.random())}`
  }



  /**
   * Clear the function
   * @param {string} the name of the function to discard
   */
  deleteFunction(functionName) {
    try {
      delete window[functionName]
    } catch (e) {
      window[functionName] = undefined
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
  removeScript(scriptId) {
    const script = document.getElementById(scriptId)
    document.querySelector('head').removeChild(script)
  }

  /**
   * Method that returns our JSONP data
   *
   * @param {String} url which we wish to make a JSONP request to
   * @return {Object} promise containing data.
   */
  jsonp(url) {

    let timeoutId
    const timeout = this.timeout
    const jsonpCallback = this.jsonpCallback

    const promise = new Promise((resolve, reject) => {

      const callbackFunction = this.generateCallbackFunction()
      const scriptId = `${jsonpCallback}_${callbackFunction}`

      window[callbackFunction] = (response) => {

        resolve({
          ok: true,
          json: () => Promise.resolve(response),
        })

        if (timeoutId) clearTimeout(timeoutId)

        this.removeScript(scriptId)
        this.deleteFunction(callbackFunction)

      }

      // Check if the url has params, if not add a ? to start a list of params
      url += (url.indexOf('?') === -1) ? '?' : '&'

      // Script used to retrieve our data from the API
      const script = document.createElement('script')

      // Attributes for above script
      const scriptAttributes = {
        src: `${url}${jsonpCallback}=${callbackFunction}`,
        id: scriptId
      }

      // Set attrbutes on script
      // NOTE: This could use DOM.removeChild, but trying to keep with the
      // single responsibility principle im adding this here.

      for(var key in scriptAttributes) {
        script.setAttribute(key, scriptAttributes[key])
      }

      // Append Script
      document.getElementsByTagName('head')[0].appendChild(script)

      // Instantiate our timeout so that our request doesnt silently fail
      timeoutId = setTimeout(() => {
        reject(new Error(`JSONP request to ${url} timed out`))

        this.deleteFunction(callbackFunction)
        this.removeScript(scriptId)
      }, timeout)

    })

    return promise

  }

}

module.exports = Data
