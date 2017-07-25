import {Mn, Model} from './common'

import MaterialListView, {MaterialList} from './MateralListView'
import MaterialDetailView, {MaterialDetail} from './MaterialDetailView'
import LoadingView from './LoadingView'

export default Mn.View.extend({
  className: 'main',
  getTemplate() {
    const {model} = this
    return `<div class="operations">
${model.get('currIndex') == null || model.get('loading') ? `<input type="checkbox"/> 全选` : `<button class="return-list">返回列表</button>`}
</div><div class="main-content-region"></div>`
  },
  regions: {
    content: '.main-content-region'
  },
  model: new Model({
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
    }].map(img => {
      img.imgSrc = 'http://photo.made-in-china.com/' + img.imgSrc
      return img
    })
  }),
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .return-list'() {
      this.model.set({currIndex: null})
    }
  },
  childViewEvents: {
    toggleMaterial(index) {
      this.model.set({currIndex: index})
    }
  },
  loading() {
    this.model.set({loading: true})
  },
  loaded(materials) {
    this.model.set({
      loading: false,
      currIndex: null,
      materials
    })
  },
  onRender() {
    const {loading, currIndex, materials} = this.model.attributes
    this.showChildView('content', loading ? new LoadingView() : currIndex == null ? new MaterialListView({
      collection: new MaterialList(materials)
    }) : new MaterialDetailView({
      model: new MaterialDetail({
        currIndex,
        materials
      })
    }))
  }
})
