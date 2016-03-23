import React, { Component, PropTypes } from 'react'

import Packery from 'packery'
import imagesloaded from 'imagesloaded'
import Draggabilly from 'draggabilly'

const refName = 'packeryContainer'

class PackeryComponent extends Component{

  constructor(props) {
    super(props)
    this.packery = false
    this.domChildren = []
    this.displayName = 'PackeryComponent'

    //bind this to all non-react functions
    //if not familiar, see https://github.com/goatslacker/alt/issues/283
    this.initializePackery = this.initializePackery.bind(this)
    this.makeEachDraggable = this.makeEachDraggable.bind(this)
    this.imagesLoaded = this.imagesLoaded.bind(this)
    this.performLayout = this.performLayout.bind(this)
  }

  initializePackery = function(force) {
    this.packery = new Packery(
        this.refs[refName],
        this.props.options
    );

    this.packery.getItemElements().forEach( this.makeEachDraggable )
    this.domChildren = this.getNewDomChildren()
  }

  getNewDomChildren = function() {
    const node = this.refs[refName]
    const children = this.props.options.itemSelector ? node.querySelectorAll(this.props.options.itemSelector) : node.children
    return Array.prototype.slice.call(children)
  }

  makeEachDraggable( itemElem ) {
    // make element draggable with Draggabilly
    const draggie = new Draggabilly( itemElem )
    // bind Draggabilly events to Packery
    this.packery.bindDraggabillyEvents( draggie )
  }

  diffDomChildren = function() {
    const oldChildren = this.domChildren.filter(function(element) {
        /*
         * take only elements attached to DOM
         * (aka the parent is the packery container, not null)
         */
        return !!element.parentNode
    });

    const newChildren = this.getNewDomChildren()

    const removed = oldChildren.filter(function(oldChild) {
        return !~newChildren.indexOf(oldChild)
    });

    const domDiff = newChildren.filter(function(newChild) {
        return !~oldChildren.indexOf(newChild)
    });

    let beginningIndex = 0

    // get everything added to the beginning of the DOMNode list
    const prepended = domDiff.filter(function(newChild, i) {
        const prepend = (beginningIndex === newChildren.indexOf(newChild))

        if (prepend) {
            // increase the index
            beginningIndex++
        }

        return prepend
    });

    // we assume that everything else is appended
    const appended = domDiff.filter(function(el) {
        return prepended.indexOf(el) === -1
    });

    this.domChildren = newChildren

    return {
        old: oldChildren,
        new: newChildren,
        removed: removed,
        appended: appended,
        prepended: prepended
    };
  }

  performLayout = function() {
    const diff = this.diffDomChildren()

    if (diff.removed.length > 0) {
        this.packery.remove(diff.removed)
    }

    if (diff.appended.length > 0) {
        this.packery.appended(diff.appended)
        diff.appended.forEach( this.makeEachDraggable )
    }

    if (diff.prepended.length > 0) {
        this.packery.prepended(diff.prepended)
        diff.prepended.forEach( this.makeEachDraggable )
    }
    this.packery.reloadItems()
    this.packery.layout()
  }

  imagesLoaded = function() {
    if (this.props.disableImagesLoaded) return;

    imagesloaded(
        this.refs[refName],
        function(instance) {
            this.packery.layout()
        }.bind(this)
    )
  }

  componentDidMount = function() {
    this.initializePackery()
    this.imagesLoaded()
  }

  componentDidUpdate = function() {
    this.performLayout()
    this.imagesLoaded()
  }

  componentWillReceiveProps = function() {
    this._timer = setTimeout(function() {
        this.packery.reloadItems()
        this.packery.layout()
    }.bind(this), 0)
  }

  componentWillUnmount = function() {
    clearTimeout(this._timer)
  }

  render = function() {
    return React.createElement(this.props.elementType, {
        className: this.props.className,
        ref: refName
    }, this.props.children)
  }
};

PackeryComponent.propTypes = {
  disableImagesLoaded: React.PropTypes.bool,
  options: React.PropTypes.object
}

PackeryComponent.defaultProps = {
  disableImagesLoaded: false,
  options: {},
  className: '',
  elementType: 'div'
}

module.exports = PackeryComponent;
