import {Mn} from './lib'

import HeaderView from './HeaderView'
import NeckView from './NeckView'
import BodyView from './BodyView'

export default Mn.View.extend({
  el: '#app',
  template: `<div class="header-region"></div><div class="neck-region"></div><div class="body-region"></div>`,
  regions: {
    header: '.header-region',
    neck: '.neck-region',
    body: '.body-region'
  },
  childViewEvents: {
    loading() {
      this.getChildView('body').loading()
    },
    loaded(materials) {
      this.getChildView('body').loaded(materials)
    }
  },
  onRender() {
    this.showChildView('header', new HeaderView())
    this.showChildView('neck', new NeckView())
    this.showChildView('body', new BodyView())
  }
})
