var gulp = require('gulp');
var install = require("gulp-install");
var zip = require('gulp-zip');
var fs = require('fs');
var webpack = require('webpack');
var config = require('./webpack.config');

gulp.task('copyapp:_package', function (cb) {
 return gulp.src( ['./bin/*', './app.js', './package.json'], { base: "./" })
    .pipe(gulp.dest('_package'));
})

gulp.task('runnpm:_package', ['copyapp:_package'], function (cb) {
 return gulp.src(['package.json'], { cwd: "./_package" } )
    .pipe(install({production: true}));  
})

gulp.task('webpack:js', ['runnpm:_package'], function(cb) {
  return webpack(config, function(err, stats) {
        if(err) throw new ("webpack", err);
        console.log(`[webpack] : ${stats}`);
        cb();
    });
});


gulp.task('create:_static', ['webpack:js'], function (cb) {
 return gulp.src( [ './app/static/*/**' ], { "base" : "./app/static" }).pipe(gulp.dest('./_package/_static'));
})

gulp.task('package:azurewebapp', ["create:_static"], function () {
    return gulp.src(['**', '!Package.zip'], { cwd: "./_package"})
        .pipe(zip("Package.zip"))
        .pipe(gulp.dest("./_package"));
});

gulp.task('default', ["package:azurewebapp"],  () => {
})