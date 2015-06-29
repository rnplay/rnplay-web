'use strict';

import React, { Component } from 'react';
import cx from 'react-classset';

import BuildPicker from './BuildPicker';
import GitModal from './git_modal';

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
    if (this.belongsToCurrentUser()) {
      return (
        <button
          onClick={this.showGitModal}
          className="btn-info editor-header__button"
        >
          Clone
        </button>
      );
    }
  }

  renderForkButton() {
    if (this.currentUserIsAdmin()) {
      return (
        <button
          onClick={this.onFork}
          className="btn-info editor-header__button"
        >
          Fork
        </button>
      );
    }
  }

  renderPickButton() {
    if (this.currentUserIsAdmin()) {
      return (
        <button
          onClick={this.onPick}
          className="btn-info editor-header__button"
        >
          {this.props.appIsPicked ? 'Unpick' : 'Pick'}
        </button>
      );
    }
  }

  renderSaveButton() {

    if (this.belongsToCurrentUser()) {
      return (
        <button
          onClick={this.onSave}
          className="btn-info editor-header__button"
        >
          Save
        </button>
      );
    }
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
          className="editor-header__drawer-toggle"
          onClick={onFileSelectorToggle}
        title="Open file drawer">
          <i className="fa fa-folder-open"></i>
        </button>
        <form onSubmit={this.handleOnSubmit}>
          <input
            type="text"
            ref="nameInput"
            placeholder="Give this app a title"
            value={name}
            onChange={this.onUpdateName}
            className="editor-header__name-input"
          />
          <BuildPicker
            onChange={this.onUpdateBuild}
            builds={builds}
            selectedBuildId={buildId}
          />
          <div className="editor-header__button-container">
            {this.renderForkButton()}
            {this.renderGitButton()}
            {this.renderPickButton()}
            {this.renderSaveButton()}
          </div>
        </form>
        {this.renderGitModal()}
      </div>
    );
  }
}
