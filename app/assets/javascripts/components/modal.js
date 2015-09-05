import React, { Component } from 'react';
import classNames from 'classnames';
import Backdrop from './backdrop';

export default class Modal extends Component {
  render() {
    var classes = classNames({
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
