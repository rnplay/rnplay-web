import React, { Component } from 'react';
import classNames from 'classNames';
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
          <div className="modal--actions">
            <button className="modal--actions__close" onClick={this.props.onClickBackdrop}>
              <i className="fa fa-times"></i>
            </button>
          </div>
          {this.props.children}
        </div>

        <Backdrop type="dark" isVisible={this.props.isOpen} onClick={this.props.onClickBackdrop} />
      </div>
    )
  }
}
