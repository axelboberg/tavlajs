/**
 * Axel Boberg © 2023
 * 
 * @typedef {{
 *  onSetupHandle: () => {}
 * }} ResizeConfig
 */

const RoundRect = require('./RoundRect')
const Draggable = require('./Draggable')

const HANDLE_WIDTH_PX = 10
const HANDLE_HEIGHT_PX = 10

module.exports = class Resizable {
  /**
   * Make a view resizable and add
   * handle nodes as children
   * @param { View } view 
   * @param { ResizeConfig } config 
   */
  static make (view, config = {}) {
    const handles = [
      // LEFT
      {
        x: (width, height) => 0,
        y: (width, height) => height / 2 - HANDLE_HEIGHT_PX / 2,
        fn: e => {
          const newWidth = view.frame.size.width + view.frame.pos.x - e.originalX
          if (newWidth >= HANDLE_WIDTH_PX) {
            view.frame.size.width = newWidth
            view.frame.pos.x = e.originalX
          }
        }
      },

      // TOP
      {
        x: (width, height) => width / 2 - HANDLE_WIDTH_PX / 2,
        y: (width, height) => 0,
        fn: e => {

          const newHeight = view.frame.size.height + view.frame.pos.y - e.originalY
          if (newHeight >= HANDLE_HEIGHT_PX) {
            view.frame.size.height = newHeight
            view.frame.pos.y = e.originalY
          }
        }
      },

      // RIGHT
      {
        x: (width, height) => width - HANDLE_WIDTH_PX,
        y: (width, height) => height / 2 - HANDLE_HEIGHT_PX / 2,
        fn: e => {
          const newWidth = e.originalX - view.frame.pos.x
          if (newWidth >= HANDLE_WIDTH_PX) {
            view.frame.size.width = newWidth
          }
        }
      },

      // BOTTOM
      {
        x: (width, height) => width / 2 - HANDLE_WIDTH_PX / 2,
        y: (Width, height) => height - HANDLE_HEIGHT_PX,
        fn: e => {
          const newHeight = e.originalY - view.frame.pos.y
          if (newHeight >= HANDLE_HEIGHT_PX) {
            view.frame.size.height = newHeight
          }
        }
      }
    ]

    for (const handle of handles) {
      const handleView = new RoundRect(handle.x(view.frame.size.width, view.frame.size.height), handle.y(view.frame.size.width, view.frame.size.height), HANDLE_WIDTH_PX, HANDLE_HEIGHT_PX)
      handleView.fillColor = 'red'

      if (typeof config?.onSetupHandle === 'function') {
        config.onSetupHandle(handleView)
      }

      handleView.on('drag', e => {
        handle.fn(e)
        view._dispatch('resize', view)
      })

      view.addChild(handleView)
      Draggable.make(handleView)

      handleView.root.on('willdraw', () => {
        handleView.frame.pos.x = handle.x(view.frame.size.width, view.frame.size.height)
        handleView.frame.pos.y = handle.y(view.frame.size.width, view.frame.size.height)
      })
    }
  }
}