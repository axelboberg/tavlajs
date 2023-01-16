/**
 * Axel Boberg © 2020
 */

module.exports = class Draggable {
  static make (view) {

    let touchdownX = 0,
        touchdownY = 0

    view.on('mousedown', (e, didDispatchChild)=> {
      if (didDispatchChild) return
      /*
      Keep track of where the user
      first clicked down on the
      view in order to drag it
      from that position and not
      the top left
      */
      touchdownX = e.x
      touchdownY = e.y

      view.isFocused = true
    })

    /*
    Deactivate drag when the user no
    longer is holding down on the view,
    the cursor may no longer be in the view itself,
    therefore listen to the root
    */
    view.root.on('mouseup', e => {
      if (view.isFocused) view._dispatch('dragstop')
      view.isFocused = false
    })

    /*
    Move the view with the cursor
    if it is still in focus
    */
    view.root.on('mousemove', e => {
      if (!view.isFocused) return

      /*
      We cannot use e.x and e.y here since
      they may be altered by a child node,
      therefore use the view's absolute position
      */
      e.deltaX = e.originalX - view.absPos.x - touchdownX
      e.deltaY = e.originalY - view.absPos.y - touchdownY

      view.pos.x += e.deltaX
      view.pos.y += e.deltaY

      view._dispatch('drag', e)
    })
  }
}