var BuildPicker = React.createClass({
  renderOptions: function() {
    var options = [];
    var self = this;

    options.push(<option key="disabled" disabled="disabled">-- React Native version --</option>)

    this.props.builds.forEach(function(build) {
      options.push(<option key={build.id} value={build.id}>{build.name}</option>)
    });

    return options;
  },

  _onChange: function(e) {
    this.props.onChange(e.target.value);
  },

  render: function() {
    return (
      <select onChange={this._onChange} defaultValue={this.props.selectedBuildId} className="build-picker">
        {this.renderOptions()}
      </select>
    )
  }
});
