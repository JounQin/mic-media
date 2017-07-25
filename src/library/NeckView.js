import {Mn, Model} from './common'

export default Mn.View.extend({
  className: 'neck clearfix',
  template: `<div class="pull-left">
  <div class="usage">
      <div class="used" style="width: <%- used / total * 100 %>%"></div>
  </div>
  剩余空间: <span class="left"><%- used.toFixed(2) %></span> MB (共 <%- total %> MB)
</div>
<div class="pull-right">
  <input>
  <button class="search-btn">搜索</button>
</div>`,
  model: new Model({
    used: Math.random() * 300,
    total: 300
  }),
  events: {
    'click .search-btn'() {
      this.trigger('loading')
      setTimeout(() => {
        this.trigger('loaded', [{
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
        }))
      }, 500)
    }
  }
})
