import $ from 'jquery'
import _dialog from 'art-dialog'

import {map, on} from './utils'
import ModalView from './ModelView'

const CONTENT_ID = '__material_library_dialog__'

const createDialog = options => {
  let $content = $(`#${CONTENT_ID}`)
  $content.length && $content.remove()
  $content = $(`<div id="${CONTENT_ID}" class="material-library-content"></div>`)
    .appendTo('body')

  const mv = new ModalView({
    el: $content,
    data: {loading: true},
    template: ({loading, materials, currIndex} = {}) => {
      if (loading) return `Loading...`
      return `<ul class="materials clearfix">
${map(materials, (material, index) => `<li>
    <div class="img-wrapper" data-index="${index}"><img src="${material.imgSrc}"></div>
  </li>`).join('')}
</ul>${currIndex + 1 || ''}`
    }
  })

  on($content, {
    'click .img-wrapper'(e) {
      mv.set({
        currIndex: $(e.currentTarget).data('index')
      })
    }
  })

  setTimeout(() => {
    mv.set({
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

  const {title, destroy, cancel, confirm} = options

  return _dialog({
    title,
    content: $content[0],
    skin: 'material-library-dialog',
    okValue: '确定',
    ok() {
      if (confirm.call(this) === false) return false
      this.close()
      return destroy
    },
    cancelValue: '取消',
    cancel() {
      if (cancel.call(this) === false) return false
      this.close()
      return destroy
    }
  })
}

let dialog

const noop = () => {}

const DEFAULT_OPTIONS = {
  title: '素材库',
  destroy: false,
  cancel: noop,
  confirm: noop
}

window.materialLibrary = (options) => {
  options = $.extend({}, DEFAULT_OPTIONS, options)

  if (!dialog || dialog.destroyed || options.destroy) {
    dialog = createDialog(options)
  }

  return dialog.showModal()
}
