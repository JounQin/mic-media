import $ from 'jquery'

export default class {
  constructor({el, data, template}) {
    this.$el = $(el)
    this.data = data
    this.template = template
    this.render()
  }

  get(prop) {
    return this.data[prop]
  }

  set(newData) {
    $.extend(this.data, newData)
    this.render()
  }

  render() {
    const {$el} = this
    if (!$el || !$el.length) return
    $el.html(this.template(this.data) || '')
  }
}
