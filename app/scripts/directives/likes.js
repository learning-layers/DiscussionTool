'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:likes
 * @description
 * # likes
 */
angular.module('discussionToolApp')
  .directive('likes', function ($rootScope, likesService, discussionsService) {
    return {
      templateUrl: 'views/templates/likes.html',
      restrict: 'E',
      scope: {
        model: '=model',
        discussion: '=discussion'
      },
      link: function postLink(scope) {
        function addLikeDislike(event, value) {
          var setEntries = ( scope.model.type === 'qa') ? false : true;
          var discussionId = setEntries ? scope.discussion.id : scope.model.id;

          angular.element(event.currentTarget).blur();
          likesService.add({
            entity: encodeURIComponent(scope.model.id),
            value: encodeURIComponent(value)
          }, {}, function () {
            discussionsService.queryFilteredDiscussion({
              disc: encodeURIComponent(discussionId)
            }, {
              setLikes: true,
              setEntries: setEntries,
            }, function (discussion) {
              if ( scope.model.type === 'qa') {
                scope.model.likes = discussion.likes;
              } else {
                var entry = $rootScope._(discussion.entries).find(function (entry) { return entry.id === scope.model.id; });
                scope.model.likes = entry.likes;
              }
            });
          });
        }

        scope.addLike = function (event) {
          addLikeDislike(event, 1);
        };

        scope.addDislike = function (event) {
          addLikeDislike(event, -1);
        };
      }
    };
  });
