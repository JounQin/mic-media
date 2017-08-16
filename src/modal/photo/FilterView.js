import {_, $, Mn, API, I18N, mapState} from '../common'

import template from './filter-view.html'

export default Mn.View.extend({
  className: 'filter',
  template,
  model: {
    groupType: '0',
    groupList: [],
    groupId: null,
    posters: null,
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
    'click .J-opt'(e) {
      $('.J-opt').removeClass('selected')
      $(e.currentTarget).addClass('selected')
      $('.J-group-text').text($('.J-opt.selected').text())
      this.model.set('groupId', $('.J-opt.selected').text())
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
    mapState(this, container, ['groupType', 'groupList', 'groupId', 'posters', 'childGroups'])
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
    groupId = groupId === '' ? I18N.allGroup : groupId
    container.set('groupId', groupId)

    API.getGroups().done(({data}) => {
      container.set('groupList', data)
    })
  }
})
