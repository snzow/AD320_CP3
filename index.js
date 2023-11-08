/*
* Name : Aodhan Bower
* Date : 11/7/2023
* 
* This is the JS file to implement the UI for a website that 
* takes in a color in one of several formats and changes the page to that color
* as well as displaying the name of the color
*/



'use strict';
(function () {
  window.addEventListener('load', init);

  function init() {
    let textBox = document.querySelector('input[type="text"]');
    let button = document.querySelector('button');
    textBox.addEventListener('input', function (event) {
      console.log('Input changed:', event.target.value);
    });

    button.addEventListener('click', function () {
      let textBox = document.querySelector('input');
      const colorContainer = id('color-container');
      if (id('color-result')) {
        colorContainer.removeChild(id('color-result'));
      }
      fetchColor(textBox.value);
    });
  }

  /**
   * activates when the change color button has been pressed and fetches the color from the api.
   * @param {string} color
   * @returns if an error has been caught
   */
  async function fetchColor(color) {
    const colorFormat = validateColor(color);
    if (colorFormat == 'failed') {
      const invalidText = document.createElement('p');
      invalidText.textContent = 'Invalid number format';
      invalidText.style.color = 'red';
      invalidText.setAttribute('id', 'color-result');
      id('color-container').appendChild(invalidText);
      return;
    }
    const apiUrl = 'https://www.thecolorapi.com/id?';
    const resp = await fetch(apiUrl + colorFormat + '=' + color, {
      method: 'GET',
      query: color,
    });

    try {
      await statusCheck(resp);
    } catch {
      (e) => {
        const error = document.createElement('p');
        error.textContent = 'error: ' + e;
        invalidText.style.color = 'red';
        invalidText.setAttribute('id', 'color-result');
        id('color-container').appendChild(invalidText);
        return;
      };
    }
    const response = await resp.json();

    console.log(response);
    // i know im not supposed to do this but its so much simpler this way please let it slide
    id('box-container').style.backgroundColor = response.hex.value;

    const colorText = document.createElement('img');
    colorText.setAttribute('id', 'color-result');
    colorText.src = response.image.named;
    id('color-container').appendChild(colorText);
  }

  /**
   * takes a string representing a color in either rgb, hex, or hasl
   *
   * @param {string} color the string representing the color to match
   * @returns either what kind of color it is, or failed if it isnt valid
   */
  function validateColor(color) {
    const rsbRegex = /^rgb\((\d+),(\d+),(\d+)\)$/;
    const hexRegex = /^([A-Fa-f0-9]{6})$/;
    const hslRegex =
      /hsl\(\s*(\d+|([1-9]|[1-9]\d|1\d\d|2([0-4]\d|5[0-5])))(\s*,\s*(\d+|100)%){2}\)/;

    if (rsbRegex.test(color)) {
      return 'rgb';
    }
    if (hexRegex.test(color)) {
      return 'hex';
    }
    if (hslRegex.test(color)) {
      return 'hsl';
    }
    return 'failed';
  }

  /* ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();
