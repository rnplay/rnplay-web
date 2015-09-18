'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';
import {result, find, template, clone} from 'lodash';
import BuildPicker from './BuildPicker';
import QrModal from './qr_modal';
import Qs from 'qs';
import Switch from './Switch';

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
    var build = this.props.build

    var appetizeId = build.appetize_id
    var appParams = {...this.props.app.appetizeOptions.app_params}

    var appetizeParams = this.props.app.appetizeOptions
    appetizeParams.app_params = null

    if (build.platform == 'android') {
      appParams.RCTDevMenu = ""
    } else if (!this.props.belongsToCurrentUser()) {
      appParams.RCTDevMenu.liveReloadEnabled = false
    }

    console.log(build.platform)
    console.log(appetizeId)
    var bundlePath = build.platform == 'android' ? appParams.bundlePath : appParams.bundlePath+"/index.ios.bundle";

    appParams['bundleUrl'] = template(appParams.packagerUrlTemplate)({bundlePath: bundlePath, buildShortName: build.short_name})
    var url = `${prefix}/${appetizeId}?${Qs.stringify(appetizeParams)}&params=${encodeURIComponent(JSON.stringify(appParams))}`
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
    }
    
    return null;
  }

  onSelectSupportedPlatform = (event) => {
    var state = {};
    const { name, checked } = event.target;

    console.log(`${name} ${checked}`);

    state[`${name}`] = checked;
    this.props.onSelectSupportedPlatform(name, checked);
  }

  onSwitchPlatform = (name) => {
    this.props.onUpdateBuild(this.buildFor(name, this.props.build.name).id);
  }

  onUpdateBuild = (name) => {
    console.log(this.buildFor(this.props.build.platform, name));

    this.props.onUpdateBuild(this.buildFor(this.props.build.platform, name).id);
  }

  buildFor = (platform, version) => {
    console.log(`${platform} ${version}`);
    console.log(this.props.builds);

    return find(this.props.builds, (build) => {
      return build.platform == platform && build.name == version;
    });
  }

  renderSupportedPlatforms() {
    if (!this.props.belongsToCurrentUser()) {
      return null;
    }

    return (
      <div className="editor-simulator-container__checkboxes">
        <input type="checkbox" defaultChecked={this.props.ios} onChange={this.onSelectSupportedPlatform} name="ios" value="on"/> iOS
        <input type="checkbox" defaultChecked={this.props.android} onChange={this.onSelectSupportedPlatform} name="android" value="on" /> Android
      </div>
    )
  }
  render() {
    const {
      // useDarkTheme,
      url,
      builds,
      buildId
    } = this.props;

    const classesSimulator = classNames({
      'editor-simulator-container__simulator': true,
      // 'editor-simulator-container--dark': useDarkTheme,
    });

    return (
      <div className="editor-simulator-container">

        <div className="editor-header__bar editor-simulator-container__header">
          {this.renderQRLink()}
        </div>

        <div className="editor-simulator-container__button-container">
          <BuildPicker
            onChange={this.onUpdateBuild}
            builds={builds}
            selectedBuildName={this.props.build.name}
          />
        </div>

        {this.renderControls()}

        {this.renderSupportedPlatforms()}

        <Switch
          onChange={this.onSwitchPlatform}
          value={this.props.build.platform}
          name="platform">
          <span value="ios">iOS</span>
          <span value="android">Android</span>
        </Switch>

        <div className={classesSimulator}>
          <iframe
            src={this.appetizeUrl()}
            width={`${this.props.build.platform == 'android' ? '300' : '273'}px`}
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
