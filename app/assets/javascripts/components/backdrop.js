import React, { Component } from 'react';
import cx from 'react-classset';

export default class Backdrop extends Component {
  render() {
    var classes = cx({
      'backdrop': true,
      'is-light': this.props.type == 'light',
      'is-visible': this.props.isVisible
    });

    return (
      <div onClick={this.props.onClick}
           className={classes}></div>
    )
  }
}
