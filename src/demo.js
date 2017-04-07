(
	function( angular ) {

		'use strict';

		// Angular App Start
		let app = angular
			.module(
				'dropularDemo',
				[
					'dropular',
				]
			)
		;


		// Configuration Phase
		app.config( Configuration );

		function Configuration( $logProvider ) {

			// Just for Debug purpose
			$logProvider.debugEnabled( true );

		};

		Configuration.$inject = [ '$logProvider' ];

		// Start
		// Run, run, run
		app.run( Run );

		function Run( $log ) {

			$log.info( '%c Dropular Demo app, ready to rock ✌️', 'color:#f1c40f' );

		};

		Run
			.$inject = [
				'$log',
			]
		;


		// Controllers
		// Main
		app.controller( 'Main', MainController );

		function MainController(
			$log,
			Dropular
		) {

			// Settings of this application
			const configuration = {
				accessToken: 'G9RJXnXuGx0AAAAAAAAG8TaPckro4CeOor-uqHS-93u2fk581BjQ8th6eABr406D',
				clientId: 'iquilqx7rzco1m8',
				debug: true,
			};

			let vm = angular.extend(
				this,
				{
					dropular: null,
				}
			);

			$log.info( '%c MainController', 'color:#f1c40f' );

			// Init Dropangular
			vm.dropular = Dropular.init( configuration );
			vm.dropular
				.filesListFolder( { path: '' } )
				.then( response => $log.info( response.entries ) )
			;

		};

		MainController
			.$inject = [
				'$log',
				'Dropular',
			]
		;

	}
)( angular );
