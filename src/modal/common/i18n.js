import {$} from './basic'

const lang = $('html').attr('lang') === 'en' ? 0 : 1

const I18N = {
  flashes: ['Motion Photos', '动图'],
  name: ['Name', '名称'],
  size: ['Size', '大小'],
  duration: ['Duration', '时长'],
  updatedDate: ['Updated Date', '更新日期'],
  linkedProduct: ['Linked Product', '关联产品'],
  photoPreview: ['Preview', '查看图片'],
  flashPreview: ['Preview', '预览动图'],
  panoramaPreview: ['View Large Photo', '预览全景'],
  confirm: ['Confirm', '确定'],
  cancel: ['Cancel', '取消'],
  visitPhotoBank: ['Visit Multimedia Bank', '去素材库中管理图片'],
  visitFlashBank: ['Visit Multimedia Bank', '去素材库中查看动图'],
  visitPanoramaBank: ['Visit Multimedia Bank', '去素材库中查看全景图']
}

for (const key in I18N) {
  if (!I18N.hasOwnProperty(key)) continue
  I18N[key] = I18N[key][lang]
}

export default I18N
