var EditorHeader = React.createClass({
  _onUpdateName: function() {
    this.props.onUpdateName &&
      this.props.onUpdateName(this.refs.nameInput.getDOMNode().value);
  },

  _handleOnSubmit: function(e) {
    e.preventDefault();

    if (this.belongsToCurrentUser()) {
      this._onSave(e);
    } else {
      this._onFork(e);
    }
  },

  _onSave: function(e) {
    e.preventDefault();
    this.props.onSave && this.props.onSave();
  },

  _onFork: function(e) {
    e.preventDefault();
    this.props.onFork && this.props.onFork();
  },

  _onPick: function(e) {
    e.preventDefault();
    this.props.onPick && this.props.onPick();
  },

  _onUpdateBuild: function(value) {
    this.props.onUpdateBuild &&
      this.props.onUpdateBuild(value);
  },

  belongsToCurrentUser: function() {
    return (
      this.props.currentUser &&
      this.props.currentUser.id == this.props.app.creatorId
    )
  },

  currentUserIsAdmin: function() {
    return this.props.currentUser.admin;
  },

  renderPickButton: function() {
    if (this.currentUserIsAdmin()) {
      if (this.props.picked) {
        return (
          <button onClick={this._onPick} className="btn-info editor-header__pick-button">
            Unpick
          </button>
        )
      } else {
        return (
          <button onClick={this._onPick} className="btn-info editor-header__pick-button">
            Pick
          </button>
        )
      }
    }
  },

  renderSaveButton: function() {
    if (this.belongsToCurrentUser()) {
      return (
        <button onClick={this._onSave} className="btn-info editor-header__save-button">
          Save &amp; Reload
        </button>
      );
    } else {
      return (
        <button onClick={this._onFork} className="btn-info editor-header__save-button">
          Fork &amp; Reload
        </button>
      );
    }
  },

  render: function() {
    var classes = classNames({
      'editor-header': true,
      'editor-header--dark': this.props.useDarkTheme
    });

    return (
      <form className={classes} onSubmit={this._handleOnSubmit}>
        <BuildPicker onChange={this._onUpdateBuild} builds={this.props.builds} selectedBuildId={this.props.buildId} />
        <input type="text" ref="nameInput" placeholder="Give this app a title"
               value={this.props.name}
               onChange={this._onUpdateName}
               className="editor-header__name-input" />
        {this.renderPickButton()}
        {this.renderSaveButton()}
      </form>
    );
  }
});
