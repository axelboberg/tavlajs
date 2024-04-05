/**
 * Axel Boberg © 2020
 */

const View = require('./View')

module.exports = class Img extends View {
  /**
   * @private
   * @type { Image | undefined }
   */
  #image

  constructor (x, y, width, height, src) {
    super(x, y, width, height)

    this.#image = new Image(width, height)
    this.#image.src = src
  }

  /**
   * Set this image's source
   * @type { String }
   */
  set src (src) {
    if (src === this.#image.src) return
    this.#image.src = src
  }

  /**
   * Get this image's source
   * @type { String }
   */
  get src () {
    return this.#image.src
  }

  draw (ctx) {
    /*
    Open a new path if this view is
    supposed to clip its children
    */
    if (this.clipping) {
      ctx.beginPath()
      ctx.rect(this.#image, this.absPos.x, this.absPos.y, this.size.width, this.size.height)
    }

    ctx.drawImage(this.#image, this.absPos.x, this.absPos.y, this.size.width, this.size.height)
    super.draw(ctx)
  }
}
