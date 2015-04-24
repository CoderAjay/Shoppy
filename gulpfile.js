'use strict';
/* global require*/
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    path = require('path'),
    folders = require('gulp-folders'),
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    dust = require('gulp-dust'),
    runSequence = require('run-sequence');


var nodejs_files = [
    './app.js',
    './routes/*.js',
    './schema/*.js',
    './controller/**/*.js',
    './externalApis/*.js'
];
var dist_dev = './dist/developement/';

var source = {
    base: './',
    views: ['./views/**'],
    stylesheets: './app/stylesheets/*.scss',
    javascripts: './app/javascripts/*.js',
    modules: ['./app/modules/**/*.js'],
    images: './app/images/*',
    templatesSrc: './views/templates',
    templatesDes: './app/templates'
};
var developement = {
    base: './dist/',
    views: './dist/developement',
    javascripts: './dist/developement/app/scripts',
    stylesheets: './dist/developement/app/styles',
    images: './dist/developement'
};
//cleaning distribution folder
gulp.task('clean-build', function() {
    return gulp.src(developement.base, {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});
// copying node server files in developement folder
gulp.task('server-files', ['views'], function() {
    return gulp.src(nodejs_files, {
            base: source.base
        })
        .pipe(gulp.dest(dist_dev));
});
//views
gulp.task('views', function() {
    return gulp.src(source.views, {
            base: source.base
        })
        .pipe(gulp.dest(developement.views));
});
// sass compiler task
gulp.task('sass', function() {
    return gulp.src(source.stylesheets)
        .pipe(sass({
            style: 'expanded',
            onError: function(error) {
                gutil.log(gutil.colors.red(JSON.stringify(error)));
                gutil.beep();
            },
            onSuccess: function() {
                gutil.log(gutil.colors.green('Sass styles compiled successfully.'));
            }
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(developement.stylesheets));
});

// Script task
gulp.task('scripts', function() {
    return gulp.src(source.javascripts)
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename(function(path) {
            path.basename = 'bundle';
        }))
        .pipe(gulp.dest(developement.javascripts));
});

// // Images
gulp.task('images', function() {
    return gulp.src(source.images, {
            base: source.base
        })
        // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(developement.images));
    // .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('compileDust', folders(source.templatesSrc, function(folder) {


    return gulp.src(path.join(source.templatesSrc, folder, '*.dust'))
        .pipe(dust())
        .pipe(concat(folder + '.js'))
        .pipe(gulp.dest(source.templatesDes));

    // return gulp.src(source.templatesSrc)
    //     .pipe(dust())
    //     .pipe(concat('index.js'))
    //     .pipe(gulp.dest(source.templatesDes));
}));

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch(source.stylesheets, ['sass']);

    // Watch .js files
    gulp.watch(source.javascripts, ['scripts']);

    // watch html files
    gulp.watch(source.views, ['views']);

    gulp.watch(source.modules, ['scripts']);
    // Watch image files
    //gulp.watch('src/images/**/*', ['images']);
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/developement/**']).on('change', livereload.changed);

});


gulp.task('server', function() {
    require(dist_dev + 'app.js').listen(8000);
    // livereload.listen();
});

gulp.task('build', ['server-files', 'compileDust', 'scripts', 'sass', 'images'], function() {

});

gulp.task('dev', ['server', 'watch'], function() {

});


gulp.task('default', function() {
    runSequence('clean-build', 'build', 'dev', function() {

    });
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
