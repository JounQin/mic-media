(function ($,_dialog) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
_dialog = _dialog && _dialog.hasOwnProperty('default') ? _dialog['default'] : _dialog;

var CONTENT_ID = '__material_library_dialog__';
var $content;

var compile = function (ref) {
  if ( ref === void 0 ) ref = {};
  var loading = ref.loading;
  var materials = ref.materials;

  if (loading) { return "Loading..." }
  return ("<ul class=\"materials\">\n" + (materials.map(function (material) { return ("<li><img src=\"" + (material.imgSrc) + "\"></li>"); }).join('')) + "\n</ul>")
};

var render = function (data) {
  if ( data === void 0 ) data = {};

  if (!$content || !$content.length) { return }
  return $content.html(compile(data) || '')
};

var createDialog = function (options) {
  $content = $(("#" + CONTENT_ID));
  $content.length && $content.remove();
  $content = $(("<div id=\"" + CONTENT_ID + "\" class=\"material-library-content\"></div>")).appendTo('body');

  render({
    loading: true
  });

  setTimeout(function () {
    render({
      materials: [{
        imgSrc: 'image?tid=0&id=mEwTWQKMhgub',
        imgName: 'mEwTWQKMhgub'
      }, {
        imgSrc: 'image?tid=0&id=aEmTgtByqrpM',
        imgName: 'aEmTgtByqrpM'
      }, {
        imgSrc: 'image?tid=0&id=JawQizZcbgpq',
        imgName: 'JawQizZcbgpq'
      }].map(function (img) {
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
