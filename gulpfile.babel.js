import gulp from 'gulp'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import plumber from 'gulp-plumber'
import autoprefixer from 'autoprefixer'
import {rollup} from 'rollup'
import buble from 'rollup-plugin-buble'

const LIBRARY = 'library'
const MODAL = 'modal'

const ALL = [LIBRARY, MODAL]

const generate = ext => ALL.map(item => `src/${item}/*.${ext}`)

const scripts = generate('js')
const styles = generate('scss')

export const script = () => Promise.all(ALL.map(entry => rollup({
  entry: `src/${entry}/index.js`,
  external: ['jquery', 'underscore', 'backbone', 'backbone.marionette'],
  plugins: [buble()]
}).then(bundle => bundle.write({
  dest: `docs/${entry}.js`,
  format: 'iife',
  globals: {
    jquery: 'jQuery',
    underscore: '_',
    backbone: 'Backbone',
    'backbone.marionette': 'Marionette'
  }
}))))

export const style = () => gulp.src(styles)
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([autoprefixer({browsers: ['> 0%']})]))
  .pipe(gulp.dest('docs'))

export const watchScript = () => gulp.watch(scripts, script)
export const watchStyle = () => gulp.watch(styles, style)

export const watch = () => {
  watchScript()
  watchStyle()
}

export default gulp.parallel(script, style)
