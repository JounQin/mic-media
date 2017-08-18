import {_, $} from './basic'

$.ajaxSetup({
  dataType: 'json',
  cache: false
})

// $.ajaxPrefilter(options => {
//   options.url = '/api/media' + options.url
// })

const cancelableApi = url =>
  (() => {
    let xhr
    return data => {
      xhr && xhr.abort()
      xhr = $.ajax({url, data}).always(() => {
        xhr = null
      })
      return xhr
    }
  })()

export const getPhotos = cancelableApi('/photo/list')

export const getFlash = cancelableApi('/motionPhoto/list')

export const getFlashPlay = data => $.ajax('/motionPhoto/play', {data})

export const getPanorama = cancelableApi('/panorama/list')

export const updateGroup = data => $.ajax('/group/update', {data})

/**
 *
 * @param data {groupId, deleteType}, deleteType: 0 移动到未分组, 1 移动到上一级, 2 永久删除
 */
export const deleteGroup = data => $.ajax('/group/delete', {data})

export const renamePhoto = data => $.ajax('/photo/rename', {data})

/**
 *
 * @param data {groupId, mediumIds}
 */
export const movePhoto = data => $.ajax('/photo/move', {data})

export const deletePhoto = mediumIds =>
  $.ajax('/photo/delete', {
    data: {
      mediumIds: _.isArray(mediumIds) ? mediumIds : [mediumIds]
    }
  })

export const switchViewType = viewType => $.ajax('/switch-view-type', {data: {viewType}})

/**
 *
 * @param data {sourceType, groupId}
 */
export const getGroups = cancelableApi('/group/list')

/**
 *
 * type: photo/video/flash/panorama
 *
 * @param data {type, mediumId}
 */
export const getCitedDetails = data => $.ajax('/get-cited-details', {data})

/**
 *
 * @param data {mediumIds, groupId}
 */
export const uploadPhoto = data => $.ajax('/photo/upload-link', {data})
