/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var app = {
  itemsKey: 'GEOAUDIO_ITEMS',

  items: [],

  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  server: 'http://chat.arrayofbytes.com',
  //server: 'http://localhost:5000',

  sendMessage: function(item, success) {
    console.log("app.sendMessage");
    var req = new XMLHttpRequest();
    req.open('POST', this.server + '/messages', true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.onreadystatechange = function() {
      console.log("app.sendMessage.onreadystatechange(req.readystate "
          + req.readystate
          + "; req.status: "
          + req.status + ")");

      if (req.readyState == 4 && req.status == 200) {
        success();
      }
    };

    req.send(JSON.stringify(item));
    //this.items.push(item);
    //window.localStorage.setItem(this.itemsKey, JSON.stringify(this.items));
    //this.addItem(item);
  },

  getMessages: function(longitude, latitude, success) {
    console.log("app.getMessages");
    var req = new XMLHttpRequest();
    req.open('GET', this.server + '/messages?longitude=' + longitude + '&latitude=' + latitude, true);

    req.onreadystatechange = function() {
      console.log("app.getMessages.onreadystatechange(req.readystate "
          + req.readyState
          + "; req.status: "
          + req.status + ")");
      if (req.readyState == 4 && req.status == 200) {
        success(JSON.parse(req.responseText));
      }
    };

    req.send();
  },

  onTextChange: function () {
    var description = document.querySelector('#description');
    var submitButton = document.querySelector("#submit");

    var empty = description.value.length < 1;
    //console.log("onTextChange: " + empty);
    submitButton.disabled = empty;
  },

  showLocationFail: function () {
    var submitMessage = document.getElementById('submit-message');
    submitMessage.style.display = "inline";
  },

  hideLocationFail: function () {
    var submitMessage = document.getElementById('submit-message');
    submitMessage.style.display = "none";
  },

  showSpinner: function () {
    var refresh = document.querySelector("#refresh-spinner");
    refresh.className = "fa fa-spinner fa-spin";
    var submit = document.querySelector("#submit-spinner");
    submit.className = "fa fa-spinner fa-spin";

    var submitButton = document.querySelector("#submit");
    submitButton.disabled = true;
  },

  hideSpinner: function () {
    var refresh = document.querySelector("#refresh-spinner");
    refresh.className = "fa fa-refresh";
    var submit = document.querySelector("#submit-spinner");
    submit.className = "fa fa-paper-plane-o";

    this.onTextChange();
    //var submitButton = document.querySelector("#submit");
    //submitButton.disabled = false;
  },

  onSubmitClick: function() {
    this.showSpinner();
    var description = document.getElementById('description');
    var item = {
      body: description.value,
      location: "No LOCO!"
    };
    navigator.geolocation.getCurrentPosition(success.bind(this), fail.bind(this));

    function success(position) {
      this.hideLocationFail();
        item.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        description.value = '';
        this.sendMessage(item, this.refresh.bind(this));
    }

    function fail() {
      this.showLocationFail();
      item.location = {
        latitude: 53.3225689,
        longitude: -1.5295307
      };
      this.sendMessage(item, this.refresh.bind(this));
    }
  },

  /*onClearClick: function() {
    this.items = [];
    window.localStorage.setItem(this.itemsKey, JSON.stringify(this.items));
    let itemsElement = document.getElementById('items');
    while (itemsElement.firstChild) {
      itemsElement.removeChild(itemsElement.firstChild);
    }
  },*/

  createElement: function(tagName, className) {
    var div = document.createElement(tagName);
    div.className = className;
    return div;
  },

  addItem: function(item) {
    var cardText = this.createElement('p', 'card-text description');
    cardText.textContent = item.body;

    var cardFooterSmall = this.createElement('small', 'text-muted date-submitted');
    cardFooterSmall.textContent = moment(item.dateSubmitted).fromNow();

    var cardFooter = this.createElement('p', 'card-text');
    cardFooter.appendChild(cardFooterSmall);

    var cardBlock = this.createElement('div', 'card-block');
    cardBlock.appendChild(cardText);
    cardBlock.appendChild(cardFooter);

    var card = this.createElement('div', 'card');
    card.appendChild(cardBlock);

    var items = document.getElementById('items');
    items.appendChild(card);
  },

  refresh: function() {
    this.showSpinner();
    console.log("app.refresh");

    navigator.geolocation.getCurrentPosition(success.bind(this), fail.bind(this));

    var callback = function (items) {
            this.items = items;
            this.refreshList();
            this.hideSpinner();
    }.bind(this);

    function success(position) {
      this.hideLocationFail();
      this.getMessages(
          position.coords.longitude,
          position.coords.latitude,
          callback);
    }

    function fail() {
      this.showLocationFail();
      this.getMessages(
          -1.5295307,
          53.3225689,
          callback);
    }
  },

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    console.log('onDeviceReady');
    var nodelist = document.querySelectorAll('.deviceready');
    for (var i = 0; i < nodelist.length; i++) {
      var element = nodelist[i];
      element.style.display = 'block';
    }

    document.addEventListener("resume", this.onResume.bind(this), false);
    document.getElementById('submit').addEventListener('click', this.onSubmitClick.bind(this), false);
    document.getElementById('refresh').addEventListener('click', this.refresh.bind(this), false);
    document.getElementById('description').addEventListener('keypress', this.onTextChange.bind(this), false);
    document.getElementById('description').addEventListener('input', this.onTextChange.bind(this), false);

    //this.items = JSON.parse(window.localStorage.getItem(this.itemsKey));
    this.refresh();
  },

  onResume: function() {
    setTimeout(function () {
      this.refresh();
    }.bind(this), 0);
  },

  refreshList: function() {
    if (!this.items) this.items = [];

    var itemsElement = document.getElementById('items');

    while (itemsElement.children.length > this.items.length) {
      itemsElement.lastChild.remove();
    }

    var alertEmpty = document.querySelector('#alert-empty');
    if (this.items.length == 0) {
      alertEmpty.style.display = "inline";
    } else {
      alertEmpty.style.display = "none";
    }

    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (!item) continue;
      if (i < itemsElement.children.length) {
        var itemElement = itemsElement.children[i];
        itemElement.querySelector('.description').textContent = item.body;
        itemElement.querySelector('.date-submitted').textContent = moment(item.dateSubmitted).fromNow();
      } else {
        console.log(JSON.stringify(item));
        this.addItem(item);
      }
    }
  },
};
