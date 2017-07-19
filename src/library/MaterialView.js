import {Mn} from './lib'

export default Mn.View.extend({
  tagName: 'li',
  className: 'material',
  template: `<div class="img-wrapper">
  <img src="<%- imgSrc %>">
</div>
<div class="img-footer"><%- imgName %></div>`,
  events: {
    'dblclick .img-wrapper'() {
      this.trigger('previewDetail', this.model.get('index'))
    }
  }
})
