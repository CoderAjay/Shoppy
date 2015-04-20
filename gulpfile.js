'use strict';
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    app = require('./app.js');


var nodejs_files = [
    './app.js',
    './views/*.hjs',
    './routes/*.js'
];
var dist_dev = './dist/developement/';

//cleaning distribution folder
gulp.task('clean-build', function() {
    gulp.src('./dist/', {
            read: false
        })
        .pipe(clean());
});
// copying node server files in developement folder
gulp.task('server-files', function() {
    return gulp.src(nodejs_files, {
            base: './'
        })
        .pipe(gulp.dest(dist_dev));
});

// sass compiler task
gulp.task('sass', function() {
    return gulp.src('./public/stylessheets/*.scss')
        .pipe(sass({
            onError: function(error) {
                gutil.log(gutil.colors.red(error));
                gutil.beep();
            },
            onSuccess: function() {
                gutil.log(gutil.colors.green('Sass styles compiled successfully.'));
            }
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('./app/styles/'));
});

// Script task
gulp.task('scripts', function() {
    return gulp.src('./public/javascripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename(function(path) {
            path.basename = 'bundle';
        }))
        .pipe(gulp.dest('app/scripts'));
});



gulp.task('watch', function() {
    gulp.watch(['app/styles/**/*.scss'], ['sass']);
    gulp.watch(['app/scripts' + '/**/*.js'], ['scripts']);
    gulp.watch(['./app/**/*.html'], ['html']);
});

gulp.task('server', function() {
    app.listen(8000);
    livereload.listen();
});

gulp.task('watch', function() {
    // gulp.watch().on('change', livereload.changed);
    // gulp.watch(, livereload.changed);
});

gulp.task('build', ['clean-build', 'server-files'], function() {

});

gulp.task('default', ['server', 'watch'], function() {

});







// Load plugins
// var gulp = require('gulp'),
//     sass = require('gulp-ruby-sass'),
//     autoprefixer = require('gulp-autoprefixer'),
//     minifycss = require('gulp-minify-css'),
//     jshint = require('gulp-jshint'),
//     uglify = require('gulp-uglify'),
//     imagemin = require('gulp-imagemin'),
//     rename = require('gulp-rename'),
//     concat = require('gulp-concat'),
//     notify = require('gulp-notify'),
//     cache = require('gulp-cache'),
//     livereload = require('gulp-livereload'),
//     del = require('del');

// // Styles
// gulp.task('styles', function() {
//   return gulp.src('src/styles/main.scss')
//     .pipe(sass({ style: 'expanded', }))
//     .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
//     .pipe(gulp.dest('dist/styles'))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(minifycss())
//     .pipe(gulp.dest('dist/styles'))
//     .pipe(notify({ message: 'Styles task complete' }));
// });

// // Scripts
// gulp.task('scripts', function() {
//   return gulp.src('src/scripts/**/*.js')
//     .pipe(jshint('.jshintrc'))
//     .pipe(jshint.reporter('default'))
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('dist/scripts'))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/scripts'))
//     .pipe(notify({ message: 'Scripts task complete' }));
// });

// // Images
// gulp.task('images', function() {
//   return gulp.src('src/images/**/*')
//     .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
//     .pipe(gulp.dest('dist/images'))
//     .pipe(notify({ message: 'Images task complete' }));
// });

// // Clean
// gulp.task('clean', function(cb) {
//     del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
// });

// // Default task
// gulp.task('default', ['clean'], function() {
//     gulp.start('styles', 'scripts', 'images');
// });

// // Watch
// gulp.task('watch', function() {

//   // Watch .scss files
//   gulp.watch('src/styles/**/*.scss', ['styles']);

//   // Watch .js files
//   gulp.watch('src/scripts/**/*.js', ['scripts']);

//   // Watch image files
//   gulp.watch('src/images/**/*', ['images']);

//   // Create LiveReload server
//   livereload.listen();

//   // Watch any files in dist/, reload on change
//   gulp.watch(['dist/**']).on('change', livereload.changed);

// });
//
