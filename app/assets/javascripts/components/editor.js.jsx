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

    var textArea = CodeMirror.fromTextArea(this.refs.editorTextArea.getDOMNode(), options);

    textArea.on('change', function(e) {
      this.props.onUpdateBody &&
        this.props.onUpdateBody(textArea.getValue())
    }.bind(this));

    this.setState({codeMirrorInstance: textArea});
  },

  render: function() {
    return (
      <div className="editor-flex-wrapper">
        <textarea ref="editorTextArea" onChange={this._onChange}>
          {this.props.play.body}
        </textarea>
      </div>
    )
  }
});
