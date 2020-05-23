var gulp = require('gulp');
var merge = require('merge2');
var ts = require('gulp-typescript');

gulp.task('default', function () {
    var tsResult = gulp.src('typescript/**/*.ts')
        .pipe(ts({
            declarationFiles: true,
            noResolve: true,
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest('dist'))
    ]);
});