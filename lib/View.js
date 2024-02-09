const EventBus = require('./EventBus')
const Frame = require('./Frame')

function makeID () {
  const timestr = String(Date.now())
  const shortTimestr = timestr.slice(timestr.length - 5, timestr.length)

  return `${shortTimestr}${Math.round(Math.random() * 100000) + 100000}`
}

module.exports = class View extends EventBus {

  /**
   * The options are only meant for internal use.
   * They are set from the outside Tavla class.
   */
  static set _opts (opts) {
    this.__opts = opts
  }

  static get _opts () {
    return this.__opts || {}
  }

  /**
   * Whether or not this view
   * should clip it's children
   * 
   * @type { Boolean }
   */
  clipping = false

  opacity = 1

  constructor (x = 0, y = 0, width = 0, height = 0) {
    super()

    this.id = makeID()
    this.frame = new Frame(x, y, width, height)

    this._parent = undefined
    this.children = {}
  }

  /**
   * A convenience getter for this
   * view's frame's position
   */
  get pos () {
    return this.frame.pos
  }

  /**
   * A convenience getter for this
   * view's frame's size
   */
  get size () {
    return this.frame.size
  }

  /**
   * Get this view's parent view or
   * undefined if no parent exists
   * @type { View | undefined }
   */
  get parent () {
    return this._parent
  }

  /**
   * Get the root-view
   * @type { View }
   */
  get root () {
    if (!this._parent) return this
    return this._parent.root
  }

  /**
   * Get this view's
   * accumulated opacity
   * @type { Number }
   */
  get accumulatedOpacity () {
    if (this.parent) {
      return this.parent.accumulatedOpacity * this.opacity
    }
    return this.opacity
  }

  /**
   * Get the absolute position
   * of this view
   */
  get absPos () {
    if (!this.parent) return this.pos

    const parent = this.parent.absPos
    return {
      x: this.pos.x + parent.x,
      y: this.pos.y + parent.y
    }
  }

  setAbsPos (x, y) {
    this.pos.x += x - this.absPos.x
    this.pos.y += y - this.absPos.y
  }

  /**
   * Remove this frame from its
   * parent frame
   */
  removeFromParent () {
    if (!this.parent) return
    this.parent.removeChild(this)
    this._parent = undefined
  }

  /**
   * Add a frame as a child to this frame
   * @param { View } view The frame to adopt
   */
  addChild (view) {
    if (this.children[view.id]) return
    this.children[view.id] = view

    /*
    Set the child's parent property
    */
    view.removeFromParent()
    view._parent = this

    /*
    Dispatch an event so that
    the view knows it's adopted
    */
    view._dispatch('adopted', { parent: this })
  }
  
  /**
   * Remove a view as a child from this view
   * @param { View } view The view to remove
   */
  removeChild (view) {
    if (!this.children[view.id]) return
    delete this.children[view.id]
  }

  /**
   * Get a flattened array of all views
   * that are in this view's hierarchy
   * @returns { Array<View> }
   */
  getDescendants () {
    const children = Object.values(this.children)

    /*
    Recursively get all children from
    this view's children and reduce
    to a flay array
    */
    const grandChildren = children
      .map(child => child.getDescendants())
      .reduce((prev, cur) => {
        return (prev || []).concat(cur)
      }, [])

    return [this, ...grandChildren]
  }

  /**
   * Draw the view
   * 
   * Make sure to call super.draw()
   * if this function is overridden
   * 
   * @param { CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D } ctx 
   */
  draw (ctx) {
    /*
    If it's supposed to be clipping,
    save the context's state and create
    a clipping path of the previous path
    (which should be the view in question)
    */
    if (this.clipping) {
      ctx.save()
      ctx.clip()
    }

    this.drawChildren(ctx)

    if (this.clipping) {
      ctx.restore()
    }
  }

  /**
   * Called before this view's draw function
   * Can be used for setup of the context
   * 
   * Make sure to call super.willDraw()
   * if this function is overridden
   * 
   * @param { CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D } ctx 
   */
  willDraw (ctx) {
    ctx.globalAlpha = this.accumulatedOpacity
  }

  /**
   * Draw all of this
   * view's children
   * @param { CanvasRenderingContext2D } ctx 
   */
  drawChildren (ctx) {
    const children = Object.values(this.children)
    for (let child of children) {
      child.willDraw(ctx)
      child.draw(ctx)

      /*
      Draw the child's wireframe
      if declared by the options
      */
      if (View._opts.drawBoundingBoxes) {
        child.drawBoundingBox(ctx)
      }
    }
  }

  drawBoundingBox (ctx) {
    ctx.lineWidth = 1
    ctx.strokeStyle = 'red'

    ctx.strokeRect(this.absPos.x, this.absPos.y, this.size.width, this.size.height)

    /*
    Reset context
    */
    ctx.lineWidth = 0
    ctx.strokeStyle = 'transparent'
  }

  _dispatch(event, ...args) {
    /*
    Check if the first argument
    contains coordinates
    */
    if (
      args[0] &&
      typeof args[0].x === 'number' &&
      typeof args[0].y === 'number'
    ){

      /*
      Calculate the relative coordinates
      in the current frame
      */
      const x = args[0].x - this.pos.x,
            y = args[0].y - this.pos.y

      /*
      Keep track of the original coordinates
      since x and y will be overridden
      */
      if (!args[0].hasOwnProperty('originalX') && !args[0].hasOwnProperty('originalY')) {
        args[0].originalX = args[0].x
        args[0].originalY = args[0].y
      }

      /*
      Set the relative coordinates
      to the event object in order to
      pass them down to the children
      */
      args[0] = { ...args[0], x: x, y: y }
      
      /*
      Find the topmost
      child at x and y
      */
      const child = this.findChild(x, y)

      /*
      If a child was found, dispatch it
      */
      if (child) {
        /*
        Provide a second argument
        indicating that a child
        was dispatched
        */
        args.push(true)
        child._dispatch(event, args[0])
      }
    }

    /*
    If no child collided of the first
    argument didn't contain coordinates,
    trigger this view's bus
    */
    super._dispatch(event, ...args)
  }

  /**
   * Find a child at the
   * specified coordinate
   * @param { Number } x 
   * @param { Number } y 
   * @returns { View? }
   */
  findChild (x, y) {
    const children = Object.values(this.children)

    for (let i = children.length - 1; i >= 0; i--) {
      if (children[i].contains(x, y)) {
        return children[i]
      }
    }
  }

  findChildren(x, y) {
    const children = Object.values(this.children)
    return children.filter(child => child.contains(x, y))
  }

  /**
   * Find the topmost descendant-view
   * at the specified coordinate
   * @param { Number } x 
   * @param { Number } y 
   * @returns { View }
   */
  findDescendant (x, y) {
    const child = this.findChild(x, y)
    if (child) return child.findDescendant(x, y)
    return this
  }

  findDescendants (x, y) {
    return this.findChildren(x, y)
      .map(child => {
        const relX = x - child.pos.x,
              relY = y - child.pos.y

        return [ child, ...child.findDescendants(relX, relY) ]
      })
      .reduce((prev, cur) => (prev || []).concat(cur), [])
  }

  /**
   * Check if this view
   * contains a coordinate
   * @param { Number } x 
   * @param { Number } y 
   * @returns { Boolean }
   */
  contains (x, y) {
    if (this.pos.x > x || this.pos.x + this.size.width < x) return false
    if (this.pos.y > y || this.pos.y + this.size.height < y) return false
    return true
  }
}