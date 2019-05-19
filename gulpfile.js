var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var plumber = require( 'gulp-plumber' );
var notify = require( 'gulp-notify' );
var sassGlob = require( 'gulp-sass-glob' );
var mmq = require( 'gulp-merge-media-queries' );
var sourcemaps = require( 'gulp-sourcemaps' );
var browserSync = require( 'browser-sync' );
var imagemin = require( 'gulp-imagemin' );
var imageminPngquant = require( 'imagemin-pngquant' );
var imageminMozjpeg = require( 'imagemin-mozjpeg' );

var postcss = require( 'gulp-postcss' );
var autoprefixer = require( 'autoprefixer' );
var cssdeclsort = require( 'css-declaration-sorter' );

var imageminOption = [
	imageminPngquant({ quality: '65-80' }),
	imageminMozjpeg({ quality: 85 }),
	imagemin.gifsicle({
		interlaced: false,
		optimizationLevel: 1,
		colors: 256
	}),
	imagemin.jpegtran(),
	imagemin.optipng(),
	imagemin.svgo()
];

gulp.task( 'sass', function() {
	return gulp
		.src( './sass/**/*.scss' )
		.pipe( plumber({ errorHandler: notify.onError( 'Error: <%= error.message %>' ) }) )
		.pipe( sassGlob() )
		.pipe( sourcemaps.init() )
		.pipe( sass({ outputStyle: 'expanded' }) )
		.pipe( postcss([ autoprefixer() ]) )
		.pipe( postcss([ cssdeclsort({ order: 'alphabetically' }) ]) )
		.pipe( mmq() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( './css' ) );
});

gulp.task( 'watch', function() {
	gulp.watch( './sass/**/*.scss', [ 'sass', 'bs-reload' ]);
});

gulp.task( 'browser-sync', function() {
	browserSync.init({
		proxy: 'template.local'
	});
});

gulp.task( 'bs-reload', function() {
	browserSync.reload();
});

gulp.task( 'default', [ 'watch' ], function() {
	gulp.watch( './*.php', [ 'bs-reload' ]);
	gulp.watch( './css/*.css', [ 'bs-reload' ]);
	gulp.watch( './js/*.js', [ 'bs-reload' ]);
});

gulp.task( 'imagemin', function() {
	return gulp
		.src( './img/**/*' )
		.pipe( imagemin( imageminOption ) )
		.pipe( gulp.dest( './img' ) );
});
