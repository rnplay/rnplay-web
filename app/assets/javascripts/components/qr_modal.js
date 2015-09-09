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
      <div className="modal__footer">
        <img className="modal__footer__logo" src="/img/react-native-playground-logo.png" width="130" height="130" />
        <div className="modal__footer--right">
          <p>Run, test and share React Native applications directly on an iOS device.</p>
          <img src="/img/app-store-badge.svg" width="135" height="40" />
        </div>
      </div>
    );
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClickBackdrop={this.props.onClickBackdrop}>
        <div className="modal__body qr-modal-body">
          <h1>
            Scan this with the <a href="https://itunes.apple.com/us/app/react-native-playground/id1002032944">React Native Playground iOS app</a>.
          </h1>
          {this.renderQRImage()}
        </div>
        {this.renderFooter()}
      </Modal>
    )
  }
}
