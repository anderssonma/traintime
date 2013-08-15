// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */


function XML2jsobj(node) {

  var data = {};

  // append a value
  function Add(name, value) {
    if (data[name]) {
      if (data[name].constructor != Array) {
        data[name] = [data[name]];
      }
      data[name][data[name].length] = value;
    }
    else {
      data[name] = value;
    }
  };
  
  // element attributes
  var c, cn;
  for (c = 0; cn = node.attributes[c]; c++) {
    Add(cn.name, cn.value);
  }
  
  // child elements
  for (c = 0; cn = node.childNodes[c]; c++) {
    if (cn.nodeType == 1) {
      if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
        // text value
        Add(cn.nodeName, cn.firstChild.nodeValue);
      }
      else {
        // sub-object
        Add(cn.nodeName, XML2jsobj(cn));
      }
    }
  }

  return data;

}


var key = 'df66d1a0b9735350c53708219da3aa7a';
var fromLocationId = 7401587; // Malmö Triangeln
var toLocationId = 7400044; // Helsingborg C
var requestURL = 'https://api.trafiklab.se/samtrafiken/resrobot/Search.xml?callback=jQuery&utf8=%E2%9C%93&apiVersion=2.1&from=Triangeln&to=Helsingborg%20C&coordSys=RT90&fromId=7401587&toId=7400044&time=16%3A50&arrival=true&searchType=T&key=' + key;

var kittenGenerator = {
  /**
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */

  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
   *
   * @public
   */
  requestKittens: function() {
    var req = new XMLHttpRequest();
    req.open('GET', requestURL, true);
    req.onload = this.prepareData.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  prepareData: function(data) {
    var obj = data.target.responseXML.documentElement;
    obj = XML2jsobj(obj);
    var trainInfo = obj.ttitem;
    for (var i = 0; i < trainInfo.length; i++) {
      
      var dep = trainInfo[i].segment.arrival.datetime;
      dep = dep.split(' ');
      dep = dep[1];
      var arr = trainInfo[i].segment.departure.datetime;
      arr = arr.split(' ');
      arr = arr[1];

      var p1 = document.createElement('p');
      var p2 = document.createElement('p');
      p1.innerHTML = '<b>DEPARTS</b>: &nbsp;' + dep;
      p2.innerHTML = '<b>ARRIVES</b>: &nbsp;&nbsp;' + arr;

      var operator = trainInfo[i].segment.segmentid.mot;

      var p3 = document.createElement('p');
      p3.innerHTML = operator;

      document.body.appendChild(p1);
      document.body.appendChild(p2);
      document.body.appendChild(p3);
      if (i < trainInfo.length - 1) {
        var hr = document.createElement('hr');
        document.body.appendChild(hr);
      }
    }
    /*
    var kittens = e.target.responseXML.querySelectorAll('photo');
    for (var i = 0; i < kittens.length; i++) {
      var img = document.createElement('img');
      img.src = this.constructKittenURL_(kittens[i]);
      img.setAttribute('alt', kittens[i].getAttribute('title'));
      document.body.appendChild(img);
    }
    */
  },

  /**
   * Given a photo, construct a URL using the method outlined at
   * http://www.flickr.com/services/api/misc.urlKittenl
   *
   * @param {DOMElement} A kitten.
   * @return {string} The kitten's URL.
   * @private
   */

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  window.setTimeout(function() {
    kittenGenerator.requestKittens();
  }, 500);
});
