import React, { Component } from 'react';
import $ from 'jquery';
import Modal from './modal';

export default class QrModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
        qrCodeUrl: null
    };
  }

  componentDidMount = () => {
    var self = this;
    $.get('/apps/' + this.props.urlToken + '/qr', function(result) {
      self.setState({qrCodeUrl: result.url});
    });
  }

  renderImage() {
    if (this.state.qrCodeUrl) {
      return <img src={this.state.qrCodeUrl} />
    } else {
      return <span />
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClickBackdrop={this.props.onClickBackdrop}>
        <div className="modal--body qr-modal-body">
          <h1>
            Scan this with the <a href="https://itunes.apple.com/us/app/react-native-playground/id1002032944">React Native Playground iOS app.</a>
          </h1>
          {this.renderImage()}
        </div>
      </Modal>
    )
  }
}
