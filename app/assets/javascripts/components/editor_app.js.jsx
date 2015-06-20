var EditorApp = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.app.name,
      // TODO figure out a better way to get the current file.
      // maybe we can store the last open file in the database?
      currentFile: 'index.ios.js',
      buildId: this.props.app.buildId,
      showHeader: true,
      picked: this.props.app.picked,
      simulatorActive: false,
    };
  },

  componentWillMount: function() {
    // cache for all modified file bodies
    this.fileBodies = {};

    window.addEventListener('message', this.handleSimulatorEvent, false);
  },

  componentDidMount: function() {
    CodeMirror.commands.save = this.onFileSave;
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
    this.fileBodies[this.state.currentFile] = newBody;
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
    this.setState({currentFile: filename});
  },

  onFileSave: function() {
    console.log(this.state);
    var fileBody = this.fileBodies[this.state.currentFile];

    $.ajax({
      url: '/apps/' + this.props.app.id + "/files/" + encodeURIComponent(this.state.currentFile),
      data: {
        body: fileBody
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
    var fileBodies = this.fileBodies;

    // reset fileBodies so we don't save these files again next time
    this.fileBodies = {};

    var appUrl = '/apps/' + this.props.app.id;
    var filesUrl = appUrl + '/files/';
    var name = this.state.name;
    var buildId = this.state.buildId;

    // store all updates files
    var requests = Object.keys(fileBodies).map(function (filename) {
      return $.ajax({
        url: filesUrl + encodeURIComponent(filename),
        data: {
          body: fileBodies[filename]
        },
        // hacky way until we fix the server to return json (atleast an emtpy string)
        dataType: 'html',
        type: 'PUT'
      });
    });

    // update app info
    requests.push($.ajax({
      url: appUrl,
      data: {
        app: {
          name: name,
          buildId: buildId
        }
      },
      type: 'PUT'
    }).promise());

    Promise.all(requests)
      .then(function () {
        if (self.state.buildUpdated) {
          window.location.reload();
        } else {
          var isOldBuild = parseInt(self.state.buildId) < 3;
          var iframe = document.querySelector('iframe');
          // From 0.4.4 and up, we enable live reload - no need to reload the app
          if (isOldBuild) {
            if (self.state.simulatorActive) {
              iframe.contentWindow.postMessage('restartApp', '*');
            } else {
              iframe.contentWindow.postMessage('requestSession', '*');
            }
          } else if (!self.state.simulatorActive) {
            iframe.contentWindow.postMessage('requestSession', '*');
          }
        }
      })
      .catch(function (err) {
        // TODO display some error message
        // TODO in case of error do this:
        // self.fileBodies = _.merge(fileBodies, self.fileBodies);
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
        <Header
          currentUser={this.props.currentUser}
          currentApp={this.props.app}
          headerLogoSrc={this.props.headerLogoSrc}
        />
      );
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

        <EditorHeader
          name={this.state.name}
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
          onFork={this.onFork}
        />

        <div className="editor-container__body">
          <Editor
            app={this.props.app}
            currentFile={this.state.currentFile}
            currentUser={this.props.currentUser}
            useVimKeyBindings={this.props.useVimKeyBindings}
            useDarkTheme={this.props.useDarkTheme}
            onChangeFile={this.onChangeFile}
            onUpdateBody={this.onUpdateBody}
          />
          <Simulator url={simulatorUrl} useDarkTheme={this.props.useDarkTheme} />
        </div>
      </div>
    )
  }
});
