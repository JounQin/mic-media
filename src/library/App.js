import {Marionette} from './lib'

import Header from './Header'
import Body from './Body'

export default Marionette.View.extend({
  el: '#app',
  template: `<div class="header-region"></div><div class="body-region"></div>`,
  regions: {
    header: '.header-region',
    body: '.body-region'
  },
  events: {},
  initialize() {
    this.render()
    this.showChildView('header', new Header())
    this.showChildView('body', new Body())
  }
})
