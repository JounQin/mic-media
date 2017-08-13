import {sizeLimit} from './basic'

export default {
  searchPhotos: ['Search Photos', '搜索图片'],
  customPhotos: ['From My Computer', '自定义'],
  systemPhotos: ['From System', '系统同步'],
  cameramanPhotos: ['From Cameraman', '上门拍摄'],
  usedStorage: ['Used Storage', '已用空间'],
  allPhotos: ['All The Photos', '所有图片'],
  ungrouped: ['Ungrouped', '未分组'],
  addGroup: ['Add Group', '添加分组'],
  upload: ['Upload', '上传'],
  uploadPhotos: ['Upload Photos', '上传图片'],
  addSubGroup: ['Add Sub-Group', '添加子分组'],
  reviewStatuses: [
    [
      {
        type: 0,
        text: 'New'
      },
      {
        type: 3,
        text: 'Approved'
      },
      {
        type: 2,
        text: 'Rejected'
      }
    ],
    [
      {
        type: 0,
        text: '新加入'
      },
      {
        type: 3,
        text: '通过审核'
      },
      {
        type: 2,
        text: '返回修改'
      }
    ]
  ],
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
  mediumStatuses: [['New', null, 'Rejected', 'Approved'], ['新加入', null, '返回修改', '通过审核']],
  selectedPhotosNum: [num => `Selected ${num} photos`, num => `已选择${num}张图片`],
  rename: ['Rename', '重命名'],
  confirmDeletePhoto: ['Delete photo(s)？Cannot be restored once deleted.', '是否确认删除图片，删除后将无法恢复？'],
  selectPhoto: ['Please select some photos first.', '请选择图片。'],
  uploadPhotosTips: [`Format: JPEG/JPG/PNG; Size: within ${sizeLimit}.`, `支持JPG、JPEG和PNG格式，图片小于${sizeLimit}。`],
  selectPhotos: ['Select Photos From My Computer', '从我的电脑选择图片']
}
