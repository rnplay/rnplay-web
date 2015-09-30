'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';
import Qs from 'qs';
import { result, find, template, clone } from 'lodash';

export default class Simulator extends Component {

  constructor(props) {
    super(props);
  }

  appetizeUrlFor(platform) {
    var appetizeOptions = {
      embed: true,
      screenOnly: this.props.url_params.screen_only || false,
      device: platform == 'ios' ? 'iphone5' : 'nexus5',
      xdocMsg: true,
      scale: this.props.url_params.scale || '75',
      deviceColor: 'white',
      orientation: 'portrait',
      debug: true
    }

    var currentBuild = find(this.props.builds, (build) => {return build.id == this.props.app.buildId});

    var bundlePath = platform == 'android' ? this.props.app.bundlePath : this.props.app.bundlePath+"/index.ios.bundle";
    var build = this.buildFor(platform, currentBuild.name);
    var appetizeId = build.appetize_id;

    var appParams = {
      moduleName: this.props.app.moduleName,
      packagerRoot: template(this.props.app.packagerRoot)({buildShortName: build.short_name}),
      bundleUrl: template(this.props.app.packagerUrlTemplate)({bundlePath: bundlePath, buildShortName: build.short_name})
    }

    var url = `https://appetize.io/embed/${appetizeId}?${Qs.stringify(appetizeOptions)}&params=${encodeURIComponent(JSON.stringify(appParams))}`
    return url;
  }

  buildFor = (platform, version) => {
    return find(this.props.builds, (build) => {
      return build.platform == platform && build.name == version;
    });
  }

  render() {
    return (
      <iframe
        src={this.appetizeUrlFor('ios')}
        id="ios-simulator"
        width="273px"
        height="9999px"
        frameBorder="0"
        scrolling="no"
      />
    );
  }
}
