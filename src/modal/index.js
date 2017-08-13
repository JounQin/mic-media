import {_, $, Mn} from './common'

import AppView from './Appview'

Mn.View.setRenderer((template, data) => {
  switch (typeof template) {
    case 'function':
      return template(data)
    case 'string':
      if (/^[#.]/.test(template)) {
        try {
          template = $(template).html() || template
        } catch (e) {}
      }
      return _.template(template)(data)
    default:
      throw new Error('template should be a function or string')
  }
})

const App = Mn.Application.extend({
  region: {
    el: '#app',
    replaceElement: true
  },
  onStart() {
    this.showView(new AppView())
  }
})

new App().start()
