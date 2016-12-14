/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function() {
    var nodelist = document.querySelectorAll('.deviceready');
    for (var i = 0; i < nodelist.length; i++) {
      var element = nodelist[i];
      element.style.display = 'block';
    }

    var service = new Service('http://chat.arrayofbytes.com');
    this.App = new App(service);
    this.App.refresh();
    document.addEventListener("resume", this.onResume.bind(this), false);
  },

  onResume: function() {
    setTimeout(function () {
      this.App.refresh();
    }.bind(this), 0);
  }
};
