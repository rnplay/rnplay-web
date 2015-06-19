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

    return {
      codeMirrorInstance: null,
      documents: {},
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

    var textareaNode = React.findDOMNode(this.refs.editorTextArea);
    var textArea = CodeMirror.fromTextArea(textareaNode, options);

    // TODO Move this code back to the `onChange` handler and reference it here
    textArea.on('change', function (e) {
      this.props.onUpdateBody && this.props.onUpdateBody(textArea.getValue());
    }.bind(this));

    var files = this.props.app.files;
    var documents = Object.keys(files)
      .reduce(function (docs, filename) {
        docs[filename] = new CodeMirror.Doc(files[filename], 'javascript');
        return docs;
      }, {});

    var index = 'index.ios.js';
    // load the index page first
    textArea.swapDoc(documents[index]);
    this.props.onChangeFile(index);

    this.setState({codeMirrorInstance: textArea, documents: documents});
  },

  changeFile: function (filename) {
    this.state.codeMirrorInstance.swapDoc(this.state.documents[filename]);
    this.setState({
      currentFile: filename
    });

    this.props.onChangeFile && this.props.onChangeFile(filename);
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
    </div>)
  }
});
