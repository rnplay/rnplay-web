var FileSelectorNode = React.createClass({

  getInitialState: function () {
    return {
      open: false
    };
  },

  onNodeClick: function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.subtree) {
      this.setState({
        open: !this.state.open
      });
    } else {
      this.props.onSelect(this.props.pathPrefix + this.props.label);
    }
  },

  render() {
    var subtree = this.props.subtree;
    var onSelect = this.props.onSelect;
    var label = this.props.label;
    var current = this.props.current;
    var pathPrefix = this.props.pathPrefix;
    var fullPath = pathPrefix + label + (subtree ? '/' : '');

    var sub = this.state.open && subtree && Object.keys(subtree)
      .map(function (filenameOrPathSegment) {
        return (
          <FileSelectorNode
            onSelect={onSelect}
            current={current}
            key={filenameOrPathSegment}
            pathPrefix={fullPath}
            label={filenameOrPathSegment}
            subtree={subtree[filenameOrPathSegment]}
          />
        );
      });

    return (
      <li
        className={classNames({
          'fileselector__list__node': true,
          'fileselector__list__node--has-children' : !!subtree,
          'fileselector__list__node--current': fullPath === current,
          'fileselector__list__node--open': this.state.open
        })}
        onClick={this.onNodeClick}
      >
        <span className='fileselector__list__node__label'>{label}</span>
        {this.state.open && sub && <ol className='fileselector__list'>{sub}</ol>}
      </li>
    );
  }
});


var FileSelector = React.createClass({

  getInitialState: function() {
    return {
      open: false
    };
  },

  toggleSelector: function (e) {
    e.preventDefault();
    this.setState({
      open: !this.state.open
    });
  },

  render: function() {
    var files = this.props.files;
    var onSelect = this.props.onSelect;
    var current = this.props.current;

    return (
      <div className={classNames({
          fileselector: true,
          open: this.state.open
        })}>
        <div className='open-handle' onClick={this.toggleSelector}></div>
        <ol className='fileselector__list'>
          {files && Object.keys(files).map(function(filename) {
            return (
              <FileSelectorNode
                onSelect={onSelect}
                current={current}
                key={filename}
                pathPrefix=''
                label={filename}
                subtree={files[filename]}
              />
            );
          })}
        </ol>
      </div>
    );
  }

});
