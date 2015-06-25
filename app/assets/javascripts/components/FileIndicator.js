'use strict';

import React from 'react';
import cx from 'react-classset';

export default class FileIndicator {

  render() {
    const {
      current,
      useDarkTheme
    } = this.props;

    return (
      <div className="file-indicator">
        {current}
      </div>
    );
  }
}
