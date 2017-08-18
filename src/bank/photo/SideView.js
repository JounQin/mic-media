import {Mn, stores, mapState} from '../common'

import GroupsView from './GroupsView'

import template from './side-view.html'

import {generateGroupName} from './utils'

const HeaderView = Mn.View.extend({
  className: 'side-header',
  template: `<% if (sourceType !== 'cameraman') { %>
    <div class="storage">
        <div class="storage-main">
            <div class="storage-used" style="width: <%- usedStorage / totalStorage * 100 %>%"></div>
        </div>
        <div class="storage-usage">
            <%- I18N.usedStorage %>：<%- usedStorage %>M/<%- totalStorage %>M
        </div>
    </div>
    <% } %>`,
  modelEvents: {
    change: 'render'
  },
  initialize() {
    mapState(this, stores.photo, ['sourceType', 'totalStorage', 'usedStorage', 'keyword'])
  }
})

export default Mn.View.extend({
  className: 'side',
  template,
  regions: {
    header: {
      el: '.side-header',
      replaceElement: true
    },
    body: '.side-body'
  },
  events: {
    'click .J-add-group'() {
      if (this.$('.input-text').length) return
      const groups = stores.photo.get('groups')

      const group = {
        groupId: '',
        editing: true,
        groupName: generateGroupName(groups.map(({groupName}) => groupName))
      }

      groups.push(group)

      this.getChildView('body').collection.push(group)

      const $sideBody = this.$('.side-body')
      $sideBody.scrollTop($sideBody[0].scrollHeight)
    }
  },
  initialize() {
    this.listenTo(stores.photo, 'change:activeTabIndex', this.toggleView)
  },
  onRender() {
    this.showChildView('header', new HeaderView())
    this.showChildView('body', new GroupsView())
    setTimeout(() => {
      this.toggleView()
      this.$('.side-body').css({maxHeight: this.$('.side-container').height()})
    })
  },
  toggleView() {
    this.$el.parent()[stores.photo.get('sourceType') === 'cameraman' ? 'removeClass' : 'addClass']('active')
  }
})
