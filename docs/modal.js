(function ($,_dialog) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
_dialog = _dialog && _dialog.hasOwnProperty('default') ? _dialog['default'] : _dialog;

var map = function (arr, callback, context) {
  if ( context === void 0 ) context = arr;

  var result = [];

  for (var i = 0, len = arr.length; i < len; i++) {
    result[i] = callback.call(context, arr[i], i, arr);
  }

  return result
};

var on = function ($el, events) {
  for (var key in events) {
    if (!events.hasOwnProperty(key)) { return }
    var callback = events[key];
    key = $.trim(key);
    var arr = key.split(/\s+/);
    if (arr.length === 1) {
      $el.on(key, callback);
    } else {
      var event = arr.shift();
      $el.on(event, arr.join(' '), callback);
    }
  }
};

var CONTENT_ID = '__material_library_dialog__';

var compile = function (ref) {
  if ( ref === void 0 ) ref = {};
  var loading = ref.loading;
  var materials = ref.materials;
  var currIndex = ref.currIndex;

  if (loading) { return "Loading..." }
  return ("<ul class=\"materials clearfix\">\n" + (map(materials, function (material, index) { return ("<li>\n    <div class=\"img-wrapper\" data-index=\"" + index + "\"><img src=\"" + (material.imgSrc) + "\"></div>\n  </li>"); }).join('')) + "\n</ul>" + (currIndex + 1 || ''))
};

var Model = function Model($el, attributes) {
  this.$el = $el;
  this.attributes = attributes;
  this.render();
};

Model.prototype.set = function set (newAttributes) {
  $.extend(this.attributes, newAttributes);
  this.render();
};

Model.prototype.render = function render () {
  var ref = this;
    var $el = ref.$el;
  if (!$el || !$el.length) { return }
  $el.html(compile(this.attributes) || '');
};

var createDialog = function (options) {
  var $content = $(("#" + CONTENT_ID));
  $content.length && $content.remove();
  $content = $(("<div id=\"" + CONTENT_ID + "\" class=\"material-library-content\"></div>"))
    .appendTo('body');

  var model = new Model($content, {loading: true});

  on($content, {
    'click .img-wrapper': function click_img_wrapper(e) {
      model.set({
        currIndex: $(e.currentTarget).data('index')
      });
    }
  });

  setTimeout(function () {
    model.set({
      loading: false,
      materials: map([{
        imgSrc: 'image?tid=0&id=mEwTWQKMhgub',
        imgName: 'mEwTWQKMhgub'
      }, {
        imgSrc: 'image?tid=0&id=aEmTgtByqrpM',
        imgName: 'aEmTgtByqrpM'
      }, {
        imgSrc: 'image?tid=0&id=JawQizZcbgpq',
        imgName: 'JawQizZcbgpq'
      }], function (img) {
        img.imgSrc = 'http://photo.made-in-china.com/' + img.imgSrc;
        return img
      })
    });
  }, 500);

  return _dialog({
    title: options.title,
    content: $content[0],
    skin: 'material-library-dialog',
    cancel: function cancel() {
      this.close();
      return false
    },
    cancelDisplay: false
  })
};

var dialog;

var DEFAULT_OPTIONS = {
  title: '素材库'
};

window.materialLibrary = function (options) {
  options = $.extend({}, DEFAULT_OPTIONS, options);

  if (!dialog || dialog.destroyed || options.destroy) {
    dialog = createDialog(options);
  }

  dialog.showModal();
};

}(jQuery,dialog));
