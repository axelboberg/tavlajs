/**
 * Axel Boberg © 2020
 */

module.exports = class EventBus {
  constructor () {
    this._handlers = {}
  }

  /**
   * Dispatch an event
   * 
   * @param { String } event The name of the event to dispatch
   * @param  {...any} args Any arguments to pass to the handlers
   */
  _dispatch (event, ...args) {
    if (!this._handlers[event]) return

    /*
    Keep track of all the handlers
    that should not be removed
    */
    const keep = []

    for (let obj of this._handlers[event]) {
      obj.handler(...args)
      if (!obj.remove) {
        keep.push({ handler: obj.handler, remove: obj.remove })
      }
    }

    /*
    Replace all handlers with
    only the ones to keep, 
    this will remove all
    handlers that should
    be removed
    */
    this._handlers[event] = keep
  }

  /**
   * An internal function for adding
   * a handler to an event together
   * with a flag indicating whether
   * or not the handler should be
   * removed after dispatch
   * 
   * @param { String } event The name of the event to listen for
   * @param { Function } handler A handler
   * @param { Boolean } remove A flag indicating whether the handler should be removed on dispatch
   */
  _on (event, handler, remove = false) {
    if (typeof handler !== 'function') throw new TypeError('Handler must be a function')

    if (!this._handlers[event]) this._handlers[event] = []
    this._handlers[event].push({ handler: handler, remove: remove })
  }

  /**
   * Add a handler for an event
   * 
   * @param { String } event The name of the event to listen for
   * @param { Function } handler A handler
   */
  on (event, handler) {
    this._on(event, handler)
  }

  /**
   * Add a handler to be called only the
   * next time an event is dispatched
   * 
   * @param { String } event The name of the event to listen for
   * @param { Function } handler A handler
   */
  once (event, handler) {
    this._on(event, handler, true)
  }
}