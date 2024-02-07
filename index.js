/**
 * @copyright Axel Boberg (c) 2024
 * 
 * @typedef {{
 *  loop: Boolean,
 *  isWorker: Boolean,
 *  pixelRatio: Number,
 *  drawBoundingBoxes: Boolean
 * }} TavlaOpts
 */

const View = require('./lib/View')

const EVENTS = [
  'click',
  'mouseup',
  'mousedown',
  'mousemove'
]

class Tavla {
  /**
   * @private
   * @type { TavlaOpts }
   */
  _opts = {}

  /**
   * @param { HTMLCanvasElement | OffscreenCanvas } canvas 
   * @param { TavlaOpts } opts 
   */
  constructor (canvas, opts = {}) {
    this._ctx = canvas.getContext('2d')

    this._canvas = canvas

    this._opts = opts

    /*
    Only setup the resolution if we're
    running with a canvas in the DOM,
    otherwise leave it as it is as
    this is mostly for presentation
    */
    if (!opts.isWorker) {
      this._setupResolution(canvas, opts.pixelRatio)
    }

    this._attachListeners(canvas)

    this._root = new View(0, 0, this._canvas.width, this._canvas.height)
    this._root.constructor._opts = opts

    this.loop = opts.loop || !opts.hasOwnProperty('loop') ? true : false

    this.draw = this.draw.bind(this)

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
  _setupResolution (canvas, pixelRatio = window.devicePixelRatio) {
    const ratio = pixelRatio || 1

    canvas.width = canvas.width * ratio
    canvas.height = canvas.height * ratio

    if (ratio === 1) {
      return
    }

    /*
    Scale the context
    */
    this._ctx.scale(ratio, ratio)

    /*
    Scale down the element to
    compensate for the upped resolution
    */
    canvas.style.transformOrigin = 'top left'
    canvas.style.transform = `scale(${1/ratio}, ${1/ratio})`
  }

  /**
   * Draw a single frame
   */
  draw () {
    this._root._dispatch('willdraw')
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    this._root.draw(this._ctx)
  }

  /**
   * Start the loop
   * to draw frames
   */
  _loop () {
    requestAnimationFrame(() => {
      this.draw()
      if (this.loop) {
        this._loop()
      }
    })
  }

  _attachListeners (canvas) {
    for (let event of EVENTS) {
      canvas.addEventListener(event, e => {
        const bounds = this._canvas.getBoundingClientRect()
        const normalized = {
          ...e,
          x: e.x - bounds.left,
          y: e.y - bounds.top
        }

        this._root._dispatch(event, normalized)
      })
    }
  }
}

const lib = {
  'Tavla': Tavla,
  'SVG': require('./lib/SVG'),
  'View': require('./lib/View'),
  'Rect': require('./lib/Rect'),
  'Text': require('./lib/Text'),
  'Mask': require('./lib/Mask'),
  'Clamp': require('./lib/Clamp'),
  'Frame': require('./lib/Frame'),
  'Image': require('./lib/Image'),
  'EventBus': require('./lib/EventBus'),
  'Draggable': require('./lib/Draggable'),
  'Resizable': require('./lib/Resizable'),
  'RoundRect': require('./lib/RoundRect')
}

if (typeof module !== 'undefined') {
  module.exports = lib
}

if (typeof window !== 'undefined') {
  window.tavla = lib
}
