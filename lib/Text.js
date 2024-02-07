/**
 * Axel Boberg © 2024
 */

const View = require('./View')

/**
 * A reusable canvas only used
 * for measuring the text,
 * 
 * this is shared between
 * all text nodes in order to
 * avoid being reinitiated
 * every time text is added
 * 
 * @type { OffscreenCanvas }
 */
const measuringCanvas = new OffscreenCanvas(0, 0)

module.exports = class Text extends View {
  /**
   * @private
   */
  #text = ''

  /**
   * Set this node's
   * text content
   */
  set text (newValue) {
    this.#text = newValue

    const metrics = this.measure()
    this.frame.size.width = metrics.width
  }

  /**
   * Get this node's
   * text content
   * @type { String | undefined }
   */
  get text () {
    return this.#text
  }

  /**
   * Construct a
   * new Text node
   * @param { String } text The node's text content
   * @param { Number } x The x-coordinate of the text's placement
   * @param { Number } y The y-coordinate of the text's placement
   * @param { String } fontSize The text's font size
   * @param { String } fontFamily The text's font family
   */
  constructor (text, x, y, fontSize, fontFamily) {
    super(x, y, 0, parseInt(fontSize || 16))

    this.strokeColor = 'transparent'
    this.strokeWidth = 0

    this.fillColor = 'black'

    this.fontFamily = fontFamily || 'Helvetica'
    this.fontSize = fontSize || '16px'

    this.textAlign = 'start'
    this.direction = 'inherit'
    this.textBaseline = 'top'

    this.text = text || ''
  }

  /**
   * Measure this text as
   * it will be rendered
   * @returns { TextMetrics }
   */
  measure () {
    const ctx = measuringCanvas.getContext('2d')
    this.#prepare(ctx)
    return ctx.measureText(this.text)
  }

  /**
   * @private
   * Prepare a context for
   * displaying this text
   * @param { CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D } ctx 
   */
  #prepare (ctx) {
    ctx.font = `${this.fontSize} ${this.fontFamily}`
    ctx.textAlign = this.textAlign
    ctx.direction = this.direction
    ctx.textBaseline = this.textBaseline
  }

  draw (ctx) {
    this.#prepare(ctx)

    if (this.fillColor) {
      ctx.fillStyle = this.fillColor
      ctx.fillText(this.text, this.absPos.x, this.absPos.y)
    }

    if (this.strokeColor) {
      ctx.lineWidth = this.strokeWidth
      ctx.strokeStyle = this.strokeColor
      ctx.strokeText(this.text, this.absPos.x, this.absPos.y)
    }

    super.draw(ctx)
  }
}