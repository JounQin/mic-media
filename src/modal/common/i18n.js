import {$} from './basic'

import flash from './i18n_flash'
import panorama from './i18n_panorama'
import video from './i18n_video'

const lang = $('html').attr('lang') === 'en' ? 0 : 1

const I18N = {
  flashes: ['Motion Photos', '动图'],
  name: ['Name', '名称'],
  size: ['Size', '大小'],
  duration: ['Duration', '时长'],
  updatedDate: ['Updated Date', '更新日期'],
  linkedProduct: ['Linked Product', '关联产品'],
  photoPreview: ['Preview', '查看图片'],
  confirm: ['Confirm', '确定'],
  cancel: ['Cancel', '取消'],
  clear: ['Clear', '清除'],
  visitPhotoBank: ['Visit Multimedia Bank', '去素材库中管理图片'],
  selectPhoto: ['Select Photos From Multimedia Bank', '选择素材库中的图片'],
  photoTips: ['Please select a photo.', '请选图片'],
  allType: ['All', '所有分类'],
  allGroup: ['All', '所有分组'],
  ungrouped: ['Ungrouped', '未分组'],
  poster: ['Poster', '上传人'],
  fromComputer: ['From My Computer', '自定义'],
  fromSystem: ['From System', '系统同步'],
  fromCameraman: ['From Cameraman', '上门拍摄'],
  searchPhotos: ['Search Photos', '搜索图片'],
  allPhotos: ['All Photos', '所有图片'],
  sortTypes: [
    [
      {
        type: 'updateTime',
        text: 'Updated Date'
      },
      {
        type: 'mediumName',
        text: 'Name'
      },
      {
        type: 'mediumSpace',
        text: 'Size'
      }
    ],
    [
      {
        type: 'updateTime',
        text: '更新日期'
      },
      {
        type: 'mediumName',
        text: '名称'
      },
      {
        type: 'mediumSpace',
        text: '大小'
      }
    ]
  ],
  ...flash,
  ...panorama,
  ...video
}

for (const key in I18N) {
  if (!I18N.hasOwnProperty(key)) continue
  I18N[key] = I18N[key][lang]
}

export default I18N
