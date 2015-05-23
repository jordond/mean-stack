(function () {
  'use strict';

  /**
   * @ngdoc factory
   * @name components.service:Socket
   * @author Jordon de Hoog
   *
   * @description
   * Handles all of the socket communication. Allows you to create a
   * secure socket object.  Handles the syncing and destruction of
   * socket model objects.
   *
   */
  angular
    .module('components')
    .service('Socket', Socket);

  Socket.$injector = ['$q', 'io', '_', 'socketFactory', 'Token', 'logger'];

  function Socket($q, io, _, socketFactory, Token, logger) {
    var TAG = 'Socket'
      , self = this
      , registeredModels = [];

    /**
     * Public Members
     */

    self.socket        = undefined;
    self.init          = init;
    self.syncUpdates   = syncUpdates;
    self.unsyncUpdates = unsyncUpdates;
    self.resetSocket   = resetSocket;
    self.destroy       = destroy;

    /**
     * Public Methods
     */

    function init() {
      var ioSocket = createIoSocket();
      self.socket = createSocket(ioSocket);
      log('Connected');
      return $q.when(self.socket);
    }

    /**
     * @public syncUpdates
     * Sync the model with the backend. First add model to
     * the global array, then call the register function.
     * @param  {String} modelName Descriptive name of model
     * @param  {Array} array      List of all the items in the model
     * @return {Promise} For keeping track of notify
     */
    function syncUpdates(modelName, array) {
      var model = {
        name: modelName,
        array: array,
        deferred: $q.defer()
      };

      if (angular.isUndefined(self.socket)) {
        logger.error('Something went wrong with socket connection');
        throw self.socket;
      }

      registeredModels.push(model);
      register(model)
        .then(null, null, function (response) {
          return model.deferred.notify(response);
        });

      return model.deferred.promise;
    }

    /**
     * @public unsyncUpdates
     * Unsync the model with the backend. Find the index of the model
     * from the global list. If it exists then remove it from the list
     * then unregister the model from the socket.
     * @param  {String} modelName Name of the model to be unsynced
     */
    function unsyncUpdates(modelName) {
      var index = _.findIndex(registeredModels, {name: modelName})
        , removed = {};
      if (index > -1) {
        removed = registeredModels.splice(index, 1)[0];
        unRegister(removed);
      }
    }

    /**
     * @public resetSocket
     * Reset the socket connection to the server, helpful if the
     * authorization token is expired, and the socket needs a new
     * connection. First unsync all the models, then create the socket, then
     * resync all the models to the socket.
     */
    function resetSocket() {
      unsyncAll()
        .then(function () {
          var newIoSocket = createIoSocket();
          self.socket = createSocket(newIoSocket);
          syncAll();
        });
    }

    function destroy() {
      unsyncAll()
        .then(function () {
          registeredModels = [];
          self.socket = undefined;
          log('Disconnected');
        });
    }

    /**
     * Private functions
     */

    /**
     * @private createIoSocket
     * Create the socket object for use with the SocketFactory module.
     * Gets the auth token from the currently logged in use.
     * @return {Object} Socket object
     */
    function createIoSocket() {
      var ioSocket = io('', {
        query: 'token=' + Token.get(),
        path: '/socket.io-client'
      });
      return ioSocket;
    }

    /**
     * @private createSocket
     * Using the SocketFactory, create the actual socket connection object.
     * @param  {Object} ioSocket The io() socket object
     * @return {Object}      SocketFactory socket object
     */
    function createSocket(ioSocket) {
      var socket = socketFactory({
        ioSocket: ioSocket
      });
      return socket;
    }

    /**
     * @private register
     * Registers the model with the socket object.  It registers the events
     * that the socket might emit, like save, and remove.
     * @param  {Object} model Contains the name, and array
     * @return {Promise}      Keeping track of actions
     */
    function register(model) {
      var deferred = $q.defer();
      self.socket.on(model.name + ':save', save);
      self.socket.on(model.name + ':remove', remove);
      log('registered ' + model.name);

      return deferred.promise;

      /**
       * @private save
       * Method is fired when the model is saved. First check to see
       * if an object was created or updated.  Update the item in the array
       * or add the item to the array.  Then return a promise of its status.
       * @param  {Object} item Model item that was saved
       */
      function save(item) {
        var oldItem = _.find(model.array, {_id: item._id})
          , index = model.array.indexOf(oldItem)
          , action = 'created';

        if (oldItem) {
          model.array.splice(index, 1, item);
          action = 'updated';
        } else {
          model.array.push(item);
        }
        log(model.name + ': ' + item._id + ' was ' + action);
        deferred.notify(createResponse(action, item, model.array));
      }

      /**
       * @private remove
       * Remove the item from the array when it is deleted on the server.
       * Three way binding is great.
       * @param  {Object} item Deleted item
       */
      function remove(item) {
        var action = 'deleted';
        _.remove(model.array, {_id: item._id});
        log(model.name + ': ' + item._id + ' was deleted');
        deferred.notify(createResponse(action, item, model.array));
      }
    }

    /**
     * @private unRegister
     * Removes all the listeners for the model, as well as resolve the
     * models promise.
     * @param  {Object} model Contains name, promise, and array
     */
    function unRegister(model) {
      model.deferred.resolve();
      self.socket.removeAllListeners(model.name + ':save');
      self.socket.removeAllListeners(model.name + ':remove');
      log('unregistered ' + model.name);
    }

    /**
     * @private unsyncAll
     * Using the list of all active sync'd models, unregister them all
     * from the socket. DOES NOT remove the models from the list, just
     * the socket.
     * @return {Promise} Array of all the registered models
     */
    function unsyncAll() {
      _.each(registeredModels, function (model) {
        unRegister(model);
      });
      return $q.when(registeredModels);
    }

    /**
     * @private SyncAll
     * Using the list of all active sync'd models, register them all
     * from the socket.
     * @return {Promise} Array of all the registered models
     */
    function syncAll() {
      _.each(registeredModels, function (model) {
        register(model);
      });
      return $q.when(registeredModels);
    }

    /**
     * @private createResponse
     * Create a response object for the socket event listeners.
     * @param  {String} action Ireate, update, or remove
     * @param  {Object} item   Item that was changed
     * @param  {Array}  array  List of items
     * @return {Object}        Response object
     */
    function createResponse(action, item, array) {
      var response = {
        action: action,
        item: item,
        array: array
      };
      return response;
    }

    function log(message) {
      logger.log(TAG, message);
    }
  }
}());
