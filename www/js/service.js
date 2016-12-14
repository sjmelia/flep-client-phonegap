/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
function Service(url) {
  this.url = url;
}

Service.prototype = {
  post: function(item, success) {
    var req = new XMLHttpRequest();
    req.open('POST', this.url + '/messages', true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200) {
        success();
      }
    };

    req.send(JSON.stringify(item));
  },

  get: function(longitude, latitude, success) {
    var req = new XMLHttpRequest();
    req.open('GET', this.url + '/messages?longitude=' + longitude + '&latitude=' + latitude, true);
    console.log("GEEET");
    req.onreadystatechange = function() {
      console.log("app.sendMessage.onreadystatechange(req.readystate "
        + req.readyState
        + "; req.status: "
        + req.status + ")");

      if (req.readyState == 4 && req.status == 200) {
        success(JSON.parse(req.responseText));
      }
    };

    req.send();
  },
};

