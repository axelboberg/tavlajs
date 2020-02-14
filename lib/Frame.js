/**
 * Axel Boberg © 2020
 */

module.exports = class Frame {
  constructor (x = 0, y = 0, width = 0, height = 0) {
    this.pos = { x: x, y: y }
    this.size = { width: width, height: height }
  }

  get center () {
    return {
      x: this.pos.x + this.size.width / 2,
      y: this.pos.y + this.size.height / 2
    }
  }
}