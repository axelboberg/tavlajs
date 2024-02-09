/**
 * Axel Boberg © 2020
 */

const View = require('./View')

module.exports = class Rect extends View {
  /**
   * Define the rectangle's stroke color
   * @type { String }
   */
  strokeColor = 'transparent'

  /**
   * Define the rectangle's stroke width
   * @type { Number }
   */
  strokeWidth = 0

  /**
   * Define the rectangle's fill color
   * @type { String }
   */
  fillColor = 'transparent'

  constructor (x, y, width, height) {
    super(x, y, width, height)
  }

  draw (ctx) {
    ctx.beginPath()
    ctx.rect(this.absPos.x, this.absPos.y, this.size.width, this.size.height)

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