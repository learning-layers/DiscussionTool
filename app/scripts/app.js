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
      .when('/discussions/:target/list', {
        templateUrl: 'views/discussions.html',
        controller: 'DiscussionsCtrl',
        controllerAs: 'discussions'
      })
      .when('/auth/:target', {
        templateUrl: 'views/auth.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })
      .when('/discussions/:target/discussion/create', {
        templateUrl: 'views/discussion_create.html',
        controller: 'DiscussionCreateCtrl',
        controllerAs: 'discussionCreate'
      })
      .when('/discussions/:target/discussion/:discussion', {
        templateUrl: 'views/discussion_view.html',
        controller: 'DiscussionViewCtrl',
        controllerAs: 'discussionView'
      })
      .when('/loggedout/:target?', {
        templateUrl: 'views/loggedout.html',
        controller: 'LoggedoutCtrl',
        controllerAs: 'loggedout'
      })
      .otherwise({
        redirectTo: '/'
      });

      $httpProvider.interceptors.push('oidcHttpInterceptor');
  });
