'use strict';

import React, { Component } from 'react';
import classNames from 'classNames';

import BuildPicker from './BuildPicker';
import QrModal from './qr_modal';

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
      <a onClick={this.showQRModal} className="editor-button">
        <i className="fa fa-mobile"></i> Run on your device
      </a>
    )
  }

  render() {
    const {
      useDarkTheme,
      url,
      builds,
      buildId
    } = this.props;

    const classes = classNames({
      'editor-simulator-container__simulator': true,
      'editor-simulator-container--dark': useDarkTheme
    });

    return (
      <div className="editor-simulator-container">

        <div className="editor-header__bar editor-simulator-container__header">
          <BuildPicker
            onChange={this.onUpdateBuild}
            builds={builds}
            selectedBuildId={buildId}
          />

        </div>

        <div className="editor-simulator-container__button-container">
          {this.renderQRLink()}
        </div>

        <div className={classes}>
          <iframe
            src={url}
            width="294px"
            height="9999px"
            frameBorder="0"
            scrolling="no"
          />
        </div>

        {this.renderQRModal()}

      </div>
    );
  }
}
