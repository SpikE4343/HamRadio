'use strict';

//require('./tasks/build');
//require('./tasks/release');

// get the dependencies
var gulp        = require('gulp'),
  childProcess  = require('child_process'),
  electron      = require('electron-prebuilt'),
  less          = require('gulp-less');

var lessTask = function () {
    return gulp.src('app/stylesheets/main.less')
    .pipe(less())
    .pipe(gulp.dest('app/stylesheets'));
};

gulp.task('less', lessTask);
gulp.task('less-watch', lessTask);


gulp.task('build', ['less']);

// create the gulp task
gulp.task('run', ['build'], function () {
  childProcess.spawn(electron, ['--debug=5858','./app'], { stdio: 'inherit' });
});

gulp.task( 'default', ['run'])
