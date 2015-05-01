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

  /*jshint undef:false */
  /*eslint-disable*/
  function socketConfig(_, socketFactory, Auth) {
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
          cb(event, item, array);
        });
      },

      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  }
  /*jshint undef:true */
  /*eslint-enable*/
}());
