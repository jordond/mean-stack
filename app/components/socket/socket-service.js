(function () {
  'use strict';

  /**
   * @ngdoc factory
   * @name components.service:Socket
   *
   * @description
   *
   */
  angular
    .module('components')
    .service('Socket', Socket);

  Socket.$injector = ['$q', 'io', '_', 'socketFactory', 'Auth', 'logger'];

  function Socket($q, io, _, socketFactory, Auth, logger) {
    var self = this
      , ioSocket
      , registeredModels = [];

    ioSocket = createIoSocket();

    /**
     * Public Members
     */

    self.socket = createSocket(ioSocket);
    self.syncUpdates = syncUpdates;
    self.unsyncUpdates = unsyncUpdates;
    self.unsyncAll = unsyncAll;
    self.resetSocket = resetSocket;

    /**
     * Public Methods
     */

    function syncUpdates(modelName, array) {
      registeredModels.push({
        name: modelName,
        array: array
      });
      register(modelName, array)
        .then(function (response) {
          return $q.when(response);
        });
    }

    function unsyncUpdates(modelName) {
      var index = _.findIndex(registeredModels, {name: modelName});
      if (index > -1) {
        registeredModels.splice(index, 1);
        unRegister(modelName);
      }
    }

    function syncAll() {
      _.each(registeredModels, function (model) {
        register(model.name, model.array);
      });
      return $q.when(registeredModels);
    }

    function unsyncAll() {
      _.each(registeredModels, function (model) {
        unRegister(model.name);
      });
      return $q.when(registeredModels);
    }

    function resetSocket() {
      unsyncAll()
        .then(function () {
          var newIoSocket = createIoSocket();
          self.socket = createSocket(newIoSocket);
          syncAll();
        });
    }

    /**
     * Private functions
     */

    function createIoSocket() {
      var socket = io('', {
        query: 'token=' + Auth.getToken(),
        path: '/socket.io-client'
      });
      return socket;
    }

    function createSocket(sock) {
      var socket = socketFactory({
        ioSocket: sock
      });
      return socket;
    }

    function register(modelName, array) {
      self.socket.on(modelName + ':save', function (item) {
        var oldItem = _.find(array, {_id: item._id})
          , index = array.indexOf(oldItem)
          , action = 'created';

        if (oldItem) {
          array.splice(index, 1, item);
          action = 'updated';
        } else {
          array.push(item);
        }

        return $q.when(createResponse(action, item, array));
      });

      self.socket.on(modelName + ':remove', function (item) {
        var action = 'deleted';

        _.remove(array, {_id: item._id});
        logger.log('Deleted item: ' + item._id);

        return $q.when(createResponse(action, item, array));
      });
    }

    function unRegister(modelName) {
      self.socket.removeAllListeners(modelName + ':save');
      self.socket.removeAllListeners(modelName + ':remove');
    }

    function createResponse(action, item, array) {
      var response = {
        action: action,
        item: item,
        array: array
      };
      return response;
    }
  }
}());
