/**
 * Axel Boberg © 2020
 */

const View = require('./lib/View')

const EVENTS = [
  'click',
  'mouseup',
  'mousedown',
  'mousemove'
]

class Tavla {
  constructor (el, opts = {}) {
    this._ctx = el.getContext('2d')

    this._el = el
    this._setupResolution(el)
    this._attachListeners(el)

    this._root = new View(0, 0, this._el.width, this._el.height)
    this._root.constructor._opts = opts

    /*
    Start drawing frames
    */
    this._loop()
  }

  get root () {
    return this._root
  }

  /**
   * Setup the canvas by scaling it
   * using the device's pixel ratio
   */
  _setupResolution (el) {
    const ratio = window.devicePixelRatio || 1

    el.width = el.width * ratio
    el.height = el.height * ratio

    /*
    Scale the context
    */
    this._ctx.scale(ratio, ratio)

    /*
    Scale down the element to
    compensate for the upped resolution
    */
    el.style.transformOrigin = 'top left'
    el.style.transform = `scale(${1/ratio}, ${1/ratio})`
  }

  _loop () {
    window.requestAnimationFrame(() => {
      this._ctx.clearRect(0, 0, this._el.width, this._el.height)
      this._root.draw(this._ctx)
      this._loop()
    })
  }

  _attachListeners (el) {
    for (let event of EVENTS) {
      el.addEventListener(event, e => this._root._dispatch(event, e))
    }
  }
}

module.exports = {
  'Tavla': Tavla,
  'SVG': require('./lib/SVG'),
  'View': require('./lib/View'),
  'Rect': require('./lib/Rect'),
  'Mask': require('./lib/Mask'),
  'Clamp': require('./lib/Clamp'),
  'Frame': require('./lib/Frame'),
  'Image': require('./lib/Image'),
  'EventBus': require('./lib/EventBus'),
  'Draggable': require('./lib/Draggable'),
  'RoundRect': require('./lib/RoundRect')
}