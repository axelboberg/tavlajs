/**
 * Axel Boberg © 2024
 * 
 * @typedef {{
 *  x: Number,
 *  y: Number
 * }} Point
 */

module.exports = class Frame {
  /**
   * This frame's position
   * in pixels
   * @type { Point }
   */
  pos

  /**
   * This frame's
   * size in pixels
   * @type {{
   *  width: Number,
   *  height: Number
   * }}
   */
  size

  constructor (x = 0, y = 0, width = 0, height = 0) {
    this.pos = { x: x, y: y }
    this.size = { width: width, height: height }
  }

  /**
   * Get the center coordinate of this frame
   * @type { Point }
   */
  get center () {
    return {
      x: this.pos.x + this.size.width / 2,
      y: this.pos.y + this.size.height / 2
    }
  }
}