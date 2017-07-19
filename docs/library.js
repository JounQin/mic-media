(function ($,_,Bb,Mn) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
_ = _ && _.hasOwnProperty('default') ? _['default'] : _;
Bb = Bb && Bb.hasOwnProperty('default') ? Bb['default'] : Bb;
Mn = Mn && Mn.hasOwnProperty('default') ? Mn['default'] : Mn;

var HeaderView = Mn.View.extend({
  className: 'header',
  template: "<h4 class=\"title\">图片库</h4><div class=\"content\">找不到图片？图片可能被删除或转移到“未分组图片”。</div>"
});

var Neck = Bb.Model.extend();

var NeckView = Mn.View.extend({
  className: 'neck clearfix',
  template: "<div class=\"pull-left\">\n  <div class=\"usage\">\n      <div class=\"used\" style=\"width: <%- used / total * 100 %>%\"></div>\n  </div>\n  剩余空间: <span class=\"left\"><%- used.toFixed(2) %></span> MB (共 <%- total %> MB)\n</div>\n<div class=\"pull-right\">\n  <input>\n  <button class=\"search-btn\">搜索</button>\n</div>",
  model: new Neck({
    used: Math.random() * 300,
    total: 300
  }),
  events: {
    'click .search-btn': function click_search_btn() {
      var this$1 = this;

      this.trigger('loading');
      setTimeout(function () {
        this$1.trigger('loaded', [{
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
        }));
      }, 500);
    }
  }
});

var MaterialView = Mn.View.extend({
  tagName: 'li',
  className: 'material',
  template: "<div class=\"img-wrapper\">\n  <img src=\"<%- imgSrc %>\">\n</div>\n<div class=\"img-footer\"><%- imgName %></div>",
  events: {
    'dblclick .img-wrapper': function dblclick_img_wrapper() {
      this.trigger('previewDetail', this.model.get('index'));
    }
  }
});

var MaterialList = Bb.Collection.extend({});

var MaterialListView = Mn.CollectionView.extend({
  tagName: 'ul',
  className: 'materials clearfix list-unstyled',
  childView: MaterialView,
  childViewOptions: function childViewOptions(model, index) {
    model.set({index: index});
  },
  childViewEvents: {
    previewDetail: function previewDetail(index) {
      this.trigger('toggleMaterial', index);
    }
  }
});

var MaterialDetail = Bb.Model.extend();

var MaterialDetailView = Mn.View.extend({
  className: 'material-detail-container',
  template: "<div class=\"material-detail\">\n<% var currMaterial = materials[currIndex] %>\n  <div class=\"img-container\">\n    <div class=\"img-wrapper\">\n      <img src=\"<%- currMaterial.imgSrc.replace(/\\?tid=0/, '?tid=1') %>\">\n    </div>\n  </div>\n</div>\n<div class=\"material-list\">\n<div class=\"prev\"><button data-index=\"<%- currIndex - 1 %>\">Prev</button></div>\n<ul class=\"clearfix list-unstyled\">\n<% _.each(materials, function(material, index) { %>\n  <li class=\"material-item <%- index === currIndex ? 'active' : '' %>\" data-index=\"<%- index %>\">\n    <div class=\"img-wrapper\">\n      <img src=\"<%- material.imgSrc %>\">\n    </div>\n  </li>\n<%}) %>\n</ul>\n<div class=\"next\"><button data-index=\"<%- currIndex + 1 %>\">Next</button></div>\n</div>",
  modelEvents: {
    change: 'render'
  },
  events: {
    'click [data-index]': function click_data_index(e) {
      var index = $(e.currentTarget).data('index');
      var ref = this;
      var model = ref.model;
      if (!_.isNumber(index) || index < 0 || index >= model.get('materials').length || index === model.get('currIndex')) { return }
      this.trigger('toggleMaterial', index);
    }
  }
});

var LoadingView = Mn.View.extend({
  template: '<div>loading...</div>'
});

var Main = Bb.Model.extend();

var MainView = Mn.View.extend({
  className: 'main',
  getTemplate: function getTemplate() {
    var ref = this;
    var model = ref.model;
    return ("<div class=\"operations\">\n" + (model.get('currIndex') == null || model.get('loading') ? "<input type=\"checkbox\"/> 全选" : "<button class=\"return-list\">返回列表</button>") + "\n</div><div class=\"main-content-region\"></div>")
  },
  regions: {
    content: '.main-content-region'
  },
  model: new Main({
    loading: false,
    currIndex: null,
    materials: [{
      imgSrc: 'image?tid=0&id=JQmElIZaYzro',
      imgName: 'JQmElIZaYzro'
    }, {
      imgSrc: 'image?tid=0&id=mEwTWQKMhgub',
      imgName: 'mEwTWQKMhgub'
    }, {
      imgSrc: 'image?tid=0&id=aEmTgtByqrpM',
      imgName: 'aEmTgtByqrpM'
    }, {
      imgSrc: 'image?tid=0&id=JawQizZcbgpq',
      imgName: 'JawQizZcbgpq'
    }, {
      imgSrc: 'image?tid=0&id=yTJEldsrngzc',
      imgName: 'yTJEldsrngzc'
    }].map(function (img) {
      img.imgSrc = 'http://photo.made-in-china.com/' + img.imgSrc;
      return img
    })
  }),
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .return-list': function click_return_list() {
      this.model.set({currIndex: null});
    }
  },
  childViewEvents: {
    toggleMaterial: function toggleMaterial(index) {
      this.model.set({currIndex: index});
    }
  },
  loading: function loading() {
    this.model.set({loading: true});
  },
  loaded: function loaded(materials) {
    this.model.set({
      loading: false,
      currIndex: null,
      materials: materials
    });
  },
  onRender: function onRender() {
    var ref = this.model.attributes;
    var loading = ref.loading;
    var currIndex = ref.currIndex;
    var materials = ref.materials;
    this.showChildView('content', loading ? new LoadingView() : currIndex == null ? new MaterialListView({
      collection: new MaterialList(materials)
    }) : new MaterialDetailView({
      model: new MaterialDetail({
        currIndex: currIndex,
        materials: materials
      })
    }));
  }
});

var BodyView = Mn.View.extend({
  className: 'body',
  template: "<div class=\"main-region\"></div>",
  regions: {
    main: '.main-region'
  },
  modelEvents: {
    change: 'render'
  },
  loading: function loading() {
    this.getChildView('main').loading();
  },
  loaded: function loaded(materials) {
    this.getChildView('main').loaded(materials);
  },
  onRender: function onRender() {
    this.showChildView('main', new MainView());
  }
});

var AppView = Mn.View.extend({
  el: '#app',
  template: "<div class=\"header-region\"></div><div class=\"neck-region\"></div><div class=\"body-region\"></div>",
  regions: {
    header: '.header-region',
    neck: '.neck-region',
    body: '.body-region'
  },
  childViewEvents: {
    loading: function loading() {
      this.getChildView('body').loading();
    },
    loaded: function loaded(materials) {
      this.getChildView('body').loaded(materials);
    }
  },
  initialize: function initialize() {
    this.render();
    this.showChildView('header', new HeaderView());
    this.showChildView('neck', new NeckView());
    this.showChildView('body', new BodyView());
  }
});

Mn.View.setRenderer(function (template, data) {
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
