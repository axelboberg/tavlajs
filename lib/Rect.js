/**
 * Axel Boberg © 2020
 */

const View = require('./View')

module.exports = class Rect extends View {
  constructor (x, y, width, height) {
    super(x, y, width, height)

    this.strokeColor = 'transparent'
    this.strokeWidth = 0

    this.fillColor = 'transparent'
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