import {$} from './basic'

import photo from './i18n_photo'

const lang = $('html').attr('lang') === 'en' ? 0 : 1

const I18N = {
  photos: ['Photos', '图片'],
  videos: ['Videos', '视频'],
  flashes: ['Motion Photos', '动图'],
  panoramas: ['Panorama Photos', '全景图'],
  goBack: ['Return', '返回'],
  confirm: ['Confirm', '确认'],
  cancel: ['Cancel', '取消'],
  name: ['Name', '名称'],
  size: ['Size', '大小'],
  pixel: ['Pixel', '尺寸'],
  duration: ['Duration', '时长'],
  updatedDate: ['Updated Date', '更新日期'],
  citedTimes: ['Times Cited', '引用次数'],
  operation: ['Operation', '操作'],
  linkedProduct: ['Linked Product', '关联产品'],
  pageSuffix: ['', '页'],
  poster: ['Poster', '上传人'],
  reviewStatus: ['State', '审核状态'],
  isCited: ['Cited', '是否引用'],
  times: ['', '次'],
  all: ['All', '所有'],
  yes: ['Yes', '是'],
  no: ['No', '否'],
  selectAll: ['All', '全选'],
  moveTo: ['Move to', '移动到'],
  del: ['Delete', '删除'],
  nextPage: ['Next', '下一页'],
  download: ['Download', '下载'],
  ...photo
}

for (const key in I18N) {
  if (!I18N.hasOwnProperty(key)) continue
  I18N[key] = I18N[key][lang]
}

export default I18N
