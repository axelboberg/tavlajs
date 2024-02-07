/**
 * Axel Boberg © 2020
 */

const el = document.querySelector('canvas')

const { Text, Tavla, Rect, RoundRect, Draggable, Resizable } = require('../index')

/*
Create a new Tavla by
giving it a canvas HTML-element
*/
const tavla = new Tavla(el)

/*
A pink square
*/
const square = new Rect(10, 10, 200, 200)
square.fillColor = 'pink'

/*
A blue circle
*/
const circle = new RoundRect(100, 100, 150, 150)
circle.fillColor = 'blue'
circle.borderRadius = 75

const rectangle = new Rect(150, 150, 150, 90)
rectangle.fillColor = 'orange'

/*
Text
*/
const text = new Text('Hello world', 0, 0)
text.fillColor = 'red'

/*
Add the views to the tree
*/
tavla.root.addChild(text)
tavla.root.addChild(square)
tavla.root.addChild(circle)
tavla.root.addChild(rectangle)

/*
Show an alert when
the square is clicked
*/
square.on('click', () => alert('Clicked square'))

/*
Allow the circle to
be dragged around
*/
Draggable.make(circle)
Draggable.make(rectangle)
Resizable.make(rectangle, {
  onSetupHandle: handle => {
    handle.fillColor = 'blue'
  }
})