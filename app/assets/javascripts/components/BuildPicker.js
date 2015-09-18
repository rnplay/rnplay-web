'use strict';

import React from 'react';

export default class BuildPicker {

  renderOptions() {
    return this.props.builds.map(({ id, platform, name }) => {
      if (this.props[platform]) {
        return <option key={id} value={id}>RN {name}, {platform == 'ios' ? 'iOS' : 'Android'}</option>
      }
    });
  }

  onChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select
          onChange={this.onChange}
          defaultValue={this.props.selectedBuildId}
          className="build-picker">
          {this.renderOptions()}
        </select>
      </div>
    )
  }
}
