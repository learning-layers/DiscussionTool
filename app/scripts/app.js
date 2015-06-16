'use strict';

/**
 * @ngdoc overview
 * @name discussionsApp
 * @description
 * # discussionsApp
 *
 * Main module of the application.
 */
angular
  .module('discussionsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'textAngular',
    'ui.bootstrap',
    'ngTagsInput',
    'angular-underscore',
    'checklist-model'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/discussion.html',
        controller: 'DiscussionCtrl'
      })
      .when('/enter/:key/:id', {
        templateUrl: 'views/enter.html',
        controller: 'EnterCtrl'
      })
      .when('/discussion/create', {
        templateUrl: 'views/discussion_create.html',
        controller: 'DiscussionCreateCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
