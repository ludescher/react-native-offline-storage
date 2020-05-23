var gulp = require('gulp');
var merge = require('merge2');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function () {
    var tsResult = gulp
        .src('typescript/**/*.ts')
        .pipe(ts(Object.assign(
            tsProject.config.compilerOptions,
            {
                declarationFiles: true,
                noResolve: true,
            }
        )));
    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest('dist'))
    ]);
});