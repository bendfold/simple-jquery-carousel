var gulp       = require('gulp');
var livereload = require('gulp-livereload');

module.exports = function(){
	gulp.watch('src/stylus/**', ['stylus']);
	livereload();
};