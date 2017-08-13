import {Bb, Mn, API, stores} from '../common'

const Group = Bb.Model.extend({
  idAttribute: 'groupId',
  defaults: {
    active: false
  }
})

const GroupView = Mn.View.extend({
  className: 'group',
  tagName: 'li',
  template: `<div class="group-item <%- active ? 'active' : '' %>">
<div class="group-name"><%- groupName %></div>
<% if(hasChildGroup) { %>
<i class="ob-icon icon-right"></i>
<% } %>
</div>`,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .group-item'() {
      const group = this.model
      group.collection.trigger('toggleActive', group.get('groupId'), group.get('hasChildGroup'))
    }
  },
  initialize() {
    const group = this.model
    const groupId = group.get('groupId')
    this.listenTo(group.collection, 'toggleActive', currGroupId => group.set({active: groupId === currGroupId}))
  }
})

const Groups = Bb.Collection.extend({
  model: Group
})

const GroupsView = Mn.CollectionView.extend({
  className: 'groups',
  tagName: 'ul',
  childView: GroupView,
  collectionEvents: {
    toggleActive(groupId, hasChildGroup) {
      this.trigger('getChildGroups', groupId, this.options.level + 1, hasChildGroup)
    }
  }
})

const LEVELS = ['first', 'second', 'third']

export default Mn.View.extend({
  className: 'move-to-group',
  template: `<div class="level first-level"></div>
<div class="level second-level"></div>
<div class="level third-level"></div>`,
  regions: {
    first: '.first-level',
    second: '.second-level',
    third: '.third-level'
  },
  childViewEvents: {
    getChildGroups(groupId, level, hasChildGroup) {
      this.trigger('toggleActive', groupId)

      if (level === 3) return

      const thirdChildView = this.getChildView('third')
      thirdChildView && thirdChildView.destroy()

      if (!hasChildGroup) {
        if (level === 1) {
          const secondChildView = this.getChildView('second')
          secondChildView && secondChildView.destroy()
        }
        return
      }

      this.showLevelRegion(groupId, level)
    }
  },
  onRender() {
    this.showLevelRegion(null, 0)
  },
  showLevelRegion(groupId, level) {
    const {photo} = stores
    API.getGroups({groupId, sourceType: photo.get('sourceType')}).done(({data: groups}) => {
      this.showChildView(LEVELS[level], new GroupsView({collection: new Groups(groups), level}))
    })
  }
})
