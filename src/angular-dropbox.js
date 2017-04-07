/*
*  Dropbox Wrapper for AngularJs @dropular
*  API @ https://luxdamore.github.io/angular-dropbox/
*
*  Dropular is a service that permit to comunicate with the new Dropbox API.
*  Manteined by @studiomado @luxdamore
*
*  Dropbox links
*      - App creation: https://www.dropbox.com/developers/apps/create
*      - Api explorer: https://dropbox.github.io/dropbox-api-v2-explorer/
*
*/

(
	function( angular ) {

		'use strict';

		/**
		* @function dropularConfigProvider
		* @param   {angularConst} DEFAULT_CONFIGURATION { Only used for the default options of the plugin }
		* @return {angularProvider} { Provider }
		*/
		function dropularConfigProvider( DEFAULT_CONFIGURATION ) {

			const $log = angular.injector( [ 'ng' ] ).get( '$log' );

			// Provider
			let provider = this;
			provider.options = {};
			provider.config = setConfig;
			provider.setConfig = setConfig;
			provider.getConfig = getConfig;

			// Default options
			let options = DEFAULT_CONFIGURATION;

			/**
			* @function getConfig
			* @return {object} { Actual configuration }
			*/
			function getConfig() {

				if( ! provider.options ) {

					$log.error( 'No configuration provided.' );
					return false;

				};

				return provider.options;

			};

			/**
			* @function setConfig
			* @param  {object} configuration { The configuration for Dropbox Developer }
			* @return {object} { The configuration actually used }
			*/
			function setConfig( configuration = {} ) {

				let tokenProvided = true
					, clientIdProvided = true
				;

				if( ! angular.isObject( configuration ) || angular.isUndefined( configuration ) ) {

					$log.error( 'Configuration must be an object.' );
					return;

				};

				tokenProvided = angular.isDefined( configuration.accessToken ) && angular.isString( configuration.accessToken );
				clientIdProvided = angular.isDefined( configuration.clientId ) && angular.isString( configuration.clientId );

				if( ! clientIdProvided && ! tokenProvided ) {

					$log.error( 'accessToken or clienId must be provided and must be a non-empty string.' );
					return;

				};

				provider.options = angular.extend( options, configuration );

				if( !! provider.options.debug === true )
					$log.debug( 'Configuration changed', provider.options );

				return provider.options;

			};

			/**
			* @function $get
			* @return {angularService} { The services for this Provider }
			*/
			provider.$get = () => {

				let service = {};
				service.setConfig = setConfig;
				service.getConfig = getConfig;

				return service;

			};

			return provider;

		};

		dropularConfigProvider
			.$inject = [
				'DEFAULT_CONFIGURATION',
			]
		;


		/**
		* @function dropularFactory
		* @param  {angularService} $log { Only used for debugging purpose }
		* @param  {dropularConfig} $location { Configuration of the Plugin }
		* @return {angularFactory} { Factory }
		*/
		function dropularFactory(
			$log,
			$dropularConfig
		) {

			function upload() {};

			/**
			* @function init
			* @param  {object} configuration { The configuration for Dropbox Developer }
			* @return {function} callback { Callback function }
			*/
			function init( configuration = {}, callback ) {

				let options = $dropularConfig.setConfig( configuration )
					, dropbox
				;

				if( options ) {

					dropbox = new Dropbox( options );

					if( typeof callback === 'function' )
						callback( dropbox );

				};

				return dropbox;

			};

			let factory = {};
			factory.init = init;
			factory.upload = upload;

			return factory;

		};

		dropularFactory
			.$inject = [
				'$log',
				'$dropularConfig'
			]
		;


		/**
		* @function dropularAuthButtonDirective
		* @param  {angularProvider} $log { Only used for debugging purpose }
		* @param  {angularProvider} $timeout { Used for Delayed statup }
		* @return {angularDirective} { Directive }
		*/
		function dropularAuthButtonDirective(
			$log,
			$timeout
		) {

			function link( scope, elem ) {

				let delay = scope.delay ? scope.delay : 0
					, configuration = {
						accessToken: scope.accessToken ? scope.accessToken : '',
						clientId: scope.clientId ? scope.clientId : '',
						debug: scope.debug ? scope.debug : false,
					}
				;

				$log.debug( configuration, delay );

				return $timeout( () => elem, delay );

			};

			let directive = {};
			directive.restrict = 'A';
			directive.scope = {
				accessToken: "@dropularAccessToken",
				clientId: "@dropularClientId",
				debug: "@dropularDebug",
				delay: "=dropularDelay",
			};
			directive.link = link;

			return directive;

		};

		dropularAuthButtonDirective
			.$inject = [
				'$log',
				'$timeout',
			]
		;


		// Main Module
		angular
			.module( 'dropular', [] )
			.provider( '$dropularConfig', dropularConfigProvider )
			.factory( 'Dropular', dropularFactory )
			.directive( 'dropularAuthButton', dropularAuthButtonDirective )
			.constant(
				'DEFAULT_CONFIGURATION',
				{
					accessToken: '',
					clientId: undefined,
					selectUser: undefined,
					debug: false,
				}
			)
		;

	}
)( angular );
