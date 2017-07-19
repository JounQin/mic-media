import {Mn} from './lib'

import MainView from './MainView'

export default Mn.View.extend({
  className: 'body',
  template: `<div class="main-region"></div>`,
  regions: {
    main: '.main-region'
  },
  modelEvents: {
    change: 'render'
  },
  loading() {
    this.getChildView('main').loading()
  },
  loaded(materials) {
    this.getChildView('main').loaded(materials)
  },
  onRender() {
    this.showChildView('main', new MainView())
  }
})
