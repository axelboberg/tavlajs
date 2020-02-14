/**
 * Axel Boberg © 2020
 */

const Image = require('./Image')

function makeSVGDataUrl (svgString) {
  return `data:image/svg+xml;base64,${btoa(svgString.replace(/\r?\n|\r/g, '').replace(/<!--.+-->/g, ''))}`
}

module.exports = class SVG extends Image {
  constructor (x, y, width, height, svgString) {
    super(x, y, width, height, makeSVGDataUrl(svgString))
  }

  set src (svgString) {
    super.src = makeSVGDataUrl(svgString)
  }
}