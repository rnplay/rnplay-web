'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';
import CodeMirror from 'codemirror';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/vim';

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
    this.simulatorIframe = document.querySelector('iframe');
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
      iframe.contentWindow.postMessage('requestSession', '*');
    }
  }

  sendHeartBeat = () => {
    this.simulatorIframe.contentWindow.postMessage('heartbeat', '*');
  }

  saveScreenshot = () => {
    this.simulatorIframe.contentWindow.postMessage('getScreenshot', '*');
  }

  openDevMenu = () => {
    this.simulatorIframe.contentWindow.postMessage('shakeDevice', '*');
  }

  rotate = (direction) => {
    this.simulatorIframe.contentWindow.postMessage(`rotate${direction}`, '*');
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
    } else if (data.type === 'debug' && data.message.indexOf('Running application') && (this.belongsToCurrentUser() || this.currentUserIsAdmin())) {
      console.log('Taking screenshot in 3 seconds...')
      setTimeout(() => {
        console.log('Took a screenshot!')
        this.saveScreenshot();
      }.bind(this), 3000)
    }

    if (data.type == 'debug') {
      dispatch(log(data));
    }
  }

  belongsToCurrentUser = () => {
    const { currentUser, app : { creatorId} } = this.props;
    return currentUser && currentUser.id === creatorId;
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

  onUpdateBuild = (buildId) => {
    const { dispatch, updateBuildId, app: {id} } = this.props;
    dispatch(updateBuildId(id, buildId));
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
    const { dispatch, saveFile, fileBodies, currentFile, app: { id } } = this.props;
    const fileBody = fileBodies[currentFile];

    if (fileBody) {
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
      saved
    } = this.props;

    const {
      onFileSelectorToggle,
      onUpdateName,
      onUpdateBuild,
      onChangeFile,
      onUpdateBody,
      belongsToCurrentUser,
      currentUserIsAdmin,
      onPick,
      onSave,
      onFork,
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
      currentUserIsAdmin,
      saveScreenshot,
      openDevMenu,
      rotate
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
          {...buildPickerProps}
        />

      </div>
    );
  }
};
