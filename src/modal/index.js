import $ from 'jquery'
import _dialog from 'art-dialog'

import {map, on} from './utils'

const CONTENT_ID = '__material_library_dialog__'

const compile = ({loading, materials, currIndex} = {}) => {
  if (loading) return `Loading...`
  return `<ul class="materials clearfix">
${map(materials, (material, index) => `<li>
    <div class="img-wrapper" data-index="${index}"><img src="${material.imgSrc}"></div>
  </li>`).join('')}
</ul>${currIndex + 1 || ''}`
}

class Model {
  constructor($el, attributes) {
    this.$el = $el
    this.attributes = attributes
    this.render()
  }

  set(newAttributes) {
    $.extend(this.attributes, newAttributes)
    this.render()
  }

  render() {
    const {$el} = this
    if (!$el || !$el.length) return
    $el.html(compile(this.attributes) || '')
  }
}

const createDialog = options => {
  let $content = $(`#${CONTENT_ID}`)
  $content.length && $content.remove()
  $content = $(`<div id="${CONTENT_ID}" class="material-library-content"></div>`)
    .appendTo('body')

  const model = new Model($content, {loading: true})

  on($content, {
    'click .img-wrapper'(e) {
      model.set({
        currIndex: $(e.currentTarget).data('index')
      })
    }
  })

  setTimeout(() => {
    model.set({
      loading: false,
      materials: map([{
        imgSrc: 'image?tid=0&id=mEwTWQKMhgub',
        imgName: 'mEwTWQKMhgub'
      }, {
        imgSrc: 'image?tid=0&id=aEmTgtByqrpM',
        imgName: 'aEmTgtByqrpM'
      }, {
        imgSrc: 'image?tid=0&id=JawQizZcbgpq',
        imgName: 'JawQizZcbgpq'
      }], img => {
        img.imgSrc = 'http://photo.made-in-china.com/' + img.imgSrc
        return img
      })
    })
  }, 500)

  return _dialog({
    title: options.title,
    content: $content[0],
    skin: 'material-library-dialog',
    cancel() {
      this.close()
      return false
    },
    cancelDisplay: false
  })
}

let dialog

const DEFAULT_OPTIONS = {
  title: '素材库'
}

window.materialLibrary = (options) => {
  options = $.extend({}, DEFAULT_OPTIONS, options)

  if (!dialog || dialog.destroyed || options.destroy) {
    dialog = createDialog(options)
  }

  dialog.showModal()
}
