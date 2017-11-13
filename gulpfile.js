var gulp = require('gulp');
var browserSync = require('browser-sync');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var csswring = require('csswring');
var del = require('del');

var $ = require('gulp-load-plugins')();
var pkg = require('./package.json')

var paths = {
  css:   './src/css/main.css',
  img:   './src/img/**/*.{jpg,png,svg,gif}',
  icons: './src/icons/**/*.svg',
  fonts: './src/fonts/**/*'
};

// errors handling and notify
const shitHappens = function(err) {
  $.notify.onError('Error: <%= error.message %>')(err);
  this.emit('end');
};

// autoprefix, precss css files and sourcemap
gulp.task('css', () => {
  var processors = [
      precss,
      autoprefixer({ browsers: ['> 1%', 'ie >= 9'] })
  ];
  return gulp.src(paths.css)
    .pipe($.plumber({ errorHandler:shitHappens }))
    .pipe($.sourcemaps.init() )
    .pipe($.postcss(processors))
    .pipe($.sourcemaps.write('.', {sourceRoot: './src'}))
    .pipe(gulp.dest('./dist/css/'));
});

// autoprefix, precss css files and minify
gulp.task('build:css', () => {
  var processors = [
      precss,
      autoprefixer({ browsers: ['> 1%', 'ie >= 9'] }),
      csswring
  ];
  return gulp.src(paths.css)
    .pipe($.plumber({ errorHandler:shitHappens }))
    .pipe($.postcss(processors))
    .pipe(gulp.dest('./dist/css/'));
});

// Copy and optimize images
gulp.task('img', () => {
  return gulp.src(paths.img)
    .pipe($.changed('./dist/img/'))
    .pipe($.imagemin([
      $.imagemin.svgo({
        plugins: [
          { removeHiddenElems: false },
          { removeUselessDefs: false },
          { cleanupIDs: false }
        ]
      }),
      $.imagemin.gifsicle({ interlaced: true }),
      $.imagemin.jpegtran({progressive: true }),
      $.imagemin.optipng({ optimizationLevel: 3 })
    ]))
    .pipe(gulp.dest('./dist/img/'));
});

gulp.task('icons', () => {
  return gulp.src(paths.icons)
    .pipe($.plumber({ errorHandler:shitHappens }))
    .pipe($.svgSymbols({
      title: false,
      id: 'icon_%f',
      className: '.%f',
      templates: [
        'default-svg'
      ]
    }))
    .pipe($.imagemin([
      $.imagemin.svgo({
        plugins: [
          { removeHiddenElems: false },
          { removeUselessDefs: false },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe($.rename('icons.svg'))
    .pipe(gulp.dest('./dist/img/'));
});

// Build html
gulp.task('html', () => {
  return gulp.src('./src/*.html')
    .pipe($.plumber({ errorHandler:shitHappens }))
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(gulp.dest('./dist/'));
});

// Clean, delete dist folder
gulp.task('clean', () => {
  return del('./dist');
});

// Build
gulp.task('build', ['clean'], () => {
  gulp.start(['build:css', 'img', 'icons', 'html']);
});

// Watch task
gulp.task('watch', () => {

  $.watch('./src/css/**/*.css', () => { gulp.start('css') });

  $.watch('./src/js/**/*.js', () => { gulp.start('js') });

  $.watch('./src/*.html', () => { gulp.start('html') });

  $.watch(paths.fonts, () => { gulp.start('fonts') });

  $.watch(paths.img, () => { gulp.start('img') });

  $.watch(paths.icons, () => { gulp.start('icons') });

  browserSync.init({
    files:   ['./dist/**/*', '!dist/**/*.map'],
    open:    'external',
    notify:  false,
    ui:      false,
    server:  {
      baseDir: './dist'
    }
  });

});