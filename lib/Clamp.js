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
}