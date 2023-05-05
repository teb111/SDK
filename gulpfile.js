const { src, dest } = require('gulp')
const concat = require('gulp-concat')

const jsBundle = () =>
  src(['./app.js', './mithril.min.js'])
    .pipe(concat('all.js'))
    .pipe(dest('dist/js'))

exports.jsBundle = jsBundle
