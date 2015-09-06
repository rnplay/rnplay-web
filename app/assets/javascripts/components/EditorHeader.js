'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';

import MainMenu from './MainMenu';
import GitModal from './git_modal';

const maybeCallMethod = (obj, method, ...args) => {
  obj[method] && obj[method](...args);
};

export default class EditorHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gitModalIsVisible: null,
      isMenuOpen: false
    };
  }

  onMenuToggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  onUpdateName = (e) => {
    maybeCallMethod(this.props, 'onUpdateName', e.target.value);
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

  isUserLoggedIn() {
    const { currentUser } = this.props;
    return !!currentUser;
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
    if (this.belongsToCurrentUser()) {
      return (
        <GitModal app={this.props.app}
                 token={this.props.currentUser.authentication_token}
                 onClickBackdrop={this.hideGitModal}
                 isOpen={this.state.gitModalIsVisible} />
      )
    }
  }

  renderGitButton() {
    if ( ! this.belongsToCurrentUser()) {
      return (
        <button
          onClick={this.showGitModal}
          className="editor-header__button">
          Clone
        </button>
      );
    }
  }

  renderForkButton() {
    return (
      <button
        onClick={this.onFork}
        className="editor-header__button"
      >
        <i className="fa fa-code-fork"></i> Fork
      </button>
    );
  }

  renderPickButton() {
    if (this.currentUserIsAdmin()) {

      const icon = this.props.appIsPicked ? 'fa-star' : 'fa-star-o';
      const iconClasses = `fa ${icon}`;

      return (
        <button
          onClick={this.onPick}
          className="editor-header__button">
          <i className={iconClasses}></i> {this.props.appIsPicked ? 'Unpick' : 'Pick'}
        </button>
      );
    }
  }

  renderSaveButton() {
    if ( ! this.belongsToCurrentUser()) {
      return (
        <button
          onClick={this.onSave}
          className="editor-header__button editor-header__button--save">
          Save
        </button>
      );
    }
  }

  renderAuthor() {
    const { username } = this.props.currentUser;
    const name = username ? `@${username}` : 'anonymous';

    return (
      <span className="editor-header__author">by {name}</span>
    );
  }

  render() {
    const { useDarkTheme, name } = this.props;
    const classes = classNames({
      'editor-header--dark': useDarkTheme,
      'editor-header__bar': true,
      'editor-header': true,
    });

    return (
      <div className={classes}>

        <MainMenu
          isOpen={this.state.isMenuOpen}
          isUserLoggedIn={this.isUserLoggedIn()}
          onMenuToggle={this.onMenuToggle.bind(this)} />

        <button
          className="editor-header__button editor-header__menu-toggle"
          onClick={this.onMenuToggle.bind(this)}
          title="Open Menu">
          <i className="fa fa-bars"></i>
        </button>
        <form onSubmit={this.handleOnSubmit}>
          <input
            type="text"
            placeholder="Give this app a title"
            value={name}
            onChange={this.onUpdateName}
            className="editor-header__name-input"
          />
          {this.renderAuthor()}
          <div className="editor-header__actions">
            {this.renderForkButton()}
            {this.renderPickButton()}
          </div>
        </form>
        {this.renderGitModal()}
      </div>
    );
  }
}
