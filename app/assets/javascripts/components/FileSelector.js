'use strict';

import React, { Component } from 'react';
import cx from 'react-classset';
import FileSelectorNode from './FileSelectorNode';

export default class FileSelector {

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      React.findDOMNode(this).style.width = '';
    }
  }

  render() {
    const { files, onSelect, current, open } = this.props;

    return (
      <div className={cx({
        'fileselector': true,
        'open': open
      })}>
        <div className='fileselector__list-wrapper'>
          <ol className='fileselector__list'>
            {files && Object.keys(files).map((filename) => (
              <FileSelectorNode
                onSelect={onSelect}
                current={current}
                key={filename}
                pathPrefix=''
                label={filename}
                subtree={files[filename]}
              />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}
