/**
 * Axel Boberg © 2020
 */

const View = require('./View')

module.exports = class Image extends View {
  constructor (x, y, width, height, src) {
    super(x, y, width, height)

    this._image = new window.Image(width, height)
    this._image.src = src
  }

  set src (src) {
    if (src === this._image.src) return
    this._image.src = src
  }

  draw (ctx) {
    ctx.drawImage(this._image, this.absPos.x, this.absPos.y, this.size.width, this.size.height)
    this.drawChildren(ctx)
  }
}
