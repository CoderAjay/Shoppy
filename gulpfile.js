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
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    minifycss = require('gulp-minify-css');


var nodejs_files = [
    './app.js',
    './config.js',
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
    templatesDes: './app/templates',
    phonegapIndex: './phonegap/index.html'
};
var developement = {
    base: './dist/developement',
    views: './dist/developement',
    javascripts: './dist/developement/app/scripts',
    stylesheets: './dist/developement/app/styles',
    images: './dist/developement'
};

var phonegap = {
    base: './dist/phonegap',
    javascripts: './dist/phonegap/scripts',
    stylesheets: './dist/phonegap/stylesheets',
    images: './dist/phonegap/images'
};

gulp.task('clean-build', function() {
    return gulp.src(developement.base, {
            read: false
        })
        .pipe(clean({
            force: true
        }));
    // .pipe(notify({
    //     message: 'Deleted previous build.'
    // }));
});
// copying node server files in developement folder
gulp.task('server-files', ['views'], function() {
    return gulp.src(nodejs_files, {
            base: source.base
        })
        .pipe(gulp.dest(dist_dev));
    // .pipe(notify({
    //     message: 'Copied Server Files.'
    // }));
});
//views
gulp.task('views', function() {
    return gulp.src(source.views, {
            base: source.base
        })
        .pipe(gulp.dest(developement.views));
    // .pipe(notify({
    //     message: 'Html View has been copied.'
    // }));
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
        .pipe(gulp.dest(developement.stylesheets))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(developement.stylesheets));
    // .pipe(notify({
    //     message: 'Sass task complete.'
    // }));
});

// Script task
gulp.task('scripts', function() {
    return gulp.src(source.javascripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename(function(path) {
            path.basename = 'bundle';
        }))
        // .pipe(uglify())
        .pipe(gulp.dest(developement.javascripts));
    // .pipe(notify({
    //     message: 'Script task completed.'
    // }));
});

// // Images
gulp.task('images', function() {
    return gulp.src(source.images, {
            base: source.base
        })
        // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(developement.images));
    // .pipe(notify({
    //     message: 'Images task complete'
    // }));
});

gulp.task('compileDust', folders(source.templatesSrc, function(folder) {


    return gulp.src(path.join(source.templatesSrc, folder, '*.dust'))
        .pipe(rename({
            extname: ""
        }))
        .pipe(dust())
        .pipe(concat(folder + '.js'))
        .pipe(gulp.dest(source.templatesDes));
    // .pipe(notify({
    //     message: 'Templates compiled for front end.'
    // }));

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
    gulp.watch(source.views, ['views', 'compileDust', 'scripts']);

    gulp.watch(source.modules, ['scripts']);
    // Watch image files
    //gulp.watch('src/images/**/*', ['images']);
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/developement/**']).on('change', livereload.changed);

});


gulp.task('server', function() {
    require(dist_dev + 'app.js').listen(8000);
    notify({
        message: 'Server is up on port 8000'
    });
});

gulp.task('build', ['server-files', 'compileDust', 'scripts', 'sass', 'images'], function() {

});

gulp.task('dev', ['server', 'watch'], function() {

});


gulp.task('default', function() {
    runSequence('clean-build', 'build', 'dev', function() {

    });
});

//cleaning distribution folder
gulp.task('phonegap-clean-build', function() {
    return gulp.src(phonegap.base, {
            read: false
        })
        .pipe(clean({
            force: true
        }))
        .pipe(notify({
            title: 'Phonegap',
            message: 'Deleted previous phonegap build.',
            onLast: true
        }));
});

gulp.task('phonegap-index', function() {
    return gulp.src(source.phonegapIndex)
        .pipe(gulp.dest(phonegap.base));
});

gulp.task('phonegap-scripts', function() {
    return gulp.src(source.javascripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename(function(path) {
            path.basename = 'bundle';
        }))
        // .pipe(uglify())
        .pipe(gulp.dest(phonegap.javascripts));
});
gulp.task('phonegap-sass', function() {
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
        .pipe(gulp.dest(phonegap.stylesheets))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(phonegap.stylesheets));
});
gulp.task('phonegap-images', function() {
    return gulp.src(source.images)
        // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(phonegap.images));
});

gulp.task('phonegap-build', ['phonegap-index', 'compileDust', 'phonegap-scripts', 'phonegap-sass', 'phonegap-images'], function() {

});
gulp.task('phonegap', function() {
    runSequence('phonegap-clean-build', 'phonegap-build', function() {
        gulp.src('').pipe(notify({
            title: 'Phonegap',
            message: 'Phonegap build is ready.',
            onLast: true
        }));
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

// // Images
// gulp.task('images', function() {
//   return gulp.src('src/images/**/*')
//     .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
//     .pipe(gulp.dest('dist/images'))
//     .pipe(notify({ message: 'Images task complete' }));
// });
