/**
 * Axel Boberg © 2020
 */

const View = require('./View')

module.exports = class Image extends View {
  constructor (x, y, width, height, src) {
    super(x, y, width, height)

    this._image = new Image(width, height)
    this._image.src = src
  }

  set src (src) {
    if (src === this._image.src) return
    this._image.src = src
  }

  draw (ctx) {
    /*
    Open a new path if this view is
    supposed to clip its children
    */
    if (this.clipping) {
      ctx.beginPath()
      ctx.rect(this._image, this.absPos.x, this.absPos.y, this.size.width, this.size.height)
    }

    ctx.drawImage(this._image, this.absPos.x, this.absPos.y, this.size.width, this.size.height)
    super.draw(ctx)
  }
}
