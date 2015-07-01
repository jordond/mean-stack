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

  Socket.$injector = ['$q', '$cookieStore', 'io', '_', 'socketFactory', 'AuthEvent', 'logger'];

  function Socket($q, $cookieStore, io, _, socketFactory, AuthEvent, logger) {
    var TAG = 'Socket'
      , self = this
      , ready
      , registeredModels = [];

    /**
     * Public Members
     */

    self.wrapper       = undefined;
    self.init          = init;
    self.syncUpdates   = syncUpdates;
    self.unsyncUpdates = unsyncUpdates;
    self.emit          = emit;
    self.on            = registerEvent;
    self.reset         = resetSocket;
    self.destroy       = destroy;

    /**
     * Listeners
     */
    AuthEvent.onAuth(init);
    AuthEvent.onRefresh(resetSocket);
    AuthEvent.onDeauth(destroy);

    /**
     * Public Methods
     */

    /**
     * @public
     * Initialize the socket object
     * @return {Promise} socket object
     */
    function init() {
      ready = connect();
      return $q.when(self.wrapper);
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
      var model
        , existing;

      existing = _.findIndex(registeredModels, function(item) {
        return item.name == modelName;
      });

      if (existing !== -1) {
        return $q.reject();
      }

      if (angular.isUndefined(self.wrapper)) {
        logger.swalError(TAG, 'Something went wrong with socket connection, live updating will not work.');
        return $q.reject();
      }

      model = {
        name: modelName,
        array: array,
        deferred: $q.defer()
      };

      ready.then(function () {
        registeredModels.push(model);
        register(model)
          .then(null, null, function (response) {
            return model.deferred.notify(response);
          });
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
     * Emit data to the socket
     * @param  {String} event Name of the event
     * @param  {Object} data  info in call
     * @return {promise}      Status of emit
     */
    function emit(event, data) {
      var deferred = $q.defer();
      if (isConnected) {
        ready.then(function () {
          self.wrapper.emit(event, data, function (response) {
            deferred.resolve(response);
          });
        });
        return deferred.promise;
      }
      return deferred.reject();
    }

    function registerEvent(event) {
      var deferred = $q.defer();
      if (ready) {
        ready.then(function () {
          self.wrapper.on(event, function (data) {
            deferred.resolve(data);
          });
        });
        return deferred.promise;
      }
      return deferred.reject();
    }

    /**
     * @public resetSocket
     * Reset the socket connection to the server, helpful if the
     * authorization token is expired, and the socket needs a new
     * connection. First unsync all the models, then create the socket, then
     * resync all the models to the socket.
     */
    function resetSocket() {
      if (isConnected()) {
        unsyncAll()
          .then(function () {
            self.wrapper.disconnect();
            connect().then(syncAll);
          });
      } else {
        init();
      }
    }

    /**
     * @public
     * Unsync all of the models in the array, clear the array,
     * and then destroy the socket object.
     */
    function destroy() {
      if (angular.isUndefined(self.wrapper)) {
        return;
      }
      unsyncAll()
        .then(function () {
          registeredModels = [];
          self.wrapper.disconnect();
          self.wrapper = undefined;
          ready = undefined;
        });
    }

    /**
     * Private functions
     */

    /**
     * Check whether or not the socket is connected
     * @return {Boolean} connection status
     */
    function isConnected() {
      if (angular.isDefined(self.wrapper)) {
        return self.wrapper.connected();
      }
      return false;
    }

    /**
     * @private connect
     * Create the socket wrapper object, and then connect to the socket.
     * @return {Promise} resolve when connected
     */
    function connect() {
      var token = $cookieStore.get('token')
        , path = '/socket.io-client'
        , socket
        , deferred = $q.defer();

      socket = io.connect('', {
        query: 'token=' + token,
        forceNew: true,
        path: path
      });

      self.wrapper = socketFactory({ioSocket: socket});

      socket.on('connect', function () {
        self.wrapper.socket(socket);
        registerSocketEvents(socket);
        log('Connected');
        deferred.resolve();
      });
      return deferred.promise;
    }

    /**
     * Register all the events for the socket connection
     * @param {Object} socket main socket object
     */
    function registerSocketEvents(socket) {
      socket.on('error', function (error) {
        logger.warning('Failed to connect to Socket server', error, 'SocketIO');
      });
      socket.on('disconnect', function () {
        log('Disonnected');
      });
      socket.on('reconnect', function () {
        logger.info('Reconnected to Socket server', '', 'SocketIO');
      });
      socket.on('reconnect_failed', function (error) {
        logger.error('Failed to reconnect to server, try logging in', error, 'SocketIO');
      });
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
      self.wrapper.on(model.name + ':save', save);
      self.wrapper.on(model.name + ':remove', remove);
      log('registered ' + '[' + model.name + ']');

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
        log('[' + model.name + '] ' + item._id + ' was ' + action);
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
        log('[' + model.name + '] ' + item._id + ' was deleted');
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
      self.wrapper.removeAllListeners(model.name + ':save');
      self.wrapper.removeAllListeners(model.name + ':remove');
      log('unregistered [' + model.name + ']');
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

    /**
     * @private
     * Handle the interaction with the logger service
     * @param  {String} message Description of event
     */
    function log(message) {
      logger.log(TAG, message);
    }
  }
}());
