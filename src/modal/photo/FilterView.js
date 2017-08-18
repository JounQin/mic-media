import {_, $, Mn, API, I18N, mapState} from '../common'

import template from './filter-view.html'

export default Mn.View.extend({
  className: 'filter',
  template,
  model: {
    groupType: '0',
    groupList: [],
    groupId: null,
    groupName: null,
    posters: null,
    posterId: null,
    childGroups: null
  },
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .J-search-photo'() {
      const keyword = $.trim(this.$('.J-search-input').val())

      // keyword 校验

      this.trigger('search', keyword)
    },
    'click .J-select-title'() {
      $('.J-select-group').addClass('focus')
      if ($('.J-select-group').hasClass('open')) {
        $('.J-select-group').removeClass('open')
      } else {
        $('.J-select-group').addClass('open')
      }
    },
    'click .J-group-opt'(e) {
      const container = this.model
      $('.J-group-opt').removeClass('selected')
      $(e.currentTarget).addClass('selected')

      const id = $(e.currentTarget).attr('cz-id')
      const groupList = container.get('groupList')
      const childGroups = container.get('childGroups')

      container.set('groupId', id)
      _.each(groupList, function(group) {
        if (group.groupId === id) {
          container.set('groupName', group.groupName)
        }
      })
      _.each(childGroups, function(group) {
        if (group.groupId === id) {
          container.set('groupName', group.groupName)
        }
      })
      if (id === '-1') {
        container.set('groupName', I18N.ungrouped)
      }
      if (id === '') {
        container.set('groupName', I18N.allGroup)
      }
    },
    'click .J-show-group'(e) {
      const target = $(e.currentTarget).parents('li').children('.J-sub-group')
      if (target.hasClass('show')) {
        target.removeClass('show')
      } else {
        target.addClass('show')
      }
    },
    'click .J-clear'() {
      this.model.set('groupType', '0')
    }
  },
  initialize({container}) {
    mapState(this, container, ['groupType', 'groupList', 'groupId', 'groupName', 'posters', 'posterId', 'childGroups'])
  },
  onRender() {
    setTimeout(() =>
      _.each(window.Select.use(this.$('select')), select => select.on('change', () => this.toggleFilter()))
    )
  },
  toggleFilter() {
    const container = this.model
    const groupType = this.$('[name="groupType"]').val()
    container.set('groupType', groupType)

    let groupId = this.$('[name="groupId"]').val()
    groupId = groupId === '' ? null : groupId
    container.set('groupId', groupId)

    let posterId = this.$('[name="posterId"]').val()
    posterId = posterId === '' ? I18N.poster : posterId
    container.set('posterId', posterId)

    API.getGroups().done(({data}) => {
      container.set('groupList', data)
    })
  }
})
