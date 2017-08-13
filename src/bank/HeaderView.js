import {$, Bb, Mn, I18N} from './common'

import template from './header-view.html'

const types = [
  {
    type: 'photo',
    text: I18N.photos
  },
  // {
  //   type: 'video',
  //   text: I18N.videos'
  // },
  {
    type: 'flash',
    text: I18N.flashes
  },
  {
    type: 'panorama',
    text: I18N.panoramas
  }
  // {
  //   type: 'trash',
  //   text: '回收站'
  // }
]

const TYPES = types.map(({type}) => type)

const hasSelector = ($el, selector) => $el.is(selector) || !!$el.parents(selector).length

const $doc = $(document)

export default Mn.View.extend({
  className: 'header',
  template,
  events: {
    'mouseenter .J-toggle-active'(e) {
      $(e.currentTarget).addClass('hover')
    },
    'mouseleave .J-toggle-active,.J-types': (() => {
      let timeout
      let moveEvent
      return function() {
        $doc.off('mousemove', moveEvent)
        $doc.on(
          'mousemove',
          (moveEvent = e => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              const $target = $(e.target)
              if (hasSelector($target, '.J-toggle-active,.J-types')) return
              this.$('.J-toggle-active').removeClass('hover')
              $doc.off('mousemove', moveEvent)
            }, 20)
          })
        )
      }
    })(),
    'click .J-toggle-type'(e) {
      const activeIndex = $(e.currentTarget).index()
      const activeType = TYPES[activeIndex]
      this.model.set({activeIndex, activeType})
      this.trigger('toggleActiveType', activeType)
    },
    'click .J-toggle-search'(e) {
      $(e.currentTarget).hide()
      this.$('.search').addClass('active')
      this.trigger('toggleSearch', true)
    },
    'click .J-close-search'() {
      this.$('.J-toggle-search').show()
      this.$('.search').removeClass('active')
      this.trigger('toggleSearch', false)
      this.$('.input-text').val('')
      this.trigger('searchPhotos', null)
    },
    'click .J-search-photo'() {
      const keyword = $.trim(this.$('.input-text').val())
      keyword && this.trigger('searchPhotos', keyword)
    }
  },
  initialize({activeType}) {
    this.model = new Bb.Model({
      activeIndex: TYPES.indexOf(activeType),
      activeType,
      types
    })
  }
})
