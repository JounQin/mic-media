import {$, Bb, Mn} from '../common'

export default Mn.View.extend({
  className: 'photo-preview',
  template: `<% if(currIndex) { %>
<div class="prev-photo" data-index="<%- currIndex - 1 %>">
<i class="ob-icon icon-left"></i>
</div>
<% } %>
<div class="img-wrapper">
    <img src="<%- photos[currIndex].mediumSrc %>" alt="<%- photos[currIndex].mediumName %>">
</div>
<% if(currIndex < photos.length - 1) { %>
<div class="next-photo" data-index="<%- currIndex + 1 %>">
<i class="ob-icon icon-right"></i>
</div>
<% } %>
<div class="close-dialog J-close-dialog">
<i class="ob-icon icon-delete"></i>
</div>`,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .J-close-dialog'() {
      this.trigger('closeDialog')
    },
    'click [data-index]'(e) {
      this.model.set({
        currIndex: $(e.currentTarget).data('index')
      })
    }
  },
  initialize({photos, currIndex}) {
    this.model = new Bb.Model({
      photos,
      currIndex
    })
  }
})
