var makeFileTree = function (filenames) {
  return filenames.reduce(function (tree, filename) {
    var parts = filename.split('/');
    var tempTree = tree;
    var part;
    while((part = parts.shift())) {
      tempTree = tempTree[part] = parts.length === 0 ?
        null :
        tempTree[part] || {};
    }
    return tree;
  }, {});
};

var Editor = React.createClass({
  getInitialState: function() {
    // var files = {
    //   'index.js': this.props.app.body,
    //   'folder/second.js': this.props.app.body.substring(0, 200),
    //   'folder/nested/more.js': this.props.app.body.substring(100, 200),
    //   'folder/different/third.js': this.props.app.body.substring(50, 400)
    // };
    return {
      codeMirrorInstance: null,
      unsavedBuffers: {},

      // TODO remove this, as soon as we have real files passed in,
      // just for testing purposes
      files: this.props.app.files,
      fileTree: makeFileTree(Object.keys(this.props.app.files))
    };
  },

  _onChange: function(e) {
    // This is being handled by the change handler added via componentDidMount
  },

  componentDidMount: function() {
    var options = {
      lineNumbers: true,
      mode: 'javascript',
      theme: this.props.useDarkTheme ? 'midnight' : 'solarized',
      lineWrapping: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false
    };

    if (this.props.useVimKeyBindings) {
      options.keyMap = 'vim';
    }

    var textArea = CodeMirror.fromTextArea(this.refs.editorTextArea.getDOMNode(), options);

    textArea.on('change', function(e) {
      this.props.onUpdateBody &&
        this.props.onUpdateBody(textArea.getValue())
    }.bind(this));

    this.setState({codeMirrorInstance: textArea});
  },

  changeFile: function (filename) {
    this.state.codeMirrorInstance.setValue(this.state.files[filename]);
    this.setState({
      currentFile: filename
    });
  },

  render: function() {
    var currentFile = this.state.currentFile || 'index.js';
    return (<div className="editor-flex-wrapper">
      <FileSelector files={this.state.fileTree} current={currentFile} onSelect={this.changeFile} />
      <div className="editor-scroll-wrapper">
        <textarea ref="editorTextArea" onChange={this._onChange}>
          {this.props.app.body}
        </textarea>
      </div>
    </div>);
  }
});
