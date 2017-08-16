import {sizeLimit, supportHtml5} from './basic'

export default {
  searchPhotos: ['Search Photos', '搜索图片'],
  searchPhotosPlaceholder: ['Please enter the photo name.', '请输入图片名称。'],
  characterNotSupported: ['\\/:*?”<>| is not supported.', '\\/:*?”<>|字符不支持输入。'],
  noSearchResults: ['No matching results.', '找不到符合条件的结果。'],
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
  subGroupNotSupported: ['Sub-Group is not supported in this group.', '当前分组下不支持添加子分组。'],
  groupDeleted: ['This group has been deleted.', '您选择的分组已经被删除。'],
  photoDeleted: ['All the photos have been deleted.', '您选择的图片已经被删除。'],
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
  duplicateGroupName: ['This group name has existed, please enter some different photos.', '该组名已经存在，请输入不同的名称。'],
  emptyName: ['Please enter a name.', '请填写名称。'],
  confirmDeleteGroup: ['Delete group？Cannot be restored once deleted.', '是否确认删除分组，删除后将无法恢复？'],
  confirmDeletePhoto: ['Delete photo(s)？Cannot be restored once deleted.', '是否确认删除图片，删除后将无法恢复？'],
  selectPhoto: ['Please select some photos first.', '请选择图片。'],
  uploadPhotosTips: [`Format: JPEG/JPG/PNG; Size: within ${sizeLimit}.`, `支持JPG、JPEG和PNG格式，图片小于${sizeLimit}。`],
  selectPhotos: ['Select Photos From My Computer', '从我的电脑选择图片'],
  photoRepeatTips: [
    (curr, origin) => `${curr} is the same as ${origin} in the MultimediaBank.`,
    (curr, origin) => `${curr}与素材库中的${origin}重复。`
  ],
  storageUsedUp: [storage => `You have already used up ${storage} of space.`, storage => `您已使用完${storage}的空间。`],
  zipError: [`Upload failed, please confirm the photo is JPG, JPEG or PNG format.`, '上传失败，请检查是否为JPG、JPEG或PNG格式的图片。'],
  mimeTypeError: [
    `JPG${supportHtml5 ? '/JPEG/PNG' : ' or or JPEG'} format only.`,
    `仅支持JPG${supportHtml5 ? '/JPEG/PNG' : '和'}格式。`
  ],
  sizeLimitError: [`The photo size should be ${sizeLimit} or below.`, `请上传${sizeLimit}以内的图片。`],
  customGroupName: ['Selfdefined Group', '自定义分组'],
  noCameramanTips: [
    'Made-in-China.com will upload the photos to this category after the photography service is finished.',
    '拍摄服务由中国制造网提供，拍摄完成后，工作人员会将图片上传至此分类。'
  ],
  noCameramanServiceTips: [
    'You haven’t buy the photography service, please contact your sales manager for more information.',
    '您尚未购买上门拍摄服务，可联系您的客户经理了解更多内容。'
  ],
  nonRgbError: ['Please upload photos in RGB mode.', '请上传RGB模式的图片。'],
  photoRepeatedError: [
    num =>
      `${num} of the selected photos are already existed in the Multimedia Bank,  please select some different photos.`,
    num => `您选择的图片中，有 ${num} 张与素材库已有图片重复，请重新选择其他图片上传。`
  ],
  viewDetails: ['More', '查看详情'],
  hideDetails: ['Less', '收起详情'],
  exceedUsageError: [num => `You can upload photos of ${num} MB at the most.`, num => `您目前最多可以上传 ${num} MB的图片，请重新选择。`]
}
