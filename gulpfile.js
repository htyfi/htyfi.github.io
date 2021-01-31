var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var spriter = require('gulp-css-spriter');
var uglify = require('gulp-uglify'); //js压缩
var babel = require("gulp-babel");
var rename = require('gulp-rename');//文件更名
var htmlmin = require('gulp-htmlmin');
var order =require("gulp-order");
// var jshint = require('gulp-jshint');//js检测

gulp.task("clean", function () {
  return gulp.src('./rev')
    .pipe(clean());
})

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function () {
  var timestamp = +new Date();
  return gulp.src(['./css/*.css'])
    // .pipe(spriter({
    //   // 生成的spriter的位置
    //   'spriteSheet': './rev/sprite' + timestamp + '.png',
    //   // 生成样式文件图片引用地址的路径
    //   // 如下将生产：backgound:url(../images/sprite20324232.png)
    //   'pathToSpriteSheetFromCSS': 'sprite' + timestamp + '.png'
    // }))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(concat('all.min.css'))
    .pipe(rev())
    .pipe(gulp.dest('./rev'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev'));
});

// 合并、压缩js文件
gulp.task('revJs', function () {
  return gulp.src(['./js/*.js'])
  .pipe(order(['jquery.js','vue.js','web3.min.js','truffle-contract.js','clipboard.min.js.js','lang.js', 'data.js', 'global.js']))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./rev'))
});

gulp.task('maxjs', function () {
  return gulp.src(['./rev/all.js','./rev/appmin.js'])
  .pipe(order(['all.js','appmin.js']))
    .pipe(concat('max_all.js'))
    .pipe(gulp.dest('./rev'))
});

gulp.task('html', function () {
  var options = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true
  };

  return gulp.src('./index.html')

    .pipe(htmlmin(options))
    .pipe(concat('cap.html'))
    .pipe(gulp.dest('./'));

});


//Html替换css、js文件版本
gulp.task('revHtml', function () {
  return gulp.src(['./rev/**/*.json', './*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('./'));
});


//开发构建
// gulp.task('default', function(done) {
//   condition = false;
//   runSequence(
//     ['clean'], ['revCss'], ['revHtml'],
//     done);
// });
gulp.task('default', gulp.parallel('clean', 'revCss', 'revJs', 'revHtml'));
// gulp.task('default',
//   gulp.series('clean', gulp.parallel('revCss', 'revHtml'),
//   function() {
//     console.log(111);
//   }));




// var gulp = require('gulp'),//基础库

//   htmlmin = require('gulp-htmlmin'),//html压缩

//   cssmin = require('gulp-minify-css'),//css压缩

//   uglify = require('gulp-uglify'),//js压缩

//   imagemin = require('gulp-imagemin'),//图片压缩

//   pngquant = require('imagemin-pngquant'),//图片深入压缩

//   imageminOptipng = require('imagemin-optipng'),

//   imageminSvgo = require('imagemin-svgo'),

//   imageminGifsicle = require('imagemin-gifsicle'),

//   imageminJpegtran = require('imagemin-jpegtran'),

//   domSrc = require('gulp-dom-src'),

//   cheerio = require('gulp-cheerio'),

//   processhtml = require('gulp-processhtml'),

//   Replace = require('gulp-replace'),

//   cache = require('gulp-cache'),//图片压缩缓存

//   clean = require('gulp-clean'),//清空文件夹

//   conCat = require('gulp-concat'),//文件合并

//   plumber = require('gulp-plumber'),//检测错误

//   gutil = require('gulp-util');//如果有自定义方法，会用到

// var date = new Date().getTime();

// gulp.task('clean', function () {

//   return gulp.src('min/**', { read: false })

//     .pipe(clean());

// });


// gulp.task('cleanCash', function (done) {//清除缓存

//   return cache.clearAll(done);

// });

// gulp.task('htmlmin', function () {

//   var options = {

//     removeComments: true,//清除HTML注释

//     collapseWhitespace: true,//压缩HTML

//     collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />

//     removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />

//     removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"

//     removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"

//     minifyJS: true,//压缩页面JS

//     minifyCSS: true//压缩页面CSS

//   };

//   gulp.src(['index/*.htm', 'index/*.html'])

//     .pipe(plumber({ errorHandler: errrHandler }))

//     .pipe(Replace(/_VERSION_/gi, date))

//     .pipe(processhtml())

//     .pipe(htmlmin(options))

//     .pipe(gulp.dest('min'));

// });

// gulp.task('cssmin', function () {

//   gulp.src('index/**/*.css')

//     .pipe(conCat('css/index.min.css'))

//     .pipe(plumber({ errorHandler: errrHandler }))

//     .pipe(cssmin({

//       advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]

//       compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]

//       keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]

//       keepSpecialComments: '*'

//       //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀

//     }))

//     .pipe(gulp.dest('min'));

// });

// gulp.task('jsmin', function () {

//   gulp.src(['index/js/*.js', '!index/**/{text1,text2}.js'])

//     .pipe(conCat('js/index.min.js'))

//     .pipe(plumber({ errorHandler: errrHandler }))

//     .pipe(uglify({

//       mangle: { except: ['require', 'exports', 'module', '$'] },//类型：Boolean 默认：true 是否修改变量名

//       compress: true,//类型：Boolean 默认：true 是否完全压缩

//       preserveComments: 'false' //保留所有注释

//     }))

//     .pipe(gulp.dest('min'));

// });

// gulp.task('imagemin', function () {

//   gulp.src('index/**/*.{png,jpg,gif,ico}')

//     .pipe(plumber({ errorHandler: errrHandler }))

//     .pipe(cache(imagemin({

//       progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片         

//       svgoPlugins: [{ removeViewBox: false }],//不要移除svg的viewbox属性

//       use: [pngquant(), imageminJpegtran({ progressive: true })

//         , imageminGifsicle({ interlaced: true }), imageminOptipng({ optimizationLevel: 3 }), imageminSvgo()] //使用pngquant深度压缩png图片的imagemin插件         

//     })))

//     .pipe(gulp.dest('min'));

// });

// gulp.task('default', ['clean'], function () {

//   gulp.start('cssmin', 'htmlmin', 'jsmin', 'imagemin');

// });
