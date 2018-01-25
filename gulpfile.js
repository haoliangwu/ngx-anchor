const gulp = require('gulp')
const { inlineResourcesForDirectory } = require('./inline-resources')
const sass = require('gulp-sass')
const args = require('get-gulp-args')()
const ghPages = require('gulp-gh-pages')

const moduleType = args.module

const SOURCE_PATH = {
  HTML: 'src/ngx-anchor/**/*.html',
  ASSET: './src/assets/**/*',
  SCSS: './src/ngx-anchor/**/*.scss'
}
const TARGET_PATH = moduleType === 'es2015' ? './publish/ngx-anchor' : './publish/es5/ngx-anchor'

function copyHtml() {
  gulp.src(SOURCE_PATH.HTML)
    .pipe(gulp.dest(TARGET_PATH)).on('end', copyAssets)
}

function copyAssets() {
  gulp.src(SOURCE_PATH.ASSET)
    .pipe(gulp.dest(TARGET_PATH)).on('end', copyScss)
}
function copyScss() {
  gulp.src(SOURCE_PATH.SCSS)
    .pipe(sass())
    .pipe(gulp.dest(TARGET_PATH)).on('end', inlineResource)
}

function inlineResource() {
  inlineResourcesForDirectory(TARGET_PATH)
}

gulp.task('copy-and-inline-resource', copyHtml)

gulp.task('compile', ['copy-and-inline-resource'])


function deploy() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages())
}

gulp.task('deploy', deploy)
