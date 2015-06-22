var React = require("react");

var Simulator = React.createClass({
  render: function() {
    var classes = classNames({
      'editor-container__simulator': true,
      'editor-container__simulator--dark': this.props.useDarkTheme
    });

    return (
      <div className={classes} style={{width: 320, paddingTop: 20, paddingLeft: 20, overflow: 'hidden'}}>
        <iframe src={this.props.url}
                width="320px"
                height="800px"
                frameBorder="0"
                scrolling="no" />
      </div>
    )
  }
});
