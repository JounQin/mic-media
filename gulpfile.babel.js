import path from 'path'

import gulp from 'gulp'
import sass from 'gulp-sass'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import replace from 'gulp-replace'
import spritesmith from 'gulp.spritesmith'
import autoprefixer from 'autoprefixer'

import {rollup} from 'rollup'
import babel from 'rollup-plugin-babel'
import {transform} from 'rollup-plugin-insert'
import resolve from 'rollup-plugin-node-resolve'

import _debug from 'debug'
import {argv} from 'yargs'

const debug = _debug('mic:gulp')

const BANK = 'bank'
const MODAL = 'modal'

const ENTRIES = [BANK, MODAL]

const generate = (ext, dir = '**') => ENTRIES.map(item => `src/${item}/${dir}/*.${ext}`)

const scripts = generate('js')
const styles = generate('scss')
const sprites = generate('{gif,jpg,png}', 'sprites')

const mstatic = (() => {
  let dir = process.cwd()
  let basename

  do {
    dir = path.dirname(dir)
    basename = path.basename(dir)
  } while (basename !== 'mstatic')

  return dir
})()

export const script = () =>
  Promise.all(
    ENTRIES.map(entry =>
      rollup({
        entry: `src/${entry}/index.js`,
        external: ['art-dialog', 'jquery', 'underscore', 'backbone', 'backbone.marionette'],
        plugins: [
          resolve(),
          transform(
            (code, id) =>
              `import _ from 'underscore'
              export default _.template(${JSON.stringify(
                (argv.watch ? `<!--template path: ${path.relative(mstatic, id)}-->` : '') + code
              )})`,
            {include: '**/*.html'}
          ),
          babel()
        ]
      }).then(bundle =>
        bundle.write({
          banner:
            argv.watch &&
            `document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></script>');`,
          dest: `dist/${entry}.js`,
          format: 'iife',
          globals: {
            'art-dialog': 'artDialog',
            jquery: 'jQuery',
            underscore: '_',
            backbone: 'Backbone',
            'backbone.marionette': 'Marionette'
          }
        })
      )
    )
  ).catch(console.error)

const cwd = process.cwd()

const PATH_REGEXP = /\$\${path.(\w+)}/g
const PATH_REPLACER = (match, $0) => `/${$0}`

export const style = () =>
  gulp
    .src(styles, {base: path.resolve(cwd, 'src')})
    .pipe(plumber())
    .pipe(
      sass({
        importer: url => {
          url = url.replace(PATH_REGEXP, PATH_REPLACER)
          return {
            file: url.startsWith('/') ? path.join(mstatic, url) : url
          }
        }
      })
    )
    .pipe(replace(PATH_REGEXP, PATH_REPLACER))
    .pipe(postcss([autoprefixer({browsers: ['> 0%']})]))
    .pipe(
      rename(path => {
        path.basename = path.dirname
        path.dirname = '.'
      })
    )
    .pipe(gulp.dest('dist'))

export const sprite = () =>
  Promise.all(
    ENTRIES.map(
      entry =>
        new Promise(resolve =>
          gulp
            .src(`src/${entry}/sprites/*.{gif,jpg,png}`)
            .pipe(
              spritesmith({
                imgName: `${entry}-sprite.png`,
                cssName: '_sprite.scss'
              })
            )
            .pipe(gulp.dest(`src/${entry}`))
            .on('end', resolve)
        )
    )
  ).then(() =>
    Promise.all(
      ENTRIES.map(
        entry =>
          new Promise(resolve =>
            gulp.src(`src/${entry}/${entry}-sprite.png`).pipe(gulp.dest('dist')).on('end', resolve)
          )
      )
    )
  )

export const watchScript = () => gulp.watch(scripts, script)
export const watchStyle = () => gulp.watch(styles, style)
export const watchSprite = () => gulp.watch(sprites, sprite)

const watchCallbacks = {
  js: script,
  scss: style
}

export const watch = () => {
  script()
  style()
  // watchScript()
  // watchStyle()
  // watchSprite()

  let jsTimeout
  let scssTimeout

  gulp.watch(['src/**/*', '!src/**/sprites/**/*']).on('change', filename => {
    const ext = path.extname(filename).replace(/^\./, '')

    if (!['js', 'scss', 'html'].includes(ext)) return

    debug(`${filename} has changed`)

    const isScss = ext === 'scss'

    clearTimeout(isScss ? scssTimeout : jsTimeout)

    const timeout = setTimeout(watchCallbacks[isScss ? 'scss' : 'js'], 200)

    if (isScss) {
      scssTimeout = timeout
    } else {
      jsTimeout = timeout
    }
  })

  gulp.watch('src/**/sprites/**/*').on('all', sprite)
}

export default gulp.parallel(script, gulp.series(sprite, style))
