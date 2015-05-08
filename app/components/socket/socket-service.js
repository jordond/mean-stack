(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name components.underscore-factory:
   *
   * @description
   *
   */
  angular
    .module('components')
    .service('socket', socketConfig);

  function socketConfig(_, socketFactory, Auth, logger, io) {
    var ioSocket = io('', {
      query: 'token=' + Auth.getToken(),
      path: '/socket.io-client'
    })
    , socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id})
            , index = array.indexOf(oldItem)
            , event = 'created';

          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          console.log('deleted');
          cb(event, item, array);
        });

        socket.on('error', function (error) {
          if (error.type === 'UnauthorizedError' || error.code === 'invalid_token') {
            logger.error('socketio token error', error);
          }
        });
      },

      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  }
}());
