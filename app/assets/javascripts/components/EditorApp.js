'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';
import CodeMirror from 'codemirror';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/vim';
import {find} from 'lodash';
import Editor from './Editor';
import Footer from './footer.js';
import ErrorView from './ErrorView';
import Simulator from './Simulator';

export default class EditorApp extends Component {

  constructor(props, context) {
    super(props, context);
    this.simulatorActive = false;
  }

  componentWillMount() {
    window.addEventListener('message', this.handleSimulatorEvent, false);
  }

  componentDidMount() {
    CodeMirror.commands.save = this.onFileSave;
    this.iosSimulator = document.querySelector('#ios-simulator');
    this.androidSimulator = document.querySelector('#android-simulator');
  }

  componentWillReceiveProps(nextProps) {
    const { buildId, buildUpdated, appSaveInProgress } = this.props;
    const { appSaveInProgress: saveStillInProgress, appSaveError, forkToken } = nextProps;
    const { simulatorActive } = this;

    if (forkToken) {
      window.location.href = `/apps/${forkToken}`;
      return;
    }

    if (appSaveInProgress && !saveStillInProgress && !appSaveError) {
      const iframe = this.simulatorIframe;
      this.simulatorAction('requestSession');
    }
  }

  simulatorAction = (action) => {
    this.iosSimulator.contentWindow.postMessage(action, '*')
    this.androidSimulator.contentWindow.postMessage(action, '*')
  }

  sendHeartBeat = () => {
    this.simulatorAction('heartbeat');
  }

  saveScreenshot = () => {
    this.simulatorAction('getScreenshot');
  }

  openDevMenu = () => {
    this.simulatorAction('shakeDevice');
  }

  rotate = (direction) => {
    this.simulatorAction(`rotate${direction}`);
  }

  // Keep track of simulator lifecycle
  handleSimulatorEvent = (e) => {

    const { data } = e;
    const { dispatch, log, saveScreenshot } = this.props;

    if (data.type === 'screenshot') {
      dispatch(saveScreenshot(this.props.app.id, data.data));
    } else if (data === 'sessionRequested') {
      this.simulatorActive = true;
    } else if (data === 'sessionEnded') {
      this.simulatorActive = false;
    } else if (data.type === 'debug' && data.message.indexOf('Running application') !== -1 && this.belongsToCurrentUser()) {
      console.log('Taking screenshot in 3 seconds...')
      setTimeout(() => {
        console.log('Took a screenshot!')
        this.saveScreenshot();
      }.bind(this), 3000)
    }
    if (data.type == 'debug' && data.message.indexOf('GoogleAnalytics') === -1 && data.message.indexOf('devtools socket') === -1) {
      dispatch(log(data));
    }
  }

  belongsToCurrentUser = () => {
    const { currentUser, app } = this.props;
    return currentUser && currentUser.id === app.creator.id;
  }

  currentUserIsAdmin = () => {
    const { currentUser } = this.props;
    return currentUser && currentUser.admin;
  }

  onUpdateName = (name) => {
    const { dispatch, updateName, app: {id} } = this.props;
    dispatch(updateName(id, name));
  }

  onUpdateBody = (newBody) => {
    const { dispatch, updateBody, currentFile } = this.props;
    dispatch(updateBody(currentFile, newBody));
  }

  onUpdateBuild = (build) => {
    const { dispatch, viewerUpdateBuild, authorUpdateBuild, app: {id} } = this.props;
    if (this.belongsToCurrentUser()) {
      dispatch(authorUpdateBuild(id, build));
    } else {
      dispatch(viewerUpdateBuild(id, build));
    }
  }

  onSelectSupportedPlatform = (platform, value) => {
    const { dispatch, authorSelectSupportedPlatform, app: {id} } = this.props;
    dispatch(authorSelectSupportedPlatform(id, platform, value));
  }

  onPick = () => {
    const { dispatch, toggleAppPickStatus, appIsPicked, app: { id } } = this.props;
    dispatch(toggleAppPickStatus(id, !appIsPicked));

  }

  onChangeFile = (filename) => {
    const { dispatch, switchFile } = this.props;
    dispatch(switchFile(filename));
  }

  /**
   * Triggers saving of the current file, if the buffer as been modified
   */
  onFileSave = () => {
    const { currentUser, dispatch, saveFile, fileBodies, currentFile, app: { id } } = this.props;
    const fileBody = fileBodies[currentFile];
    if (this.belongsToCurrentUser() && fileBody) {
      dispatch(saveFile(id, currentFile, fileBody));
    }
  }

  onSave = () => {
    const { dispatch, saveApp, fileBodies, name, buildId, app: { id} } = this.props;
    dispatch(saveApp(id, name, buildId, fileBodies));
  }

  onFork = () => {
    const { dispatch, forkApp, app: { urlToken }, currentUser } = this.props;
    if (currentUser) {
      dispatch(forkApp(urlToken));
    } else {
      window.location = "/users/sign_in";
    }
  }

  onFileSelectorToggle = () => {
    const { dispatch, toggleFileSelector } = this.props;
    dispatch(toggleFileSelector());
  }

  render() {

    const {
      useDarkTheme,
      useVimKeyBindings,
      app,
      currentUser,
      builds,
      showHeader,
      name,
      currentFile,
      fileTree,
      buildId,
      appSaveError,
      appIsPicked,
      fileSelectorOpen,
      logs,
      unsavedChanges,
      saved,
      android,
      ios
    } = this.props;

    const {
      onFileSelectorToggle,
      onUpdateName,
      onUpdateBuild,
      onChangeFile,
      onUpdateBody,
      onSelectSupportedPlatform,
      belongsToCurrentUser,
      currentUserIsAdmin,
      onPick,
      onSave,
      onFork,
      onFileSave,
      saveScreenshot,
      rotate,
      openDevMenu
    } = this;

    const { appetizeUrl } = app;

    const editorHeaderProps = {
      app,
      appIsPicked,
      belongsToCurrentUser,
      currentUser,
      creator: app.creator,
      name,
      onFork,
      onPick,
      onSave,
      onUpdateName,
      useDarkTheme,
    };

    const editorProps = {
      app,
      fileTree,
      currentFile,
      currentUser,
      useVimKeyBindings,
      useDarkTheme,
      onChangeFile,
      onUpdateBody,
      onFileSave,
      belongsToCurrentUser,
      fileSelectorOpen,
      onFileSelectorToggle,
      logs,
      unsavedChanges,
      saved
    };

    const buildPickerProps = {
      builds,
      buildId,
      onUpdateBuild,
      onSelectSupportedPlatform,
      currentUserIsAdmin,
      saveScreenshot,
      openDevMenu,
      rotate,
      android,
      ios
    };

    const classes = classNames({
      'editor-app': true,
      'dark-theme': useDarkTheme
    });

    return (

      <div onKeyUp={this.sendHeartBeat} className={classes}>

        <Editor editorHeaderProps={editorHeaderProps} {...editorProps} />

        <Simulator
          app={this.props.app}
          useDarkTheme={useDarkTheme}
          belongsToCurrentUser={belongsToCurrentUser}
          build={find(builds, (build) => {return build.id == buildId})}
          {...buildPickerProps}
        />

      </div>
    );
  }
};
