document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function ($,_,backbone,Marionette) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
_ = _ && _.hasOwnProperty('default') ? _['default'] : _;
backbone = backbone && backbone.hasOwnProperty('default') ? backbone['default'] : backbone;
Marionette = Marionette && Marionette.hasOwnProperty('default') ? Marionette['default'] : Marionette;

var Header = Marionette.View.extend({
  template: "<h2>图片库</h2><div>找不到图片？图片可能被删除或转移到“未分组图片”。</div>",
  className: 'header'
});

var AppView = Marionette.View.extend({
  el: '#app',
  template: "<div class=\"header-region\"></div>",
  regions: {
    header: '.header-region'
  },
  events: {},
  initialize: function initialize() {
    this.render();
    this.showChildView('header', new Header());
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
      throw 'template should be a function or string'
  }
});

new AppView();

}(jQuery,_,Backbone,Marionette));
