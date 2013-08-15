// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var QUERY = 'nature';
var APIkey = 'df66d1a0b9735350c53708219da3aa7a';
var triangeln = 7401587;
var malmoc = 7400003;
var hbg = 7400044;
console.log($);

var resrobot = 'https://api.trafiklab.se/samtrafiken/resrobot/Search.json?apiVersion=2.1&from=Triangeln&to=Helsingborg%20C&coordSys=RT90&fromId=7401587&toId=7400044&time=16%3A50&arrival=true&searchType=T&key=' + APIkey;

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
  searchOnFlickr_: 'https://secure.flickr.com/services/rest/?' +
      'method=flickr.photos.search&' +
      'api_key=90485e931f687a9b9c2a66bf58a3861a&' +
      'text=' + encodeURIComponent(QUERY) + '&' +
      'safe_search=1&' +
      'content_type=1&' +
      'sort=interestingness-desc&' +
      'per_page=20',

  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
   *
   * @public
   */
  requestKittens: function() {
    var req = new XMLHttpRequest();
    req.open('GET', resrobot, true);
    req.onload = this.showPhotos_.bind(this);
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
  showPhotos_: function (e) {
    var arr = JSON.parse(e.target.responseText);
    console.log(arr);
    var trainInfo = arr.timetableresult.ttitem;
    console.log(trainInfo);
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

      var operator = trainInfo[i].segment.segmentid.carrier.id;
      if (operator === 276) {
        operator = 'Pågatåg';
      } else {
        operator = 'Öresundståg';
      }
      console.log(operator);
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
  constructKittenURL_: function (photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_s.jpg";
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  kittenGenerator.requestKittens();
});
