const gulp = require('gulp');
const concat = require('gulp-concat');

//js文件打包
gulp.task('jsmin', (done) => {
    gulp
        .src([
            './src/jquery.min.js'
            , './src/utils.js'
            , './src/moelyrics.js'
        ])
        // .pipe(babel()) //ES6转换为ES5
        .pipe(concat("moelyrics.min.js"))  //多个文件合并为一个文件，注：文件合并必须在babel之后
        // .pipe(uglify()) //js代码压缩
        .pipe(gulp.dest('dist'))
    done()
})

gulp.task('default', gulp.series('jsmin'))
