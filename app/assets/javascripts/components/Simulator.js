'use strict';

import React from 'react';
import cx from 'react-classset';

const styles = {
  width: 320,
  paddingTop: 20,
  paddingLeft: 20,
  overflow: 'hidden'
};

export default class Simulator {

  render() {
    const { useDarkTheme, url } = this.props;
    const classes = cx({
      'editor-container__simulator': true,
      'editor-container__simulator--dark': useDarkTheme
    });

    return (
      <div
        className={classes}
        style={styles}
      >
        <iframe
          src={url}
          width="320px"
          height="800px"
          frameBorder="0"
          scrolling="no"
        />
      </div>
    );
  }

}
