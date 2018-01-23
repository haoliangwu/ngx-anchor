var gulp = require('gulp');
var { inlineResourcesForDirectory } = require('./inline-resources');
var sass = require('gulp-sass');


gulp.task('copy-and-inline-resource', copyHtml);

function copyHtml() {
  gulp.src('src/app/**/*.html')
    .pipe(gulp.dest('./lib/app')).on('end', copyAssets);
}

function copyAssets() {
  gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./lib/assets')).on('end', copyScss);
}
function copyScss() {
  gulp.src('./src/app/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./lib/app')).on('end', inlineResource);
}

function inlineResource() {
  inlineResourcesForDirectory('./lib/app');
}

gulp.task('default', ['copy-and-inline-resource']);
