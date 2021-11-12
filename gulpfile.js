const gulp = require('gulp');
const {
  series,
  parallel
} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename")
const browserSync = require('browser-sync').create();
const del = require('del');

// =*=*=*=*=*= Html =*=*=*=*=*= //
const html = () => {
  return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build'))
}

// =*=*=*=*=*= Styles =*=*=*=*=*= //
const styles = () => {
  return gulp.src('src/styles/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/css'))
}

// =*=*=*=*=*= Fonts =*=*=*=*=*= //
const buildFonts = () => {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('build/fonts'))
}

// =*=*=*=*=*= Images =*=*=*=*=*= //
const images = () => {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('build/images'))
}

// =*=*=*=*=*= BrowserSync =*=*=*=*=*= //
const server = () => {
  browserSync.init({
    server: {
      baseDir: './build'
    },
    notify: false
  })
  browserSync.watch('build', browserSync.reload)
}

// =*=*=*=*=*= Del =*=*=*=*=*= //
const deleteBuild = (cb) => {
  return del('build/**/*.*').then(() => {
    cb()
  })
}

// =*=*=*=*=*= Watching =*=*=*=*=*= //
const watch = () => {
  gulp.watch('src/pug/**/*.pug', html)
  gulp.watch('src/styles/**/*.scss', styles)
  gulp.watch('src/images/**/*', images)
  gulp.watch('src/fonts/*', buildFonts)
}

// =*=*=*=*=*= Gulp =*=*=*=*=*= //
exports.default = series(
  deleteBuild,
  parallel(html, styles, images, buildFonts),
  parallel(watch, server)
)