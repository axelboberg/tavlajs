# Tavla
A lightweight HTML canvas framework with support for event forwarding and automatic adjustment for screen resolution.

## Installation
`npm install tavla`

## Example
Run the example by installing the framework
followed by `npm run example`.

## Usage  
```javascript
const { Tavla, Rect, Draggable } = require('tavla')

/*
Select your canvas element
*/
const el = document.querySelector('canvas')

const tavla = new Tavla(el)

/*
Make yourself a red rectangle
*/
const rectangle = new Rect(0, 0, 100, 120)
rectangle.fillColor = 'red'

/*
Add the rectangle to the view
and start rendering it immediately
*/
tavla.root.addChild(rectangle)

/*
Allow the rectangle to be dragged around
*/
Draggable.make(rectangle)

```

## API

### `Tavla`
---

#### `new Tavla(el [,opts])`
Creates a new instance of Tavla.

**Options**
```javascript
{
  drawBoundingBoxes: Boolean // Defaults to false
  pixelRatio: Number // Defaults to window.devicePixelRatio
  isWorker: Boolean // Whether or not the script is running in a worker, if this is true Tavla will skip any DOM-specific logic
  loop: Boolean // Whether to start a draw-loop or not, defaults to true
}
```

#### `tavla.root`
*read-only*  
An instance of `View`, use this to add your own views.

#### `tavla.draw()`
Manually trigger a draw of the current state.

### `View`
---

#### `new View(x, y, width, height)`
Create a new view.
Coordinates are relative to the view's
parent and drawn from the top-left.

#### `view.id`
Contains a unique string used to identify the view.

#### `view.frame`
*read-only*  
Get the view's frame.

#### `view.pos`
*read-only*  
A convenience wrapper to get the view's position relative to it's parent.
This returns the same thing as `view.frame.pos`.

#### `view.size`
*read-only*  
A convenience wrapper to get the view's size.
This returns the same thing as `view.frame.size`.

#### `view.clipping`  
A `boolean` indicating whether or not this view should be clipping its children, defaults to `false`.

#### `view.root`
*read-only*  
Returns the topmost view that the view is a descendant of.

#### `view.parent`
*read-only*  
Returns the view's parent or null if not yet added as a child.

#### `view.absPos`
*read-only*  
Get the view's position relative to the root view.

#### `view.setAbsPos(x, y)`
Update the position of the view's frame with coordinates relative to the root-view.

#### `view.removeFromParent()`
Remove the view from its parent view.

#### `view.addChild(view)`
Add a view as a child to this view.
The child will start rendering immediately.

#### `view.removeChild(view)`
Remove a child-view.

#### `view.getDescendants()`
Get a flattened array of all descendants to this view.

#### `view.draw(ctx)`
Draw the view and its children to the provided `CanvasRenderingContext2D`.
This method may be overridden by subclasses of `View`, but note that all overrides **should** also call `view.drawChildren(ctx)`.

#### `view.drawChildren(ctx)`
Trigger all children of the view to be drawn onto the provided `CanvasRenderingContext2D`.

#### `view.drawWireframe(ctx)`
Draw the view's wireframe onto the provided `CanvasRenderingContext2D`.

#### `view.on(event, handler)`
Listen for an event dispatched by the view.

```javascript
view.on('click', (e, didDispatchChildren) => {
  // e contains the event payload
  // didDispatchChildren is a boolean indicating whether this event was passed on to a child view or not. I.e. if true, the event was meant for a child to this view.
})
```

#### `view.once(event, handler)`
Similar to `view.on` but the handler will only be called once.

### `Draggable`
---

#### `Draggable.make(view)`
Make a view draggable and enable its `drag`-event.  
This **must** only be called once per view and **after** the view has been added as a child to another view.  
*Tip! Listen for the `adopted` event which will be fired when the view has been given a parent.*

### `Mask`
---

#### `Mask.make(view)`  
Turn the view into a mask by setting the `ctx.globalCompositeOperation = 'destination-out'`.  
This will make the view and its children mask any underlying views so that the background becomes visible.  
Note that the view **must** have a fillColor or strokeColor in order to be a mask.

### `Clamp`
---

#### `Clamp.make(view, anchor)`  
Clamp a view's coordinates to the coordinates of another view.
The clamped view will follow the anchor view.

#### `Clamp.reset(view)`  
Undo a clamp.
This will leave the view in place at its current position

### `Rect`
---

`Rect` inherits from `View`.

#### `new Rect(x, y, width, height)`
Create a new rectangle with a position relative to its parent view.

#### `rect.strokeColor`
Get or set the stroke-color for the rectangle.
Defaults to `'transparent'`.

#### `rect.strokeWidth`
Get or set the stroke-width for the rectangle.
Defaults to `0`.

#### `rect.fillColor`
Get or set the fill-color for the rectangle.
Defaults to `'transparent'`.

### `RoundRect`
---

`RoundRect` inherits from `Rect`.

#### `roundRect.borderRadius`
Set the border-radius of all of the rectangle's corners.

#### `roundRect.borderRadiusTL`
Set the top-left border-radius of the rectangle.

#### `roundRect.borderRadiusTR`
Set the top-right border-radius of the rectangle.

#### `roundRect.borderRadiusBR`
Set the bottom-right border-radius of the rectangle.

#### `roundRect.borderRadiusBL`
Set the bottom-left border-radius of the rectangle.

### `Image`
---

Draw an image. Inherits from `View`.

#### `new Image(x, y, width, height, src)`
Create a new image with an image source.
The source may be a data-url or image path in the form of a string.

#### `image.src`
Change the image-source.
The new source will be drawn on the next frame.

### `SVG`
---

Draw an SVG-string as an image. Inherits from `Image`.

#### `new SVG(x, y, width, height, svgString)`
Create a new SVG instance from an SVG-string.

#### `svg.src`
Change the SVG-source.
The new source will be drawn on the next frame.

### `Text`
---

Draw some text. Inherits from `View`.

#### `new Text(text, x, y, fontSize, fontFamily)`
Create a new Text instance.

#### `text.text`
The text node's text content

#### `text.fontSize`
The text node's font size.  
Defaults to `16px`.

#### `text.fontFamily`
The text node's font family.  
Defaults to `Helvetica`.

#### `text.textAlign`
The text node's alignment. One of `start`, `end`, `left`, `right` or `center`.  
Defaults to `start`.

#### `text.direction`
The text node's direction. One of `ltr`, `rtl`, `inherit`.  
Defaults to `inherit`.

#### `text.textBaseline`
The text node's baseline setting. One of `top`, `hanging`, `middle`, `alphabetic`, `ideographic` or `bottom`.  
Defaults to `top`.

### `Frame`
---

#### `new Frame(x?, y?, width?, height?)`
Create a new frame.
Coordinates are calculated from the top-left.

#### `frame.center`
Get coordinates for the frame's center-point.

## Events
The following are events fired by instances of `View`.

### `click`
Fired when the view was clicked.

### `mousemove`
Fired when the cursor moved over the view.

### `mousedown`
Fired when the cursor clicked down on the view.

### `mouseup`
Fired when the cursor let go of a click on the view.

### `adopted`
Fired when the view has been added using `view.addChild()` to another view.

### `drag`
Will only be fired if the view was made draggable with `Draggable.make(view)`

### `dragstop`
Fired when a view has stopped being dragged.