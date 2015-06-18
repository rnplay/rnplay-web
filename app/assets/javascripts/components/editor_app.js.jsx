var EditorApp = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.app.name,
      body: this.props.app.body,
      currentFile: null,
      buildId: this.props.app.buildId,
      showHeader: true,
      picked: this.props.app.picked,
      simulatorActive: false,
    };
  },

  componentWillMount: function() {
    window.addEventListener('message', this.handleSimulatorEvent.bind(this), false);
  },

  componentDidMount: function() {
    CodeMirror.commands.save = this.onFileSave.bind(this);
    var iframe = document.querySelector('iframe');

    $(document).keyup(function() {
      iframe.contentWindow.postMessage('heartbeat', '*');
    });
  },

  // Keep track of simulator lifecycle
  handleSimulatorEvent: function(e) {
    if (event.data == 'sessionRequested') {
      this.setState({simulatorActive: true});
    } else if (event.data == 'userError') {
        console.log(event.data);
    } else if (event.data == 'firstFrameReceived') {
        console.log(event.data);
    } else if (event.data == 'timeoutWarning') {
        console.log(event.data);
    } else if(event.data == 'sessionEnded') {
      console.log(event.data);
      this.setState({simulatorActive: false});
    }
  },

  onUpdateName: function(newName) {
    this.setState({name: newName});
  },

  onUpdateBody: function(newBody) {
    this.setState({body: newBody});
  },

  onUpdateBuild: function(newBuild) {
    this.setState({buildId: newBuild, buildUpdated: true});
  },

  onPick: function() {
    $.ajax({
      url: '/apps/' + this.props.app.id,
      data: {
        app: {pick: this.state.picked ? "0" : "1"}
      },
      type: 'PUT',
      success: function() {
        this.setState({picked: this.state.picked ? false : true});
      }.bind(this)
    });
  },

  onChangeFile: function(filename) {
    this.setState({currentFile: filename})
  },

  onFileSave: function() {
    console.log(this.state);

    $.ajax({
      url: '/apps/' + this.props.app.id + "/files/" + encodeURIComponent(this.state.currentFile),
      data: {
        body: this.state.body
      },
      type: 'PUT',
      success: function(data) {
        if (data.success) {

        }
      }
    });

  },

  onSave: function() {
    var self = this;

    $.ajax({
      url: '/apps/' + this.props.app.id,
      data: {
        app: {name: this.state.name, build_id: this.state.buildId}
      },
      type: 'PUT',
      success: function(data) {
        if (data.success) {
          if (self.state.buildUpdated) {
            window.location.reload();
          } else {

            // From 0.4.4 and up, we enable live reload - no need to reload the app
            if (parseInt(this.state.buildId) < 3) {
              var iframe = document.querySelector('iframe');
              if (self.state.simulatorActive) {
                iframe.contentWindow.postMessage('restartApp', '*');
              } else {
                iframe.contentWindow.postMessage('requestSession', '*');
              }
            }

          }
        }
      }.bind(this)
    });
  },

  onFork: function() {
    var self = this;

    $.ajax({
      url: '/apps/' + this.props.app.id + '/fork',
      data: {
        app: {name: this.state.name, body: this.state.body, build_id: this.state.buildId}
      },
      type: 'POST',
      success: function(data) {
        if (data.success) {
          window.location.href = '/apps/' + data.token;
        } else {
          alert(data.error);
        }
      }
    });
  },

  renderHeader: function() {
    if (this.state.showHeader) {
      return (
        <Header currentUser={this.props.currentUser}
                currentApp={this.props.app}
                headerLogoSrc={this.props.headerLogoSrc} />
      )
    }
  },

  render: function() {
    // TODO any other ideas how to do this? Not sure whether the full url should
    // be stored with the app or just identifier, without all options.
    var simulatorUrl = this.props.useDarkTheme ?
      this.props.app.appetizeUrl.replace('deviceColor=white', 'deviceColor=black') :
      this.props.app.appetizeUrl;

    return (
      <div className="editor-container" style={{paddingTop: this.state.showHeader ? 50 : 0}}>
        {this.renderHeader()}

        <EditorHeader name={this.state.name}
                      useDarkTheme={this.props.useDarkTheme}
                      app={this.props.app}
                      currentUser={this.props.currentUser}
                      onUpdateName={this.onUpdateName}
                      onUpdateBuild={this.onUpdateBuild}
                      builds={this.props.builds}
                      buildId={this.props.app.buildId}
                      picked={this.state.picked}
                      onPick={this.onPick}
                      onSave={this.onSave}
                      onFork={this.onFork} />

        <div className="editor-container__body">
          <Editor app={this.props.app} currentUser={this.props.currentUser}
                  useVimKeyBindings={this.props.useVimKeyBindings}
                  useDarkTheme={this.props.useDarkTheme}
                  onChangeFile={this.onChangeFile}
                  onUpdateBody={this.onUpdateBody} />
          <Simulator url={simulatorUrl} useDarkTheme={this.props.useDarkTheme} />
        </div>
      </div>
    )
  }
});
