'use strict';

import React from 'react';
import cx from 'react-classset';

import BuildPicker from './BuildPicker';

const maybeCallMethod = (obj, method, ...args) => {
  obj[method] && method(...args);
};

export default class EditorHeader {

  onUpdateName = () => {
    const { onUpdateName } = this.props;
    const nameInputNode = React.findDOMNode(this.refs.nameInput);
    onUpdateName && onUpdateName(nameInputNode.value);
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
    const { useDarkTheme, builds, name, buildId } = this.props;
    const classes = cx({
      'editor-header': true,
      'editor-header--dark': useDarkTheme
    });

    return (
      <form className={classes} onSubmit={this.handleOnSubmit}>
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
        {this.renderPickButton()}
        {this.renderSaveButton()}
      </form>
    );
  }
}
