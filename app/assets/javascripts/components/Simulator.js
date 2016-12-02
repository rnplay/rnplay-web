'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';
import Qs from 'qs';
import { result, find, template, clone } from 'lodash';
import BuildPicker from './BuildPicker';
import QrModal from './qr_modal';
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

  appetizeUrlFor(platform) {
    let manifestUrl = `rnplay://rnplay.org/apps/${this.props.app.urlToken}`;

    var appetizeOptions = {
      embed: true,
      screenOnly: false,
      device: platform == 'ios' ? 'iphone5' : 'nexus5',
      launchUrl: platform === 'android' ? manifestUrl : undefined,
      xdocMsg: true,
      deviceColor: 'white',
      xDocMsg: true,
      orientation: 'portrait',
      debug: true,
    }

    var build = this.buildFor(platform, this.props.build.name);
    var appetizeId = build.appetize_id;


    var appParams = {
      "EXKernelLaunchUrlDefaultsKey": manifestUrl,
    }

    var url = `https://appetize.io/embed/${appetizeId}?${Qs.stringify(appetizeOptions)}&params=${encodeURIComponent(JSON.stringify(appParams))}`
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
    return null;
    return (
      <QrModal urlToken={this.props.app.urlToken}
               onClickBackdrop={this.hideQRModal}
               isOpen={this.state.qrModalIsVisible} />
    )
  }

  renderQRLink = () => {
    return null;
    return (
      <a onClick={this.showQRModal} className="editor-button">
        <i className="fa fa-mobile"></i> Run on your device
      </a>
    )
  }

  renderControls() {
    return null;

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
    const { name, checked } = event.target;
    this.props.onSelectSupportedPlatform(name, checked);
    if (!checked) {
      this.props.onUpdateBuild(this.buildFor(name == 'ios' ? 'android' : 'ios', this.props.build.name).id);
    }
  }

  onSwitchPlatform = (name) => {
    this.props.onUpdateBuild(this.buildFor(name, this.props.build.name));
  }

  onUpdateBuild = (name) => {
    this.props.onUpdateBuild(this.buildFor(this.props.build.platform, name));
  }

  buildFor = (platform, version) => {
    return find(this.props.builds, (build) => {
      return build.platform == platform && build.name == version;
    });
  }

  renderSwitch() {
    return (
      <Switch
        onChange={this.onSwitchPlatform}
        defaultValue={this.props.build.platform}
        name="platform">
        <span value="ios">iOS</span>
        <span value="android">Android</span>
      </Switch>
    )
  }

  renderBuildPicker() {
    return null;

    return (
      <section className={classesBuildPicker}>
        <span className="editor-simulator-container__title">Version</span>
        <BuildPicker
          onChange={this.onUpdateBuild}
          builds={builds}
          selectedBuildName={this.props.build.name}
        />
      </section>
    );
  }

  renderSupportedPlatforms() {
    return null;
    if (!this.props.belongsToCurrentUser()) {
      return null;
    }

    return (
      <section className="editor-simulator-container__platforms">
        <span className="editor-simulator-container__title">Supported</span>
        <label htmlFor="ios">
          <input type="checkbox"
            defaultChecked={this.props.ios}
            onChange={this.onSelectSupportedPlatform}
            name="ios"
            id="ios"
            value="on"/>
          iOS
        </label>

        <label htmlFor="android">
          <input type="checkbox"
            defaultChecked={this.props.android}
            onChange={this.onSelectSupportedPlatform}
            name="android"
            id="android"
            value="on" />
          Android
        </label>
      </section>
    );
  }

  renderRestartButton() {
    return (
      <a
        className="editor-simulator-container__buttons--restart"
        onClick={() => this.props.simulatorAction('restartApp')}>
        Restart
      </a>
    );
  }

  render() {
    const {
      // useDarkTheme,
      builds,
      buildId
    } = this.props;

    const classesSimulator = classNames({
      'editor-simulator-container__simulator': true,
      // 'editor-simulator-container--dark': useDarkTheme,
    });

    const classesBuildPicker = classNames({
      'editor-simulator-container__settings--single': !this.props.belongsToCurrentUser()
    });

    return (
      <div className="editor-simulator-container">
        <h2 style={{fontSize: "14px"}}><a href="http://facebook.github.io/react-native/releases/0.33/">React Native <strong>0.33</strong></a> <span style={{color: "#999"}}>via</span> <a href="http://exponentjs.com">exponent.js</a></h2>
        {this.renderControls()}

        <div className="editor-simulator-container__settings">
          {this.renderSupportedPlatforms()}
          {this.renderBuildPicker()}
        </div>

        <div className="editor-simulator-container__buttons">
          {this.renderSwitch()}
          {this.renderRestartButton()}
        </div>

        <div className={classesSimulator}>
          <iframe
            src={this.appetizeUrlFor('ios')}
            id="ios-simulator"
            width="273px"
            height="9999px"
            frameBorder="0"
            scrolling="no"
            style={{display: this.props.build.platform == 'ios' ? 'block' : 'none'}}
          />
          <iframe
            src={this.appetizeUrlFor('android')}
            id="android-simulator"
            width="300px"
            height="9999px"
            frameBorder="0"
            scrolling="no"
            style={{display: this.props.build.platform == 'android' ? 'block' : 'none'}}
          />
        </div>

        {this.renderQRModal()}

      </div>
    );
  }
}
