'use strict';

import React, { Component } from 'react';
import cx from 'react-classset';

export default class FileSelectorNode extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };
  }

  onNodeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { subtree } = this.props;

    if (subtree) {
      this.setState({
        open: !this.state.open
      });
    } else {
      const { pathPrefix, onSelect, label} = this.props;
      onSelect(pathPrefix + label);
    }
  }

  render() {
    const { subtree, onSelect, label, current, pathPrefix } = this.props;
    const { open } = this.state;

    const fullPath = `${pathPrefix}${label}${(subtree ? '/' : '')}`;
    const sub = open && subtree && Object.keys(subtree)
      .map((filenameOrPathSegment) => (
        <FileSelectorNode
          onSelect={onSelect}
          current={current}
          key={filenameOrPathSegment}
          pathPrefix={fullPath}
          label={filenameOrPathSegment}
          subtree={subtree[filenameOrPathSegment]}
        />
      ));

    return (
      <li
        className={cx({
          'fileselector__list__node': true,
          'fileselector__list__node--has-children' : !!subtree,
          'current': current.indexOf(fullPath) === 0,
          'fileselector__list__node--open': open
        })}
        onClick={this.onNodeClick}
      >
        <span className='fileselector__list__node__label'>{label}</span>
        {open && sub && <ol className='fileselector__list'>{sub}</ol>}
      </li>
    );
  }
}
