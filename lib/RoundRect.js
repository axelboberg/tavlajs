/**
 * Axel Boberg © 2020
 */

const Rect = require('./Rect')

module.exports = class RoundRect extends Rect {
  constructor (x, y, width, height) {
    super(x, y, width, height)
    this.borderRadius = 1
  }

  set borderRadius (r) {
    this.borderRadiusTL = r
    this.borderRadiusTR = r
    this.borderRadiusBL = r
    this.borderRadiusBR = r
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

    /* Start at the beginning of the first curve */
    ctx.moveTo(x, y + r[0])

    /* Top left */
    ctx.arcTo(x, y, x + r[0], y, r[0])
    ctx.lineTo(x + w - r[1], y)

    /* Top right */
    ctx.arcTo(x + w, y, x + w, y + r[1], r[1])
    ctx.lineTo(x + w, y + h - r[2])

    /* Bottom right */
    ctx.arcTo(x + w, y + h, x + w - r[2], y + h, r[2])
    ctx.lineTo(x + r[3], y + h)

    /* Bottom left */
    ctx.arcTo(x, y + h, x, y + r[3], r[3])
    ctx.lineTo(x, y + r[0])

    ctx.fillStyle = this.fillColor
    ctx.fill()

    ctx.lineWidth = this.strokeWidth
    ctx.strokeStyle = this.strokeColor
    ctx.stroke()

    this.drawChildren(ctx)
  }
}