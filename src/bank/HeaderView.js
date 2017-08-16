import {$, Bb, Mn, I18N, SPECIAL_CHAR_REG} from './common'

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

const MAX_KEYWORD_LENGTH = 50

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
      this.$('.search').removeClass('active error')
      this.trigger('toggleSearch', false)
      this.$('.input-text').val('')
      this.trigger('searchPhotos', null)
    },
    'compositionstart .J-search-input'() {
      this.composing = true
    },
    'compositionend .J-search-input': 'inputChange',
    'input .J-search-input, propertychange .J-search-input'(e) {
      if (this.composing) return
      this.inputChange(e)
    },
    'click .J-search-photo'() {
      if (this.$('.search').hasClass('error')) return
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
  },
  inputChange(e) {
    this.composing = false
    const $input = $(e.currentTarget)
    let keyword = $.trim($input.val())

    if (keyword.length > MAX_KEYWORD_LENGTH) {
      $input.val((keyword = keyword.substr(0, MAX_KEYWORD_LENGTH)))
    }

    const $seach = this.$('.search')

    if (SPECIAL_CHAR_REG.test(keyword)) {
      $seach.addClass('error')
      this.$('.search-error').text(I18N.characterNotSupported)
    } else {
      $seach.removeClass('error')
    }
  }
})
