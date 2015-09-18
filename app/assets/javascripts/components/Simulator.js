'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';
import {result, find, template, clone} from 'lodash';
import BuildPicker from './BuildPicker';
import QrModal from './qr_modal';
import Qs from 'qs'

// Sample appetize URL
// https://appetize.io/embed/u702ejhe26p438rp73c74uyxur?device=iphone5s&scale=75&orientation=portrait&screenOnly=false&xdocMsg=true&autoapp=false&deviceColor=white&debug=true&params=%7B%22bundleUrl%22:%22http://rnplay-jsierles.ngrok.io/app_js/cUJ22A/index.ios.bundle%22,%22moduleName%22:%22SampleApp%22,%22RCTDevMenu%22:%7B%22liveReloadEnabled%22:true%7D,%22route%22:%22%22%7D

export default class Simulator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      qrModalIsVisible: null
    };
  }

  appetizeUrl() {
    var prefix = 'https://appetize.io/embed';
    var buildShortName = this.props.buildId
    var build = find(this.props.builds, (build) => {return build.id == this.props.buildId})

    var appetizeId = build.appetize_id
    var appParams = {...this.props.app.appetizeOptions.app_params}

    var appetizeParams = this.props.app.appetizeOptions
    appetizeParams.app_params = null

    if (build.platform == 'android') {
      appParams.RCTDevMenu = ""
    } else if (!this.props.belongsToCurrentUser()) {
      appParams.RCTDevMenu.liveReloadEnabled = false
    }

    var bundlePath = build.platform == 'android' ? appParams.bundlePath : appParams.bundlePath+"/index.ios.bundle";

    appParams['bundleUrl'] = template(appParams.packagerUrlTemplate)({bundlePath: bundlePath, buildShortName: build.short_name})
    var url = `${prefix}/${appetizeId}?${Qs.stringify(appetizeParams)}&params=${encodeURIComponent(JSON.stringify(appParams))}`
    console.log(appParams.bundleUrl)
    console.log(url)
    return url;
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

  renderControls() {
    if (this.props.currentUserIsAdmin()) {
      return (
        <div className="editor-simulator-container__controls">
          <a onClick={this.props.saveScreenshot}>Save screenshot</a>
          <a onClick={this.props.openDevMenu}>Dev menu</a>
          <a onClick={() => this.props.rotate('Left')}>Rotate left</a>
        </div>
      )
    } else {
      return null
    }
  }

  selectPlatform = (event) => {
    var state = {}
    console.log(`${event.target.name} ${event.target.checked}`)
    state[`${event.target.name}`] = event.target.checked
    this.props.onSelectPlatform(event.target.name, event.target.checked);
  }

  platform() {
    return find(this.props.builds, (build) => {return build.id == this.props.buildId}).platform
  }

  render() {
    console.log(this.platform())
    const {
      useDarkTheme,
      url,
      builds,
      buildId
    } = this.props;

    let classesObject = {
      'editor-simulator-container__simulator': true,
      'editor-simulator-container--dark': useDarkTheme,
    }

    let classes = classNames(classesObject);


    return (
      <div className="editor-simulator-container">

        <div className="editor-header__bar editor-simulator-container__header">
          {this.renderQRLink()}
        </div>

        <div className="editor-simulator-container__button-container">
          <BuildPicker
            onChange={this.props.onUpdateBuild}
            builds={builds}
            ios={this.props.ios}
            android={this.props.android}
            selectedBuildId={buildId}
          />

          <div className="editor-simulator-container__checkboxes">
            <input type="checkbox" defaultChecked={this.props.ios} onChange={this.selectPlatform} name="ios" value="on"/> iOS
            <input type="checkbox" defaultChecked={this.props.android} onChange={this.selectPlatform} name="android" value="on" /> Android
          </div>

        </div>

        {this.renderControls()}

        <div className={classes}>
          <iframe
            src={this.appetizeUrl()}
            width={`${this.platform() == 'android' ? '300' : '270'}px`}
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
