'use strict';

import React, { Component } from 'react';
import classNames from 'classNames';

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

    var buttonClasses = classNames({
      'editor-tab-bar__tab__button': true,
      'editor-tab-bar__tab__button--wide': this.state.isOpen,
    });

    return (
      <div className="editor-header__bar editor-tab-bar">
        <span className={buttonClasses} ref="toggleFileSelector" onClick={this.toggleFileSelector.bind(this)}><i className="fa fa-folder-open"></i> Files</span>
        <span className="editor-tab-bar__tab">{currentFile}<div className="editor-tab-bar__tab__circle"></div></span>
      </div>
    );
  }
}
