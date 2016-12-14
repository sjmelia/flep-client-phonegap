/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
function App(service) {
  this.service = service;
  this.description = document.getElementById('description');
  this.submitButton = document.getElementById('submit');
  this.refreshButton = document.getElementById('refresh');
  this.submitMessage = document.getElementById('submit-message');
  this.refreshSpinner = document.getElementById('refresh-spinner');
  this.submitSpinner = document.getElementById('submit-spinner');
  var listContainer = document.getElementById('items');
  var alertEmpty = document.getElementById('alert-empty');
  this.list = new List(listContainer, alertEmpty);

  this.submitButton.addEventListener('click', this.submitClick.bind(this), false);
  this.refreshButton.addEventListener('click', this.refresh.bind(this), false);
  this.description.addEventListener('keypress', this.descriptionChange.bind(this), false);
  this.description.addEventListener('input', this.descriptionChange.bind(this), false);
}

App.prototype = {
  descriptionChange: function() {
    var empty = this.description.value.length < 1;
    this.submitButton.disabled = empty;
  },

  showLocationFail: function() {
    this.submitMessage.style.display = 'inline';
  },

  hideLocationFail: function() {
    this.submitMessage.style.display = 'none';
  },

  showSpinner: function() {
    this.refreshSpinner.className = "fa fa-spinner fa-spin";
    this.submitSpinner.className = "fa fa-spinner fa-spin";
    this.submitButton.disabled = true;
  },

  hideSpinner: function() {
    this.refreshSpinner.className = "fa fa-refresh";
    this.submitSpinner.className = "fa fa-paper-plane-o";
    this.descriptionChange();
  },

  submitClick: function() {
    this.showSpinner();
    var item = {
      body: this.description.value,
      location: ""
    };

    function success(position) {
      this.hideLocationFail();
      item.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      this.description.value = '';
      this.service.post(item, this.refresh.bind(this));
    }

    function fail() {
      this.showLocationFail();
      item.location = {
        latitude: 53.3225689,
        longitude: -1.5295307
      };
      this.service.post(item, this.refresh.bind(this));
    }

    navigator.geolocation.getCurrentPosition(success.bind(this), fail.bind(this));
  },

  refresh: function() {
    this.showSpinner();

    var callback = function (items) {
            this.list.set(items);
            this.hideSpinner();
    }.bind(this);

    function success(position) {
      this.hideLocationFail();
      this.service.get(
          position.coords.longitude,
          position.coords.latitude,
          callback);
    }

    function fail() {
      this.showLocationFail();
      this.service.get(-1.5295307, 53.3225689, callback);
    }

    navigator.geolocation.getCurrentPosition(success.bind(this), fail.bind(this));
  }
};

