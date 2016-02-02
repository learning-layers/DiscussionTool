'use strict';

/**
 * @ngdoc service
 * @name discussionToolApp.evalLogs
 * @description
 * # evalLogs
 * Factory in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .factory('evalLogsService', function ($resource, config, sssRestPrefix) {
    var evalUrl = config.sssRestUrl + sssRestPrefix + '/eval/';
    var resourceInstance = $resource(evalUrl, {}, {
      log: {
        url: evalUrl + 'log',
        method: 'POST',
        isArray: false,
        transformResponse: [angular.fromJson, function(data, headersGetter, status) {
          return ( status === 500 ) ? data : {
            data: data
          };
        }]
      }
    });

    // Public API here
    return {
      logTypes: {
        'OPENBITSANDPIECES' : 'openBitsAndPieces',
        'OPENLIVINGDOCUMENTS' : 'openLivingDocuments',
        'CLOSEDISCUSSIONTOOL' : 'closeDiscussionTool',
        'STARTDISCUSSIONTOOL' : 'startDiscussionTool',
        'WORKSINDISCUSSIONTOOL' : 'worksInDiscussionTool'
      },
      log: resourceInstance.log
    };
  });
