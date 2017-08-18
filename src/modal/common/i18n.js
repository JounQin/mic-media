import {$} from './basic'

import photo from './i18n_photo'
import flash from './i18n_flash'
import panorama from './i18n_panorama'
import video from './i18n_video'

const lang = $('html').attr('lang') === 'en' ? 0 : 1

const I18N = {
  name: ['Name', '名称'],
  size: ['Size', '大小'],
  pixel: ['Pixel', '尺寸'],
  state: ['State', '审核状态'],
  new: ['New', '新加入'],
  approved: ['Approved', '通过审核'],
  rejected: ['Rejected', '返回修改'],
  duration: ['Duration', '时长'],
  updatedDate: ['Updated Date', '更新日期'],
  linkedProduct: ['Linked Product', '关联产品'],
  photoPreview: ['Preview', '查看图片'],
  confirm: ['Confirm', '确定'],
  cancel: ['Cancel', '取消'],
  clear: ['Clear', '清除'],
  ...photo,
  ...flash,
  ...panorama,
  ...video
}

for (const key in I18N) {
  if (!I18N.hasOwnProperty(key)) continue
  I18N[key] = I18N[key][lang]
}

export default I18N
