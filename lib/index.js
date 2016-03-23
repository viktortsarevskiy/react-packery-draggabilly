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

  initializePackery = (force) => {
    this.packery = new Packery(
        this.refs[refName],
        this.props.options
    )

    this.packery.getItemElements().forEach( this.makeEachDraggable )
    this.domChildren = this.getNewDomChildren()
  }

  getNewDomChildren = () => {
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

  diffDomChildren = () => {
    const oldChildren = this.domChildren.filter((element) => {
        /*
         * take only elements attached to DOM
         * (aka the parent is the packery container, not null)
         */
        return !!element.parentNode
    })

    const newChildren = this.getNewDomChildren()

    const removed = oldChildren.filter((oldChild) => {
        return !~newChildren.indexOf(oldChild)
    })

    const domDiff = newChildren.filter((newChild) => {
        return !~oldChildren.indexOf(newChild)
    })

    let beginningIndex = 0

    // get everything added to the beginning of the DOMNode list
    const prepended = domDiff.filter((newChild, i) => {
        const prepend = (beginningIndex === newChildren.indexOf(newChild))

        if (prepend) {
            // increase the index
            beginningIndex++
        }

        return prepend
    })

    // we assume that everything else is appended
    const appended = domDiff.filter((el) => {
        return prepended.indexOf(el) === -1
    })

    this.domChildren = newChildren

    return {
        old: oldChildren,
        new: newChildren,
        removed: removed,
        appended: appended,
        prepended: prepended
    }
  }

  performLayout = () => {
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

  imagesLoaded = () => {
    if (this.props.disableImagesLoaded) return

    imagesloaded(
        this.refs[refName],
        (instance) => {
            this.packery.layout()
        }
    )
  }

  componentDidMount = () => {
    this.initializePackery()
    this.imagesLoaded()
  }

  componentDidUpdate = () => {
    this.performLayout()
    this.imagesLoaded()
  }

  componentWillReceiveProps = () => {
    this._timer = setTimeout(() => {
        this.packery.reloadItems()
        this.packery.layout()
    }
  }

  componentWillUnmount = () => {
    clearTimeout(this._timer)
  }

  render = () => {
    return React.createElement(this.props.elementType, {
        className: this.props.className,
        ref: refName
    }, this.props.children)
  }
}

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

module.exports = PackeryComponent
