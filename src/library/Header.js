import {Marionette} from './lib'

export default Marionette.View.extend({
  className: 'header',
  template: `<h2>图片库</h2><div>找不到图片？图片可能被删除或转移到“未分组图片”。</div>`
})
