'use strict';

import React from 'react';

export default class BuildPicker {

  renderOptions() {
    return [
      <option
        key="disabled"
        disabled="disabled">
        -- React Native version --
      </option>
    ].concat(this.props.builds.map(({ id, name }) => (
      <option key={id} value={id}>{name}</option>
    )));
  }

  onChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <select
        onChange={this.onChange}
        defaultValue={this.props.selectedBuildId}
        className="build-picker">
        {this.renderOptions()}
      </select>
    )
  }
}
