'use strict';

/**
 * @ngdoc service
 * @name discussionsApp.helpers
 * @description
 * # helpers
 * Service in the discussionsApp.
 */
angular.module('discussionsApp')
  .service('helpers', function (authService) {
    var getIdFromUri = function(uri) {
      if ( uri.substr(uri.length - 1) === '/' ) {
        uri = uri.substr(0, uri.length - 1);
      }
      var tmp = uri.split('/');
      return tmp[tmp.length - 1];
    };

    var deprecatedRequestTransformation = function(data) {
      data.key = authService.getAuthKey();
      data.user = 'FAKE';
      return angular.toJson(data);
    };

    var getEntityIconClass = function(entity) {
      var icon = 'fa-link';

      if ( entity.type === 'file' || entity.type === 'evernoteResource' ) {
        icon = 'fa-file-o';
      } else if ( entity.type === 'evernoteNote' ) {
        icon = 'fa-file-text-o';
      } else if ( entity.type === 'evernoteNotebook' ) {
        icon = 'fa-archive-o';
      } else if ( entity.type === 'placeholder' ) {
        icon = 'fa-link';
      }

      return 'fa ' + icon;
    };

    return {
      getIdFromUri: getIdFromUri,
      deprecatedRequestTransformation: deprecatedRequestTransformation,
      getEntityIconClass: getEntityIconClass
    };
  });
