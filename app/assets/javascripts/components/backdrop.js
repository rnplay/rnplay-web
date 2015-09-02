import React, { Component } from 'react';
import classNames from 'classNames';

export default class Backdrop extends Component {
  render() {
    var classes = classNames({
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
