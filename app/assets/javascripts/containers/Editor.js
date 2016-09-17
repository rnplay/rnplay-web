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
    newPlatform,
    currentFile,
    fileBodies,
    showHeader,
    appSaveInProgress,
    appSaveError,
    appIsPicked,
    forkToken,
    ios,
    android,
    unsavedChanges,
    saved
  } = editor;

  return {
    app,
    appIsPicked: appIsPicked !== null ? appIsPicked : app.picked,
    someValue: 'test',
    name: newName || app.name,
    buildId: newBuildId || app.buildId,
    platform: newPlatform || app.platform,
    ios: ios == null ? app.ios : ios,
    android: android == null ? app.android : android,
    buildUpdated: !!newBuildId,
    currentFile,
    fileBodies,
    forkToken,
    showHeader,
    appSaveInProgress,
    appSaveError,
    unsavedChanges,
    saved,
    logs: logs.logs
  };
})

export default class Editor {

  render() {
    return <EditorApp {...this.props} {...editorActions} {...loggerActions} />;
  }

}
