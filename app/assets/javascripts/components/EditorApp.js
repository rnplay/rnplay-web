'use strict';

import $ from 'jquery';
import React, { Component } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/vim';

import Editor from './Editor';
import Header from './header.js';
import Footer from './footer.js';
import EditorHeader from './EditorHeader';
import ErrorView from './ErrorView';
import Simulator from './Simulator';

export default class EditorApp extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      picked: props.app.picked,
    };

    this.simulatorActive = false;
  }

  componentWillMount() {
    window.addEventListener('message', this.handleSimulatorEvent, false);
  }

  componentDidMount() {
    CodeMirror.commands.save = this.onFileSave;
    const iframe = document.querySelector('iframe');

    $(document).keyup(() => {
      iframe.contentWindow.postMessage('heartbeat', '*');
    });
  }

  componentWillReceiveProps(nextProps) {
    const { buildId, buildUpdated, appSaveInProgress } = this.props;
    const { appSaveInProgress: saveStillInProgress, appSaveError } = nextProps;
    const { simulatorActive } = this;

    if (appSaveInProgress && !saveStillInProgress && !appSaveError) {
      if (buildUpdated) {
        window.location.reload();
      } else {
        const isOldBuild = parseInt(buildId) < 3;
        const iframe = document.querySelector('iframe');
        // From 0.4.4 and up, we enable live reload - no need to reload the app
        if (isOldBuild) {
          if (simulatorActive) {
            iframe.contentWindow.postMessage('restartApp', '*');
          } else {
            iframe.contentWindow.postMessage('requestSession', '*');
          }
        } else if (!simulatorActive) {
          iframe.contentWindow.postMessage('requestSession', '*');
        }
      }
    }
  }

  // Keep track of simulator lifecycle
  handleSimulatorEvent(e) {
    const { data } = e;
    if (data === 'sessionRequested') {
      this.simulatorActive = true;
    } else if (data === 'userError') {
        console.log(data);
    } else if (data === 'firstFrameReceived') {
        console.log(data);
    } else if (data === 'timeoutWarning') {
        console.log(data);
    } else if(data === 'sessionEnded') {
      console.log(data);
      this.simulatorActive = false;
    }
  }

  onUpdateName = (name) => {
    const { dispatch, updateName } = this.props;
    dispatch(updateName(name));
  }

  onUpdateBody = (newBody) => {
    const { dispatch, updateBody, currentFile } = this.props;
    dispatch(updateBody(currentFile, newBody));
  }

  onUpdateBuild = (buildId) => {
    const { dispatch, updateBuildId } = this.props;
    dispatch(updateBuildId(buildId));
  }

  onPick = () => {
    $.ajax({
      url: `/apps/${this.props.app.id}`,
      data: {
        app: {
          pick: +!this.state.picked
        }
      },
      type: 'PUT',
      success: () => {
        this.setState({
          picked: !this.state.picked
        });
      }
    });
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
    const { name, buildId, buildUpdated, app: { id } } = this.props;
    const { body } = this.state;
    $.ajax({
      url: `/apps/${id}/fork`,
      data: {
        app: {
          name,
          body,
          build_id: buildId
        }
      },
      type: 'POST',
      success: ({ succes, error, token }) => {
        if (data.success) {
          window.location.href = `/apps/${token}`;
        } else {
          alert(error);
        }
      }
    });
  }

  onFileSelectorToggle = () => {
    const { dispatch, toggleFileSelector } = this.props;
    dispatch(toggleFileSelector());
  }

  renderHeader() {
    if (this.props.showHeader) {
      const { currentUser, app, headerLogoSrc} = this.props;
      return (
        <Header
          currentUser={currentUser}
          currentApp={app}
          headerLogoSrc={headerLogoSrc}
        />
      );
    }
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
      picked,
      currentFile,
      fileTree,
      buildId,
      appSaveError,
      fileSelectorOpen
    } = this.props;

    const {
      onFileSelectorToggle,
      onUpdateName,
      onUpdateBuild,
      onChangeFile,
      onUpdateBody,
      onPick,
      onSave,
      onFork
    } = this;

    const { appetizeUrl } = app;

    const simulatorUrl = useDarkTheme ?
      appetizeUrl.replace('deviceColor=white', 'deviceColor=black') :
      appetizeUrl;

    const editorHeaderProps = {
      name,
      useDarkTheme,
      app,
      currentUser,
      builds,
      buildId,
      picked,
      onUpdateName,
      onUpdateBuild,
      onPick,
      onSave,
      onFork,
      onFileSelectorToggle
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
      fileSelectorOpen
    };

    return (
      <div className="editor-container" style={{paddingTop: showHeader ? 50 : 0}}>
        {this.renderHeader()}
        <EditorHeader {...editorHeaderProps} />
        <div className="editor-container__body">
          <ErrorView error={appSaveError} />
          <Editor {...editorProps} />
          <Simulator
            url={simulatorUrl}
            app={this.props.app}
            useDarkTheme={useDarkTheme}
          />
        </div>
      </div>
    )
  }
};
