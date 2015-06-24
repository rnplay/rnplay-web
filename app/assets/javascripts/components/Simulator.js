'use strict';

import React, { Component } from 'react';
import cx from 'react-classset';

import QrModal from './qr_modal.js';

const styles = {
  width: 320,
  paddingTop: 20,
  paddingLeft: 20,
  overflow: 'hidden'
};

export default class Simulator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      qrModalIsVisible: null
    };
  }

  showQRModal = (e) => {
    e.preventDefault();
    this.setState({qrModalIsVisible: true});
  }

  hideQRModal = (e) => {
    e.preventDefault();
    this.setState({qrModalIsVisible: false});
  }

  renderQRModal() {
    return (
      <QrModal urlToken={this.props.app.urlToken}
               onClickBackdrop={this.hideQRModal}
               isOpen={this.state.qrModalIsVisible} />
    )
  }

  renderQRLink = () => {
    return (
      <a onClick={this.showQRModal} style={{cursor: 'pointer', textAlign: 'center', display: 'block', marginRight: '2vw', marginBottom: '2vh', fontSize: '130%'}}>
        <i className="fa fa-mobile"></i> Run on your device
      </a>
    )
  }

  render() {
    const { useDarkTheme, url } = this.props;
    const classes = cx({
      'editor-container__simulator': true,
      'editor-container__simulator--dark': useDarkTheme
    });

    return (
      <div>
        <div
          className={classes}
          style={styles}
        >
        {this.renderQRLink()}
          <iframe
            src={url}
            width="320px"
            height="800px"
            frameBorder="0"
            scrolling="no"
          />
        </div>
        {this.renderQRModal()}

      </div>
    );
  }
}
