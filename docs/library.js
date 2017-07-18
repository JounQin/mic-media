(function ($,_,Backbone,Marionette) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
_ = _ && _.hasOwnProperty('default') ? _['default'] : _;
Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
Marionette = Marionette && Marionette.hasOwnProperty('default') ? Marionette['default'] : Marionette;

var Header = Marionette.View.extend({
  className: 'header',
  template: "<h2>图片库</h2><div>找不到图片？图片可能被删除或转移到“未分组图片”。</div>"
});

var Body = Backbone.Model.extend();

var Body$1 = Marionette.View.extend({
  className: 'body',
  template: "<%= msg %><button class=\"reverse-btn\">Reverse</button>",
  model: new Body({
    msg: 'Hello Marionette'
  }),
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .reverse-btn': function click_reverse_btn() {
      this.model.set({
        msg: this.model.get('msg').split('').reverse().join('')
      });
    }
  }
});

var AppView = Marionette.View.extend({
  el: '#app',
  template: "<div class=\"header-region\"></div><div class=\"body-region\"></div>",
  regions: {
    header: '.header-region',
    body: '.body-region'
  },
  events: {},
  initialize: function initialize() {
    this.render();
    this.showChildView('header', new Header());
    this.showChildView('body', new Body$1());
  }
});

Marionette.View.setRenderer(function (template, data) {
  switch (typeof template) {
    case 'function':
      return template(data)
    case 'string':
      /^<[\s\S]+\/?>$/.test(template) || (template = $(template).html() || template);
      return _.template(template)(data)
    default:
      throw new Error('template should be a function or string')
  }
});

new AppView(); // eslint-disable-line no-new

}(jQuery,_,Backbone,Marionette));
