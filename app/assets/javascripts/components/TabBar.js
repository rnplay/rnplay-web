'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';

export default class TabBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleFileSelector() {
    this.props.onFileSelectorToggle();
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const {
      onFileSelectorToggle,
      currentFile
    } = this.props;

    const { isOpen } = this.state;

    var buttonClasses = classNames({
      'editor-tab-bar__tab__button': true,
      'editor-tab-bar__tab__button--wide': isOpen,
    });

    const iconClasses = classNames({
      'fa': true,
      'editor-tab-bar__icon': true,
      'fa-folder': !isOpen,
      'fa-folder-open': isOpen,
    });

    return (
      <div className="editor-header__bar editor-tab-bar">
        <span className={buttonClasses} ref="toggleFileSelector" onClick={this.toggleFileSelector.bind(this)}>
          <i className={iconClasses}></i>
          <span className="editor-tab-bar__text">Files</span>
          <i className="fa fa-angle-right editor-tab-bar__icon--right"></i>
        </span>
        <span className="editor-tab-bar__tab">
          {currentFile}
          <div className="editor-tab-bar__tab__circle"></div>
        </span>
      </div>
    );
  }
}
