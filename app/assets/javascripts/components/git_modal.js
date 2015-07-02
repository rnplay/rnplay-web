import React, { Component } from 'react';
import Modal from './modal';

export default class GitModal extends Component {

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClickBackdrop={this.props.onClickBackdrop}>
        <div className="modal--body git-modal-body">
          <h1>
            Clone this project from https://{this.props.token}:@git.rnplay.org/{this.props.app.urlToken}.git
          </h1>
        </div>
      </Modal>
    )
  }
}
