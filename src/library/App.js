import {Marionette} from './lib'

import Header from './Header'

export default Marionette.View.extend({
  el: '#app',
  template: `<div class="header-region"></div>`,
  regions: {
    header: '.header-region'
  },
  events: {},
  initialize() {
    this.render()
    this.showChildView('header', new Header())
  }
})
