/**
 * @fileoverview Google Content Experiments utility functions.
 */

var uri = require('../utils/uri');

var ATTR = 'data-ak-gcx';
var initted = false;


function initGoogleContentExperiments (experimentId) {
  if (initted) {
    return;
  }

  if (window.cxApi) {
    initVariations();
  } else {
    var scriptEl = document.createElement('script');
    scriptEl.src = '//www.google-analytics.com/cx/api.js?experiment=' + experimentId;
    document.getElementsByTagName('head')[0].appendChild(scriptEl);
    scriptEl.onload = initVariations;
  }
  initted = true;
}


function setVariationShown(chosenVariationId) {
  var els = document.querySelectorAll('[' + ATTR + ']');
  [].forEach.call(els, function(el) {
    var eachVariationId = el.getAttribute(ATTR);
    var enabled = eachVariationId == chosenVariationId;
    if (enabled) {
      el.setAttribute(ATTR + '--active', eachVariationId);
      el.removeAttribute(ATTR);
    }
  });
}


function initVariations() {
  var variationFromParam = uri.getParameterValue('variation');
  if (variationFromParam) {
    var variation = variationFromParam;
  } else {
    var variation = window.cxApi.chooseVariation();
  }
  setVariationShown(variation);
}


module.exports = {
  initGoogleContentExperiments: initGoogleContentExperiments
};
