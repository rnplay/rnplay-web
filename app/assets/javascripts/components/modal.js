import React, { Component } from 'react';
import cx from 'react-classset';
import Backdrop from './backdrop';

export default class Modal extends Component {
  render() {
    var classes = cx({
      'modal-container': true,
      'is-visible': this.props.isOpen
    });

    return (
      <div className={classes}>
        <div className="modal">
          {this.props.children}
        </div>

        <Backdrop type="dark" isVisible={this.props.isOpen} onClick={this.props.onClickBackdrop} />
      </div>
    )
  }
}
