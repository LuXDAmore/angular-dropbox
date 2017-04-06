/*eslint no-undef: 0*/
const gulp = require( 'gulp' )
	, eslint = require( 'gulp-eslint' )
	, uglify = require( 'gulp-uglify' )
	, sourcemaps = require( 'gulp-sourcemaps' )
	, babel = require( 'gulp-babel' )
	, concat = require( 'gulp-concat' )
	, browserSync = require( 'browser-sync' ).create()
	, gutil = require( 'gulp-util' )
	, clean = require( 'gulp-clean' )
	, options = {
		directory: {
			app: 'app',
			source: 'src',
			dist: 'dist',
		},
		babel: {
			presets:  [
				'es2015',
			],
		},
		uglify: {
			preserveComments: false,
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
	}
;


// Starting Gulp Tasks
// Requirements && Build
gulp
	.task(
		'clean',
		() => {

			gutil.log( gutil.colors.white.bgMagenta( '[ CLEANING ]' ) );

			return gulp
				.src(
					[
						options.directory.app,
						options.directory.dist,
					],
					{
						read: false,
					}
				)
				.pipe( clean( { force: true } ) )
			;
		}
	)
;
gulp
	.task(
		'copy:requirements',
		() => {

			gutil.log( gutil.colors.red.dim.bold( '[ Copying: Requirements ]' ) );

			return gulp
				.src( options.directory.source + '/dropbox-sdk.min.js' )
				.pipe( gulp.dest( options.directory.dist ) )
			;
		}
	)
;
gulp
	.task(
		'build:production',
		() => {

			gutil.log( gutil.colors.green.bold( '[ Building: Production ]' ) );

			return gulp
				.src( options.directory.source + '/angular-dropbox.js' )
				.pipe( sourcemaps.init() )
				.pipe( babel( options.babel ) )
				.pipe( concat( 'angular-dropbox.min.js' ) )
				.pipe( uglify( options.uglify ) )
				.pipe( eslint() )
				.pipe( eslint.format() )
				.pipe( sourcemaps.write( '.' ) )
				.pipe( gulp.dest( options.directory.dist ) )
			;

		}
	)
;
gulp
	.task(
		'build:dev',
		() => {

			gutil.log( gutil.colors.yellow.bold( '[ Building: Dev ]' ) );

			return gulp
				.src( options.directory.source + '/angular-dropbox.js' )
				.pipe( babel( options.babel ) )
				.pipe( eslint() )
				.pipe( eslint.format() )
				.pipe( concat( 'angular-dropbox.js' ) )
				.pipe( gulp.dest( options.directory.dist ) )
			;

		}
	)
;
gulp
	.task(
		'build:demo',
		() => {

			gutil.log( gutil.colors.red.dim.bold( '[ Building: Demo ]' ) );

			return gulp
				.src( options.directory.source + '/demo.js' )
				.pipe( sourcemaps.init() )
				.pipe( babel( options.babel ) )
				.pipe( eslint() )
				.pipe( eslint.format() )
				.pipe( concat( 'demo.min.js' ) )
				.pipe( uglify( options.uglify ) )
				.pipe( sourcemaps.write( '.' ) )
				.pipe( gulp.dest( options.directory.app ) )
			;

		}
	)
;

// Dev: Watch and Serve
function Reload( done ) {

	gutil.log( gutil.colors.gray( 'File edited: browser reload..' ) );
	browserSync.reload();
	done();

};
gulp.task( 'watch:html', Reload );
gulp.task( 'watch:js', [ 'build:js' ], Reload );
gulp
	.task(
		'serve',
		[
			'build',
		],
		() => {

			browserSync
				.init(
					{
						server: {
							baseDir: './',
						},
					}
				)
			;

			// Watch files
			gulp.watch( options.directory.source + '/*.js', [ 'watch:js' ] );
			gulp.watch( './*.html', [ 'watch:html' ] );

		}
	)
;

// Defaults Tasks
gulp.task( 'watch', [ 'serve' ] );

gulp.task( 'build:js', [ 'build:demo', 'build:dev', 'build:production' ] );
gulp.task( 'build', [ 'copy:requirements', 'build:js' ] );

gulp.task( 'default', [ 'build' ] );

// Exports Gulp in you use 'Gulp Devtools' in Chrome DevTools
module.exports = gulp;
