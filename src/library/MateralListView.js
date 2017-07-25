import {Bb, Mn} from './common'

import MaterialView from './MaterialView'

export const MaterialList = Bb.Collection.extend({})

export default Mn.CollectionView.extend({
  tagName: 'ul',
  className: 'materials clearfix list-unstyled',
  childView: MaterialView,
  childViewOptions(model, index) {
    model.set({index})
  },
  childViewEvents: {
    previewDetail(index) {
      this.trigger('toggleMaterial', index)
    }
  }
})
