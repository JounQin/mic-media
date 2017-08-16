import {$, Bb, Mn, API, artDialog, showTitle, I18N} from '../common'

import template from './flash-view.html'

const FlashView = Mn.View.extend({
  className: 'flash',
  tagName() {
    return this.model.attributes.viewType === 'thumbnail' ? 'li' : 'tr'
  },
  template
})

export default Mn.CollectionView.extend({
  className: 'flashes',
  tagName() {
    return this.options.viewType === 'thumbnail' ? 'ul' : 'tbody'
  },
  childViewOptions(model) {
    model.set({viewType: this.options.viewType})
  },
  childView: FlashView,
  events: {
    'click .J-image'(e) {
      const id = $(e.currentTarget).attr('data-index')
      API.getFlashPlay({mediumId: id}).done(({data}) => {
        const {mediumSrc} = data
        this.showFlashes(mediumSrc)
      })
    },
    'mousemove .flash-play .J-image'(e) {
      showTitle(e, I18N.flashPreview)
    },
    'mouseout .flash-play .J-image'() {
      $('.alert-title').hide()
    },
    'mousemove .J-image-title'(e) {
      const arr = this.options.flash
      const id = $(e.currentTarget).attr('data-index')
      let size = ''
      let duration = ''
      let date = ''
      arr.map(el => {
        $.each(el, (key, value) => {
          if (key === 'mediumId' && value === id) {
            size = el.mediumSize
            duration = el.mediumDuration
            date = el.updateTime
          }
        })
      })
      showTitle(
        e,
        `
       <ul>
           <li>${I18N.size}: ${size}</li>
           <li>${I18N.duration}: ${duration}</li>
           <li>${I18N.updatedDate}: ${date}</li>
       </ul>
      `
      )
    },
    'mouseout .J-image-title'() {
      $('.alert-title').hide()
    },
    'click .input-radio input'() {
      $('.flash-item').removeClass('checked')
      $('input[type="radio"]:checked').parents('.flash-item').addClass('checked')
    }
  },
  initialize({flash}) {
    this.collection = new Bb.Collection(flash)
  },
  showFlashes(imageList) {
    let image = ''
    imageList.map(src => {
      image += `<img src=${src}>`
    })

    artDialog({
      title: ' ',
      content: `<div id="ImageBox" class="flash-dialog"> 
        ${image}
        <div class="icon-tool J-icon">
          <i class="ob-icon icon-play"></i>
          <i class="ob-icon icon-pause"></i> 
        </div>
    </div>`,
      // width: '620px',
      lock: true,
      drag: false,
      fixed: false,
      button: false,
      padding: '10px'
    })

    const picRound = new window.PicRound({
      isAutoPlay: true,
      speed: 150,
      carrier: {
        imgbox: '#ImageBox'
      }
    })

    let start = true
    $('#ImageBox').click(() => {
      if (start) {
        $('.J-icon').addClass('stop')
        picRound.picRoundStop()
        start = false
      } else {
        $('.J-icon').removeClass('stop')
        picRound.picRoundStart()
        start = true
      }
    })
  }
})
