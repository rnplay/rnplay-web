'use strict';

import React from 'react';
import {map, uniq} from 'lodash';

export default class BuildPicker {

  renderOptions() {
    return uniq(map(this.props.builds, 'name')).map((name) => {
      return <option key={name} value={name}>{name}</option>
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
          defaultValue={this.props.selectedBuildName}
          className="build-picker">
          {this.renderOptions()}
        </select>
      </div>
    )
  }
}
