var Editor = React.createClass({
  getInitialState: function() {
    return {
      codeMirrorInstance: null
    }
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
    }

    if (this.props.useVimKeyBindings) {
      options.keyMap = 'vim';
    }

    if (!this.props.app.multiFile) {
      var textArea = CodeMirror.fromTextArea(this.refs.editorTextArea.getDOMNode(), options);

      textArea.on('change', function(e) {
        this.props.onUpdateBody &&
          this.props.onUpdateBody(textArea.getValue())
      }.bind(this));

      this.setState({codeMirrorInstance: textArea});
    }
  },

  render: function() {
    content = this.props.app.multiFile ?
    <div className="editor-flex-wrapper">
      <p>This app can't be edited yet, because it contains multiple files. Support for this coming soon!</p>
    </div>
    :
    <div className="editor-flex-wrapper">
      <textarea ref="editorTextArea" onChange={this._onChange}>
        {this.props.app.body}
      </textarea>
    </div>

    return content;
  }
});
