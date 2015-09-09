import React, { Component } from 'react';
import axios from 'axios';
import Modal from './modal';

export default class QrModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
        qrCodeUrl: null
    };
  }

  componentDidMount() {
    axios.get(`/apps/${this.props.urlToken}/qr`)
         .then(response => response.data)
         .then(data => this.setState({qrCodeUrl: data.url}));
  }

  renderQRImage() {
    if (this.state.qrCodeUrl) {
      return <img src={this.state.qrCodeUrl} />
    }

    return null;
  }

  renderFooter() {
    return (
      <div className="modal__header">
          <p>Scan this with our <a href="https://itunes.apple.com/us/app/react-native-playground/id1002032944">iOS app</a>!</p>
          <img src="/img/app-store-badge.svg" width="135" height="40" />
      </div>
    );
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClickBackdrop={this.props.onClickBackdrop}>
        {this.renderFooter()}
        <div className="modal__body qr-modal-body">
          {this.renderQRImage()}
        </div>
      </Modal>
    )
  }
}
