'use strict';

import React, { Component } from 'react';
import cx from 'react-classset';

import BuildPicker from './BuildPicker';
import GitModal from './git_modal.js';

const maybeCallMethod = (obj, method, ...args) => {
  obj[method] && obj[method](...args);
};

export default class EditorHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gitModalIsVisible: null
    };
  }

  onUpdateName = () => {
    const nameInputNode = React.findDOMNode(this.refs.nameInput);
    maybeCallMethod(this.props, 'onUpdateName', nameInputNode.value);
  }

  handleOnSubmit = (e)  => {
    e.preventDefault();
    const method = this.belongsToCurrentUser() ? 'onSave' : 'onFork';
    this[method](e);
  }

  onSave = (e) => {
    e.preventDefault();
    maybeCallMethod(this.props, 'onSave');
  }

  onFork = (e) => {
    e.preventDefault();
    maybeCallMethod(this.props, 'onFork');
  }

  onPick = (e) => {
    e.preventDefault();
    maybeCallMethod(this.props, 'onPick');
  }

  onUpdateBuild = (value) => {
    maybeCallMethod(this.props, 'onUpdateBuild', value);
  }

  belongsToCurrentUser() {
    const { currentUser, app : { creatorId} } = this.props;
    return currentUser && currentUser.id === creatorId;
  }

  currentUserIsAdmin() {
    const { currentUser } = this.props;
    return currentUser && currentUser.admin;
  }

  showGitModal = (e) => {
    e.preventDefault();
    this.setState({gitModalIsVisible: true});
  }

  hideGitModal = (e) => {
    e.preventDefault();
    this.setState({gitModalIsVisible: false});
  }

  renderGitModal = () => {
    return (
      <GitModal app={this.props.app}
               onClickBackdrop={this.hideGitModal}
               isOpen={this.state.gitModalIsVisible} />
    )
  }

  renderGitButton() {
      return (
        <button
          onClick={this.renderGitModal}
          className="btn-info editor-header__pick-button"
        >
          Clone with git
        </button>
      );
  }

  renderPickButton() {
    if (this.currentUserIsAdmin()) {
      return (
        <button
          onClick={this.onPick}
          className="btn-info editor-header__pick-button"
        >
          {this.props.picked ? 'Unpick' : 'Pick'}
        </button>
      );
    }
  }

  renderSaveButton() {
    let method = this.onFork;
    let text = 'Fork &amp; Reload';

    if (this.belongsToCurrentUser()) {
      text = 'Save & Reload';
      method = this.onSave;
    }

    return (
      <button
        onClick={method}
        className="btn-info editor-header__save-button"
      >
        {text}
      </button>
    );
  }

  render() {
    const { useDarkTheme, builds, name, buildId, onFileSelectorToggle } = this.props;
    const classes = cx({
      'editor-header': true,
      'editor-header--dark': useDarkTheme
    });

    return (
      <div className={classes}>
        <button
          onClick={onFileSelectorToggle}
        title="Open file drawer">
          <i className="fa fa-folder-open"></i>
        </button>
        <form onSubmit={this.handleOnSubmit}>
          <BuildPicker
            onChange={this.onUpdateBuild}
            builds={builds}
            selectedBuildId={buildId}
          />
          <input
            type="text"
            ref="nameInput"
            placeholder="Give this app a title"
            value={name}
            onChange={this.onUpdateName}
            className="editor-header__name-input"
          />
          {this.renderGitButton()}
          {this.renderPickButton()}
          {this.renderSaveButton()}
        </form>
      </div>
    );
  }
}
