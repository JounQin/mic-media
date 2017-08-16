import {$} from './basic'

$.ajaxSetup({
  dataType: 'json',
  cache: false
})

$.ajaxPrefilter(options => {
  options.url = '/api/media' + options.url
})

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

export const switchViewType = viewType => $.ajax('/switch-view-type', {data: {viewType}})

export const getGroups = cancelableApi('/group/list')
