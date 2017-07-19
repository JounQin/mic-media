import $ from 'jquery'
import _dialog from 'art-dialog'

const CONTENT_ID = '__material_library_dialog__'
let $content

const compile = ({loading, materials} = {}) => {
  if (loading) return `Loading...`
  return `<ul class="materials">
${materials.map(material => `<li><img src="${material.imgSrc}"></li>`).join('')}
</ul>`
}

const render = (data = {}) => {
  if (!$content || !$content.length) return
  return $content.html(compile(data) || '')
}

const createDialog = options => {
  $content = $(`#${CONTENT_ID}`)
  $content.length && $content.remove()
  $content = $(`<div id="${CONTENT_ID}" class="material-library-content"></div>`).appendTo('body')

  render({
    loading: true
  })

  setTimeout(() => {
    render({
      materials: [{
        imgSrc: 'image?tid=0&id=mEwTWQKMhgub',
        imgName: 'mEwTWQKMhgub'
      }, {
        imgSrc: 'image?tid=0&id=aEmTgtByqrpM',
        imgName: 'aEmTgtByqrpM'
      }, {
        imgSrc: 'image?tid=0&id=JawQizZcbgpq',
        imgName: 'JawQizZcbgpq'
      }].map(img => {
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
