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
import Simulator from './Simulator';

export default class EditorApp extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      // name: props.app.name,
      // TODO figure out a better way to get the current file.
      // maybe we can store the last open file in the database?
      // currentFile: 'index.ios.js',
      // buildId: props.app.buildId,
      // showHeader: true,
      picked: props.app.picked,
    };

    this.simulatorActive = false;
  }

  componentWillMount() {
    // cache for all modified file bodies
    this.fileBodies = {};
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
    const { simulatorActive } = this;

    if (appSaveInProgress && !nextProps.appSaveInProgress) {
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
    if (data == 'sessionRequested') {
      this.simulatorActive = true;
    } else if (data == 'userError') {
        console.log(data);
    } else if (data == 'firstFrameReceived') {
        console.log(data);
    } else if (data == 'timeoutWarning') {
        console.log(data);
    } else if(data == 'sessionEnded') {
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

    // const appUrl = `/apps/${id}`;
    // const filesUrl = `${appUrl}/files/`;

    // store all updates files
    // const requests = Object.keys(fileBodies).map((filename) => {
    //   return $.ajax({
    //     url: filesUrl + encodeURIComponent(filename),
    //     data: {
    //       body: fileBodies[filename]
    //     },
    //     // hacky way until we fix the server to return json
    //     // (atleast an emtpy string)
    //     dataType: 'html',
    //     type: 'PUT'
    //   });
    // });
    //
    // // update app info
    // requests.push($.ajax({
    //   url: appUrl,
    //   data: {
    //     app: {
    //       name,
    //       buildId
    //     }
    //   },
    //   type: 'PUT'
    // }));

    // Promise.all(requests)
      // .then(() => {
      //   if (buildUpdated) {
      //     window.location.reload();
      //   } else {
      //     const isOldBuild = parseInt(buildId) < 3;
      //     const iframe = document.querySelector('iframe');
      //     // From 0.4.4 and up, we enable live reload - no need to reload the app
      //     if (isOldBuild) {
      //       if (simulatorActive) {
      //         iframe.contentWindow.postMessage('restartApp', '*');
      //       } else {
      //         iframe.contentWindow.postMessage('requestSession', '*');
      //       }
      //     } else if (!simulatorActive) {
      //       iframe.contentWindow.postMessage('requestSession', '*');
      //     }
      //   }
      // })
      // .catch((err) => {
      //   // TODO display some error message
      //   // TODO in case of error do this:
      //   // self.fileBodies = _.merge(fileBodies, self.fileBodies);
      // });

    // reset fileBodies so we don't save these files again next time
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
      buildId
    } = this.props;

    const {
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
      onFork
    };

    const editorProps = {
      app,
      fileTree,
      currentFile,
      currentUser,
      useVimKeyBindings,
      useDarkTheme,
      onChangeFile,
      onUpdateBody
    };

    return (
      <div className="editor-container" style={{paddingTop: showHeader ? 50 : 0}}>
        {this.renderHeader()}
        <EditorHeader {...editorHeaderProps} />
        <div className="editor-container__body">
          <Editor {...editorProps} />
          <Simulator
            url={simulatorUrl}
            useDarkTheme={useDarkTheme}
          />
        </div>
      </div>
    )
  }
};
