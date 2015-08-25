'use strict';

/**
 * @ngdoc overview
 * @name discussionToolApp
 * @description
 * # discussionToolApp
 *
 * Main module of the application.
 */
angular
  .module('discussionToolApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/discussions', {
        templateUrl: 'views/discussions.html',
        controller: 'DiscussionsCtrl',
        controllerAs: 'discussions'
      })
      .when('/auth', {
        templateUrl: 'views/auth.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })
      .otherwise({
        redirectTo: '/discussions'
      });
  });
