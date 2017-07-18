import buble from 'rollup-plugin-buble'
import sass from 'rollup-plugin-sass'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import livereload from 'rollup-plugin-livereload'
import {argv} from 'yargs'

const ENTRY = process.env.ENTRY || 'library'

export default {
  entry: `src/${ENTRY}/index.js`,
  dest: `dist/${ENTRY}.js`,
  format: 'iife',
  external: ['jquery', 'underscore', 'backbone', 'backbone.marionette'],
  globals: {
    jquery: 'jQuery',
    underscore: '_',
    backbone: 'Backbone',
    'backbone.marionette': 'Marionette'
  },
  plugins: [
    sass({
      output: `dist/${ENTRY}.css`,
      processor: css =>
        postcss([
          autoprefixer({
            browsers: ['> 0%']
          })
        ]).process(css)
    }),
    buble(),
    ...(argv.watch ? [livereload('dist')] : [])
  ]
}
