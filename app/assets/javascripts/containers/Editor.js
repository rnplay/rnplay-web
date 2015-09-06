'use strict';

import React from 'react';
import { connect } from 'react-redux';

import { editor as editorActions, logger as loggerActions } from '../actions';
import EditorApp from '../components/EditorApp';

@connect((state) => {
  const { editor, logs } = state;
  const {
    app,
    newName,
    newBuildId,
    currentFile,
    fileTree,
    fileBodies,
    showHeader,
    appSaveInProgress,
    appSaveError,
    fileSelectorOpen,
    appIsPicked,
    forkToken,
    unsaved
  } = editor;

  return {
    app,
    appIsPicked: appIsPicked !== null ? appIsPicked : app.picked,
    name: newName || app.name,
    buildId: newBuildId || app.buildId,
    buildUpdated: !!newBuildId,
    currentFile,
    fileTree,
    fileBodies,
    forkToken,
    showHeader,
    appSaveInProgress,
    appSaveError,
    fileSelectorOpen,
    unsaved,
    logs: logs.logs
  };
})
export default class Editor {

  render() {
    return <EditorApp {...this.props} {...editorActions} {...loggerActions} />;
  }

}
