import React, { Component } from 'react';

import classNames from 'classnames';
import Backdrop from './backdrop';

export default class MainMenu extends Component {

  renderUserActions() {
    const { isUserLoggedIn } = this.props;

    if (isUserLoggedIn) {
      return (
        <div className="editor-main-menu__row">
          <a className="editor-main-menu__link editor-main-menu__link--row" rel="nofollow" data-method="delete" href="/users/sign_out"><i className="fa fa-sign-out"></i>Logout</a>
          <a className="editor-main-menu__link editor-main-menu__link--row" href="/users/edit"><i className="fa fa-gear"></i>Settings</a>
        </div>
      );
    }

    return (
      <div className="editor-main-menu__row">
        <a className="editor-main-menu__link editor-main-menu__link--row" href="/users/sign_in"><i className="fa fa-sign-in"></i>Login</a>
        <a className="editor-main-menu__link editor-main-menu__link--row" href="/users/sign_up"><i className="fa fa-user-plus"></i>Sign Up</a>
      </div>
    );
  }

  renderMenuItemMyApps() {
    const { isUserLoggedIn } = this.props;

    return isUserLoggedIn && (
      <a className="editor-main-menu__link" href="/apps"><i className="fa fa-rocket"></i>My Apps</a>
    );
  }

  render() {
    const { onMenuToggle, isOpen } = this.props;

    const classes = classNames({
      'editor-main-menu': true,
      'editor-main-menu--open': this.props.isOpen
    });

    return (
      <div className="editor-main-menu__wrapper">
        <Backdrop type="dark" isVisible={isOpen} onClick={onMenuToggle} />
        <div className={classes}>

          <div className="editor-main-menu__header">
            <button
              className="editor-header__button editor-header__menu-toggle"
              onClick={onMenuToggle}
              title="Close Menu">
              <i className="fa fa-times"></i>
            </button>
            <span className="editor-main-menu__title">React Native Playground</span>
          </div>

          <a className="editor-main-menu__link" href="/apps/new"><i className="fa fa-plus"></i>New App</a>
          {this.renderMenuItemMyApps()}
          <a className="editor-main-menu__link" href="/apps/picks"><i className="fa fa-star"></i>Staff picks</a>
          <a className="editor-main-menu__link" href="/about"><i className="fa fa-info"></i>About</a>

          {this.renderUserActions()}

        </div>
      </div>
    )
  }
}
