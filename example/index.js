/**
 * Axel Boberg © 2020
 */

const el = document.querySelector('canvas')

const { Tavla, Rect, RoundRect, Draggable } = require('../index')

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

/*
Add the views to the tree
*/
tavla.root.addChild(square)
tavla.root.addChild(circle)

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