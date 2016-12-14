/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
function List(container, emptyAlert) {
  this.container = container;
  this.emptyAlert = emptyAlert;
}

List.prototype = {
  items: [],

  add: function(item) {
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

    this.container.appendChild(card);
  },

  createElement: function(tagName, className) {
    var div = document.createElement(tagName);
    div.className = className;
    return div;
  },

  set: function(items) {
    this.items = items;
    while (this.container.children.length > this.items.length) {
      this.container.lastChild.remove();
    }

    if (this.items.length == 0) {
      this.emptyAlert.style.display = "inline";
    } else {
      this.emptyAlert.style.display = "none";
    }

    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (!item) continue;
      if (i < this.container.children.length) {
        var itemElement = this.container.children[i];
        itemElement.querySelector('.description').textContent = item.body;
        itemElement.querySelector('.date-submitted').textContent = moment(item.dateSubmitted).fromNow();
      } else {
        this.add(item);
      }
    }
  }
};

