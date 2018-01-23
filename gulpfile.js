var gulp = require('gulp');
var { inlineResourcesForDirectory } = require('./inline-resources');
var sass = require('gulp-sass');

const SOURCE_PATH = {
  HTML: 'src/app/**/*.html',
  ASSET: './src/assets/**/*',
  SCSS: './src/app/**/*.scss'
}
const TARGET_PATH = './lib/app'

gulp.task('copy-and-inline-resource', copyHtml);

function copyHtml() {
  gulp.src(SOURCE_PATH.HTML)
    .pipe(gulp.dest(TARGET_PATH)).on('end', copyAssets);
}

function copyAssets() {
  gulp.src(SOURCE_PATH.ASSET)
    .pipe(gulp.dest(TARGET_PATH)).on('end', copyScss);
}
function copyScss() {
  gulp.src(SOURCE_PATH.SCSS)
    .pipe(sass())
    .pipe(gulp.dest(TARGET_PATH)).on('end', inlineResource);
}

function inlineResource() {
  inlineResourcesForDirectory(TARGET_PATH);
}

gulp.task('default', ['copy-and-inline-resource']);
