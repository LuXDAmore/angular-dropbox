'use strict';

/*
*  Dropbox Wrapper for AngularJs @dropular
*  API @ http://angular-dropbox.github.io/
*
*  Dropular is a service that permit to comunicate with the new Dropbox API.
* Manteined by @studiomado @luxdamore
*
* Dropbox links
* 	- App creation: https://www.dropbox.com/developers/apps/create
*	- Api explorer: https://dropbox.github.io/dropbox-api-v2-explorer/
*
*/

(function (angular) {

	'use strict';

	/**
 * @function dropularConfigProvider
 * @param  {angularProvider} $logProvider { Only used for debugging purpose }
 * @return {object} { Provider && Services Configurator }
 */

	function dropularConfigProvider(DEFAULT_CONFIGURATION) {

		var $log = angular.injector(['ng']).get('$log');

		// Provider
		var provider = this;
		provider.options = {};
		provider.config = setConfig;
		provider.setConfig = setConfig;
		provider.getConfig = getConfig;

		// Default options
		var options = DEFAULT_CONFIGURATION;

		/**
  * @function getConfig
  * @return {object} { Actual configuration }
  */
		function getConfig() {

			if (!provider.options) {

				$log.error('No configuration provided.');
				return false;
			};

			return provider.options;
		};

		/**
  * @function setConfig
  * @param {object} configuration { the configuration for your droprox API }
  * @return {bool} { if everything goes fine }
  */
		function setConfig() {
			var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


			var tokenProvided = true,
			    clientIdProvided = true;

			if (!angular.isObject(configuration) || angular.isUndefined(configuration)) {

				$log.error('Configuration must be an object.');
				return;
			};

			tokenProvided = angular.isDefined(configuration.accessToken) && angular.isString(configuration.accessToken);
			clientIdProvided = angular.isDefined(configuration.clientId) && angular.isString(configuration.clientId);

			if (!clientIdProvided && !tokenProvided) {

				$log.error('accessToken or clienId must be provided and must be a non-empty string.');
				return;
			};

			provider.options = angular.extend(options, configuration);

			if (!!provider.options.debug === true) $log.debug('Configuration changed', provider.options);

			return provider.options;
		};

		/**
  * @function $get
  * @return {angularServices} { The services for this provider }
  */
		provider.$get = function () {

			var service = {};
			service.setConfig = setConfig;
			service.getConfig = getConfig;

			return service;
		};

		return provider;
	};

	dropularConfigProvider.$inject = ['DEFAULT_CONFIGURATION'];

	/**
 * @function dropularFactory
 * @param  {angularProvider} $log { Only used for debugging purpose }
 * @return {angularFactory} { Factory }
 */
	function dropularFactory($log, $location, $dropularConfig) {

		function upload() {};

		/**
  * @function init
  * @param  {type} configuration = {} { Create new Dropbox instance }
  * @return {type} { Dropbox instance }
  */
		function init() {
			var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var callback = arguments[1];


			var options = $dropularConfig.setConfig(configuration),
			    dropbox = void 0;

			if (options) {

				dropbox = new Dropbox(options);

				if (typeof callback === 'function') callback(dropbox);
			};

			return dropbox;
		};

		var factory = {};
		factory.init = init;
		factory.upload = upload;

		return factory;
	};

	dropularFactory.$inject = ['$log', '$location', '$dropularConfig'];

	/**
 * @function dropularAuthButtonDirective
 * @param  {angularProvider} $log { Only used for debugging purpose }
 * @param  {angularProvider} $timeout { Used for Delayed statup }
 * @return {angularDirective} { Directive }
 */
	function dropularAuthButtonDirective($log, $timeout) {

		function link(scope, elem) {

			var delay = scope.delay ? scope.delay : 0,
			    configuration = {
				accessToken: scope.accessToken ? scope.accessToken : '',
				clientId: scope.clientId ? scope.clientId : '',
				debug: scope.debug ? scope.debug : false
			};

			$log.debug(configuration, delay);

			return $timeout(function () {
				return elem;
			}, delay);
		};

		var directive = {};
		directive.restrict = 'A';
		directive.scope = {
			accessToken: "@dropularAccessToken",
			clientId: "@dropularClientId",
			debug: "@dropularDebug",
			delay: "=dropularDelay"
		};
		directive.link = link;

		return directive;
	};

	dropularAuthButtonDirective.$inject = ['$log', '$timeout'];

	// Main Module
	angular.module('dropular', []).provider('$dropularConfig', dropularConfigProvider).factory('Dropular', dropularFactory).directive('dropularAuthButton', dropularAuthButtonDirective).constant('DEFAULT_CONFIGURATION', {
		accessToken: '',
		clientId: undefined,
		selectUser: undefined,
		debug: false
	});
})(angular);