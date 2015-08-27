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
    'ngTouch',
    'textAngular',
    'ui.bootstrap',
    'ngTagsInput',
    'checklist-model',
    'angular-underscore'
  ])
  .config(function ($routeProvider, $httpProvider) {
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
      .when('/discussions/discussion/create', {
        templateUrl: 'views/discussion_create.html',
        controller: 'DiscussionCreateCtrl',
        controllerAs: 'discussionCreate'
      })
      .otherwise({
        redirectTo: '/discussions'
      });

      $httpProvider.interceptors.push('oidcHttpInterceptor');
  });
