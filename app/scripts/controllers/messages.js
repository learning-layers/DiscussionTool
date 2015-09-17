'use strict';

/**
 * @ngdoc function
 * @name discussionToolApp.controller:MessagesCtrl
 * @description
 * # MessagesCtrl
 * Controller of the discussionToolApp
 */
angular.module('discussionToolApp')
  .controller('MessagesCtrl', function ($scope, messagesService) {
    $scope.dismissTimeout = messagesService.getDismissTimeout();

    $scope.getMessages = function () {
      return messagesService.getMessages();
    };

    $scope.closeMessage = function (index) {
      return messagesService.removeMessage(index);
    };
  });
