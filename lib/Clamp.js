/**
 * Axel Boberg © 2020
 */

module.exports = class Clamp {
  /**
   * Clamp a view to another view,
   * the views does not need to be
   * parent and child
   * @param { View } view The view that will mimic
   * @param { View } anchor The view to mimic
   */
  static make (view, anchor) {
    const draw = view.draw.bind(view)

    /*
    Keep a reference to the original draw-method
    */
    view._tmp_clamped_draw = draw

    view.draw = function (ctx) {
      /*
      Set the absolute position of the mimicing view
      to the absolute position of the anchor view
      */
      const { x, y } = anchor.absPos
      view.setAbsPos(x, y)

      draw(ctx)
    }
  }

  /**
   * Stop the view from being clamped by
   * removing the override of the draw function
   * @param { View } view 
   */
  static reset (view) {
    /*
    Return instead of overriding 
    draw with undefined
    */
    if (!view._tmp_clamped_draw) return

    view.draw = view._tmp_clamped_draw
    view._tmp_clamped_draw = undefined
  }
}