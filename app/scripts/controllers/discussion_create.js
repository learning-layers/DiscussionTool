'use strict';

/**
 * @ngdoc function
 * @name discussionsApp.controller:DiscussionCreateCtrl
 * @description
 * # DiscussionCreateCtrl
 * Controller of the discussionsApp
 */
angular.module('discussionsApp')
  .controller('DiscussionCreateCtrl', function ($scope, $location, $q, helpers, authService, entityService, tagService, episodeService, discService) {
    var isInsideCircle = function(x, y, circle) {
      var cx = circle.xC,
          cy = circle.yC,
          rx = circle.xR,
          ry = circle.yR,
          inside = Math.pow(((x-cx)/rx),2) + Math.pow(((y-cy)/ry),2);

      return (inside <= 1) ? true : false;
    };

    $scope.discussion = {
      label: '',
      description: '',
      tags: [],
      entities: []
    };
    $scope.tagCloud = [];
    $scope.tagAutocomplete = $q.defer();
    $scope.standalone = [];

    $scope.entity = entityService.get({
      id: authService.getEntityId()
    }, function() {
      // Only deal with circles and entities in case of Episode
      if ( !$scope.isEpisode() ) {
        return;
      }
      $scope.learningEpisodeVerion = episodeService.getVersion({ learnEp: $scope.entity.id }, function() {
        angular.forEach($scope.learningEpisodeVerion.learnEpEntities, function(entity) {
          var contained = false;

          angular.forEach($scope.learningEpisodeVerion.learnEpCircles, function(circle) {
            if ( isInsideCircle(entity.x, entity.y, circle) ) {
              contained = true;
            }
          });

          if ( !contained ) {
            $scope.standalone.push(entity.id);
          }
        });
      });
    });

    $scope.tagFrequencies = tagService.queryFrequencies(function() {
      $scope.maxFrequency = $scope._($scope.tagFrequencies).max(function(frequency) {
        return frequency.frequ;
      }).frequ;
      $scope.minFrequency = $scope._($scope.tagFrequencies).min(function(frequency) {
        return frequency.frequ;
      }).frequ;

      $scope.tagAutocomplete.resolve($scope._($scope.tagFrequencies).map(function(frequency){
        return frequency.label;
      }));
    }, function() {
      $scope.tagAutocomplete.reject([]);
    });

    $scope.isEpisode = function() {
      if ($scope.entity.type === 'learnEp') {
        return true;
      }

      return false;
    };

    $scope.isInsideCircle = function(entity, circle) {
      return isInsideCircle(entity.x, entity.y, circle);
    };

    $scope.isOrphaned = function(entity) {
      if ( $scope.standalone.indexOf(entity.id) !== -1 ) {
        return true;
      }

      return false;
    };

    $scope.getIconClass = function(entity) {
      return helpers.getEntityIconClass(entity);
    };

    $scope.calculateFontSize = function(element) {
      var fontMin = 15,
          fontMax = 20,
          frequ = element.frequ;
      return (frequ === $scope.minFrequency) ? fontMin : (frequ / $scope.maxFrequency) * (fontMax - fontMin) + fontMin;
    };

    $scope.addToTags = function(element, event) {
      if ( !$scope._($scope.discussion.tags).find(function(tag) { return tag.text === element.label; }) ) {
        $scope.discussion.tags.push({
          text: element.label
        });
      }
      // TODO Use directive instead
      angular.element(event.currentTarget).blur();
    };

    $scope.getTagAutocomplete = function() {
      return $scope.tagAutocomplete.promise;
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.doCancel = function() {
      $scope.label = '';
      $scope.description = '';

      $location.path('/');
    };

    $scope.doSubmit = function() {
      // TODO Add protection from double submission
      $scope.$broadcast('dtClearAlerts', {});

      if ( !( $scope.discussion.label && $scope.discussion.description ) ) {
        $scope.$broadcast('dtAddAlert', {
          type: 'danger',
          msg: 'At least one of the required fields is empty!'
        });
        return;
      }

      discService.save({
        label: $scope.discussion.label,
        description: $scope.discussion.description,
        entities: $scope.discussion.entities,
        entity: $scope.entity.id,
        type: 'qa',
        addNewDisc: true
      }, function(response) {
        var promises = [];
        angular.forEach($scope.discussion.tags, function(tag) {
          var promise = tagService.addToEntity({
            tag: tag.text,
            id: helpers.getIdFromUri(response.disc),
          }, {
            space: 'sharedSpace'
          }, function() {
          }).$promise;
          promises.push(promise);
        });
        // Navigate away when all promises resolve
        $q.all(promises).then(function() {
          $location.path('/');
        });
      }, function() {
        $scope.$broadcast('dtAddAlert', {
          type: 'danger',
          msg: 'Creation failed, please try again!'
        });
      });
    };
  });
