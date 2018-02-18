'use strict';

const gulp = require('gulp');
const bs = require('browser-sync').create();
const gp = require('gulp-load-plugins')();

gulp.task('html', () => {
    return gulp.src('app/**/*.html')
    .pipe(gulp.dest('build'))
    .on('end', bs.reload);
})

gulp.task('less', () => {
    return gulp.src('app/styles/*.less')
    .pipe(gp.sourcemaps.init())
    .pipe(gp.less({
        'include css': true
    }))
    .pipe(gp.autoprefixer({
        browsers: ['last 5 versions'],
        cascade: false
    }))
    .on('error', gp.notify.onError({
        message: 'Error: <%= error.message %>',
        title: 'Style'
    }))
    .pipe(gp.csso())
    .pipe(gp.sourcemaps.write())
    .pipe(gulp.dest('build/styles/'))
    .pipe(bs.reload({
        stream: true
    }));
});

gulp.task('serve', () => {
    bs.init({
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('watch', () => {
    gulp.watch('app/styles/*.less', gulp.series('less'))
    gulp.watch('app/**/*.html', gulp.series('html'))
});

gulp.task('build', gulp.series(
    gulp.parallel('less', 'html'),
    gulp.parallel('watch', 'serve')
))