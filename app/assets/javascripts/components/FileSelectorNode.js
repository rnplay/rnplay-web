'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';

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

    const classes = classNames({
      'editor-file-selector__list__node': true,
      'editor-file-selector__current': current.indexOf(fullPath) === 0 && !subtree,
      'editor-file-selector__list__node--open': open
    });

    const labelClasses = classNames({
      'editor-file-selector__list__node--directory' : !!subtree,
      'editor-file-selector__list__node--open': open,
      'editor-file-selector__list__node__label': true,
    });


    // Display right icon based on node type (folder or file)
    let icon;

    if (!!subtree) {
      icon = open ? <i className="fa fa-folder-open"></i> : <i className="fa fa-folder"></i>;
    } else {
      icon = <i className="fa fa-file-code-o"></i>;
    }

    return (
      <li className={classes} onClick={this.onNodeClick}>
        {icon}
        <span className={labelClasses}>{label}</span>
        {open && sub && <ul className='editor-file-selector__list'>{sub}</ul>}
      </li>
    );
  }
}
