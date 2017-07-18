import {Backbone, Marionette} from './lib'

const Body = Backbone.Model.extend()

export default Marionette.View.extend({
  className: 'body',
  template: `<%= msg %><button class="reverse-btn">Reverse</button>`,
  model: new Body({
    msg: 'Hello Marionette'
  }),
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .reverse-btn'() {
      this.model.set({
        msg: this.model.get('msg').split('').reverse().join('')
      })
    }
  }
})
