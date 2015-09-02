'use strict';

import React, { Component } from 'react';
import classNames from 'classNames';
import FileSelectorNode from './FileSelectorNode';

export default class FileSelector {

  /*
  
  Seems to be unnecessary, toggling using
  classes should be okay for now.

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      React.findDOMNode(this).style.width = '';
    }
  }
  */

  render() {
    const { files, onSelect, current, open } = this.props;

    return (
      <div className={classNames({
        'editor-file-selector': true,
        'editor-file-selector--open': open
      })}>
          <ul className='editor-file-selector__list'>
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
          </ul>
      </div>
    );
  }
}
