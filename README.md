React Packery Component
=======================

[![npm version](https://badge.fury.io/js/react-packery-component.svg)](http://badge.fury.io/js/react-packery-component)

#### Introduction:
A [React.js](https://facebook.github.io/react/) [Packery](http://packery.metafizzy.co/) [Draggabilly](http://draggabilly.desandro.com/)  component. 

#### Support
React >= 0.14.x

#### Usage:

* Example code:

```js
var React = require('react');
var Packery = require('./PackeryClass');

var packeryOptions = {
    // transitionDuration: 0,
    gutter: 10,
    columnWidth: 225
};

var WvPackery = React.createClass({

  render: function () {

    var actions = this.props.actions;

    var childElements = this.props.elements.map(function(brick, index){
     return (
        <div key={index} className="brick">
          <span
            onClick={() => actions.deleteBrick(brick.id)}
            className="cross control-buttons">
              <i className="fa fa-close"></i>
          </span>
          {brick.topic.title}
        </div>
      );
    });

    return (
      <Packery
        className={'packery'}
        elementType={'div'}
        options={packeryOptions}
        disableImagesLoaded={false}
      >
        {childElements}
      </Packery>
    );
  }
});

module.exports = WvPackery;

```
