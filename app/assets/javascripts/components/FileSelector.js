'use strict';

import React, { Component } from 'react';
import cx from 'react-classset';
import FileSelectorNode from './FileSelectorNode';

export default class FileSelector extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };
  }

  toggleSelector = (e) => {
    e.preventDefault();
    const open = !this.state.open;

    if (!open) {
      React.findDOMNode(this).style.width = '';
    }

    this.setState({
      open
    });
  }

  render() {
    const { files, onSelect, current } = this.props;

    return (
      <div className={cx({
        fileselector: true,
        open: this.state.open
      })}>
        <div className='open-handle' onClick={this.toggleSelector}></div>
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
