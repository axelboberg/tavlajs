/**
 * Axel Boberg © 2020
 */

const View = require('./View')

const DEFAULT_BORDER_RADIUS_PX = 10

module.exports = class RoundRect extends View {
  /**
   * Define the rounded rectangle's stroke color
   * @type { String }
   */
  strokeColor = 'transparent'

  /**
   * Define the rounded rectangle's stroke width
   * @type { Number }
   */
  strokeWidth = 0

  /**
   * Define the rounded rectangle's fill color
   * @type { String }
   */
  fillColor = 'transparent'

  /**
   * Define the rounded rectangle's
   * border radius in pixels
   * @type { Number }
   *//**
   * Define the rounded rectangle's
   * border radius in pixels for
   * each corner
   * 
   * @example borderRadius = [ topLeft, topRight, bottomRight, bottomLeft ]
   *
   * @type { Number[] }
   */
  set borderRadius (r) {
    let values = r
  
    /*
    If the shorthand is used and a single
    value is passed to the function,
    apply it to all corners
    */
    if (!Array.isArray(values)) {
      values = [r, r, r, r]
    }

    /*
    If an array is passed but without a value for each corner,
    fall back to using the default value
    */
    if (values.length < 4) {
      const newValues = [
        DEFAULT_BORDER_RADIUS_PX,
        DEFAULT_BORDER_RADIUS_PX,
        DEFAULT_BORDER_RADIUS_PX,
        DEFAULT_BORDER_RADIUS_PX
      ]
      for (let i in values) {
        newValues[i] = values[i]
      }
      values = newValues
    }

    this.borderRadiusTL = values[0]
    this.borderRadiusTR = values[1]
    this.borderRadiusBR = values[2]
    this.borderRadiusBL = values[3]
  }

  constructor (x, y, width, height) {
    super(x, y, width, height)
  }

  draw (ctx) {
    const x = this.absPos.x
    const y = this.absPos.y
    const w = this.size.width
    const h = this.size.height

    /*
    Bind the radius-values for each corner
    to be max half of the width of the rect
    */
    const r = []
    const corners = [ 'borderRadiusTL', 'borderRadiusTR', 'borderRadiusBR', 'borderRadiusBL' ]
    for (let i in corners) {
      const corner = this[corners[i]]
      r[i] = corner < w / 2 ? corner : w / 2
    }

    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)

    if (this.fillColor) {
      ctx.fillStyle = this.fillColor
      ctx.fill()
    }

    if (this.strokeColor) {
      ctx.lineWidth = this.strokeWidth
      ctx.strokeStyle = this.strokeColor
      ctx.stroke()
    }

    super.draw(ctx)
  }
}