/**
 * Axel Boberg © 2020
 */

module.exports = class Mask {
  /**
   * Turn the view and its children into a mask by
   * drawing them with ctx.globalCompositeOperation
   * set to 'destination-out'
   * @param { View } view 
   */
  static make (view) {
    const draw = view.draw.bind(view)

    /*
    Override the draw-method to set
    and reset the global composite
    operation
    */
    view.draw = function (ctx) {
      const prev = ctx.globalCompositeOperation
      ctx.globalCompositeOperation = 'destination-out'

      /*
      Call the original draw-method
      */
      draw(ctx)

      ctx.globalCompositeOperation = prev
    }
  }
}