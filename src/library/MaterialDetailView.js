import {$, _, Bb, Mn} from './common'

export const MaterialDetail = Bb.Model.extend()

export default Mn.View.extend({
  className: 'material-detail-container',
  template: `<div class="material-detail">
<% var currMaterial = materials[currIndex] %>
  <div class="img-container">
    <div class="img-wrapper">
      <img src="<%- currMaterial.imgSrc.replace(/\\?tid=0/, '?tid=1') %>">
    </div>
  </div>
</div>
<div class="material-list">
<div class="prev"><button data-index="<%- currIndex - 1 %>">Prev</button></div>
<ul class="clearfix list-unstyled">
<% _.each(materials, function(material, index) { %>
  <li class="material-item <%- index === currIndex ? 'active' : '' %>" data-index="<%- index %>">
    <div class="img-wrapper">
      <img src="<%- material.imgSrc %>">
    </div>
  </li>
<%}) %>
</ul>
<div class="next"><button data-index="<%- currIndex + 1 %>">Next</button></div>
</div>`,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click [data-index]'(e) {
      const index = $(e.currentTarget).data('index')
      const {model} = this
      if (!_.isNumber(index) || index < 0 || index >= model.get('materials').length || index === model.get('currIndex')) return
      this.trigger('toggleMaterial', index)
    }
  }
})
