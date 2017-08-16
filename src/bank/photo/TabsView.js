import {$, Mn, stores, mapState} from '../common'

export default Mn.View.extend({
  className: 'tabs',
  template: `<ul class="tab-list">
<% _.each(tabs, function(tab, index) { %>
  <li class="J-toggle-tab <%- index === activeTabIndex ? 'active' : '' %> <%- tab.highlight ? 'highlight' : '' %> <%- keyword && tab.remark === 0 ? 'hide' : '' %>">
    <%- tab.text %> <% if(keyword && tab.remark) { %> (<%- tab.remark %>) <% } %>
    <div class="highlight-circle"></div>
  </li>
<% }) %>
</ul>`,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .J-toggle-tab'(e) {
      const {photo} = stores
      const activeTabIndex = $(e.currentTarget).index()
      photo.get('tabs')[activeTabIndex].highlight = false
      photo.set({activeTabIndex})
    }
  },
  initialize() {
    mapState(this, stores.photo, ['tabs', 'activeTabIndex', 'keyword'])
  }
})
