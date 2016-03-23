React Packery Draggabilly Component
=======================

[![npm version](https://badge.fury.io/js/react-packery-component.svg)](http://badge.fury.io/js/react-packery-component)

#### Introduction:
An ES6 [React.js](https://facebook.github.io/react/) [Packery](http://packery.metafizzy.co/) [Draggabilly](http://draggabilly.desandro.com/)  component. 

#### Support
React >= 0.14.x

#### Usage:

* Example code:

```js
import React, { Component } from 'react'
import PackeryComponent from './Packery'

const packeryOptions = {
    // transitionDuration: 0,
    gutter: 10,
    columnWidth: 225
}

class MyPackery extends Component{

  render = function () {

    const childElements = this.props.elements.map(function(child, index){
     return (
        <div key={index} className="child">
          {child.topic.title}
        </div>
      )
    })

    return (
      <PackeryComponent
        ref="PackeryComponent"
        className={'packery'}
        elementType={'div'}
        options={packeryOptions}
        disableImagesLoaded={false}
      >
        {childElements}
      </PackeryComponent>
    )
  }
};

module.exports = MyPackery;


```
