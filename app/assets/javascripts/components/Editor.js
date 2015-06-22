'use strict';

import React from 'react';
import CodeMirror from 'codemirror';
import assign from 'lodash/object/assign';

import FileSelector from './FileSelector';

/**
 * Builds a nested object from an array of filepaths
 * @param  {array} filenames The filenames
 * @return {object}          The tree
 */
const makeFileTree = (filenames) => {
  return filenames.reduce((tree, filename) => {
    const parts = filename.split('/');
    let tempTree = tree;
    let part;
    while((part = parts.shift())) {
      tempTree = tempTree[part] = parts.length === 0 ?
        null :
        tempTree[part] || {};
    }
    return tree;
  }, {});
};

const DEFAULT_CODEMIRROR_OPTIONS = {
  autofocus: true,
  indentUnit: 2,
  indentWithTabs: false,
  lineNumbers: true,
  lineWrapping: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
  mode: 'javascript',
  tabSize: 2,
  theme: 'solarized',
};

export default class Editor {

  static propTypes = {
    onChangeFile: React.PropTypes.func.isRequired
  }

  constructor({ app : { files } }, context) {
    // TODO move this into a store
    this._fileTree = makeFileTree(Object.keys(files));
    this._codeMirrorInstance = null;
    this._codeMirrorDocuments = null;
  }

  handleEditorChange = (codeMirror) => {
    const { onUpdateBody } = this.props;
    onUpdateBody && onUpdateBody(codeMirror.getValue());
  }

  componentDidMount() {
    const {
      useDarkTheme,
      useVimKeyBindings,
      app : { files },
      onChangeFile,
      currentFile
    } = this.props;

    const options = assign({}, DEFAULT_CODEMIRROR_OPTIONS, {
      theme: useDarkTheme ? 'midnight' : 'solarized',
    }, useVimKeyBindings ? {keyMap: 'vim'} : {});

    const textareaNode = React.findDOMNode(this.refs.editorTextArea);
    const textArea = CodeMirror.fromTextArea(textareaNode, options);
    textArea.on('change', this.handleEditorChange);

    const documents = Object.keys(files)
      .reduce((docs, filename) => {
        docs[filename] = new CodeMirror.Doc(files[filename], 'javascript');
        return docs;
      }, {});

    this._codeMirrorInstance = textArea;
    this._codeMirrorDocuments = documents;

    // load the index page first
    textArea.swapDoc(documents[currentFile]);
    onChangeFile(currentFile);
  }

  changeFile = (filename) => {
    this._codeMirrorInstance.swapDoc(this._codeMirrorDocuments[filename]);
    this.props.onChangeFile(filename);
  }

  render() {
    const {
      app: { body },
      currentFile
    } = this.props;

    return (
      <div className="editor-flex-wrapper">
        <FileSelector
          files={this._fileTree}
          current={currentFile}
          onSelect={this.changeFile}
        />
        <div className="editor-scroll-wrapper">
          <textarea ref="editorTextArea" onChange={this._onChange}>
            {body}
          </textarea>
        </div>
      </div>
    );
  }
}
